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

// Connecting to mongoose.
// TODO : when deploying to a website change the url

mongoose.connect(process.env.MONGODB_URI, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
    console.log("Successfully connected to MongoDB");
});

mongoose.Promise = global.Promise;

// App use

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// TODO : Change origin when deploying to heroku
app.use(cors({
    origin: "https://store-design.herokuapp.com",
    credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/basket', basketRoutes);
// Authentication
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authenticationRoutes);

// Server launch

app.listen(process.env.PORT, () => console.log("Listening on port process.env.PORT"));