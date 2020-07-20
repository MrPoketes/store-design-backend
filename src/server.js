const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');
const productRoutes = require('./api/routes/products');

// Connecting to mongoose.
// TODO : when deploying to a website change the url
mongoose.connect('mongodb://localhost:37017/shop',{useUnifiedTopology:true,useNewUrlParser:true}).then(()=>{
    console.log("Successfully connected to MongoDB");
});

mongoose.Promise = global.Promise;

// App use

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes

app.use('/api/products',productRoutes);

// Server launch
app.listen(8080,()=>console.log("Listening on port 8080"));