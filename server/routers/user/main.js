const express = require('express')

const router = express.Router()

router.use('/seed',require('./seed'))
router.use('/auth',require('./auth'))
router.use('/register',require('./registration'))
module.exports = router
