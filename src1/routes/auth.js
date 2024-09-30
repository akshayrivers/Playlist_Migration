// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
//https://playlist-migration-backend.vercel.app/api/auth/google/redirect
//https://playlist-migration-backend.vercel.app/api/auth/spotify/redirect
// Spotify Authentication Route
router.get('/spotify', passport.authenticate('spotify', {
    scope: ['user-read-email', 'playlist-read-private'],
}));

// Spotify Callback Route
router.get('/spotify/redirect',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to frontend
        res.redirect('http://localhost:5173'); // Update to your frontend URL
    }
);

// Google Authentication Route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

// Google Callback Route
router.get('/google/redirect',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to frontend
        res.redirect('http://localhost:5173'); // Update to your frontend URL
    }
);

// Logout Route
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('http://localhost:5173'); // Update to your frontend URL
    });
});

module.exports = router;
