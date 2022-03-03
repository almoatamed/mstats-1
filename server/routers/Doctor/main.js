const express = require('express')
const factory_middleware = require('../../middlewares/factory.middleware')

const router = express.Router()

router.use('/seed',factory_middleware.is_factory_enabled,require('./seed'))
router.use('/register',require('./registration'))
router.use('/fetch',require('./fetch'))
module.exports = router
