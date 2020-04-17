const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const { fileSchema } = require('../models/file');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 50,
        trim: true,
        required: true
    },
    description: {
        type: String,
        minlength: 5,
        maxlength: 255,
        trim: true,
        required: true
    },
    brand: {
        type: String,
        minlength: 2,
        maxlength: 50,
        trim: true,
        required: true
    },
    upc: {
        type: String,
        minlength: 10,
        maxlength: 15,
        unique: true,
        trim: true,
        required:true
    },
    category: {
        type: String,
        enum: ['hardware', 'software'],
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        trim: true
    },
    price: {
      //  type: mongoose.Decimal128,
        type: Number,
        required: true,
        trim: true
    },
    stockDate: {
        type: Date,
        default: Date.now()
    },
    files: [fileSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().min(5).max(255).required(),
        brand: Joi.string().min(2).max(50).required(),
        upc: Joi.string().min(10).max(15).required(),
        category: Joi.string().valid('hardware', 'software'),
        quantity: Joi.number().required(),
        price: Joi.number().required()
    })
    return schema.validate(product)
}

function validateProductId(id) {
    const schema = Joi.object({
        id: Joi.objectId()
    })
    return schema.validate(id);
}



module.exports = {
    Product,
    validateProduct,
    validateProductId
}

