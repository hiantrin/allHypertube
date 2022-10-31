const express = require('express')
const isEmpty = require('../components/help')
const router = express.Router()
const pool = require('../connection/dbConnection')
const response = require('../response/apiResponse')
const bcrypt = require('bcrypt');
const createToken = require('../components/createJwt')


const checkEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            connection.execute('SELECT * FROM `users` WHERE `email` = ?', [email], (err, result) => {
                if (err) reject(err)
                else {
                    connection.release()
                    resolve(result);
                }
            })
        })
    })
}

const checkUser = async (req, res, next) => {
    const error = {}
    await checkEmail(req.body.email).then(async (result) => {
        if (isEmpty(result)) {
            error.email = "email don't exist Please Enter a valid email";
        } else {
            if (result[0].isVerified === 0) {
                error.email = "Please verify your email first"
            } else {
                const res = await bcrypt.compareSync(req.body.password, result[0].password);
                if (res === false)
                    error.password = "password is Invalid"
                else
                    req.body.myUsername = result[0].username;
            }
            
        }
    }).catch((error) => {
        req.bridgeErrors = error;
    })
    if (error.email === "Please verify your email first")
        req.bridgeErrors = "Please verify your email first"
    else
        req.bridgeErrors = error
    next()
}

const setAuthToken = (token, username) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            connection.execute('UPDATE `users` SET `authToken` = ?  WHERE `users`.`username` = ?', [token, username], (err, result) => {
                if(err) reject(err)
                else{
                    connection.release();
                    resolve(result);
                }
            })
        })
    })
}

const generateAuth = async (username) => {
    const jwt = createToken(username, 0);
    const auth = {}
    await setAuthToken(jwt, username).then((result) => {
        auth.token = jwt
    }).catch((error) => {
        auth = null
    })
    return (auth)
}

router.post("/signIn", checkUser, async (req, res) => {
    if (!isEmpty(req.bridgeErrors)) {
        res.send(response(0, req.bridgeErrors, null))
    } else {
        const token = await generateAuth(req.body.myUsername)
        if (token === null)
            res.send(response(0, "Something went wrong", null))
        else
            res.send(response(1, null, token))
    }

})

module.exports = router