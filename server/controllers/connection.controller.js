const Connection = require("../models/connection.model");
const BioProfile = require("../models/bioProfile.model");
const CompatibilityReport = require("../models/compatibilityReport.model");
const { derive } = require("../services/bioProfile.service");
const { generate } = require("../services/compatibility.service");
const { geocodeBirthLocation } = require("../services/geocode.service");

async function getConnections(req, res) {
  try {
    const connections = await Connection.find({ ownerId: req.user._id });
    res.json(connections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getConnection(req, res) {
  try {
    const connection = await Connection.findOne({
      _id: req.params.id,
      ownerId: req.user._id,
    });
    if (!connection)
      return res.status(404).json({ error: "Connection not found" });
    res.json(connection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function mergeCalibration(derived, userAdjustments) {
  if (!userAdjustments) return derived;
  return {
    ...derived,
    chronotype: userAdjustments.chronotype || derived.chronotype,
    stressBaseline: userAdjustments.stressBaseline || derived.stressBaseline,
    socialSeason: userAdjustments.socialSeason || derived.socialSeason,
  };
}

async function createConnection(req, res) {
  try {
    const { type, manualProfile, connectedUserId } = req.body;
    const ownerId = req.user._id;
    const ownerProfile = await BioProfile.findOne({ userId: ownerId });
    if (!ownerProfile)
      return res
        .status(400)
        .json({ error: "Complete your own profile before adding connections" });
    let partnerDerived;
    if (connectedUserId) {
      const partnerProfile = await BioProfile.findOne({
        userId: connectedUserId,
      });
      if (!partnerProfile)
        return res
          .status(400)
          .json({ error: "Partner has not completed their profile yet" });
      partnerDerived = mergeCalibration(
        partnerProfile.derived,
        partnerProfile.userAdjustments,
      );
    } else {
      const { dob, birthLocation, survey } = manualProfile;
      const { lat, lng } = await geocodeBirthLocation(birthLocation);
      const defaultSurvey = {
        stressResponse: "expand",
        openness: "situational",
        socialSeason: "summer",
        conflictStyle: "process-first",
      };
      const effectiveSurvey = {
        ...defaultSurvey,
        ...(survey || {}),
      };
      partnerDerived = derive(dob, lat, lng, effectiveSurvey);
      manualProfile.birthLocation = { ...birthLocation, lat, lng };
    }
    const ownerEffective = mergeCalibration(
      ownerProfile.derived,
      ownerProfile.userAdjustments,
    );
    const report = generate(ownerEffective, partnerDerived);
    const savedReport = await CompatibilityReport.create({
      scores: report.scores,
      tiers: report.tiers,
      archetype: report.archetype,
      dimensions: report.dimensions,
      generatedAt: report.generatedAt,
    });
    const connection = await Connection.create({
      ownerId,
      type,
      connectedUserId: connectedUserId || null,
      manualProfile: connectedUserId ? undefined : manualProfile,
      compatibilityReportId: savedReport._id,
    });
    savedReport.connectionId = connection._id;
    await savedReport.save();
    res.status(201).json({ connection, report: savedReport });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteConnection(req, res) {
  try {
    const connection = await Connection.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user._id,
    });
    if (!connection)
      return res.status(404).json({ error: "Connection not found" });
    if (connection.compatibilityReportId)
      await CompatibilityReport.findByIdAndDelete(
        connection.compatibilityReportId,
      );
    res.json({ message: "Connection deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getConnections,
  getConnection,
  createConnection,
  deleteConnection,
};
