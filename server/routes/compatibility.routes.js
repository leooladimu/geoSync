const express = require('express')
const { requireAuth } = require('../middleware/auth.middleware')
const { getReport, regenerateReport } = require('../controllers/compatibility.controller')

const router = express.Router()

router.use(requireAuth)

router.get('/:connectionId', getReport)
router.post('/generate/:connectionId', regenerateReport)

module.exports = router
