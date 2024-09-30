// strategies/spotify.js
const passport = require("passport");
const SpotifyStrategy = require('passport-spotify').Strategy;
require('dotenv').config();

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_REDIRECT_URL,
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      try {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        profile.tokenExpiresAt = Date.now() + expires_in * 1000; 

        console.log('Spotify access token acquired.');
        process.env.stoken=accessToken;
        done(null, profile);
      } catch (error) {
        console.error('Error in Spotify strategy:', error);
        done(error, null);
      }
    }
  )
);

console.log('Spotify Strategy initialized');