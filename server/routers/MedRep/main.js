const express = require('express')

const router = express.Router()

router.use('/register',require('./registration'))
module.exports = router
