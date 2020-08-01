const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Provide a JSON file
// Adding a new item to the basket

router.post("/", async (req, res) => {
    const body = req.body;
    if (body) {
        const priceOne = body.price;
        const quantity = body.quantity;
        const itemId = body.itemId;
        const username = body.username;
        let fullPrice = priceOne * quantity;
        if (itemId !== "" && quantity > 0) {
            let basket = await User.find({ username: username },"basket").exec();
            if (basket) {
                let data = {};
                let newArray = [];
                data = Object.assign({
                    priceOne: priceOne,
                    fullPrice: fullPrice,
                    itemId: itemId,
                    quantity: quantity,
                });
                basket[0].basket.push(data);
                console.log(basket);
                User.findOneAndUpdate({username:username},{basket:basket[0].basket},(err,info)=>{
                    if(err){
                        res.send(err);
                    }
                    else{
                        res.send(info);
                    }
                })
            }
            else {
                res.send("No provided values");
            }
        }
        else {
            res.send("Data provided does not fit the schema");
        }
    }
    else {
        res.sendStatus(404);
    }
});

// Provide a JSON file
router.get("/getbasket/:username", async (req, res) => {
    if (req.params.username) {
        const basket = await User.find({ username: req.params.username },"basket");
        if (basket) {
            var length = 0;
            if (basket[0].basket.length>0) {
                length = basket[0].basket.length;
            }
            let data = {};
            data = Object.assign({
                basket: basket[0].basket,
                size: length
            });
            res.send(data);
        }
        else {
            req.send("No user found");
        }
    }
    else {
        res.send("No user provided");
    }
});

// Provide a JSON file
// Updating the quantity of the same item

router.post("/updateBasket", async (req, res) => {
    if (req.body.username && req.body.itemId && req.body.quantity) {
        const itemId = req.body.itemId;
        const user = await User.find({ username: req.body.username });
        if (user) {
            let index = -1;
            for (let i = 0; i !== user.basket.length; i++) {
                if (user.basket[i].itemId === itemId) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                user.basket[index].quantity = req.body.quantity;
                user.basket[index].fullPrice = user.basket[index].priceOne * req.body.quantity;
                user.save()
                    .then(result => res.status(200).send(result))
                    .catch(err => res.send(err));
            }
            else {
                res.status(404).send("Item Not Found");
            }
        }
        else {
            res.send("No user found");
        }
    }
});

// Provide a JSON file
// Deleting one item

router.delete("/deleteOne", async (req, res) => {
    if (req.body.itemId && req.body.username) {
        const itemId = req.body.itemId;
        const user = await User.find({ username: req.body.username });
        if (user) {
            let index = -1;
            for (let i = 0; i !== user.basket.length; i++) {
                if (user.basket[i].itemId === itemId) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                user.basket.splice(index, 1);
                user.save()
                    .then(result => res.status(200).send(result))
                    .catch(err => res.send(err));
            }
            else {
                res.status(404).send("Item not found");
            }
        }
        else {
            res.send("No user found");
        }
    }
    else {
        res.send("No values provided");
    }
})

// Provide a JSON file
// Delete the whole basket

router.delete("/", async (req, res) => {
    if (req.body.username) {
        const user = await User.find({ username: req.body.username });
        user.basket = [];
        user.save()
            .then(result => res.status(200).send(result))
            .catch(err => res.send(err))
    }
    else {
        res.send("No userId provided");
    }
})

module.exports = router;
