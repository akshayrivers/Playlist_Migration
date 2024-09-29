const { Router } = require('express');

const passport = require("passport")

const config = require('dotenv').config();

//var SpotifyWebApi = require('spotify-web-api-node');

const router = Router();

router.get('/google',passport.authenticate('google'),(req, res) => res.sendStatus(200));
router.get('/google/redirect',passport.authenticate('google'), (req, res) => res.sendStatus(200).redirect('https://playlist-migration.vercel.app'));

// Spotify authentication routes
router.get('/spotify', passport.authenticate('spotify', {
    scope: [
        'app-remote-control',
        'user-read-email',
        'user-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-read-private',

        'user-library-modify',
        'user-library-read',
        'user-top-read',
        'user-read-recently-played',
    ]
}));

router.get('/spotify/redirect', 
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        res.redirect('https://playlist-migration.vercel.app'); // Change to your desired redirect
        console.log("done man")
    }
);
module.exports = router;