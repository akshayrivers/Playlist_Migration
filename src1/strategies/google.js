// strategies/google.js
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope:['email','profile','https://www.googleapis.com/auth/youtube','https://www.googleapis.com/auth/youtube.force-ssl'],
    },
    function(accessToken, refreshToken, params, profile, done) {
      try {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        profile.tokenExpiresAt = Date.now() + params.expires_in * 1000; 

        console.log('Google access token acquired.');
        process.env.gtoken=accessToken;
        console.log(profile);
        done(null, profile);
      } catch (error) {
        console.error('Error in Google strategy:', error);
        done(error, null);
      }
    }
  )
);

console.log('Google Strategy initialized');    