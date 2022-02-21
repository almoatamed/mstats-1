const express = require('express')

const router = express.Router()

router.use('/user', require('./user/main'))
router.use('/hospital', require('./Hospital/main'))
router.use('/medrep', require('./MedRep/main')) // paths should be small letters not camel

module.exports = router