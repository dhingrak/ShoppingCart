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
        },
        inStock: {
            type: Boolean
        }
    }],
    cartTotal: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = {
    cartSchema,
    Cart
}