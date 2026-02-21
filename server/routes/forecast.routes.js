const express = require('express')
const { requireAuth } = require('../middleware/auth.middleware')
const { getForecast, getForecastRange } = require('../controllers/forecast.controller')

const router = express.Router()

router.use(requireAuth)

router.get('/:connectionId', getForecast)
router.get('/:connectionId/range', getForecastRange)

module.exports = router
