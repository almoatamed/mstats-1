const express = require('express');
const env = require('../../env')
const mysql = require('../../database/mydql')
const router = express.Router();
const bcrypt = require('bcrypt')
 
router.get('/',(req,res)=>{
    mysql.pool.getConnection((err,connection)=>{
        if(err){
            res.status(500).json({error:err, msg:'Error in database connection'}).end()
        }
        const sql_query = `
            SELECT * FROM user WHERE user_name = 'admin' and name = 'admin';
        `
        connection.query(sql_query,async (err, result) => {
            if(err){
                connection.release()
                res.status(500).json({error:err, msg:'Error in database connection'}).end()
            }
            
            const hash = await bcrypt.hash('admin',env.auth.bcrypt.rounds)
            
            if(result.length == 0){
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
                        res.status(500).json({error:err, msg:'Error in seeding'}).end()
                    }else{
                        res.status(200).json({result,msg:'defaul user created'}).end()
                    }
                })
            }else{
                connection.release()
                res.status(400).json({
                    error:{name:"seed error", message: "already seeded"},
                    message: "already seeded",
                    result
                }).end()
            }

        })
    })
})

module.exports = router 