const router = require("express").Router();
const {
  createProfile,
  getMyProfile,
  updateProfile,
  updateCalibration,
} = require("../controllers/profile.controller");
const auth = require("../middleware/auth.middleware");
router.get("/", auth, getMyProfile);
router.post("/", auth, createProfile);
router.put("/", auth, updateProfile);
router.patch("/calibration", auth, updateCalibration);

module.exports = router;
