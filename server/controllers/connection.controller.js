const Connection          = require('../models/connection.model')
const BioProfile          = require('../models/bioProfile.model')
const CompatibilityReport = require('../models/compatibilityReport.model')
const { derive }          = require('../services/bioProfile.service')
const { generate }        = require('../services/compatibility.service')
const { geocodeBirthLocation } = require('../services/geocode.service')

// Helper to merge user calibration with derived profile
function mergeCalibration(derived, userAdjustments) {
  if (!userAdjustments) return derived
  return {
    ...derived,
    chronotype:     userAdjustments.chronotype     || derived.chronotype,
    stressBaseline: userAdjustments.stressBaseline || derived.stressBaseline,
    socialSeason:   userAdjustments.socialSeason   || derived.socialSeason
  }
}

async function getConnections(req, res) {
  try {
    const connections = await Connection.find({ ownerId: req.user._id })
    res.json(connections)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getConnection(req, res) {
  try {
    const connection = await Connection.findOne({
      _id: req.params.id,
      ownerId: req.user._id
    })
    if (!connection) return res.status(404).json({ error: 'Connection not found' })
    res.json(connection)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function createConnection(req, res) {
  try {
    const { type, manualProfile, connectedUserId } = req.body
    const ownerId = req.user._id

    // Get the owner's bio profile
    const ownerProfile = await BioProfile.findOne({ userId: ownerId })
    if (!ownerProfile) {
      return res.status(400).json({ error: 'Complete your own profile before adding connections' })
    }

    // Resolve the partner's derived profile
    let partnerDerived
    let partnerProfile = null

    if (connectedUserId) {
      // Partner is a platform user
      partnerProfile = await BioProfile.findOne({ userId: connectedUserId })
      if (!partnerProfile) {
        return res.status(400).json({ error: 'Partner has not completed their profile yet' })
      }
      partnerDerived = partnerProfile.derived
    } else {
      // Manual entry — derive on the fly
      const { dob, birthLocation, survey } = manualProfile
      const { lat, lng } = await geocodeBirthLocation(birthLocation)
      partnerDerived = derive(
        dob, lat, lng,
        survey || { stressResponse: 'expand', openness: 'situational', socialSeason: 'summer', conflictStyle: 'process-first' }
      )
      // Store lat/lng back into manualProfile
      manualProfile.birthLocation = { ...birthLocation, lat, lng }
    }

    // Merge calibration with derived profiles
    const ownerEffective  = mergeCalibration(ownerProfile.derived, ownerProfile.userAdjustments)
    const partnerEffective = partnerProfile 
      ? mergeCalibration(partnerProfile.derived, partnerProfile.userAdjustments)
      : partnerDerived

    // Generate compatibility report using effective (calibrated) profiles
    const report = generate(ownerEffective, partnerEffective)

    // Create the connection first (without the report ref)
    const connection = await Connection.create({
      ownerId,
      type,
      connectedUserId: connectedUserId || null,
      manualProfile:   connectedUserId ? undefined : manualProfile,
    })

    // Now create the report with the connectionId
    const savedReport = await CompatibilityReport.create({
      connectionId:   connection._id,
      scores:         report.scores,
      tiers:          report.tiers,
      archetype:      report.archetype,
      dimensions:     report.dimensions,
      generatedAt:    report.generatedAt
    })

    // Update the connection with the report reference
    connection.compatibilityReportId = savedReport._id
    await connection.save()

    res.status(201).json({ connection, report: savedReport })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function deleteConnection(req, res) {
  try {
    const connection = await Connection.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user._id
    })
    if (!connection) return res.status(404).json({ error: 'Connection not found' })

    // Clean up the associated report
    if (connection.compatibilityReportId) {
      await CompatibilityReport.findByIdAndDelete(connection.compatibilityReportId)
    }

    res.json({ message: 'Connection deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getConnections, getConnection, createConnection, deleteConnection }
