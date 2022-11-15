const express = require('express')
const router = express.Router()
const passport = require("../passportConfig")


router.get("/google", passport.authenticate("google"));
router.get("/google/callback", (req, res) =>
		res.redirect("http://localhost:3000/")
);
module.exports = router