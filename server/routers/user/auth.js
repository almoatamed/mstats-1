const express = require('express');
const mysql = require('../../database/mydql')
const bcrypt = require('bcrypt')
const user_middlewares = require('../../middlewares/user.middleware')

// env 
const env  = require('../../env')

// rules 
const rules = require('../../utils/rules/index')

// jwt 
const jwt = require('../../utils/jwt/index')

//router instance 
const router = express.Router();

router.post('/verify', user_middlewares.auth, (req,res)=>{
    console.log('verifying', request)
    res.status(200).json({result:{name:'valid', msg:'verified user'}}).end()
})

router.post('/login',async (req,res)=>{
    const user_data = req.body

    // validate
    let password_validation = await rules(['required','password'], user_data.password, 'password')
    if(!password_validation.valid){
        return res.status(env.response.status_codes.not_autharized).json({error:{name:'authentication error', msg:password_validation.msg}}).end()
    }

    let username_validation = await rules(['required','username'], user_data.username, 'username')
    if(!username_validation.valid){
        return res.status(env.response.status_codes.not_autharized).json({error:{name:'authentication error', msg:username_validation.msg}}).end()
    }


    // authentication
    mysql.pool.getConnection((err,connection)=>{
        if(err){
            res.status(env.response.status_codes.server_error).json({error:{err, msg:'Error in database connection'}}).end()
        }
        
        const sql_query = `
            SELECT user_id, user_name, password FROM user WHERE user_name = '${user_data.username}' AND deleted = 0 limit 1;
        `
        connection.query(sql_query,async (err, result) => {
            if(err){
                connection.release()
                return res.status(env.response.status_codes.server_error).json({error:err, msg:'Error in database connection'}).end()
            }
            if(result.length == 0){
                connection.release()
                return res.status(env.response.status_codes.not_autharized).json({error:{name:'authentication error', msg:'Invalid username and password'}}).end()
            }
            bcrypt.compare(user_data.password, result[0].password,(err,result)=>{
                if(err){
                    connection.release()
                    return res.status(env.response.status_codes.server_error).json({error:err, msg:'Error in bcrypt'}).end()
                }
                if(!result){
                    connection.release()
                    return res.status(env.response.status_codes.not_autharized).json({error:{name:'authentication error', msg:'Invalid username and password'}}).end()
                }
                
                connection.release()
                res.status(200).json({result: {
                    token: jwt.generate({
                        user_id: user_data.user_id,
                    })
                }}).end()
            })
            
        })

    })

})

module.exports = router 