/**
 * Takes two derived BioProfiles and produces a full compatibility report.
 * No DB calls — pure scoring logic.
 */

// ─── Chronotype Scoring ───────────────────────────────────────────────────────

const CHRONOTYPE_SCORES = {
  lark:    { lark: 90,  neutral: 65, owl: 35  },
  neutral: { lark: 65,  neutral: 75, owl: 65  },
  owl:     { lark: 35,  neutral: 65, owl: 90  }
}

const CHRONOTYPE_INSIGHTS = {
  high: {
    insight: "Your daily rhythms naturally align. Energy peaks, wind-down times, and decision windows overlap.",
    warning: "Beware the echo chamber — you may avoid friction that's actually useful.",
    strategy: "Use your natural sync as a foundation, but deliberately seek outside perspectives."
  },
  moderate: {
    insight: "You have a workable overlap window — roughly midday to early afternoon.",
    warning: "Don't schedule important conversations at the edges of your overlap.",
    strategy: "Block 11am–2pm as your sacred window for anything that matters."
  },
  low: {
    insight: "Your energy peaks are offset. This isn't fatal — but it needs explicit management.",
    warning: "Never have serious conversations before 10am or after 9pm.",
    strategy: "Use async communication (voice notes, messages) for non-urgent processing. Protect your overlap hours fiercely."
  }
}

function scoreChronotype(profileA, profileB) {
  const score = CHRONOTYPE_SCORES[profileA.chronotype][profileB.chronotype]
  const tier  = score >= 75 ? 'high' : score >= 50 ? 'moderate' : 'low'

  return {
    score,
    tier,
    ...CHRONOTYPE_INSIGHTS[tier],
    detail: {
      a: profileA.chronotype,
      b: profileB.chronotype
    }
  }
}

// ─── Stress Response Scoring ──────────────────────────────────────────────────

// Pairings scored by friction potential and manageability
// freeze/expand is actually workable with the right protocol
// freeze/fight-flight is the toxic loop
const STRESS_SCORES = {
  freeze: {
    freeze:       72,
    expand:       65,
    'fight-flight': 28
  },
  expand: {
    freeze:       65,
    expand:       70,
    'fight-flight': 58
  },
  'fight-flight': {
    freeze:       28,
    expand:       58,
    'fight-flight': 50
  }
}

const STRESS_DYNAMICS = {
  'freeze-freeze': {
    archetype: 'The Two Islands',
    dynamic: "You both retreat under pressure. Neither of you pursues — which means conflicts can go unresolved for too long.",
    toxicLoop: null,
    circuitBreaker: "Agree in advance: after 2 hours of separate processing, you reconvene — no matter what. The reconnection has to be a rule, not a feeling."
  },
  'freeze-expand': {
    archetype: 'The Anchor and the Sail',
    dynamic: "One withdraws, one pursues solutions. This is workable — the expand type just can't take the freeze personally.",
    toxicLoop: null,
    circuitBreaker: "Freeze partner signals 'I need 2 hours' explicitly. Expand partner problem-solves on paper during that window. Reconvene with concrete thoughts, not just feelings."
  },
  'freeze-fight-flight': {
    archetype: 'The Avalanche Loop',
    dynamic: "This is the highest-friction pairing. One shuts down, one amps up. The more you push, the more they retreat. The more they retreat, the more you push.",
    toxicLoop: "Crisis → freeze withdraws → fight-flight escalates to re-engage → freeze retreats further → explosion.",
    circuitBreaker: "A pre-agreed 'stop word' that halts escalation immediately. Fight-flight partner writes a letter during freeze's processing window. Freeze partner returns with one concrete statement, not a full resolution."
  },
  'expand-expand': {
    archetype: 'The Two Optimists',
    dynamic: "Great energy, great growth orientation. The risk is shared blind spots — you may both minimize problems until they're critical.",
    toxicLoop: null,
    circuitBreaker: "Designate a rotating 'devil's advocate' role. One of you has to argue the worst case before any major decision."
  },
  'expand-fight-flight': {
    archetype: 'The Fixer and the Fighter',
    dynamic: "One wants to solve it, one needs to feel it first. This works if you take turns leading — solution-mode before the emotion is processed will always backfire.",
    toxicLoop: null,
    circuitBreaker: "Fight-flight partner gets 20 minutes to express fully, uninterrupted. Then expand partner leads with solutions. Sequence matters."
  },
  'fight-flight-fight-flight': {
    archetype: 'The Thunderstorm',
    dynamic: "High intensity, high passion, high friction. You understand each other's urgency — but without a container, conflicts escalate fast.",
    toxicLoop: "Both escalate simultaneously, neither has a natural de-escalation role.",
    circuitBreaker: "Physical pattern interrupt — leave the room, change location. Intensity needs a circuit breaker that isn't words."
  }
}

function getStressDynamicKey(a, b) {
  // Normalize key order so freeze-expand === expand-freeze
  const order = ['freeze', 'expand', 'fight-flight']
  const sorted = [a, b].sort((x, y) => order.indexOf(x) - order.indexOf(y))
  return `${sorted[0]}-${sorted[1]}` 
}

