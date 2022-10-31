const pool = require('../connection/dbConnection')

const checkEmail =  (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err,connection) => {
            if (err) reject(err)
            connection.execute('SELECT * FROM `users` WHERE `email` = ? ', [email], (err, result) => {
                if(err) reject(err)
                else {
                    connection.release();
                    if (result.length === 0) resolve(true)
                    else resolve(false)
                }
            })
        })
    })
}

module.exports = checkEmail;