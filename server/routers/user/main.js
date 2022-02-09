const express = require('express')

const router = express.Router()

router.use('/seed',require('./seed'))

module.exports = router
