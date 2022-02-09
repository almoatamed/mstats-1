const env  = require('../env.js')
const mysql = require('mysql');


const pool = mysql.createPool({
    host: "localhost",
    user: "admin",
    password: "admin",
    database: "pharma"
});

module.exports = {
    pool,     
}
