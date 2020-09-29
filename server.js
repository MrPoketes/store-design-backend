const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv/config');
const productRoutes = require('./src/api/routes/products');
const passport = require("passport");
const authenticationRoutes = require("./src/api/routes/authentication");
const basketRoutes = require("./src/api/routes/basket");
const PORT = process.env.PORT || 8081;

// Connecting to mongoose.
// TODO : when deploying to a website change the url

mongoose.connect(process.env.ATLAS_URI, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
    console.log("Successfully connected to MongoDB");
})
.catch(err=> console.log(err.reason));

mongoose.Promise = global.Promise;

// App use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cors({
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json',
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

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));