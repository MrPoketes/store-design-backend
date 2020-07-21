const express = require('express');
const router = express.Router();
const multer = require('multer');
const productServices = require('../services/productServices');

// Configuring multer to upload the original files in the uploads folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const upload = multer({
    storage: storage
});

const Product = require('../models/products');

// TODO : implement geting all the images, mens, womens and kids images seperately.

// Getting all the products or a single product if an id is provided

router.get("/:id?", async (req, res) => {
    try {
        const items = await productServices.getAll();
        let item = null;
        if (req.params.id) {
            item = await productServices.getOne(req.params.id);
        }
        if (item) {
            res.send(item);
        }
        else {
            return res.send(items);
        }
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

// Deleting a product from the database

router.delete("/delete/:id?", async (req, res) => {
    try {
        console.log(req.params.id);
        if (req.params.id) {
            const result = await productServices.remove(req.params.id);
            if (result === 0) {
                return res.status(404).send("The item was not removed");
            }
            else {
                return res.sendStatus(200);
            }
        }
        else {
            return res.send("No id provided");
        }
    }
    catch (err) {
        return res.status(500).send(err);
    }
})

// Posting a product to the the database

router.post("/", upload.single('image'), async (req, res) => {
    var newProduct = new Product();
    if (req.body.type === "men" || req.body.type === "women" || req.body.type === "kids" && req.body.new === "true" || req.body.new === "false" ) {
        newProduct.name = req.body.name;
        newProduct.price = req.body.price;
        newProduct.category = req.body.category;
        newProduct.type = req.body.type;
        newProduct.new = req.body.new;
        newProduct.description = req.body.description;
        newProduct.image = req.file.path;
        newProduct.save()
            .then(result => {
                res.status(200).send(result);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    }
    else {
        res.sendStatus(500);
    }
});

module.exports = router;