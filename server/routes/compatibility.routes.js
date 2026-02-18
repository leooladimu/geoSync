const router = require('express').Router()
const { getReport, regenerateReport } = require('../controllers/compatibility.controller')
const auth = require('../middleware/auth.middleware')
router.get('/:connectionId',             auth, getReport)
router.post('/regenerate/:connectionId', auth, regenerateReport)
module.exports = router
