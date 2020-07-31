const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Provide a JSON file
// Adding a new item to the basket
router.post("/", async (req, res) => {
    const body = req.body;
    if (body) {
        const quantity = body.quantity;
        const itemId = body.itemId;
        const userId = body.userId;
        if (itemId !== "" && quantity > 0) {
            const user = await User.findById(userId);
            if (user) {
                let data = {};
                data = Object.assign({
                    itemId: itemId,
                    quantity: quantity,
                });
                try {
                    user.basket.push(data);
                    user.save()
                        .then(result => {
                            res.status(200).send(result)
                        })
                        .catch(err => res.send(err));
                    // res.sendStatus(200);
                }
                catch (err) {
                    res.sendStatus(500);
                }
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
router.get("/getbasket/", async (req, res) => {
    if (req.body.userId) {
        const user = await User.findById(req.body.userId);
        if (user) {
            const length = user.basket.length;
            let data = {};
            data = Object.assign({
                basket: user.basket,
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
    if (req.body.userId && req.body.itemId && req.body.quantity) {
        const itemId = req.body.itemId;
        const user = await User.findById(req.body.userId);
        let index = 0;
        if (user) {
            for (let i = 0; i !== user.basket.length; i++) {
                if (user.basket[i].itemId === itemId) {
                    index = i;
                    break;
                }
            }
            user.basket[index].quantity += req.body.quantity;
            user.save()
                .then(result => res.status(200).send(result))
                .catch(err => res.send(err));
        }
        else {
            res.send("No user found");
        }
        // res.send(user);

    }
})

module.exports = router;
