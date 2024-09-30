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
        // Attach tokens to the user profile
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        // Optionally, store token expiry time
        profile.tokenExpiresAt = Date.now() + params.expires_in * 1000; // Current time + expires_in seconds

        console.log('Google access token acquired.');
        process.env.gtoken=accessToken;
        // Pass the updated profile to the done callback
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