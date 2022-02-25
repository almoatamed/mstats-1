const express = require('express')

const router = express.Router()

router.use('/register',require('./registration'))
router.use('/fetch',require('./fetch'))
module.exports = router
