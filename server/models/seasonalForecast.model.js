const mongoose = require('mongoose')

const partnerForecastSchema = new mongoose.Schema({
  energyLevel:           { type: String, enum: ['rising','peak','dipping','low'], required: true },
  inVulnerabilityWindow: { type: Boolean, required: true }
}, { _id: false })

const seasonalForecastSchema = new mongoose.Schema({
  connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection', required: true },
  month:        { type: Number, required: true, min: 1, max: 12 },
  year:         { type: Number, required: true },
  userA:        { type: partnerForecastSchema, required: true },
  userB:        { type: partnerForecastSchema, required: true },
  mismatchRisk: { type: String, enum: ['low','moderate','high'], required: true },
  recommendations: [String],
  scripts:         [String]
}, { timestamps: true })

seasonalForecastSchema.index({ connectionId: 1, month: 1, year: 1 }, { unique: true })
module.exports = mongoose.model('SeasonalForecast', seasonalForecastSchema)
