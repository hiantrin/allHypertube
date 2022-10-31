const express = require('express')
const router = express.Router()
const isEmpty = require('../components/help')
const verifyToken = require('../components/verifyToken')
const response = require('../response/apiResponse')
const pool = require('../connection/dbConnection')


const getUserdata = (username) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            connection.execute('SELECT * FROM `users` WHERE `username` = ?', [username], (err, result) => {
                if (err) reject(err)
                else {
                    connection.release()
                    resolve(result)
                }
            })
        })
    })
}

const getInfos = async (username) => {
    const data = {}
    await getUserdata(username).then((result) => {
        data.infos = result[0]
    }).catch((err) => {
        data.error = null;
    })
    return(data.infos)
}

router.post('/getInfos', verifyToken, async (req, res) => {
    if (isEmpty(req.bridgeErrors)) {
        const infos = await getInfos(req.body.myUsername)
        if (infos.error !== null) {
            res.send(response(1, null, {
                username : infos.username,
                firstName: infos.firstName,
                lastName: infos.lastName,
                email: infos.email,
                avatar: infos.avatar
            }))
        }
    }
    else{
        res.send(response(0, "Something Went Wrong", null))
    }
})

module.exports = router