const Connection = require("../models/connection.model");
const CompatibilityReport = require("../models/compatibilityReport.model");
const BioProfile = require("../models/bioProfile.model");
const { derive } = require("../services/bioProfile.service");
const { generate } = require("../services/compatibility.service");

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
    let partnerDerived;
    if (connection.connectedUserId) {
      const pp = await BioProfile.findOne({
        userId: connection.connectedUserId,
      });
      if (!pp)
        return res.status(400).json({ error: "Partner profile missing" });
      partnerDerived = pp.derived;
    } else {
      const { dob, birthLocation, survey } = connection.manualProfile;
      partnerDerived = derive(
        dob,
        birthLocation.lat,
        birthLocation.lng,
        survey || {},
      );
    }
    const report = generate(ownerProfile.derived, partnerDerived);
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
