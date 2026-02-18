const router = require("express").Router();
const { getNudges, dismissNudge } = require("../controllers/nudge.controller");
const auth = require("../middleware/auth.middleware");
router.get("/", auth, getNudges);
router.patch("/:id/dismiss", auth, dismissNudge);
module.exports = router;
