// strategies/google.js
const passport = require("passport");
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const GoogleToken = require('../models/googleToken'); 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope:['email','profile','https://www.googleapis.com/auth/youtube','https://www.googleapis.com/auth/youtube.force-ssl'],
    },
    async function(accessToken, refreshToken, params, profile, done) {
      try {
        let user = await User.findOne({googleId: profile.id});

        if (!user) {
          user = new User({
              _id:user.req.id,
              username: profile.displayName,
              googleId: profile.id,
          });
          await user.save();
      }
        // profile.accessToken = accessToken;
        // profile.refreshToken = refreshToken;
        // profile.tokenExpiresAt = Date.now() + 3600 * 1000; // Example expiration

        console.log('Google access token acquired.');

        // Prepare token data
        const tokenData = {
          userId: profile.id,
          provider:'google',
          accessToken,
          refreshToken,
          tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
        };

        await GoogleToken.findOneAndUpdate(
          { userId: profile.id }, // Search for an existing record
          tokenData,              // Update with new data
          { upsert: true, new: true }  // Insert if it doesn't exist
        );

        done(null, profile);
      } catch (error) {
        console.error('Error in Google strategy:', error);
        done(error, null);
      }
    }
  )
);

console.log('Google Strategy initialized');    