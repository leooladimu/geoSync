const CoachingNudge  = require('../models/coachingNudge.model')
const BioProfile     = require('../models/bioProfile.model')
const Connection     = require('../models/connection.model')
const nudgeService   = require('../services/nudge.service')

async function getNudges(req, res) {
  try {
    const userId = req.user._id

    // Regenerate nudges on each fetch — cheap and keeps them current
    const profile = await BioProfile.findOne({ userId })
    if (profile) {
      const connections = await Connection.find({ ownerId: userId })
      await nudgeService.generate(userId, profile, connections)
    }

    const nudges = await CoachingNudge.find({
      userId,
      dismissed: false
    })
    .populate('connectionId', 'type manualProfile connectedUserId')
    .sort({ createdAt: -1 })

    res.json(nudges)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function dismissNudge(req, res) {
  try {
    const nudge = await CoachingNudge.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { dismissed: true },
      { new: true }
    )
    if (!nudge) return res.status(404).json({ error: 'Nudge not found' })
    res.json(nudge)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getNudges, dismissNudge }
