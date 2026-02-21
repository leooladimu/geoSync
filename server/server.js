require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const connectionRoutes = require("./routes/connection.routes");
const compatibilityRoutes = require("./routes/compatibility.routes");
const forecastRoutes = require("./routes/forecast.routes");
const nudgeRoutes = require("./routes/nudge.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/compatibility", compatibilityRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/nudges", nudgeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Database connection
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/geosync";
console.log(
  "Connecting to MongoDB...",
  mongoUri.includes("mongodb+srv") ? "(Atlas)" : "(local)",
);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
