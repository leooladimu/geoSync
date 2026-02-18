const CHRONOTYPE_SCORES = {
  lark:   { lark:90, neutral:65, owl:35 },
  neutral:{ lark:65, neutral:75, owl:65 },
  owl:    { lark:35, neutral:65, owl:90 }
}

const CHRONOTYPE_INSIGHTS = {
  high:     { insight:"Your daily rhythms naturally align.", warning:"Beware the echo chamber.", strategy:"Use your natural sync as a foundation, but seek outside perspectives." },
  moderate: { insight:"You have a workable overlap window — roughly midday to early afternoon.", warning:"Don't schedule important conversations at the edges of your overlap.", strategy:"Block 11am–2pm as your sacred window for anything that matters." },
  low:      { insight:"Your energy peaks are offset. This needs explicit management.", warning:"Never have serious conversations before 10am or after 9pm.", strategy:"Use async communication for non-urgent processing. Protect your overlap hours." }
}

const STRESS_SCORES = {
  freeze:        { freeze:72, expand:65, 'fight-flight':28 },
  expand:        { freeze:65, expand:70, 'fight-flight':58 },
  'fight-flight':{ freeze:28, expand:58, 'fight-flight':50 }
}

const STRESS_DYNAMICS = {
  'freeze-freeze':        { archetype:'The Two Islands', dynamic:"You both retreat under pressure. Conflicts can go unresolved.", toxicLoop:null, circuitBreaker:"Agree in advance: after 2 hours of separate processing, you reconvene — no matter what." },
  'freeze-expand':        { archetype:'The Anchor and the Sail', dynamic:"One withdraws, one pursues solutions. Workable — if the expand type doesn't take withdrawal personally.", toxicLoop:null, circuitBreaker:"Freeze signals '2 hours'. Expand problem-solves on paper. Reconvene with concrete thoughts." },
  'freeze-fight-flight':  { archetype:'The Avalanche Loop', dynamic:"One shuts down, one amps up. The more you push, the more they retreat.", toxicLoop:"Crisis → freeze withdraws → fight-flight escalates → freeze retreats further → explosion.", circuitBreaker:"A pre-agreed stop word. Fight-flight writes a letter during freeze's processing window. Freeze returns with one concrete statement." },
  'expand-expand':        { archetype:'The Two Optimists', dynamic:"Great energy. The risk is shared blind spots — you may both minimize problems until they're critical.", toxicLoop:null, circuitBreaker:"Designate a rotating devil's advocate before any major decision." },
  'expand-fight-flight':  { archetype:'The Fixer and the Fighter', dynamic:"One wants to solve it, one needs to feel it first. Sequence matters.", toxicLoop:null, circuitBreaker:"Fight-flight gets 20 minutes uninterrupted. Then expand leads with solutions." },
  'fight-flight-fight-flight': { archetype:'The Thunderstorm', dynamic:"High intensity, high friction. Without a container, conflicts escalate fast.", toxicLoop:"Both escalate simultaneously, neither de-escalates naturally.", circuitBreaker:"Physical pattern interrupt — leave the room, change location." }
}

function getStressDynamicKey(a, b) {
  const order = ['freeze','expand','fight-flight']
  const sorted = [a, b].sort((x, y) => order.indexOf(x) - order.indexOf(y))
  return `${sorted[0]}-${sorted[1]}`
}

function expandWindow(startMonth, endMonth) {
  const months = new Set()
  if (startMonth <= endMonth) {
    for (let m = startMonth; m <= endMonth; m++) months.add(m)
  } else {
    for (let m = startMonth; m <= 12; m++) months.add(m)
    for (let m = 1; m <= endMonth; m++) months.add(m)
  }
  return months
}

function monthLabel(window) {
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${names[window.startMonth - 1]}–${names[window.endMonth - 1]}`
}

function scoreChronotype(profileA, profileB) {
  const score = CHRONOTYPE_SCORES[profileA.chronotype][profileB.chronotype]
  const tier  = score >= 75 ? 'high' : score >= 50 ? 'moderate' : 'low'
  return { score, tier, ...CHRONOTYPE_INSIGHTS[tier], detail: { a: profileA.chronotype, b: profileB.chronotype } }
}

function scoreStress(profileA, profileB) {
  const score   = STRESS_SCORES[profileA.stressBaseline][profileB.stressBaseline]
  const tier    = score >= 65 ? 'high' : score >= 45 ? 'moderate' : 'low'
  const dynamic = STRESS_DYNAMICS[getStressDynamicKey(profileA.stressBaseline, profileB.stressBaseline)]
  return { score, tier, ...dynamic, detail: { a: profileA.stressBaseline, b: profileB.stressBaseline } }
}

function scoreSeasonal(profileA, profileB) {
  const setA = expandWindow(profileA.vulnerabilityWindow.startMonth, profileA.vulnerabilityWindow.endMonth)
  const setB = expandWindow(profileB.vulnerabilityWindow.startMonth, profileB.vulnerabilityWindow.endMonth)
  let overlap = 0
  setA.forEach(m => { if (setB.has(m)) overlap++ })
  const score = Math.round(100 - (overlap / 4) * 70)
  const tier  = score >= 70 ? 'protective' : score >= 45 ? 'moderate' : 'risky'
  const insights = {
    protective: { insight:"Your vulnerability windows are offset — you can take turns holding the relationship.", strategy:`A's low: ${monthLabel(profileA.vulnerabilityWindow)}. B's low: ${monthLabel(profileB.vulnerabilityWindow)}.` },
    moderate:   { insight:"Your low periods partially overlap. Lean on external support during that window.", strategy:"Identify overlap months now and pre-plan: fewer big decisions, more stabilizing routines." },
    risky:      { insight:"Your vulnerability windows largely coincide. You will both be low at the same time, every year.", strategy:"Build external support systems before you hit that window." }
  }
  return { score, tier, overlapMonths: overlap, ...insights[tier], detail: { a: profileA.vulnerabilityWindow, b: profileB.vulnerabilityWindow } }
}

function deriveArchetype(chronoTier, stressTier, seasonalTier) {
  if (chronoTier === 'high' && stressTier === 'high') return 'The Mirror'
  if (seasonalTier === 'protective' && stressTier === 'low') return 'The Tortoise and the Hare'
  if (chronoTier === 'low' && stressTier === 'high') return 'The Night Shift Partnership'
  if (seasonalTier === 'risky' && chronoTier === 'high') return 'The Fair Weather Match'
  return 'The Long Game'
}

function generate(profileA, profileB) {
  const chronotype = scoreChronotype(profileA, profileB)
  const stress     = scoreStress(profileA, profileB)
  const seasonal   = scoreSeasonal(profileA, profileB)
  const overall    = Math.round(chronotype.score * 0.30 + stress.score * 0.40 + seasonal.score * 0.30)
  const archetype  = deriveArchetype(chronotype.tier, stress.tier, seasonal.tier)
  return {
    scores: { overall, chronotype: chronotype.score, stress: stress.score, seasonal: seasonal.score },
    tiers:  { chronotype: chronotype.tier, stress: stress.tier, seasonal: seasonal.tier },
    archetype,
    dimensions: { chronotype, stress, seasonal },
    generatedAt: new Date()
  }
}

module.exports = { generate }
