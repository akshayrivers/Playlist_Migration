const { Router } = require('express');
const fetch = require('node-fetch');
const router = Router();
const config = require('dotenv').config();
// const passport = require("passport");
require('../strategies/spotify');
const fetchWithTimeout = (url, options, timeout = 5000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeout)
        )
    ]);
};


// Route to fetch Spotify playlists
router.get('/spotify-getplaylist', async (req, res) => {

    const spotifyToken = process.env.stoken;

    if (!spotifyToken) {
        return res.status(401).json({ error: 'Spotify token not available' });
    }

    console.log('Fetching playlists...');

    try {
        const response = await fetchWithTimeout('https://api.spotify.com/v1/me/playlists', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${spotifyToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response received');
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }

        const data = await response.json();
        console.log('Data received:', data);
        
        const playlists = data.items.map(playlist => ({
            title: playlist.name,
            tracksUrl: playlist.tracks.href ,
            playlistId:playlist.id 
        }));

        // Example of logging playlists
        playlists.forEach(playlist => {
            console.log(`Title: ${playlist.title}, Tracks URL: ${playlist.tracksUrl}`);
            console.log(` id: ${playlist.playlistId}`);
        });

        res.json(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to migrate playlists from Spotify to YouTube
router.post('/Migrate',  async (req, res) => {
    const youtubeToken = process.env.gtoken;
    const spotifyToken = process.env.stoken;
    const { playlistId } = req.body;

    if (!playlistId) {
        return res.status(400).json({ error: 'Playlist ID is required' });
    }

    const trackUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    if (!youtubeToken || !spotifyToken) {
        return res.status(401).json({ error: 'Required tokens not available' });
    }

    try {
        // 1. Fetch tracks from Spotify
        const trackResponse = await fetchWithTimeout(trackUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${spotifyToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!trackResponse.ok) {
            throw new Error('Error fetching tracks from Spotify: ' + trackResponse.status);
        }

        const tracksData = await trackResponse.json();

        // 2. Create a new YouTube playlist
        const playlistResponse = await fetchWithTimeout('https://www.googleapis.com/youtube/v3/playlists?part=snippet', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${youtubeToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                snippet: {
                    title: 'Migrated Playlist', 
                    description: 'This playlist was migrated from Spotify to YouTube.',
                    tags: ['Spotify', 'YouTube', 'Migration'],
                    defaultLanguage: 'en'
                }
            })
        });

        if (!playlistResponse.ok) {
            throw new Error('Error creating YouTube playlist: ' + playlistResponse.status);
        }

        const playlistData = await playlistResponse.json();
        const playlistId = playlistData.id; // Get the new playlist ID

        // 3. Search for each track on YouTube and add it to the new playlist
        for (const item of tracksData.items) {
            const songTitle = item.track.name; // Get song title
            const artistName = item.track.artists.map(artist => artist.name).join(', '); // Get artist names

            // Search for the song on YouTube
            const searchResponse = await fetchWithTimeout(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(`${songTitle} ${artistName}`)}&key=${process.env.API_KEY}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!searchResponse.ok) {
                throw new Error('Error searching for track on YouTube: ' + searchResponse.status);
            }

            const searchData = await searchResponse.json();
            const videoId = searchData.items[0]?.id?.videoId; // Get the video ID of the first result

            // 4. Add the video to the newly created YouTube playlist
            if (videoId) {
                const addVideoResponse = await fetchWithTimeout('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${youtubeToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        snippet: {
                            playlistId: playlistId,
                            resourceId: {
                                kind: 'youtube#video',
                                videoId: videoId
                            }
                        }
                    })
                });

                if (!addVideoResponse.ok) {
                    console.warn(`Failed to add video ${videoId} to playlist: HTTP ${addVideoResponse.status}`);
                }
            } else {
                console.warn(`No video found for "${songTitle}" by ${artistName}`);
            }
        }

        res.status(200).json({ message: 'Playlist migrated successfully!', playlistId });
    } catch (error) {
        console.error('Error during migration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;