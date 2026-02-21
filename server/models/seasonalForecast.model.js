const mongoose = require('mongoose')

const seasonalForecastSchema = new mongoose.Schema({
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connection',
    required: true
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  userA: {
    energyLevel: {
      type: String,
      enum: ['rising', 'peak', 'dipping', 'low'],
      required: true
    },
    inVulnerabilityWindow: {
      type: Boolean,
      required: true
    }
  },
  userB: {
    energyLevel: {
      type: String,
      enum: ['rising', 'peak', 'dipping', 'low'],
      required: true
    },
    inVulnerabilityWindow: {
      type: Boolean,
      required: true
    }
  },
  mismatchRisk: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    required: true
  },
  recommendations: [String],
  scripts: [String]
}, {
  timestamps: true
})

// Compound index to ensure one forecast per connection per month
seasonalForecastSchema.index({ connectionId: 1, month: 1, year: 1 }, { unique: true })

module.exports = mongoose.model('SeasonalForecast', seasonalForecastSchema)
