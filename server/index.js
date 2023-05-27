require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const meetupRoutes = require('./routes/meetups');
const userRoutes = require('./routes/user');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

//routes
app.use('/api/meetups', meetupRoutes);
app.use('/api/user', userRoutes);

//connect to DB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('connected to database');
        app.listen(PORT, () => {
            console.log(`connected to DB and listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

app.get('/', (req, res) => {
    res.json({msg: 'welcome'});
});



