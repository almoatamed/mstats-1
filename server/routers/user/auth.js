const express = require('express');
const mysql = require('../../database/mydql')
const bcrypt = require('bcrypt')
const user_middlewares = require('../../middlewares/user.middleware')

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

router.post('/login',(req,res)=>{
    const user_data = req.body

    // validate
    if(!rules('usernmae', user_data.username) || !rules('password', user_data.password)){
        return res.status(421).json({error:{name:'authentication error', msg:'Invalid username and password'}}).end()
    }

    
    mysql.pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).json({error:{err, msg:'Error in database connection'}}).end()
        }
        
        const sql_query = `
            SELECT user_id, user_name, password FROM user WHERE user_name = '${user_data.username}' AND deleted = 0 limit 1;
        `
        connection.query(sql_query,async (err, result) => {
            if(err){
                connection.release()
                return res.status(500).json({error:err, msg:'Error in database connection'}).end()
            }
            if(result.length == 0){
                connection.release()
                return res.status(421).json({error:{name:'authentication error', msg:'Invalid username and password'}}).end()
            }
            bcrypt.compare(user_data.password, result[0].password,(err,result)=>{
                if(err){
                    connection.release()
                    return res.status(500).json({error:err, msg:'Error in bcrypt'}).end()
                }
                if(!result){
                    connection.release()
                    return res.status(421).json({error:{name:'authentication error', msg:'Invalid username and password'}}).end()
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