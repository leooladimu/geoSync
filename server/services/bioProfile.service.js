/**
 * Takes raw user input (DOB, coordinates, survey) and derives
 * the full biological profile. All scoring logic lives here.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const SEASONS = {
  SPRING: 'spring',
  SUMMER: 'summer',
  FALL:   'fall',
  WINTER: 'winter'
}

// Northern hemisphere month → season mapping
// We'll flip for southern hemisphere below
const NH_SEASON_MAP = {
  1:  SEASONS.WINTER,
  2:  SEASONS.WINTER,
  3:  SEASONS.SPRING,
  4:  SEASONS.SPRING,
  5:  SEASONS.SPRING,
  6:  SEASONS.SUMMER,
  7:  SEASONS.SUMMER,
  8:  SEASONS.SUMMER,
  9:  SEASONS.FALL,
  10: SEASONS.FALL,
  11: SEASONS.FALL,
  12: SEASONS.WINTER
}

// Photoperiod trend at birth month (is daylight increasing or decreasing?)
// Used for chronotype derivation
const PHOTOPERIOD_TREND = {
  1:  'lengthening',   // days getting longer after Dec solstice
  2:  'lengthening',
  3:  'lengthening',
  4:  'lengthening',
  5:  'lengthening',
  6:  'peak',          // solstice
  7:  'shortening',
  8:  'shortening',
  9:  'shortening',
  10: 'shortening',
  11: 'shortening',
  12: 'trough'         // solstice
}

// Vulnerability window durations by season of birth (months after birth season)
// e.g. a fall-born person is most vulnerable Oct–Jan
const VULNERABILITY_WINDOWS = {
  [SEASONS.SPRING]: { startMonth: 3,  endMonth: 5  },
  [SEASONS.SUMMER]: { startMonth: 6,  endMonth: 8  },
  [SEASONS.FALL]:   { startMonth: 9,  endMonth: 12 },
  [SEASONS.WINTER]: { startMonth: 1,  endMonth: 3  }
}

// Latitude thresholds (absolute value of lat)
const LAT = {
  HIGH: 50,   // >= 50° — Seattle, Oslo, Edinburgh
  MID:  30,   // 30–49° — NYC, LA, Rome
  LOW:  0     // < 30°  — Miami, Dubai, Mexico City
}

// ─── Core Derivation ──────────────────────────────────────────────────────────

/**
 * Derive season from DOB and birth latitude
 * Flips season for southern hemisphere
 */
function deriveSeason(dob, lat) {
  const month = new Date(dob).getMonth() + 1  // 1-12
  const season = NH_SEASON_MAP[month]

  // Southern hemisphere: flip seasons
  if (lat < 0) {
    const flip = {
      [SEASONS.SPRING]: SEASONS.FALL,
      [SEASONS.FALL]:   SEASONS.SPRING,
      [SEASONS.SUMMER]: SEASONS.WINTER,
      [SEASONS.WINTER]: SEASONS.SUMMER
    }
    return flip[season]
  }

  return season
}

/**
 * Light profile based on season
 * high-light = spring/summer, low-light = fall/winter
 */
function deriveLightProfile(season) {
  return [SEASONS.SPRING, SEASONS.SUMMER].includes(season)
    ? 'high-light'
    : 'low-light'
}

/**
 * Latitude tier based on absolute latitude
 */
function deriveLatitudeTier(lat) {
  const absLat = Math.abs(lat)
  if (absLat >= LAT.HIGH) return 'high'
  if (absLat >= LAT.MID)  return 'mid'
  return 'low'
}

/**
 * Chronotype derivation
 * Combines photoperiod trend at birth month + survey stress response as a modifier
 *
 * Lengthening days at birth → lark tendency (brain calibrated to expanding light)
 * Shortening days at birth → owl tendency (brain calibrated to contracting light)
 * Survey stress response can push neutral cases one way
 */
function deriveChronotype(dob, surveyStressResponse) {
  const month = new Date(dob).getMonth() + 1
  const trend = PHOTOPERIOD_TREND[month]

  if (trend === 'lengthening') return 'lark'
  if (trend === 'shortening')  return 'owl'

  // Peak (June) or trough (Dec) — use stress response as tiebreaker
  // "freeze" types tend toward lark (conserving), "fight-flight" toward owl (reactive)
  if (trend === 'trough') {
    return surveyStressResponse === 'fight-flight' ? 'owl' : 'neutral'
  }
  if (trend === 'peak') {
    return surveyStressResponse === 'expand' ? 'lark' : 'neutral'
  }

  return 'neutral'
}

/**
 * Neurotransmitter baseline estimation
 * Based on season of birth + latitude tier
 *
 * Dopamine:
 *   Low-light births (fall/winter) → lower dopamine receptor density (research-backed)
 *   High-latitude compounds this effect
 *
 * Serotonin:
 *   High-light births → higher serotonin baseline
 *   Low-latitude (lots of UV year-round) raises serotonin floor
 */
function deriveNeurotransmitters(season, latitudeTier) {
  const isLowLight = [SEASONS.FALL, SEASONS.WINTER].includes(season)
  const isHighLat  = latitudeTier === 'high'
  const isMidLat   = latitudeTier === 'mid'

  const dopamine = (() => {
    if (isLowLight && isHighLat) return 'low'
    if (isLowLight || isHighLat) return 'moderate'
    return 'high'
  })()

  const serotonin = (() => {
    if (!isLowLight && !isHighLat) return 'high'
    if (isLowLight && isHighLat)   return 'low'
    return 'moderate'
  })()

  return { dopamine, serotonin }
}

/**
 * Stress baseline
 * Survey answer is primary, but latitude tier can elevate it
 * (high-lat births have more pronounced HPA-axis reactivity)
 */
function deriveStressBaseline(surveyStressResponse, latitudeTier) {
  // High-latitude amplifies whatever the survey says
  // freeze → more pronounced freeze; fight-flight → more reactive
  if (latitudeTier === 'high') {
    const amplified = {
      'freeze':       'freeze',        // already there, just more so (flagged in profile)
      'expand':       'freeze',        // high-lat overrides optimism with caution
      'fight-flight': 'fight-flight'   // amplified
    }
    return amplified[surveyStressResponse] || surveyStressResponse
  }

  return surveyStressResponse
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * derive(dob, lat, lng, survey) → derived profile object
 *
 * @param {Date|string} dob
 * @param {number} lat  — birth location latitude
 * @param {number} lng  — birth location longitude (reserved for future use)
 * @param {object} survey
 *   @param {string} survey.openness         — "quick" | "gradual" | "situational"
 *   @param {string} survey.stressResponse   — "freeze" | "expand" | "fight-flight"
 *   @param {string} survey.socialSeason     — "spring" | "summer" | "fall" | "winter"
 *   @param {string} survey.conflictStyle    — "resolve-now" | "process-first" | "avoid"
 * @returns {object} derived
 */
function derive(dob, lat, lng, survey) {
  const season            = deriveSeason(dob, lat)
  const lightProfile      = deriveLightProfile(season)
  const latitudeTier      = deriveLatitudeTier(lat)
  const chronotype        = deriveChronotype(dob, survey.stressResponse)
  const stressBaseline    = deriveStressBaseline(survey.stressResponse, latitudeTier)
  const neurotransmitters = deriveNeurotransmitters(season, latitudeTier)
  const vulnerabilityWindow = VULNERABILITY_WINDOWS[season]

  return {
    season,
    lightProfile,
    latitudeTier,
    chronotype,
    stressBaseline,
    vulnerabilityWindow,
    neurotransmitters
  }
}

module.exports = { derive }
