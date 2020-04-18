const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.ObjectId = require('joi-objectid')(Joi);

const orderSchema = new mongoose.Schema({
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
    }],
    cartTotal: {
        type: mongoose.Decimal128
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    currrentStatus: {
        type: String,
        default: "Null"
    },
    deliveryDate: {
        type: Date
    },
    tax: {
        type: mongoose.Decimal128       // Need to upgrade to decimal128
    },
    grandTotal: {
        type: mongoose.Decimal128       // Need to upgrade to decimal128
    }
})

const Order = mongoose.model('Order', orderSchema);


function validateOrderId(id) {
    const schema = Joi.object({
        id: Joi.objectId()
    })
    return schema.validate(id);
}

module.exports = {
    orderSchema,
    Order,
    validateOrderId
}