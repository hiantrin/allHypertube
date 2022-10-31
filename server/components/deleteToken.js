const pool = require('../connection/dbConnection')

const deleteToken = (token, type) => {
    return new Promise((resolve, reject) => {
        console.log("first")
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            connection.execute('UPDATE `users` SET `emailToken` = ?, `isVerified` = ? WHERE `users`.`emailToken` = ? ', [null, 1, token], (err, result) => {
                if (err) reject(err)
                else {
                    connection.release();
                    resolve("success");
                }
            })
        })
    })
}

module.exports = deleteToken;