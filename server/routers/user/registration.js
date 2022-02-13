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
    const user_data = request.body 
     

    // validation
    const validaters = [
        [['required', 'username'], user_data.username, 'username'],
        [['required', 'password'], user_data.password, 'password'],
        [['required', 'name'], user_data.name, 'name'],
        [['email'], user_data.email, 'email'],
        [['phone'], user_data.phone, 'phone'],
        [['address'], user_data.address, 'address'],
    ];
    validaters.forEach(async  validater=>{
        const valid = await rules(validater[0], validater[1], validater[2])
        if(!valid.valid){
            res.status(env.response.status_codes.invalid_field).json({error:{name:'Invalid Field', msg:valid.msg}}).end()
        }
    })
    
    //registration 
    pool.pool.getConnection(async (err, connection )=>{
        if(err){
            res.status(env.response.status_codes.server_error).json({error:{err, msg:'Error in database connection'}}).end()
        }
        
        // verify that username is unique 
        const check_if_exists_query =  `
            SELECT * FROM user WHERE user_name = '${user_data.username}' LIMIT 1;
        `
        connection.query(check_if_exists_query, async (err, result)=>{
            if(err){
                connection.release()
                res.status(env.response.status_codes.server_error).json({error:{err, msg:'Error in verifying unique user'}}).end()
            }
            
            if(result.length >0){
                connection.release()
                res.status(env.response.status_codes.repeated_query).json({
                    error:{name:"user exists", message: "username already exists"},
                }).end()
            }

            // insert new user
            const hash = await bcrypt.hash(user_data.password,env.auth.bcrypt.rounds)
            const insertion_query = `
                INSERT INTO user(user_name, pasword, name, email, phone_number, address) VALUES(
                    '${user_data.username}',
                    '${hash}',
                    '${user_data.name}',
                    ${!!user_data.email?"'"+user_data.email+"'":'null'},
                    ${!!user_data.phone?"'"+user_data.phone+"'":'null'},
                    ${!!user_data.address?"'"+user_data.address+"'":'null'},
                );
            `
            connection.query(insertion_query, (err)=>{
                if(err){
                    connection.release()
                    res.status(env.response.status_codes.server_error).json({error:{err, msg:'Error in creating User'}}).end()
                }
                connection.release()
                res.status(env.response.status_codes.ok).json({result:{msg:'user created'}}).end()
            })
        })
    })
})



module.exports = router

