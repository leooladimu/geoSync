const mongoose = require('mongoose')

const bioProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dob: {
    type: Date,
    required: true
  },
  birthLocation: {
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  survey: {
    openness: {
      type: String,
      enum: ['quick', 'gradual', 'situational'],
      required: true
    },
    stressResponse: {
      type: String,
      enum: ['freeze', 'expand', 'fight-flight'],
      required: true
    },
    socialSeason: {
      type: String,
      enum: ['spring', 'summer', 'fall', 'winter'],
      required: true
    },
    conflictStyle: {
      type: String,
      enum: ['resolve-now', 'process-first', 'avoid'],
      required: true
    }
  },
  derived: {
    season: {
      type: String,
      enum: ['spring', 'summer', 'fall', 'winter'],
      required: true
    },
    lightProfile: {
      type: String,
      enum: ['high-light', 'low-light'],
      required: true
    },
    latitudeTier: {
      type: String,
      enum: ['high', 'mid', 'low'],
      required: true
    },
    chronotype: {
      type: String,
      enum: ['lark', 'owl', 'neutral'],
      required: true
    },
    stressBaseline: {
      type: String,
      enum: ['freeze', 'expand', 'fight-flight'],
      required: true
    },
    vulnerabilityWindow: {
      startMonth: { type: Number, min: 1, max: 12, required: true },
      endMonth: { type: Number, min: 1, max: 12, required: true }
    },
    neurotransmitters: {
      dopamine: {
        type: String,
        enum: ['high', 'moderate', 'low'],
        required: true
      },
      serotonin: {
        type: String,
        enum: ['high', 'moderate', 'low'],
        required: true
      }
    }
  },
  userAdjustments: {
    chronotype: {
      type: String,
      enum: ['lark', 'owl', 'neutral'],
      default: null
    },
    stressBaseline: {
      type: String,
      enum: ['freeze', 'expand', 'fight-flight'],
      default: null
    },
    socialSeason: {
      type: String,
      enum: ['spring', 'summer', 'fall', 'winter'],
      default: null
    }
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('BioProfile', bioProfileSchema)
