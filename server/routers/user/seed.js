const express = require('express');
const env = require('../../env')
const mysql = require('../../database/mydql')
const router = express.Router();
const bcrypt = require('bcrypt')
 
router.get('/',(req,res)=>{
    if(req.query.key != env.auth.seed_key){
        return res.status(env.response.status_codes.not_autharized).json({error:{name:'not authorized', msg:"please provide seed key"}})
    }
    mysql.pool.getConnection((err,connection)=>{
        if(err){
            res.status(env.response.status_codes.server_error).json({error:{err, msg:'Error in database connection'}}).end()
        }
        const sql_query = `
            SELECT * FROM user WHERE user_name = 'admin' and name = 'admin' AND deleted = 0 limit 1;
        `
        connection.query(sql_query,async (err, result) => {
            if(err){
                connection.release()
                res.status(env.response.status_codes.server_error).json({error:{err, msg:'Error in database connection'}}).end()
            }
            
            if(result.length == 0){
                const hash = await bcrypt.hash('admin',env.auth.bcrypt.rounds)
                const seed_query = `
                    INSERT INTO user(name, user_name, password) VALUES(
                        'admin', 
                        'admin', 
                        '${hash}'  
                    );
                `   
                connection.query(seed_query, (err, result)=>{
                    connection.release()
                    if(err){
                        res.status(env.response.status_codes.server_error).json({error:{err, msg:'Error in seeding'}}).end()
                    }else{
                        res.status(env.response.status_codes.ok).json({result:{msg:'defaul user created'}}).end()
                    }
                })
            }else{
                connection.release()
                res.status(env.response.status_codes.repeated_query).json({
                    error:{name:"seed error", message: "already seeded"},
                }).end()
            }

        })
    })
})

module.exports = router 