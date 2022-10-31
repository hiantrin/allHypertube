const jwt =  require('jsonwebtoken')
const pool = require('../connection/dbConnection')
const deleteToken = require('../components/deleteToken')


const verify = (token, type) => {
    return new Promise((resolve, reject) => {
        const JWT_SECRET = ["ajingoolikanawene7kilik7kaaaya!!", "okontiliyaokhlitektiiiirinarianri77ha!!", "yahabibiya7abibituestombecomme!!"]
        jwt.verify(token, JWT_SECRET[type], (err, user) => {
            if (err) reject("token Invalid")
            else {
                resolve(user)
            }
        })
    })
}

const checkInBase = (username) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            connection.execute('SELECT * FROM `users` WHERE `username` = ?', [username], (err, result) => {
                if (err) reject(err)
                else {
                    connection.release();
                    resolve(result[0]);
                }
            })
        })
    })
}

const verifyToken = async (req, res, next) => {
    await verify(req.body.token, req.body.type).then(async (result) => {
        await checkInBase(result.user).then( async (response) => {
            if (req.body.type == 0) {
                if (response.isVerified === 0)
                    req.bridgeErrors = "email is not  verified"
                else if (req.body.token !== response.authToken)
                    req.bridgeErrors = "Token Invalid"
                else {
                    req.body.myUsername = response.username;
                }
            }
            else if (req.body.type === 1)
            {
                if (response.isVerified === 1)
                    req.bridgeErrors = "account is already verified"
                else if (req.body.token !== response.emailToken)
                    req.bridgeErrors = "Token Invalid"
                else {
                    await deleteToken(req.body.token, 1).then((response)=> {
                        console.log(response)
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            }
            else if (req.body.type === 2)
            {
                if (req.body.token !== response.resetToken)
                    req.bridgeErrors = "Token Invalid"
                else
                    req.body.myUsername = response.username;
            }
        }).catch((error) => {
            req.bridgeErrors = error;
        })
    }).catch((error) => {
        req.bridgeErrors = error;
    })
    
    next()
}



module.exports = verifyToken;