const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('config');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 255,
        trim: true,
        required: true
    },
    lastName: {
        type:String,
        minlength: 2,
        maxlength: 255,
        trim: true,
        required: true
    },
    username: {
        type: String,
        minlength: 5,
        maxlength: 50,
        trim: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 50,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 1024,
        required: true,
        trim: true
    },
    address: {
        type: String,
        min: 5,
        max: 255,
        trim: true,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
})


userSchema.methods.generateAuthToken = function() {

    // Generating jwt token for authentication
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

userSchema.pre('save', async function() {

    // Encrypting the password before saving into the database
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(255).required(),
        lastName: Joi.string().min(2).max(255).required(),
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required(),
        address: Joi.string().min(5).max(255).required(),
        // Not sure about the role at the moment
        role: Joi.string().valid('admin', 'merchandiser', 'user')
    })

    return schema.validate(user);
}

function validateLoginCredentials(user) {
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required()
    })

    return schema.validate(user);
}

function validateUserId(id) {
    const schema = Joi.object({
        id: Joi.objectId()
    })
    return schema.validate(id);
}

function validateUpdateUser(user) { 
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(255).required(),
        lastName: Joi.string().min(2).max(255).required(),
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(50).required(),
        address: Joi.string().min(5).max(255).required(),
    })
    return schema.validate(user);
}

function validatePassword(password) {
    const schema = Joi.object({
        oldPassword: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required(),
        newPassword: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required()
    })
    return schema.validate(password);
}

module.exports = {
    userSchema,
    User,
    validateUser,
    validateLoginCredentials,
    validateUserId,
    validateUpdateUser,
    validatePassword
}