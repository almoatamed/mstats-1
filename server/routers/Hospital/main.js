const express = require('express')

const router = express.Router()

router.use('/register',require('./HospRegistration'))
module.exports = router
