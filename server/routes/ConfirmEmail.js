const express = require('express')
const router = express.Router()
const verifyToken = require('../components/verifyToken')
const response = require('../response/apiResponse')
const isEmpty = require('../components/help')


router.post('/confirm', verifyToken, (req, res) => {
    if (isEmpty(req.bridgeErrors))
    {
        res.send(response(1, null, "Token Valid"))
    }
    else
        res.send(response(0, req.bridgeErrors, null))
})

module.exports = router