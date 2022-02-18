const express = require('express')

const router = express.Router()

router.use('/user', require('./user/main'))
router.use('/hospital', require('./Hospital/HospRegistration'))
router.use('/MedRep', require('./MedRep/MedRepRegistration'))



module.exports = router