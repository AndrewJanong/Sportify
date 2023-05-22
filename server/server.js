const express = require('express');
const mongoose = require('mongoose');
const meetupRoutes = require('./routes/meetups');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

const PORT = 4000;
const MONGO_URI = 'mongodb+srv://sportify:Sportify2357@sportify.5yxzgan.mongodb.net/';

//routes
app.use('/api/meetups', meetupRoutes);

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



