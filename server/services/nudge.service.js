const CoachingNudge = require('../models/coachingNudge.model')
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function isInWindow(month, startMonth, endMonth) {
  if (startMonth <= endMonth) return month >= startMonth && month <= endMonth
  return month >= startMonth || month <= endMonth
}

function connectionName(connection) {
  return connection?.manualProfile?.name || 'this person'
}

function checkWithdrawal(profile, connection, currentMonth) {
  const { vulnerabilityWindow, stressBaseline } = profile.derived
  if (!isInWindow(currentMonth, vulnerabilityWindow.startMonth, vulnerabilityWindow.endMonth) || stressBaseline !== 'freeze') return null
  const name = connectionName(connection)
  return {
    category: 'withdrawal',
    trigger: `Current month (${MONTH_NAMES[currentMonth - 1]}) falls in your vulnerability window with a freeze stress response`,
    message: `You're entering your natural low period. Your instinct is to go quiet — with ${name} and with yourself. Before you do: let them know it's seasonal, not personal. One sentence is enough.`
  }
}

function checkIntensitySeeking(profile, connection, currentMonth) {
  const { neurotransmitters, vulnerabilityWindow } = profile.derived
  if (neurotransmitters.dopamine !== 'low' || !isInWindow(currentMonth, vulnerabilityWindow.startMonth, vulnerabilityWindow.endMonth)) return null
  const name = connectionName(connection)
  return {
    category: 'intensity-seeking',
    trigger: 'Low dopamine baseline active during vulnerability window',
    message: `Your baseline is craving stimulation right now. That's biology, not boredom with ${name}. Before you create friction to feel something — try naming what you actually need.`
  }
}

function checkOverCommitment(profile, connection, currentMonth) {
  const { lightProfile, neurotransmitters } = profile.derived
  if (lightProfile !== 'high-light' || neurotransmitters.serotonin !== 'high' || ![5,6,7,8].includes(currentMonth)) return null
  const name = connectionName(connection)
  return {
    category: 'over-commitment',
    trigger: 'High-light profile in peak season — over-commitment risk elevated',
    message: `You're at peak energy and everything feels possible with ${name}. Your optimism is real — but it may be outpacing the relationship's actual timeline. What have you promised lately that your future self will have to deliver?`
  }
}

function checkScarcityLock(profile, connection) {
  const { latitudeTier, stressBaseline } = profile.derived
  if (latitudeTier !== 'high' || stressBaseline !== 'freeze') return null
  const name = connectionName(connection)
  return {
    category: 'scarcity-lock',
    trigger: 'High-latitude freeze profile — scarcity pattern possible',
    message: `Your profile shows a strong loyalty baseline — which is a strength. But loyalty and obligation aren't the same thing. Are you still with ${name} because you genuinely want to be, or because leaving feels like losing something you can't replace?`
  }
}

function checkOptimismBias(profile, connection, currentMonth) {
  const { lightProfile, chronotype } = profile.derived
  if (lightProfile !== 'high-light' || chronotype !== 'lark' || ![3,4,5].includes(currentMonth)) return null
  const name = connectionName(connection)
  return {
    category: 'optimism-bias',
    trigger: 'High-light lark profile in spring — optimism bias peak',
    message: `Spring is your most optimistic season, which means it's also your most selective-memory season. You're likely minimizing friction with ${name} that was real in winter. Don't make structural decisions until June — in either direction.`
  }
}

function checkSeasonalSelfAwareness(profile, currentMonth) {
  const { vulnerabilityWindow } = profile.derived
  const { startMonth } = vulnerabilityWindow
  const warningMonth = ((startMonth - 2 + 12) % 12) + 1
  if (currentMonth !== warningMonth) return null
  return {
    category: 'withdrawal',
    trigger: `One month before vulnerability window opens (${MONTH_NAMES[startMonth - 1]})`,
    message: `Your natural low period starts next month. Shore up routines, communicate expectations to people close to you, and avoid scheduling anything that requires you to be "on." You already know what this feels like — plan for it this time.`
  }
}

async function generate(userId, profile, connections) {
  const currentMonth = new Date().getMonth() + 1
  const created = []

  const selfNudge = checkSeasonalSelfAwareness(profile, currentMonth)
  if (selfNudge) {
    const exists = await CoachingNudge.findOne({ userId, connectionId: null, category: selfNudge.category, dismissed: false })
    if (!exists) created.push(await CoachingNudge.create({ userId, connectionId: null, ...selfNudge }))
  }

  for (const connection of connections) {
    const candidates = [
      checkWithdrawal(profile, connection, currentMonth),
      checkIntensitySeeking(profile, connection, currentMonth),
      checkOverCommitment(profile, connection, currentMonth),
      checkScarcityLock(profile, connection),
      checkOptimismBias(profile, connection, currentMonth)
    ].filter(Boolean)

    for (const nudge of candidates) {
      const exists = await CoachingNudge.findOne({ userId, connectionId: connection._id, category: nudge.category, dismissed: false })
      if (!exists) created.push(await CoachingNudge.create({ userId, connectionId: connection._id, ...nudge }))
    }
  }

  return created
}

module.exports = { generate }
