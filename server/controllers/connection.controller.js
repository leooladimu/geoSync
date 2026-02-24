const Connection = require("../models/connection.model");
const BioProfile = require("../models/bioProfile.model");
const User = require("../models/user.model");
const CompatibilityReport = require("../models/compatibilityReport.model");
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

/**
 * Check if the manual profile matches an existing user in the database.
 * Matches on: name (case-insensitive), date of birth, and birth city+country.
 * Returns the matched user's BioProfile (with userId) or null.
 */
async function findMatchingUser(manualProfile, ownerId) {
  const { name, dob, birthLocation } = manualProfile;
  if (!name || !dob || !birthLocation?.city || !birthLocation?.country)
    return null;

  // Normalise for comparison
  const normName = name.trim().toLowerCase();
  const normCity = birthLocation.city.trim().toLowerCase();
  const normCountry = birthLocation.country.trim().toLowerCase();
  const targetDate = new Date(dob);

  // Find all BioProfiles whose DOB and birth city/country match
  // (DOB is stored as a Date, so match by day range)
  const dayStart = new Date(targetDate);
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date(targetDate);
  dayEnd.setUTCHours(23, 59, 59, 999);

  const candidates = await BioProfile.find({
    userId: { $ne: ownerId }, // exclude self
    dob: { $gte: dayStart, $lte: dayEnd },
  }).populate("userId", "name"); // pull in user.name

  for (const bp of candidates) {
    if (!bp.userId || !bp.userId.name) continue;

    const bpCity = (bp.birthLocation?.city || "").trim().toLowerCase();
    const bpCountry = (bp.birthLocation?.country || "").trim().toLowerCase();
    const bpName = bp.userId.name.trim().toLowerCase();

    if (
      bpName === normName &&
      bpCity === normCity &&
      bpCountry === normCountry
    ) {
      return bp; // matched!
    }
  }
  return null;
}

async function getConnections(req, res) {
  try {
    const connections = await Connection.find({
      ownerId: req.user._id,
    }).populate("connectedUserId", "name");
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
    }).populate("connectedUserId", "name");
    if (!connection)
      return res.status(404).json({ error: "Connection not found" });
    res.json(connection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createConnection(req, res) {
  try {
    const { type, manualProfile, connectedUserId } = req.body;
    const ownerId = req.user._id;

    // Get the owner's bio profile
    const ownerProfile = await BioProfile.findOne({ userId: ownerId });
    if (!ownerProfile) {
      return res
        .status(400)
        .json({ error: "Complete your own profile before adding connections" });
    }

    // Resolve the partner's derived profile
    let partnerDerived;
    let partnerProfile = null;
    let resolvedConnectedUserId = connectedUserId || null;
    let matchedExistingUser = false;

    if (connectedUserId) {
      // Explicitly linked partner (existing flow)
      partnerProfile = await BioProfile.findOne({ userId: connectedUserId });
      if (!partnerProfile) {
        return res
          .status(400)
          .json({ error: "Partner has not completed their profile yet" });
      }
      partnerDerived = partnerProfile.derived;
    } else if (manualProfile) {
      // Manual entry — check if this person is already a user on the platform
      const matchedProfile = await findMatchingUser(manualProfile, ownerId);

      if (matchedProfile) {
        // This connection is an existing user — use their real profile
        partnerProfile = matchedProfile;
        partnerDerived = matchedProfile.derived;
        resolvedConnectedUserId =
          matchedProfile.userId._id || matchedProfile.userId;
        matchedExistingUser = true;
        console.log(
          `[connection] Matched manual entry "${manualProfile.name}" to existing user ${resolvedConnectedUserId}`,
        );
      } else {
        // No match — derive on the fly from manual entry
        const { dob, birthLocation, survey } = manualProfile;
        const { lat, lng } = await geocodeBirthLocation(birthLocation);
        partnerDerived = derive(
          dob,
          lat,
          lng,
          survey || {
            stressResponse: "expand",
            openness: "situational",
            socialSeason: "summer",
            conflictStyle: "process-first",
          },
        );
        // Store lat/lng back into manualProfile
        manualProfile.birthLocation = { ...birthLocation, lat, lng };
      }
    } else {
      return res
        .status(400)
        .json({ error: "Provide either connectedUserId or manualProfile" });
    }

    // Merge calibration with derived profiles
    const ownerEffective = mergeCalibration(
      ownerProfile.derived,
      ownerProfile.userAdjustments,
    );
    const partnerEffective = partnerProfile
      ? mergeCalibration(partnerProfile.derived, partnerProfile.userAdjustments)
      : partnerDerived;

    // Generate compatibility report using effective (calibrated) profiles
    const report = generate(ownerEffective, partnerEffective);

    // Create the connection first (without the report ref)
    const connection = await Connection.create({
      ownerId,
      type,
      connectedUserId: resolvedConnectedUserId,
      manualProfile: resolvedConnectedUserId ? undefined : manualProfile,
    });

    // Now create the report with the connectionId
    const savedReport = await CompatibilityReport.create({
      connectionId: connection._id,
      scores: report.scores,
      tiers: report.tiers,
      archetype: report.archetype,
      dimensions: report.dimensions,
      generatedAt: report.generatedAt,
    });

    // Update the connection with the report reference
    connection.compatibilityReportId = savedReport._id;
    await connection.save();

    res
      .status(201)
      .json({ connection, report: savedReport, matchedExistingUser });
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

    // Clean up the associated report
    if (connection.compatibilityReportId) {
      await CompatibilityReport.findByIdAndDelete(
        connection.compatibilityReportId,
      );
    }

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