function scoreStress(profileA, profileB) {
  const score   = STRESS_SCORES[profileA.stressBaseline][profileB.stressBaseline]
  const tier    = score >= 65 ? 'high' : score >= 45 ? 'moderate' : 'low'
  const dynamic = STRESS_DYNAMICS[getStressDynamicKey(profileA.stressBaseline, profileB.stressBaseline)]

  return {
    score,
    tier,
    ...dynamic,
    detail: {
      a: profileA.stressBaseline,
      b: profileB.stressBaseline
    }
  }
}

// ─── Seasonal Vulnerability Scoring ──────────────────────────────────────────

/**
 * Measures overlap between vulnerability windows.
 * Overlapping windows = double-risk periods (both low at same time)
 * Offset windows = resilience (one is stable when the other is low)
 */
function monthsOverlap(windowA, windowB) {
  const expand = (w) => {
    const months = []
    if (w.startMonth <= w.endMonth) {
      for (let m = w.startMonth; m <= w.endMonth; m++) months.push(m)
    } else {
      // Wraps year (e.g. Nov–Feb)
      for (let m = w.startMonth; m <= 12; m++) months.push(m)
      for (let m = 1; m <= w.endMonth; m++) months.push(m)
    }
    return new Set(months)
  }

  const setA = expand(windowA)
  const setB = expand(windowB)
  let overlap = 0
  setA.forEach(m => { if (setB.has(m)) overlap++ })
  return overlap
}

function scoreSeasonal(profileA, profileB) {
  const overlap     = monthsOverlap(profileA.vulnerabilityWindow, profileB.vulnerabilityWindow)
  const maxOverlap  = 4 // vulnerability windows are ~3-4 months

  // High overlap = both vulnerable at same time = lower score
  // Zero overlap = perfectly offset = high score
  const score = Math.round(100 - (overlap / maxOverlap) * 70)
  const tier  = score >= 70 ? 'protective' : score >= 45 ? 'moderate' : 'risky'

  const insights = {
    protective: {
      insight: "Your vulnerability windows are offset — when one of you is low, the other is stable. You can take turns holding the relationship.",
      strategy: `A's low period: ${monthLabel(profileA.vulnerabilityWindow)}. Let them set the pace then. B's low period: ${monthLabel(profileB.vulnerabilityWindow)}. Now A leads.` 
    },
    moderate: {
      insight: "Your low periods partially overlap. You'll need external support during that window — lean on friends, routines, or a therapist rather than each other.",
      strategy: "Identify the overlap months now and pre-plan for them: fewer big decisions, more stabilizing routines."
    },
    risky: {
      insight: "Your vulnerability windows largely coincide. You will both be low at the same time, every year.",
      strategy: "This isn't a dealbreaker but it requires external scaffolding. Build a support system outside this relationship before you hit that window."
    }
  }

  return {
    score,
    tier,
    overlapMonths: overlap,
    ...insights[tier],
    detail: {
      a: profileA.vulnerabilityWindow,
      b: profileB.vulnerabilityWindow
    }
  }
}

function monthLabel(window) {
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${names[window.startMonth - 1]}–${names[window.endMonth - 1]}` 
}

// ─── Archetype Map ────────────────────────────────────────────────────────────

function deriveArchetype(chronoTier, stressTier, seasonalTier) {
  // High across the board
  if (chronoTier === 'high' && stressTier === 'high') return 'The Mirror'
  // Great seasonal offset but friction in stress
  if (seasonalTier === 'protective' && stressTier === 'low') return 'The Tortoise and the Hare'
  // Chronotype mismatch but stress compatible
  if (chronoTier === 'low' && stressTier === 'high') return 'The Night Shift Partnership'
  // Seasonal risk with good daily sync
  if (seasonalTier === 'risky' && chronoTier === 'high') return 'The Fair Weather Match'
  // Default fallback
  return 'The Long Game'
}

// ─── Overall Score ────────────────────────────────────────────────────────────

function weightedScore(chrono, stress, seasonal) {
  return Math.round(
    chrono   * 0.30 +
    stress   * 0.40 +   // stress response weighted highest — it drives conflict patterns
    seasonal * 0.30
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * generate(profileA, profileB) → full compatibility report
 *
 * @param {object} profileA — derived BioProfile (from bioProfile.service)
 * @param {object} profileB — derived BioProfile
 * @returns {object} report
 */
function generate(profileA, profileB) {
  const chronotype = scoreChronotype(profileA, profileB)
  const stress     = scoreStress(profileA, profileB)
  const seasonal   = scoreSeasonal(profileA, profileB)

  const overall  = weightedScore(chronotype.score, stress.score, seasonal.score)
  const archetype = deriveArchetype(chronotype.tier, stress.tier, seasonal.tier)

  return {
    scores: {
      overall,
      chronotype: chronotype.score,
      stress:     stress.score,
      seasonal:   seasonal.score
    },
    tiers: {
      chronotype: chronotype.tier,
      stress:     stress.tier,
      seasonal:   seasonal.tier
    },
    archetype,
    dimensions: {
      chronotype,
      stress,
      seasonal
    },
    generatedAt: new Date()
  }
}

module.exports = { generate }
