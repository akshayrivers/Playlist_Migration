// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    googleId: { type: String }, 
    spotifyId: { type: String }, 
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
