const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth',          require('./routes/auth.routes'))
app.use('/api/profile',       require('./routes/profile.routes'))
app.use('/api/connections',   require('./routes/connection.routes'))
app.use('/api/compatibility', require('./routes/compatibility.routes'))
app.use('/api/forecast',      require('./routes/forecast.routes'))
app.use('/api/nudges',        require('./routes/nudge.routes'))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () =>
      console.log(`geoSync API running on port ${process.env.PORT || 5000}`)
    )
  })
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1) })
