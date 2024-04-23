const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const middleware = require('./middlewares/middleware');
const session = require("express-session");

const app = express();

app.use('/files', express.static('files'));

app.use(
    session({ 
        secret: 'MmcmForumHubsdjbfhsdbj4tsussfdsoo9ew%%3', 
        resave: false, 
        saveUninitialized: true,
    })
);

//initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(middleware);

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database connected'))
.catch((error) => console.log('Database not connected', error));

//user
app.use('/', require('./routes/userRoute'));
app.use('/post', require('./routes/postRoute'));
app.use('/comment', require('./routes/commentRoute'));
app.use('/reply', require('./routes/replyRoute'));
app.use('/notification', require('./routes/notificationRoute'));
app.use('/search-history', require('./routes/searchHistoryRoute'));

//admin
app.use('/admin', require('./routes/adminRoute'));

const PORT = 8080;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));