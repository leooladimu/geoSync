const router = require("express").Router();
const {
  getConnections,
  getConnection,
  createConnection,
  deleteConnection,
} = require("../controllers/connection.controller");
const auth = require("../middleware/auth.middleware");
router.get("/", auth, getConnections);
router.get("/:id", auth, getConnection);
router.post("/", auth, createConnection);
router.delete("/:id", auth, deleteConnection);
module.exports = router;
