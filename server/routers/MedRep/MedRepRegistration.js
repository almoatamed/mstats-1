// router instance 
const express = require('express')
const router  = express.Router()

// env 
const env = require('../../env')

// authenticater
const user_middleware    = require('../../middlewares/user.middleware')
// rules 
const rules   = require('../../utils/rules/index')

// database pool
const pool    = require('../../database/mydql')
const res = require('express/lib/response')




router.post('/', user_middleware.auth, async (request, response)=>{
    const MedRep_data = request.body

    //validation
    const validaters = [
        [['required', 'name'], MedRep_data.name, 'name'],
        [['email'], MedRep_data.email, 'email'],
        [['phone'], MedRep_data.phone, 'phone'],
        [['address'], MedRep_data.address, 'address'],
    ];

    validaters.forEach(async  validater=>{
        const valid = await rules(validater[0])
        if(!valid.valid){
            res.status(env.response.status_codes.invalid_field).json({error:{name:'Invalid Field', msg:valid.msg}}).end()
        }
    })

      //registration 
      pool.pool.getConnection(async (err, connection )=>{
        if(err){
            res.status(env.response.status_codes.server_error).json({error:{err, msg:'Error in database connection'}}).end()
        }

         // verify that MedRep name is unique 
         const check_if_exists_query =  `
         SELECT * FROM medical_representative WHERE name = '${MedRep_data.name}' LIMIT 1;
     `
     connection.query(check_if_exists_query, async (err, result)=>{
         if(err){
             connection.release()
             res.status(env.response.status_codes.server_error).json({error:{err, msg:'Error in verifying unique Medical representative'}}).end()
         }
         
         if(result.length >0){
             connection.release()
             res.status(env.response.status_codes.repeated_query).json({
                 error:{name:"Medical representative exists", message: "Medical representative already exists"},
             }).end()
         }

 
         // insert new user
         const insertion_query = `
             INSERT INTO medical_representative(name, email, phone, address) VALUES(
                 '${hospital_data.name}',
                 '${!!hospital_data.email?hospital_data.email:'null'}',
                 '${!!hospital_data.phone?hospital_data.phone:'null'}',
                 '${!!hospital_data.address?hospital_data.address:'null'}',
             );
         `
         connection.query(insertion_query, (err)=>{
             if(err){
                 connection.release()
                 res.status(env.response.status_codes.server_error).json({error:{err, msg:'Error in creating Medical representative'}}).end()
             }
             connection.release()
             res.status(env.response.status_codes.ok).json({result:{msg:'Medical representative created'}}).end()
         })
     })
 })
})



module.exports = router
