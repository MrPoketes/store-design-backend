const mongoose = require('mongoose');

var UserSchema = mongoose.Schema(
    {
        username: {type:String, required:true},
        password: {type:String, required:true},
        basket : [{quantity:Number,itemId:String}],
    }
);
module.exports = mongoose.model('User', UserSchema);