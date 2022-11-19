const express = require('express')
const router = express.Router()
const passport = require("../passportConfig")


router.get("/google", passport.authenticate("google"));

router.get("/google/callback", (req, res, next) =>
	passport.authenticate("google", function (err, id) {
		if (err) return res.redirect(`http://localhost:3000/authError/${err}`);
		else res.redirect("http://localhost:3000/");
	})(req, res, next)
);

router.get("/github", passport.authenticate("github"));

router.get("/github/callback", (req, res, next) =>
	passport.authenticate("github", function (err, id) {
		if (err) return res.redirect(`http://localhost:3000/authError/${err}`);
		else res.redirect("http://localhost:3000/");
	})(req, res, next)
);

router.get("/42", passport.authenticate("42"));

router.get("/42/callback", (req, res, next) =>
	passport.authenticate("42", function (err, id) {
		if (err) return res.redirect(`http://localhost:3000/authError/${err}`);
		else res.redirect("http://localhost:3000/");
	})(req, res, next)
);

module.exports = router