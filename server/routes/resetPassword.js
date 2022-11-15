const express = require('express')
const isEmpty = require('../components/help')
const router = express.Router()
const verifyToken = require('../components/verifyToken')
const response = require('../response/apiResponse')
const bcrypt = require('bcrypt');
const pool = require('../connection/dbConnection')

const updatePassword = (password, username) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) reject(err)
            connection.execute('UPDATE `users` SET `password` = ?, `resetToken` = ? WHERE `users`.`username` = ? ', [password, null, username], (err, result) => {
                if(err) reject(err)
                else {
                    connection.release();
                    resolve(result)
                }
            })
        })
    })
}

const changePass = async (password, username) => {
    const salt = bcrypt.genSaltSync(10);
    const hash =  bcrypt.hashSync(password, salt)
    await updatePassword(hash, username).then((result) => {
        
    }).catch((error) => {
        req.bridgeErrors = error;
    })
}

router.post('/resetPassword', verifyToken, (req, res) => {
    if (isEmpty(req.bridgeErrors))
    {
        changePass(req.body.password, req.body.myUsername)
        if (isEmpty(req.bridgeErrors))
        {   
            res.send(response(1, null, "You have changed you Password Succefully"))
        }else {
            res.send(response(0, req.bridgeErrors, null))
        }
    } else {
        res.send(response(0, req.bridgeErrors, null))
    }
})

module.exports = router