const SEASONS = { SPRING:'spring', SUMMER:'summer', FALL:'fall', WINTER:'winter' }

const NH_SEASON_MAP = {
  1:'winter',2:'winter',3:'spring',4:'spring',5:'spring',
  6:'summer',7:'summer',8:'summer',9:'fall',10:'fall',11:'fall',12:'winter'
}

const PHOTOPERIOD_TREND = {
  1:'lengthening',2:'lengthening',3:'lengthening',4:'lengthening',5:'lengthening',
  6:'peak',7:'shortening',8:'shortening',9:'shortening',10:'shortening',11:'shortening',12:'trough'
}

const VULNERABILITY_WINDOWS = {
  spring:{ startMonth:3, endMonth:5 },
  summer:{ startMonth:6, endMonth:8 },
  fall:  { startMonth:9, endMonth:12 },
  winter:{ startMonth:1, endMonth:3 }
}

function deriveSeason(dob, lat) {
  const month = new Date(dob).getMonth() + 1
  const season = NH_SEASON_MAP[month]
  if (lat < 0) {
    const flip = { spring:'fall', fall:'spring', summer:'winter', winter:'summer' }
    return flip[season]
  }
  return season
}

function deriveLightProfile(season) {
  return ['spring','summer'].includes(season) ? 'high-light' : 'low-light'
}

function deriveLatitudeTier(lat) {
  const abs = Math.abs(lat)
  if (abs >= 50) return 'high'
  if (abs >= 30) return 'mid'
  return 'low'
}

function deriveChronotype(dob, surveyStressResponse) {
  const month = new Date(dob).getMonth() + 1
  const trend = PHOTOPERIOD_TREND[month]
  if (trend === 'lengthening') return 'lark'
  if (trend === 'shortening')  return 'owl'
  if (trend === 'trough') return surveyStressResponse === 'fight-flight' ? 'owl' : 'neutral'
  if (trend === 'peak')   return surveyStressResponse === 'expand' ? 'lark' : 'neutral'
  return 'neutral'
}

function deriveNeurotransmitters(season, latitudeTier) {
  const isLowLight = ['fall','winter'].includes(season)
  const isHighLat  = latitudeTier === 'high'
  const dopamine  = isLowLight && isHighLat ? 'low' : (isLowLight || isHighLat) ? 'moderate' : 'high'
  const serotonin = !isLowLight && !isHighLat ? 'high' : (isLowLight && isHighLat) ? 'low' : 'moderate'
  return { dopamine, serotonin }
}

function deriveStressBaseline(surveyStressResponse, latitudeTier) {
  if (latitudeTier === 'high') {
    const amplified = { freeze:'freeze', expand:'freeze', 'fight-flight':'fight-flight' }
    return amplified[surveyStressResponse] || surveyStressResponse
  }
  return surveyStressResponse
}

function derive(dob, lat, lng, survey) {
  const season             = deriveSeason(dob, lat)
  const lightProfile       = deriveLightProfile(season)
  const latitudeTier       = deriveLatitudeTier(lat)
  const chronotype         = deriveChronotype(dob, survey.stressResponse)
  const stressBaseline     = deriveStressBaseline(survey.stressResponse, latitudeTier)
  const neurotransmitters  = deriveNeurotransmitters(season, latitudeTier)
  const vulnerabilityWindow = VULNERABILITY_WINDOWS[season]
  return { season, lightProfile, latitudeTier, chronotype, stressBaseline, vulnerabilityWindow, neurotransmitters }
}

module.exports = { derive }
