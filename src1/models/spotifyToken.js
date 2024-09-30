const mongoose = require('mongoose');
const spotifyTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // User's Spotify ID or unique identifier
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  tokenExpiresAt: { type: Date, required: true },
}, { timestamps: true });

const SpotifyToken = mongoose.model('SpotifyToken', spotifyTokenSchema);
module.exports=SpotifyToken