const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configuring multer to upload the original files in the uploads folder
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname);
    }
})
const upload = multer({
    storage:storage
});

const Product = require('../models/products');

// TODO : implement geting all the images, mens, womens and kids images seperately.
router.get("/",(req,res)=>{
    Product.find({},(err,items)=>{
        if(err) throw err;
        res.send(items);
    });
});

// Posting a product to the the database

router.post("/",upload.single('image'), async (req,res)=>{
    var newProduct = new Product();
    newProduct.name = req.body.name;
    newProduct.price = req.body.price;
    newProduct.category = req.body.category;
    newProduct.description = req.body.description;
    newProduct.image = req.file.path;
    newProduct.save()
    .then(result=>{
        res.status(200).send(result);
    })
    .catch(err=>{
        res.status(500).send(err);
    });
});

module.exports = router;