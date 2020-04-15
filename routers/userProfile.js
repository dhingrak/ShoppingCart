const express = require('express');
const router = express.Router();
const { User, validateUserId, validateUpdateUser } = require('../models/user');
const _ = require('lodash');
const auth = require('../middleware/auth');


// GET: Get user info
router.get('/', auth, async(req, res, next) => {

    const user = await User.findOne({_id: req.user._id})
                           .select('firstName lastName username email address');
    res.send(user);
});


// PUT: Update user info
router.put('/', auth, async (req, res, next) => {
    
    const validateId = validateUserId({id: req.params.id});
    if(validateId.error) return res.status(400).send('Invalid user id');
    
    const { error } = validateUpdateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOneAndUpdate({ _id: req.user._id}, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        address: req.body.address
    }, {new: true});

    await user.save();
    res.send(_.pick(user, [ 'firstName', 'lastName', 'username', 'email']));

});



module.exports = router;