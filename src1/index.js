const passport = require("passport")
const config = require('dotenv').config();
const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth'); 
const wer = require('./routes/request'); 
require('./strategies/google');
require('./strategies/spotify');
const cors = require("cors");

passport.serializeUser((user, done) => {
    // Serialize the entire user object into the session
    done(null, user);
});

passport.deserializeUser((user, done) => {
    // Deserialize the user object from the session
    done(null, user);
});

async function bootstrap() {
    const app = express();
    app.use(express.json());
    const PORT = process.env.PORT;
    app.use(cors({
        origin: 'http://localhost:5173', 
        credentials: true 
    }));
    app.use(
        session({
            secret: 'your-secret-key', 
            resave: false, 
            saveUninitialized: true, 
            cookie: { secure: true }, 
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/api/auth', authRoutes);
    app.use('/request',wer);

    
    try {
        app.listen(PORT, () => {
            console.log(`Running on ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

bootstrap();