
const jwt = require('../utils/jwt/index')
const mysql = require('../database/mydql')

module.exports = {
    auth: (req,res,next)=>{
        const token = req.headers.authorization
        if(!token){ return res.status(421).json({error:{name:'unautharized', msg:"unautharized action"}}).end()}
        jwt.verify(token,(err,user)=>{
            if(!err){ return res.status(421).json({error:{name:'unautharized', msg:"unautharized action"}}).end()}
            else {
                req.user = user
                res.headers["Access-Control-Allow-Origin"] = "*"
                const select_query = `
                    select * from user where user_id = ${user.user_id} and deleted = 0 limit 1;
                `
                mysql.pool.getConnection((err,connection)=>{
                    if(err){
                        res.status(500).json({error:{err, msg:'Error in database connection'}}).end()
                    }
                    connection.query(select_query, (err,result)=>{
                        if(err){
                            connection.release()
                            return res.status(500).json({error:err, msg:'Error in database connection'}).end()
                        }
                        if(result.length == 0){
                            connection.release()
                            return res.status(421).json({error:{name:'unautharized', msg:"unautharized action"}}).end()
                        }
                        next()
                    })
                })
            }            
        })
    }
}