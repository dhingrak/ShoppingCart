const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const { fileSchema } = require('../models/file');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        min: 5,
        max: 255,
        required: true,
        trim: true
    },
    description: {
        type: String,
        min: 5,
        max: 2048,
        required: true,
        trim: true
    },
    files: [fileSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Notification = mongoose.model('Notification', notificationSchema);

function validateNotification(notification) {
    var schema = Joi.object({
        title: Joi.string().min(5).max(255).required(),
        description: Joi.string().min(5).max(2048).required()
    })
    return schema.validate(notification);
}

function validateObjectId(id) {
    var schema = Joi.object({
        id: Joi.objectId()
    })
    return schema.validate(id);
}

module.exports = {
    Notification,
    validateNotification,
    validateObjectId
}
