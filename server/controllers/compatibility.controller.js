const Connection = require("../models/connection.model");
const CompatibilityReport = require("../models/compatibilityReport.model");
const BioProfile = require("../models/bioProfile.model");
const { derive } = require("../services/bioProfile.service");
const { generate } = require("../services/compatibility.service");
const { geocodeBirthLocation } = require("../services/geocode.service");

// Helper to merge user calibration with derived profile
function mergeCalibration(derived, userAdjustments) {
  if (!userAdjustments) return derived;
  return {
    ...derived,
    chronotype: userAdjustments.chronotype || derived.chronotype,
    stressBaseline: userAdjustments.stressBaseline || derived.stressBaseline,
    socialSeason: userAdjustments.socialSeason || derived.socialSeason,
  };
}

async function getReport(req, res) {
  try {
    const connection = await Connection.findOne({
      _id: req.params.connectionId,
      ownerId: req.user._id,
    });
    if (!connection)
      return res.status(404).json({ error: "Connection not found" });

    const report = await CompatibilityReport.findById(
      connection.compatibilityReportId,
    );
    if (!report) return res.status(404).json({ error: "Report not found" });

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function regenerateReport(req, res) {
  // Force-regenerate — useful when either profile has been updated
  try {
    const connection = await Connection.findOne({
      _id: req.params.connectionId,
      ownerId: req.user._id,
    });
    if (!connection)
      return res.status(404).json({ error: "Connection not found" });

    const ownerProfile = await BioProfile.findOne({ userId: req.user._id });
    if (!ownerProfile)
      return res.status(400).json({ error: "Owner profile missing" });

    const ownerEffective = mergeCalibration(
      ownerProfile.derived,
      ownerProfile.userAdjustments,
    );
    let partnerEffective;

    if (connection.connectedUserId) {
      const partnerProfile = await BioProfile.findOne({
        userId: connection.connectedUserId,
      });
      if (!partnerProfile)
        return res.status(400).json({ error: "Partner profile missing" });
      partnerEffective = mergeCalibration(
        partnerProfile.derived,
        partnerProfile.userAdjustments,
      );
    } else {
      const { dob, birthLocation, survey } = connection.manualProfile;
      const { lat, lng } = birthLocation;
      partnerEffective = derive(dob, lat, lng, survey || {});
    }

    const report = generate(ownerEffective, partnerEffective);

    const updated = await CompatibilityReport.findByIdAndUpdate(
      connection.compatibilityReportId,
      {
        scores: report.scores,
        tiers: report.tiers,
        archetype: report.archetype,
        dimensions: report.dimensions,
        generatedAt: report.generatedAt,
      },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getReport, regenerateReport };
