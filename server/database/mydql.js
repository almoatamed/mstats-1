const env  = require('../env.js')
const mysql = require('mysql');


const pool = mysql.createPool(env.db.mysql);

module.exports = {
    pool,     
}
