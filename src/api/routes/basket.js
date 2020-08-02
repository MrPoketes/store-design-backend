const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Provide a JSON file
// Adding a new item to the basket

router.post("/", async (req, res) => {
    const body = req.body;
    if (body) {
        const name = body.name;
        const priceOne = body.price;
        const quantity = body.quantity;
        const itemId = body.itemId;
        const username = body.username;
        let fullPrice = priceOne * quantity;
        if (itemId !== "" && quantity > 0) {
            let basket = await User.find({ username: username }, "basket").exec();
            let index = -1;
            if (basket) {
                for (let i = 0; i !== basket[0].basket.length; i++) {
                    if (basket[0].basket[i].itemId === itemId) {
                        index = i;
                    }
                }
                if (index === -1) {
                    let data = {};
                    data = Object.assign({
                        name: name,
                        priceOne: priceOne,
                        fullPrice: fullPrice,
                        itemId: itemId,
                        quantity: quantity,
                    });
                    basket[0].basket.push(data);
                }
                else {
                    basket[0].basket[index].quantity += quantity;
                    basket[0].basket[index].fullPrice = priceOne * basket[0].basket[index].quantity;
                }
                User.findOneAndUpdate({ username: username }, { basket: basket[0].basket }, (err, info) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
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

router.get("/getbasket/:username", async (req, res) => {
    if (req.params.username) {
        const basket = await User.find({ username: req.params.username }, "basket");
        if (basket) {
            var length = 0;
            var total = 0;
            if (basket[0].basket.length > 0) {
                for (let i = 0; i !== basket[0].basket.length; i++) {
                    length += basket[0].basket[i].quantity;
                    total += basket[0].basket[i].fullPrice;
                }
            }
            let data = {};
            data = Object.assign({
                basket: basket[0].basket,
                size: length,
                total: total,
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
        let basket = await User.find({ username: req.body.username }, "basket");
        if (basket) {
            let index = -1;
            for (let i = 0; i !== basket[0].basket.length; i++) {
                if (basket[0].basket[i].itemId === itemId) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                if (req.body.quantity !== 0) {
                    basket[0].basket[index].quantity = req.body.quantity;
                    basket[0].basket[index].fullPrice = basket[0].basket[index].priceOne * req.body.quantity;
                }
                else {
                    basket[0].basket[index] = [];
                }
                User.findOneAndUpdate({ username: req.body.username }, { basket: basket[0].basket }, (err, info) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.send("Updated Successfully");
                    }
                });
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
        let basket = await User.find({ username: req.body.username }, "basket");
        if (basket) {
            let index = -1;
            for (let i = 0; i !== basket[0].basket.length; i++) {
                if (basket[0].basket[i].itemId === itemId) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                basket[0].basket.splice(index, 1);
                User.findOneAndUpdate({ username: req.body.username }, { basket: basket[0].basket }, (err, info) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.send("Record deleted successfully");
                    }
                })
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
        User.findOneAndUpdate({ username: req.body.username }, { basket: [] }, (err, info) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send("Removed Successfully");
            }
        });
    }
    else {
        res.send("No userId provided");
    }
})

module.exports = router;
