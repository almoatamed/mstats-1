
const db = require('../mydql')

module.exports = (table, field, value)=>{
    return new Promise((resolve,reject)=>{
        db.pool.getConnection((err,connection)=>{
            if(err){
                return reject(err)
            }
            const query = `
                SELECT * FROM ${table} WHERE ${field} = '${value}' limit 1;
            `
            connection.query(query, (err,result)=>{
                if(err){
                    connection.release()
                    return reject(err)
                }
                connection.release()
                if(result.length == 0){
                    return resolve(true)
                }
                resolve(false)
            })
        })
    })
}