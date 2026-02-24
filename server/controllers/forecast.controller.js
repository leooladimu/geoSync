const Connection = require("../models/connection.model");
const BioProfile = require("../models/bioProfile.model");
const SeasonalForecast = require("../models/seasonalForecast.model");
const { generateForecast } = require("../services/forecast.service");

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

async function getForecast(req, res) {
  try {
    const connection = await Connection.findOne({
      _id: req.params.connectionId,
      ownerId: req.user._id,
    });
    if (!connection)
      return res.status(404).json({ error: "Connection not found" });

    // Get current forecast or generate if needed
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let forecast = await SeasonalForecast.find({
      connectionId: connection._id,
      month: { $gte: currentMonth },
      year: { $gte: currentYear },
    })
      .sort({ month: 1, year: 1 })
      .limit(3);

    // If we don't have 3 months of forecast data, generate it
    if (forecast.length < 3) {
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
        const { derive } = require("../services/bioProfile.service");
        partnerEffective = derive(dob, lat, lng, survey || {});
      }

      const newForecastData = generateForecast(
        ownerEffective,
        partnerEffective,
        currentMonth,
        currentYear,
      );

      // Clear old forecasts and create new ones
      await SeasonalForecast.deleteMany({ connectionId: connection._id });

      const createdForecasts = await SeasonalForecast.insertMany(
        newForecastData.map((f) => ({
          ...f,
          connectionId: connection._id,
        })),
      );

      forecast = createdForecasts;
    }

    res.json(forecast);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getForecastRange(req, res) {
  try {
    const { from, to } = req.query;
    const connection = await Connection.findOne({
      _id: req.params.connectionId,
      ownerId: req.user._id,
    });
    if (!connection)
      return res.status(404).json({ error: "Connection not found" });

    const forecast = await SeasonalForecast.find({
      connectionId: connection._id,
      month: { $gte: parseInt(from) },
      year: { $gte: parseInt(to) },
    }).sort({ month: 1, year: 1 });

    res.json(forecast);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getForecast, getForecastRange };
