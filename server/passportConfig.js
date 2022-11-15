const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

GOOGLE_CLIENT_ID = "42506965891-i7fcta0r8hdp6n44cm7bu7g7u01qoliq.apps.googleusercontent.com";
GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
            // console.log(profile)
    }
  )
);

module.exports = passport;