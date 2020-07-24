const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
// const passportLocal = require("passport-local").Strategy;
const User = require("../models/user");
require("../services/passport")(passport);

router.post("/login",(req,res,next)=>{
    passport.authenticate("local",(err,user,info)=>{
        if(err) return err;
        if(!user) res.send("No User Found");
        else{
            req.logIn(user,(err)=>{
                if(err) return err;
                res.send("Successfully Authenticated");
                console.log(req.user);
            });
        }
    })(req,res,next);
})
router.post("/register", (req,res)=>{
    User.findOne({username:req.body.username}, async (err,doc)=>{
        if(err) return err;
        if(doc) res.send("User Already Exists");
        if(!doc){
            const hashedPassword = await bcrypt.hash(req.body.password,10);
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
            });
            await newUser.save();
            res.send("User Created");
        }
    })
});

module.exports = router;