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
const basketRoutes = require("./api/routes/basket");
const PORT = process.env.PORT || 8081;

// Connecting to mongoose.
// TODO : when deploying to a website change the url

const URI = 'mongodb://localhost:37017/shop';
mongoose.connect(process.env.MONGODB_URI || URI, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
    console.log("Successfully connected to MongoDB");
});

mongoose.Promise = global.Promise;

// App use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
// app.use(cors({
//     origin: "http://store-design.herokuapp.com",
//     methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
//     allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json',
//     credentials: true,
// }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/basket', basketRoutes);
// Authentication
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authenticationRoutes);

// Server launch

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));