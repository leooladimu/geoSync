const mongoose = require("mongoose");

const coachingNudgeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection",
      default: null,
    },
    category: {
      type: String,
      enum: [
        "withdrawal",
        "over-commitment",
        "intensity-seeking",
        "scarcity-lock",
        "optimism-bias",
      ],
      required: true,
    },
    trigger: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    dismissed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("CoachingNudge", coachingNudgeSchema);
