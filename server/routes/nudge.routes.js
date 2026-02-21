const express = require('express')
const { requireAuth } = require('../middleware/auth.middleware')
const { getNudges, dismissNudge } = require('../controllers/nudge.controller')

const router = express.Router()

router.use(requireAuth)

router.get('/', getNudges)
router.patch('/:id/dismiss', dismissNudge)

module.exports = router
