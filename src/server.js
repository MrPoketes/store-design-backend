const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv/config');
const productRoutes = require('./api/routes/products');
const passport = require("passport");
const authenticationRoutes = require("./api/routes/authentication");

// Connecting to mongoose.
// TODO : when deploying to a website change the url
mongoose.connect('mongodb://localhost:37017/shop', { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
    console.log("Successfully connected to MongoDB");
});

mongoose.Promise = global.Promise;

// App use

// TODO : Change origin when deploying to heroku
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));
app.use(bodyParser.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/api/products', productRoutes);

// Authentication
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth",authenticationRoutes);

// Server launch
app.listen(8081, () => console.log("Listening on port 8081"));