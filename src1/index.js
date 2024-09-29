const passport = require("passport")
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

passport.serializeUser((user, done) => {
    // Serialize the entire user object into the session
    done(null, user);
});

passport.deserializeUser((user, done) => {
    // Deserialize the user object from the session
    done(null, user);
});

// 
    const app = express();
    app.use(express.json());


    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));
    //const PORT = process.env.PORT;

    app.use(cors({
        origin: 'https://playlist-migration.vercel.app', 
        credentials: true 
    }));
    app.use(session({
        secret: 'your-secret-key', 
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL,
            collectionName: 'sessions', 
        }),
        cookie: {
            secure: true, // Set to true if using HTTPS
            maxAge: 3600000, // Session expiration time (1 hour)
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/',(req,res)=>{

        res.send("Testing Api");
    })
    app.use('/api/auth', authRoutes);
    app.use('/request',wer);

    
    // try {
    //     app.listen(PORT, () => {
    //         console.log(`Running on ${PORT}`);
    //     });
    // } catch (error) {
    //     console.log(error);
    // }
//}

//bootstrap();
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
module.exports=express;