const express = require('express')
const router = express.Router()
const axios = require('axios')
const response = require('../response/apiResponse')

const getMyMovie = async (string) => {
    console.log(string)
    const res = await axios.get(`https://yts.torrentbay.to/api/v2/list_movies.json?${string}`)
    if (res.data.status === 'ok') {
        return res.data.data
    }
    else {
        return null
    }
}

router.get('/getMovies', async (req, res) => {

    const resp = await getMyMovie(req.query.string)
    if (resp === null)
        res.send(response(0, "something Went Wrong", null))
    else {
        res.send(response(1, null, resp))
    }
        
})

module.exports = router