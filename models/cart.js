const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number
        }
    }]
})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = {
    cartSchema,
    Cart
}