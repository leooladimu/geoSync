const Connection = require("../models/connection.model");
const BioProfile = require("../models/bioProfile.model");
const SeasonalForecast = require("../models/seasonalForecast.model");
const { derive } = require("../services/bioProfile.service");
const { generateRange } = require("../services/forecast.service");

function mergeCalibration(derived, userAdjustments) {
  if (!userAdjustments) return derived;
  return {
    ...derived,
    chronotype: userAdjustments.chronotype || derived.chronotype,
    stressBaseline: userAdjustments.stressBaseline || derived.stressBaseline,
    socialSeason: userAdjustments.socialSeason || derived.socialSeason,
  };
}

async function resolveBothProfiles(connection, ownerUserId) {
  const ownerProfile = await BioProfile.findOne({ userId: ownerUserId });
  if (!ownerProfile) throw new Error("Owner profile not found");
  let partnerDerived;
  if (connection.connectedUserId) {
    const pp = await BioProfile.findOne({ userId: connection.connectedUserId });
    if (!pp) throw new Error("Partner profile not found");
    partnerDerived = mergeCalibration(pp.derived, pp.userAdjustments);
  } else {
    const { dob, birthLocation, survey } = connection.manualProfile;
    partnerDerived = derive(
      dob,
      birthLocation.lat,
      birthLocation.lng,
      survey || {},
    );
  }
  const ownerEffective = mergeCalibration(
    ownerProfile.derived,
    ownerProfile.userAdjustments,
  );
  return { ownerDerived: ownerEffective, partnerDerived };
}

async function getForecast(req, res) {
  try {
    const connection = await Connection.findOne({
      _id: req.params.connectionId,
      ownerId: req.user._id,
    });
    if (!connection)
      return res.status(404).json({ error: "Connection not found" });
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const { ownerDerived, partnerDerived } = await resolveBothProfiles(
      connection,
      req.user._id,
    );
    const forecasts = generateRange(
      ownerDerived,
      partnerDerived,
      month,
      year,
      3,
    );
    const saved = await Promise.all(
      forecasts.map((f) =>
        SeasonalForecast.findOneAndUpdate(
          { connectionId: connection._id, month: f.month, year: f.year },
          { ...f, connectionId: connection._id },
          { upsert: true, new: true },
        ),
      ),
    );
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getForecastRange(req, res) {
  try {
    const connection = await Connection.findOne({
      _id: req.params.connectionId,
      ownerId: req.user._id,
    });
    if (!connection)
      return res.status(404).json({ error: "Connection not found" });
    const { from, to } = req.query;
    if (!from || !to)
      return res
        .status(400)
        .json({ error: "from and to query params required (YYYY-MM)" });
    const [fromYear, fromMonth] = from.split("-").map(Number);
    const [toYear, toMonth] = to.split("-").map(Number);
    const totalMonths = (toYear - fromYear) * 12 + (toMonth - fromMonth) + 1;
    if (totalMonths < 1 || totalMonths > 12)
      return res.status(400).json({ error: "Range must be 1–12 months" });
    const { ownerDerived, partnerDerived } = await resolveBothProfiles(
      connection,
      req.user._id,
    );
    const forecasts = generateRange(
      ownerDerived,
      partnerDerived,
      fromMonth,
      fromYear,
      totalMonths,
    );
    const saved = await Promise.all(
      forecasts.map((f) =>
        SeasonalForecast.findOneAndUpdate(
          { connectionId: connection._id, month: f.month, year: f.year },
          { ...f, connectionId: connection._id },
          { upsert: true, new: true },
        ),
      ),
    );
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getForecast, getForecastRange };
