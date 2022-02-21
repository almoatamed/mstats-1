
const jwt = require('../utils/jwt/index')
const mysql = require('../database/mydql')

module.exports = {
    auth: (req,res,next)=>{
        const token = req.headers['authorization']
        if(!token){ return res.status(421).json({error:{name:'unautharized', msg:"unautharized action"}}).end()}
        jwt.verify(token,(err,user)=>{
            if(err){ return res.status(421).json({error:{name:'unautharized', msg:"unautharized action"}}).end()}
            else {
                const select_query = `
                    select * from user where user_id = ${user.user_id} and deleted = 0 limit 1;
                `
                mysql.pool.getConnection((err,connection)=>{
                    if(err){
                        return res.status(500).json({error:{err, msg:'Error in database connection'}}).end()
                    }
                    connection.query(select_query, (err,result)=>{
                        if(err){
                            console.log('error in db', err)
                            connection.release()
                            return res.status(500).json({error:err, msg:'Error in database connection'}).end()
                        }
                        if(result.length == 0){
                            connection.release()
                            return res.status(421).json({error:{name:'unautharized', msg:"unautharized action"}}).end()
                        }
                        connection.release()

                        req.user = result[0]
                        return next()
                    })
                })
            }            
        })
    }
}