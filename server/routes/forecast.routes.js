const router = require('express').Router()
const { getForecast, getForecastRange } = require('../controllers/forecast.controller')
const auth = require('../middleware/auth.middleware')
router.get('/:connectionId',       auth, getForecast)
router.get('/:connectionId/range', auth, getForecastRange)
module.exports = router
