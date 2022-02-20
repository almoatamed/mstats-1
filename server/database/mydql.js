const env  = require('../env.js')
const mysql = require('mysql');

const mysql_configuration = JSON.parse(JSON.stringify(env.db.mysql))
if(process.platform == 'linux'){
    mysql_configuration.socketPath = undefined
}


const pool = mysql.createPool(mysql_configuration);

module.exports = {
    pool,     
}
