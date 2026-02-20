const BioProfile = require("../models/bioProfile.model");
const { derive } = require("../services/bioProfile.service");
const { geocodeBirthLocation } = require("../services/geocode.service");

async function createProfile(req, res) {
  try {
    const { dob, birthLocation, survey } = req.body;
    const userId = req.user._id;
    const existing = await BioProfile.findOne({ userId });
    if (existing)
      return res
        .status(409)
        .json({ error: "Profile already exists — use PUT to update" });
    const { lat, lng } = await geocodeBirthLocation(birthLocation);
    const derived = derive(dob, lat, lng, survey);
    console.log('Derived profile:', JSON.stringify(derived, null, 2));
    const profile = await BioProfile.create({
      userId,
      dob,
      birthLocation: { ...birthLocation, lat, lng },
      survey,
      derived,
    });
    res.status(201).json(profile);
  } catch (err) {
    console.error('Profile creation error:', err);
    res.status(500).json({ error: err.message });
  }
}

async function getMyProfile(req, res) {
  try {
    const profile = await BioProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ error: "No profile found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const { dob, birthLocation, survey } = req.body;
    const { lat, lng } = await geocodeBirthLocation(birthLocation);
    const derived = derive(dob, lat, lng, survey);
    const profile = await BioProfile.findOneAndUpdate(
      { userId: req.user._id },
      { dob, birthLocation: { ...birthLocation, lat, lng }, survey, derived },
      { new: true, upsert: true },
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateCalibration(req, res) {
  try {
    const { userAdjustments } = req.body;
    const profile = await BioProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { userAdjustments } }, // use $set, not full replace
      { new: true, runValidators: true },
    );
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createProfile,
  getMyProfile,
  updateProfile,
  updateCalibration,
};
