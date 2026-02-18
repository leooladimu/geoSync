const mongoose = require('mongoose')

const manualProfileSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  dob:   { type: Date, required: true },
  birthLocation: {
    city:    { type: String, required: true },
    state:   { type: String },
    country: { type: String, required: true },
    lat:     { type: Number, required: true },
    lng:     { type: Number, required: true }
  },
  survey: {
    openness:       { type: String, enum: ['quick','gradual','situational'] },
    stressResponse: { type: String, enum: ['freeze','expand','fight-flight'] },
    socialSeason:   { type: String, enum: ['spring','summer','fall','winter'] },
    conflictStyle:  { type: String, enum: ['resolve-now','process-first','avoid'] }
  }
}, { _id: false })

const connectionSchema = new mongoose.Schema({
  ownerId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:            { type: String, enum: ['romantic','family','platonic','professional'], required: true },
  connectedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  manualProfile:   { type: manualProfileSchema, default: null },
  compatibilityReportId: { type: mongoose.Schema.Types.ObjectId, ref: 'CompatibilityReport', default: null }
}, { timestamps: true })

connectionSchema.index(
  { ownerId: 1, connectedUserId: 1 },
  { unique: true, partialFilterExpression: { connectedUserId: { $ne: null } } }
)

module.exports = mongoose.model('Connection', connectionSchema)
