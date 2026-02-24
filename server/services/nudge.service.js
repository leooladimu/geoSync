/**
 * Analyzes a user's profile + connection context and generates
 * coaching nudges based on detected behavioral patterns.
 *
 * In a real app, nudges would be triggered by logged user behavior.
 * Here we derive them purely from the biophysical profile + current date,
 * which gives us a solid set of always-relevant nudges without requiring
 * behavior tracking infrastructure.
 */

const CoachingNudge = require('../models/coachingNudge.model')

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun',
                     'Jul','Aug','Sep','Oct','Nov','Dec']

// ─── Nudge Generators ─────────────────────────────────────────────────────────
// Each returns null (no nudge warranted) or a nudge object

function checkWithdrawal(profile, connection, currentMonth) {
  const { vulnerabilityWindow, stressBaseline } = profile.derived
  const { startMonth, endMonth } = vulnerabilityWindow

  const inWindow = isInWindow(currentMonth, startMonth, endMonth)
  if (!inWindow || stressBaseline !== 'freeze') return null

  const name = connectionName(connection)

  return {
    category: 'withdrawal',
    trigger:  `Current month (${MONTH_NAMES[currentMonth - 1]}) falls in your vulnerability window with a freeze stress response`,
    message:  `You're entering your natural low period. Your instinct right now is to go quiet — with ${name} and with yourself. Before you do: let them know it's seasonal, not personal. One sentence is enough. Silence without context reads as rejection.` 
  }
}

function checkIntensitySeeking(profile, connection, currentMonth) {
  const { neurotransmitters, vulnerabilityWindow } = profile.derived
  const inWindow = isInWindow(currentMonth,
    vulnerabilityWindow.startMonth, vulnerabilityWindow.endMonth)

  if (neurotransmitters.dopamine !== 'low' || !inWindow) return null

  const name = connectionName(connection)

  return {
    category: 'intensity-seeking',
    trigger:  'Low dopamine baseline active during vulnerability window',
    message:  `Your baseline is craving stimulation right now. That's biology, not boredom with ${name}. Before you create friction to feel something — try naming what you actually need. Intensity and intimacy aren't the same thing.` 
  }
}

function checkOverCommitment(profile, connection, currentMonth) {
  const { lightProfile, neurotransmitters } = profile.derived

  // High-light, high-serotonin profiles are over-commitment prone
  // especially in summer months
  if (lightProfile !== 'high-light' || neurotransmitters.serotonin !== 'high') return null
  if (![5, 6, 7, 8].includes(currentMonth)) return null

  const name = connectionName(connection)

  return {
    category: 'over-commitment',
    trigger:  'High-light profile in peak season — over-commitment risk elevated',
    message:  `You're at peak energy right now and everything feels possible with ${name}. That's real — but your optimism is outpacing the relationship's actual timeline. What have you promised lately that your future self will have to deliver on?` 
  }
}

function checkScarcityLock(profile, connection) {
  const { latitudeTier, stressBaseline } = profile.derived
  if (latitudeTier !== 'high' || stressBaseline !== 'freeze') return null

  const name = connectionName(connection)

  return {
    category: 'scarcity-lock',
    trigger:  'High-latitude freeze profile — scarcity pattern possible',
    message:  `Your profile shows a strong loyalty baseline — which is a strength. But loyalty and obligation aren't the same thing. Are you still with ${name} because you genuinely want to be, or because leaving feels like losing something you can't replace?` 
  }
}

function checkOptimismBias(profile, connection, currentMonth) {
  const { lightProfile, chronotype } = profile.derived
  if (lightProfile !== 'high-light' || chronotype !== 'lark') return null
  if (![3, 4, 5].includes(currentMonth)) return null  // spring surge

  const name = connectionName(connection)

  return {
    category: 'optimism-bias',
    trigger:  'High-light lark profile in spring — optimism bias peak',
    message:  `Spring is your most optimistic season, which means it's also your most selective-memory season. You're likely minimizing friction with ${name} that was real in winter. Don't make structural decisions about this relationship until June — in either direction.` 
  }
}

// ─── Self-Directed Nudges (no connection required) ────────────────────────────

function checkSeasonalSelfAwareness(profile, currentMonth) {
  const { vulnerabilityWindow, season } = profile.derived
  const { startMonth } = vulnerabilityWindow

  // Trigger one month before window opens
  const warningMonth = ((startMonth - 2 + 12) % 12) + 1
  if (currentMonth !== warningMonth) return null

  const windowStart = MONTH_NAMES[startMonth - 1]

  return {
    category: 'withdrawal',
    trigger:  `One month before vulnerability window opens (${windowStart})`,
    message:  `Your natural low period starts next month. This is your heads-up. It's a good time to: shore up routines, communicate expectations to people close to you, and avoid scheduling anything that requires you to be "on." You already know what this feels like — plan for it this time.` 
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isInWindow(month, startMonth, endMonth) {
  if (startMonth <= endMonth) {
    return month >= startMonth && month <= endMonth
  }
  return month >= startMonth || month <= endMonth
}

function connectionName(connection) {
  return connection?.connectedUserId?.name || connection?.manualProfile?.name || 'this person'
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * generate(userId, profile, connections) → saves new nudges to DB
 * Skips any nudge category already active (not dismissed) for that connection
 *
 * @param {string} userId
 * @param {object} profile     — full BioProfile document (with .derived)
 * @param {array}  connections — array of Connection documents
 * @returns {array} newly created nudges
 */
async function generate(userId, profile, connections) {
  const currentMonth = new Date().getMonth() + 1
  const created = []

  // ── Self-directed nudge (no connection) ──────────────────────────────────
  const selfNudge = checkSeasonalSelfAwareness(profile, currentMonth)
  if (selfNudge) {
    const alreadyActive = await CoachingNudge.findOne({
      userId,
      connectionId: null,
      category:     selfNudge.category,
      dismissed:    false
    })
    if (!alreadyActive) {
      const n = await CoachingNudge.create({ userId, connectionId: null, ...selfNudge })
      created.push(n)
    }
  }

  // ── Per-connection nudges ─────────────────────────────────────────────────
  for (const connection of connections) {
    const candidates = [
      checkWithdrawal(profile, connection, currentMonth),
      checkIntensitySeeking(profile, connection, currentMonth),
      checkOverCommitment(profile, connection, currentMonth),
      checkScarcityLock(profile, connection),
      checkOptimismBias(profile, connection, currentMonth)
    ].filter(Boolean)

    for (const nudge of candidates) {
      const alreadyActive = await CoachingNudge.findOne({
        userId,
        connectionId: connection._id,
        category:     nudge.category,
        dismissed:    false
      })
      if (alreadyActive) continue

      const n = await CoachingNudge.create({
        userId,
        connectionId: connection._id,
        ...nudge
      })
      created.push(n)
    }
  }

  return created
}

module.exports = { generate }
