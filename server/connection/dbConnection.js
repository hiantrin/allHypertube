const mysql = require("mysql2")

const pool = mysql.createPool({
    port: '6033',
    host: "localhost",
    user : "root",
    password : "myrootpass",
    database : "hypertube"
})

module.exports= pool;