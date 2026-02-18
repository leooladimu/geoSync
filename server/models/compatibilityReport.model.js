const mongoose = require('mongoose')

const dimensionDetailSchema = new mongoose.Schema({
  score: Number, tier: String, insight: String, warning: String,
  strategy: String, archetype: String, dynamic: String,
  toxicLoop: String, circuitBreaker: String,
  overlapMonths: Number, detail: mongoose.Schema.Types.Mixed
}, { _id: false })

const compatibilityReportSchema = new mongoose.Schema({
  connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection' },
  scores: {
    overall: { type: Number, required: true },
    chronotype: { type: Number, required: true },
    stress:     { type: Number, required: true },
    seasonal:   { type: Number, required: true }
  },
  tiers: { chronotype: String, stress: String, seasonal: String },
  archetype: { type: String, required: true },
  dimensions: {
    chronotype: dimensionDetailSchema,
    stress:     dimensionDetailSchema,
    seasonal:   dimensionDetailSchema
  },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

module.exports = mongoose.model('CompatibilityReport', compatibilityReportSchema)
