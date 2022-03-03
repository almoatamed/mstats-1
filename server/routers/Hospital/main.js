const express = require('express')
const fm = require('../../middlewares/factory.middleware')

const router = express.Router()

router.use('/seed',fm.is_factory_enabled,require('./seed'))
router.use('/register',require('./registration'))
router.use('/fetch',require('./fetch'))
module.exports = router
