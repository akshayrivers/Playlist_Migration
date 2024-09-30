// models/GoogleToken.js
const mongoose = require('mongoose');

const googleTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, 
  provider: { type: String, default: 'google' }, 
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  tokenExpiresAt: { type: Date, required: true },
}, { timestamps: true });

const GoogleToken = mongoose.model('GoogleToken', googleTokenSchema);

module.exports = GoogleToken;
