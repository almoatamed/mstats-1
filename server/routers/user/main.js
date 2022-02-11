const express = require('express')

const router = express.Router()

router.use('/seed',require('./seed'))
router.use('/auth',require('./auth'))
module.exports = router
