const env = require('../../env')
const express = require('express')
const router = express.Router()

const middlewares = []

const factory_middleware = require('../../middlewares/factory.middleware')
middlewares.push(factory_middleware.is_factory_enabled)

const user_router = require('../user/seed')
middlewares.push(user_router.methods.factory_middleware)

const hospital_router = require('../Hospital/seed')
middlewares.push(hospital_router.methods.factory_middleware)

const manufacturer_router = require('../Manufacturer/seed')
middlewares.push(manufacturer_router.methods.factory_middleware)

const product_router = require('../Products/seed')
middlewares.push(product_router.methods.factory_middleware)

const pharmacy_router = require('../Pharmacy/seed')
middlewares.push(pharmacy_router.methods.factory_middleware)

const medrep_router = require('../MedRep/seed')
middlewares.push(medrep_router.methods.factory_middleware)

const seed_router = require('../Doctor/seed')
middlewares.push(seed_router.methods.factory_middleware)

middlewares.push((req,res)=>{
    return res.status(env.response.status_codes.ok).json({result:{msg:'success'},status_code:env.response.status_codes.ok})
})


router.get('/:no',middlewares)

module.exports = router