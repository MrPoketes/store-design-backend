const Product = require('../models/products');

async function getAll() {
    return Product.find({});
}
async function getOne(id) {
    return Product.findById(id);
}
async function getSpecificGender(gender){
    return Product.find({type:gender}).exec();
}
async function getNew(value){
    return Product.find({new:value}).exec();
}
async function update(id, data) {
    const item = await getAll(id);
    if (!item) throw new Error("Could not find the item");

    Object.keys(data).forEach((key) => {
        item[key] = data[key];
    });
    return item.save();
}
async function remove(id) {
    const result = await Product.remove({ _id: id });
    return result.deletedCount;
}
module.exports = {
    getAll,
    getOne,
    getSpecificGender,
    getNew,
    update,
    remove,
}