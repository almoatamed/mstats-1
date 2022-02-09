const env  = require('../env.js')
const mysql = require('mysql');


const con = mysql.createConnection(env.db.mysql);

module.exports = {
    con, 
}
