const express = require('express')

const router = express.Router()

router.use('/user', require('./user/main'))


module.exports = router