const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const SCHOOLStrategy = require("passport-42").Strategy;
const passport = require("passport");
const pool = require('./connection/dbConnection')
const isEmpty = require('./components/help')
const createToken = require('./components/createJwt')

GOOGLE_CLIENT_ID = "42506965891-i7fcta0r8hdp6n44cm7bu7g7u01qoliq.apps.googleusercontent.com";
GOOGLE_CLIENT_SECRET = "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";

GITHUB_CLIENT_ID = "af3b10cbb811321531c9"
GITHUB_CLIENT_SECRET = "00d4b20318183875d5697dc32abbc09385fc952c"

SCHOOL_CLIENT_ID = "u-s4t2ud-f842f9fda1de0b00804981222a788c09ba01e6c6f72b1bff0a524562fe43736e"
SCHOOL_CLIENT_SECRET = "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"

const checkid = (id) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) reject(err)
			connection.execute('SELECT * FROM `users` WHERE `redirect` = ? AND `passportId` = ? ', ['GO', id], (err, result) => {
				if (err) reject(err)
				else {
					connection.release();
                    if (result.length === 0) resolve(true)
                    else resolve(false)
				}
			}) 
		})
	})
}

const check = async (id) => {
    const error = {}
    await checkid(id).then((result) => {
        if(!result)
            error.error = 'login';
    }).catch((message) => {
        error.error = message;
    })
	if (isEmpty(error))
		return null
	else
		return error.error
}

const setInBase = (username, firstName, lastName, email, id) => {
	return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err)
            connection.execute('Insert Into `users` (`username`, `firstName`, `lastName`, `email`, `password`, `isVerified`, `redirect`, `passportId`) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [username, firstName, lastName, email,  'passport', 1, 'GO', id], (err, result) => {
                if(err) reject(err)
                else{
                    connection.release();
                    resolve("successfully")
                }
            })
        })
    })
}

const setAuthPassport = async (username, firstName, lastName, email, id) => {
	const error = {};
	await setInBase(username, firstName, lastName, email, id).then((result) => {

	}).catch((err) => {
		error.error  = err
	})
	return error
}

const setAuthToken = (jwt, id) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) reject(err)
			connection.execute('UPDATE `users` set `authToken` = ? WHERE `users`.`redirect` = ? AND `users`.`passportId` = ?', [jwt, 'GO' ,id], (err, result) => {
				if (err) reject(err)
				else{
					connection.release()
					resolve(true)
				}
			})
		})
	})
}

const createAuthToken = async (username, id) => {
	const jwt = createToken(username, 0);
	const error = {}
	await setAuthToken(jwt, id).then((response) => {
		error.jwt = jwt;
	}).catch((err) => {
		error.jwt = null;
	})

	return error.jwt;
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
		const error = await check(profile._json.sub)
		const username = [profile._json.given_name, profile._json.sub].join('');
		if (error && error !== 'login') return cb(error)
		else if (error && error === 'login')
		{
			const response = await createAuthToken(username, profile._json.sub);
			if (!response)
				return cb("Something Went Wrong Please Try Again !!")
			else {
				
				return cb(['authToken:', response].join(''))
			}
		}
    	else {
			const result = await setAuthPassport(username, profile._json.given_name, profile._json.family_name, profile._json.email, profile._json.sub);
			if (!isEmpty(result)) return cb(result.error)
			const response = await createAuthToken(username, profile._json.sub);
			if (!response) return cb("Something Went Wrong Please Try Again !!")
			else return cb(['authToken:', response].join(''))
      	}
	}
  )
);
passport.use(
new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/github/callback",
      scope: ["user:email"],
    },
    function (accessToken, refreshToken, profile, cb) {
		console.log(profile)
	})
);

passport.use(
	new SCHOOLStrategy(
		{
			clientID: SCHOOL_CLIENT_ID,
			clientSecret: SCHOOL_CLIENT_SECRET,
			callbackURL: "http://localhost:3001/auth/42/callback",
		},
		function (accessToken, refreshToken, profile, cb) {
			console.log(profile)
		}
	)
);

module.exports = passport;