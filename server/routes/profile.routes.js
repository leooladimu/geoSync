const express = require('express')
const { requireAuth } = require('../middleware/auth.middleware')
const { createProfile, getMyProfile, updateProfile, updateCalibration } = require('../controllers/profile.controller')

const router = express.Router()

router.use(requireAuth)

router.post('/create', createProfile)
router.get('/me', getMyProfile)
router.put('/update', updateProfile)
router.patch('/calibration', updateCalibration)

module.exports = router
