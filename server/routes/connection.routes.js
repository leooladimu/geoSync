const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const {
  getConnections,
  getConnection,
  createConnection,
  deleteConnection,
} = require("../controllers/connection.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/", getConnections);
router.get("/:id", getConnection);
router.post("/", createConnection);
router.delete("/:id", deleteConnection);

module.exports = router;
