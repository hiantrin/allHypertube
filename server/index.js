const express = require('express')
const app = express()
const cors = require('cors');

app.use(express.json({
	limit: '50mb', extended: true
}))

app.use(cors({
	origin : "http://localhost:3000"
}));



const signUpRouter = require('./routes/signUp')
const signInRouter = require('./routes/signIn')
const confirmEmail = require('./routes/ConfirmEmail')
const forgetPassword = require('./routes/forgetPassword')
const resetPassword = require('./routes/resetPassword')
const getInfos = require('./routes/getInfos')
const changeInfos = require('./routes/changeInfos')
const getMovies = require('./routes/getMovies')


app.use('/', signInRouter)
app.use('/', signUpRouter)
app.use('/auth', confirmEmail)
app.use('/auth', forgetPassword)
app.use('/auth', resetPassword)
app.use('/user', getInfos)
app.use('/user', changeInfos)
app.use('/movies', getMovies)


app.listen(3001, () => {
    console.log("RUNNING ON PORT 3001")
});