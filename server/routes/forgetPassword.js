const express = require('express')
const router = express.Router()
const pool = require('../connection/dbConnection')
const checkEmail = require('../components/checkEmail')
const isEmpty = require('../components/help')
const response  = require('../response/apiResponse')
const createToken = require('../components/createJwt')
const createTransporter = require('../components/createTransporter')

const checkExist = async (req, res, next) => {
    const error = {}
    await checkEmail(req.body.email).then((message) => {
        if(message)
            error.email = "Email don't Exist";
    }).catch((message) => {
        console.log("hna lemail", message)
    })
    req.bridgeErrors = error;
    next();
}

const importUsername = (email) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) reject(err)
			connection.execute('SELECT `username` FROM `users` WHERE `email` = ?', [email], (err, result) => {
				if (err) reject(err)
				else {
					connection.release();
					resolve(result[0]);
				}
			})
		})
	})
}

const insertTokenReset = (username, token) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) reject(err)
			connection.execute('UPDATE `users` SET `resetToken` = ?  WHERE `users`.`username` = ?', [token, username], (err, result) => {
				if (err) reject(err)
				else{
					connection.release()
					resolve(result)
				}
			})
		})
	})
}

const sendResetInstructions = async (email) => {
	await importUsername(email).then(async (result) => {
		const jwt = createToken(result.username, 2);
		await insertTokenReset(result.username, jwt).then(async (result) => {
			const html = `<h1>Reset Your Password</h1>
			<p>Reset Your Password by clicking the link bellow</p>
			<a href="http://localhost:3000/auth/resetPassword/${jwt}">Click to reset your password</a>`

			const subject = "Reset Your Password"

			await createTransporter(subject, email, html).then((result) => {
				console.log(result)
			}).catch((err) => {
				console.log(err)
			})
		}).catch((error) => {
			req.body.bridgeErrors = error;
		})
		
	}).catch((error) => {
		req.body.bridgeErrors = error;
	})

}

router.post('/forgetPassword', checkExist, (req, res) => {
    if (isEmpty(req.bridgeErrors))
    {
        sendResetInstructions(req.body.email)
        res.send(response(1, null, "Reset Password Email has sent"));
    } else {
        res.send(response(0, req.bridgeErrors.email, null))
    }
})

module.exports = router