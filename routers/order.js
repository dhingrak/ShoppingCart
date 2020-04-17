const express = require('express');
const router = express.Router();
const { Order, validateOrderId } = require('../models/order');
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// GET : Get all the orders against a user
router.get('/', auth, async(req, res, next) => {

    const userId = req.user._id;
    const user = await User.findOne({_id: userId})
                             .populate('orders')

    if(user.orders.length == 0) return res.status(400).send('No orders found');
    res.send(user.orders)
});


//GET: Get a particular order
router.get('/:id', auth, async(req, res, next) => {

    const userId = req.user._id;
    const { error } = validateOrderId({id: req.param.id});
    if(error) return res.status(400).send('Invalid order id');

    const user = await User.findOne({_id: userId})
                             .populate('orders')
                             .select('orders');

    if(!user) return res.status(400).send('User does not exist');

    if(user.orders){
        user.orders.forEach(order => {
            if(order._id == req.params.id){
                return res.send(order)
            }
        });
    }
    else{
        res.send('No orders found');
    }
   
});


module.exports = router;