const express = require('express');
const env = require('../../env')
const mysql = require('../../database/mydql')
const router = express.Router();
const bcrypt = require('bcrypt')
const gen = require('../../utils/generator')
const is_unique = require('../../database/helpers/is_unique.db')
const pq = require('../../database/helpers/promise_query.db')

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
        connection.query(sql_query,async(err, result) => {
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



router.get('/factory/:no',(req, res)=>{
    console.log('generating users, req.query', req.query, ' req.params', req.params)
    let number_of_entries = 0
    if(req.query.key != env.auth.seed_key){
        return res.status(env.response.status_codes.not_autharized).json({error:{name:'not authorized', msg:"please provide seed key"}})
    }
    try {
        number_of_entries = parseInt(req.params.no)
        if(number_of_entries == NaN){
            throw {name:"factory error", msg:"not defined factory number"}
        }
    } catch (error) {
        res.status(env.response.status_codes.invalid_field).json({error:{err:error,message:"Invalid number of factory", name:"factory error" }}).end()
    }

    console.log('trying to parse int the params', number_of_entries)

    mysql.pool.getConnection(async(err,connection)=>{
        if(err){
            res.status(env.response.status_codes.server_error).json({error:{err, msg:'Error in database connection'}}).end()
        }
        console.log('connection craeted')

        try {
            let password = '1234'
            const hash = await bcrypt.hash(password,env.auth.bcrypt.rounds)
            console.log('hash created', hash)
            for (let index = 0; index < number_of_entries; index++) {
                let name = gen.name(2)

                let username = gen.username(name)
                while(!is_unique('user', 'user_name',username)){
                    username = gen.username(name)
                } 
                console.log('craeting user',name, username)
                let insert_query = `
                    INSERT INTO user (name, user_name, password) VALUES(
                        '${name}', '${username}', '${hash}'
                    );
                `
                await pq(insert_query)
            }
            console.log('done')
            connection.release()
            res.status(env.response.status_codes.ok).json({result:{name:'succeed',msg:`created ${number_of_entries} mock user`}})         
        } catch (error) {

            connection.release()
            res.status(env.response.status_codes.server_error).json({error:{err:error,message:"server error", name:"factory error" }}).end()
        } })

})

module.exports = router 