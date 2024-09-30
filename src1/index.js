const passport = require("passport");
const config = require('dotenv').config();
const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth'); 
const wer = require('./routes/request'); 
require('./strategies/google');
require('./strategies/spotify');
const cors = require("cors");
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// Initialize Passport
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Initialize Express app
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit process with failure
    });

// CORS setup
app.use(cors({
    origin: 'https://playlist-migration.vercel.app', 
    credentials: true 
}));

// Configure session
app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        collectionName: 'sessions', 
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true in production only
        maxAge: 3600000, // Session expiration time (1 hour)
    },
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport serializeUser and deserializeUser
passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize only the user ID
});

passport.deserializeUser(async (id, done) => {
    try {
        // Attempt to find the user in SpotifyToken or GoogleToken
        let user = await SpotifyToken.findOne({ userId: id });
        if (!user) {
            user = await GoogleToken.findOne({ userId: id });
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
// Test route
app.get('/', (req, res) => {
    res.send("Testing API");
});

// Use authentication and other routes
app.use('/api/auth', authRoutes);
app.use('/request', wer);

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;