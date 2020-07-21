const mongoose = require('mongoose');

var ProductSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        type: { type: String, required: true },
        category: { type: String, required: true },
        new : { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
    }
);
module.exports = mongoose.model('Product', ProductSchema);