const mongoose = require('mongoose')

const compatibilityReportSchema = new mongoose.Schema({
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connection',
    required: true
  },
  scores: {
    overall: { type: Number, min: 0, max: 100, required: true },
    chronotype: { type: Number, min: 0, max: 100, required: true },
    stress: { type: Number, min: 0, max: 100, required: true },
    seasonal: { type: Number, min: 0, max: 100, required: true }
  },
  tiers: {
    chronotype: {
      type: String,
      enum: ['high', 'moderate', 'low'],
      required: true
    },
    stress: {
      type: String,
      enum: ['high', 'moderate', 'low'],
      required: true
    },
    seasonal: {
      type: String,
      enum: ['protective', 'moderate', 'risky'],
      required: true
    }
  },
  archetype: {
    type: String,
    required: true
  },
  dimensions: {
    chronotype: {
      score: { type: Number, required: true },
      tier: { type: String, required: true },
      insight: { type: String },
      warning: { type: String },
      strategy: { type: String },
      detail: {
        a: { type: String, required: true },
        b: { type: String, required: true }
      }
    },
    stress: {
      score: { type: Number, required: true },
      tier: { type: String, required: true },
      archetype: { type: String },
      dynamic: { type: String },
      toxicLoop: { type: String },
      circuitBreaker: { type: String },
      detail: {
        a: { type: String, required: true },
        b: { type: String, required: true }
      }
    },
    seasonal: {
      score: { type: Number, required: true },
      tier: { type: String, required: true },
      insight: { type: String },
      strategy: { type: String },
      overlapMonths: { type: Number, required: true },
      detail: {
        a: { type: Object, required: true },
        b: { type: Object, required: true }
      }
    }
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('CompatibilityReport', compatibilityReportSchema)
