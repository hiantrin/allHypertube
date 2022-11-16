const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const checkEmail = require('./components/checkEmail')
const pool = require('./connection/dbConnection')
const isEmpty = require('./components/help')

GOOGLE_CLIENT_ID = "42506965891-i7fcta0r8hdp6n44cm7bu7g7u01qoliq.apps.googleusercontent.com";
GOOGLE_CLIENT_SECRET = "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";

const check = async (email) => {
    const error = {}
    await checkEmail(email).then((message) => {
        if(!message)
            error.email = "email Already exists";
    }).catch((message) => {
        console.log("hna lemail", message)
    })
	return error
}

const setInBase = (username, firstName, lastName, email) => {
	return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            connection.execute('Insert Into `users` (`username`, `firstName`, `lastName`, `email`, `password`, `isVerified`) VALUES(?, ?, ?, ?, ?, ?)', [username, firstName, lastName, email,  "passport", 1], (err, result) => {
                if(err) reject(err)
                else{
                    connection.release();
                    resolve("successfully")
                }
            })
        })
    })
}

const setAuthPassport = async (username, firstName, lastName, email) => {
	const error = {};
	await setInBase(username, firstName, lastName, email).then((result) => {

	}).catch((err) => {
		error.error  = err
	})
	return error
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, cb) =>  {
		const error = await check(profile._json.email)
		if (!isEmpty(error)) return cb(error.email)
    	else {
			const username = [profile._json.given_name, profile._json.sub].join('');
			console.log(profile._json);
			const result = await setAuthPassport(username, profile._json.given_name, profile._json.family_name, profile._json.email);
			if (!isEmpty(result)) return cb(result.error)
			return cb(null, "nice")
      	}
	}
  )
);

module.exports = passport;