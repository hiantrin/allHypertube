const express = require('express')
const verifyToken = require('../components/verifyToken')
const router = express.Router()
const isEmpty = require('../components/help')
const response = require('../response/apiResponse')
const pool = require('../connection/dbConnection')
const createToken = require('../components/createJwt')

const updateInfos = (infos, token) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) reject(err)
			connection.execute('UPDATE `users` SET `username` = ? , `firstName` = ? , `lastName` = ? , `email` = ? , `avatar` = ? , `authToken` = ? WHERE `users`.`username` = ?', [infos.username, infos.firstName, infos.lastName , infos.email , infos.avatar , token, infos.myUsername], (err, result) => {
				if (err) reject(err)
				else {
					connection.release();
					resolve(result)
				}
			})
		})
	})
}

const setInBase = async (infos) => {
	const errors = {};
	const token = createToken(infos.username, 0)
    await updateInfos(infos, token).then((response) => {
		errors.error = null;
		errors.token = token;
    }).catch((error) => {
		console.log(error)
		errors.error = "Something Went Wrong Please Try Again Later"
    })
	return errors
}

router.post('/changeInfos', verifyToken, async (req, res) => {
    if(isEmpty(req.bridgeErrors)) {
        const result = await setInBase(req.body)
		if (result.error === null)
			res.send(response(1, null, {message : "Your infos Has Been Updated Succefully", token : result.token}))
		else
			res.send(response(0, result.error, null))
    } else {
        res.send(response(0, "Something Went Wrong Please Try Again", null))
    }
})

module.exports = router