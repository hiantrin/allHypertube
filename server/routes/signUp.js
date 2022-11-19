const express = require('express')
const router = express.Router()
const pool = require('../connection/dbConnection')
const isEmpty = require('../components/help')
const response = require('../response/apiResponse')
const createToken = require('../components/createJwt')
const checkEmail = require('../components/checkEmail')
const createTransporter = require('../components/createTransporter')
const bcrypt = require('bcrypt');
const checkUsername = require('../components/checkUsername')

const check = async (req, res, next) => {
    const error = {}
    await checkUsername(req.body.username).then((message) => {
        if (!message)
            error.username = "username Already exists";
    }).catch((message) => {
        console.log("hna username", message);
    });
    await checkEmail(req.body.email).then((message) => {
        if(!message)
            error.email = "email Already exists";
    }).catch((message) => {
        console.log("hna lemail", message)
    })
    req.bridgeErrors = error;
    next();
}

const insertUser = (infos) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            connection.execute('Insert Into `users` (`username`, `firstName`, `lastName`, `email`, `password`, `redirect`, `passportId`) VALUES(?, ?, ?, ?, ?, ?, ?)', [infos.username, infos.firstName, infos.lastName, infos.email, infos.password, 'normal', null], (err, result) => {
                if(err) reject(err)
                else{
                    connection.release();
                    resolve("successfully")
                }
            })
        })
    })
}

const insertIt = async (infos) => {
    const salt = bcrypt.genSaltSync(10);
    const hash =  bcrypt.hashSync(infos.password, salt)
    infos.password = hash;
    await insertUser(infos).then((result) => {
        return(true)
    }).catch((error) => {
        console.log(error)
        return (false)
    })
}

const setEmailToken = (token, username) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            connection.execute('UPDATE `users` SET `emailToken` = ?  WHERE `users`.`username` = ?', [token, username], (err, result) => {
                if(err) reject(err)
                else{
                    connection.release();
                    resolve(true);
                }
            })
        })
    })
}

const createEmail = async (token, email) => {
    const html = `<h1>Confirm Your Email</h1>
    <p>Confrim your email by clicking the link bellow</p>
    <a href="http://localhost:3000/confirm/${token}">Click to validate your registration</a>`

    const subject = "Confirm your email"

    await createTransporter(subject, email, html).then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
    })
}

const sendMail = async (username, email) => {
    const jwt = createToken(username, 1);

    await setEmailToken(jwt, username).then((result) => {
        createEmail(jwt, email);
    }).catch((error) => {
        console.log(error)
        return;
    })
}

router.post('/signUp', check, async (req, res) => {
    
    if (isEmpty(req.bridgeErrors))
    {
        if(insertIt(req.body)) {
            sendMail(req.body.username, req.body.email)
            res.send(response(1, null, null))
        }
        else res.send(response(0, null, null))
    }
    else
        res.send(response(0, req.bridgeErrors, null))
})

module.exports = router