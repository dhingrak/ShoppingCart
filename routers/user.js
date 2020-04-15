require('express-async-errors');
const express = require('express');
const router = express.Router();
const { User, validateUser, validateLoginCredentials, validatePassword } = require('../models/user');
const auth = require('../middleware/auth');
const _ = require('lodash');
const bcrypt = require('bcrypt');


// POST: Register a new user
router.post('/', async (req, res,next) => {

    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User is already registered with the given email');

    user = await User.findOne({ username: req.body.username });
    if(user) return res.status(400).send('Username is already taken');

    user = new User(_.pick(req.body, ['firstName', 'lastName', 'username', 'email', 'password', 'role', 'address']));

    // Generating auth token for the user
    const token = user.generateAuthToken();

    await user.save();
    res.header('x-auth-token', token).send(_.pick(user, 'firstName', 'lastName', 'username', 'email', 'address'));

});


// POST: Login user
router.post('/login', async(req, res, next) => {

    const { error } = validateLoginCredentials(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password');

    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if(!validatePassword) return res.status(400).send('Invalid email or password');

    const token  = user.generateAuthToken();
    res.header('x-auth-token', token).send('Log In success');
});


// PUT: Update Password
router.put('/updatePassword', auth, async(req, res, next) => {
    
    const { error } = validatePassword(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({_id: req.user._id});
    user.password = req.body.newPassword;
    await user.save();

    res.send('Password updated successfully');
    
});


module.exports = router;