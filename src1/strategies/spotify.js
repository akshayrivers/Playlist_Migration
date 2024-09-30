// strategies/spotify.js
const passport = require("passport");
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../models/user');
const SpotifyToken = require('../models/spotifyToken');

passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_REDIRECT_URL,
}, async (accessToken, refreshToken, expires_in, profile, done) => {
    try {
        let user = await User.findOne({ spotifyId: profile.id });

        if (!user) {
            user = new User({
                username: profile.displayName,
                spotifyId: profile.id,
            });
            await user.save();
        }

        // Save the Spotify token
        const tokenData = {
            userId: user.id, 
            accessToken,
            refreshToken,
            tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        };

        await SpotifyToken.findOneAndUpdate(
            { userId: user.id }, 
            tokenData,              
            { upsert: true, new: true }
        );

        done(null, user); // Pass the user object to serialize
    } catch (error) {
        done(error, null);
    }
}));
console.log('Spotify Strategy initialized');