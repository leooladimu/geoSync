const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["romantic", "family", "platonic", "professional"],
      required: true,
    },
    connectedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    manualProfile: {
      name: { type: String },
      dob: { type: Date },
      birthLocation: {
        city: { type: String },
        state: { type: String },
        country: { type: String },
        lat: { type: Number },
        lng: { type: Number },
      },
      survey: {
        openness: { type: String },
        stressResponse: { type: String },
        socialSeason: { type: String },
        conflictStyle: { type: String },
      },
    },
    compatibilityReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompatibilityReport",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Connection", connectionSchema);
