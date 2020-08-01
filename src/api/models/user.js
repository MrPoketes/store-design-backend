const mongoose = require('mongoose');

var UserSchema = mongoose.Schema(
    {
        username: {type:String, required:true},
        password: {type:String, required:true},
        basket : [{quantity:Number,itemId:String,priceOne:Number,fullPrice:Number}],
    }
);
module.exports = mongoose.model('User', UserSchema);