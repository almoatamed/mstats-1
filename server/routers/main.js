const express = require('express')

const router = express.Router()

router.use('/user', require('./user/main'))
router.use('/hospital', require('./Hospital/main'))
router.use('/doctor', require('./Doctor/main'))
router.use('/pharmacy', require('./Pharmacy/main'))
router.use('/manufacturer', require('./Manufacturer/main'))
router.use('/medrep', require('./MedRep/main')) // paths should be small letters not camel
router.use('/product', require('./Products/main')) // paths should be small letters not camel
router.use('/factory', require('./Factory/index'))
router.use('/prescription', require('./Prescription/main'))
router.use('/sheet', require('./Sheets/main'))
module.exports = router