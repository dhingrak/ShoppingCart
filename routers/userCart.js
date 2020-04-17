require('express-async-errors');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Cart, cartSchema } = require('../models/cart');
const { Product , validateProductId } = require('../models/product');
const { Order } = require('../models/order');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');


// GET: Get the contents of a user cart
router.get('/', auth, async(req, res, next) => {

    const contents = await Cart.findOne({userid: req.user._id});
    if(!contents) return res.status(400).send('Empty cart');
    if(contents.products){
        return res.send(contents);
    }
    res.status(400).send('Empty cart');
});


// POST : Adding the products to the cart
router.post('/addProduct/:id/:quantity', auth, async(req, res, next) => {
    
    const { error } = validateProductId({id: req.params.id});
    if(error) return res.status(400).send(error.details[0].message);

    let product = await Product.findOne({_id: req.params.id, quantity: {$gte: req.params.quantity} });
    if(!product) return res.status(400).send('Qunatity not available');

    // Check for the existing userCart
    let productObject = {
        productId: req.params.id,
        quantity: req.params.quantity
    }
    let cart = await Cart.findOne({ userid: req.user._id});
   
    if(cart){
        let productExists = false
        cart.products.forEach(product => {
            if(product.productId == req.params.id){
                product.quantity = product.quantity + parseInt(req.params.quantity);
                productExists = true;
            }
        });
        if(!productExists) cart.products.push(productObject);
    }
    else{
        let productArray = [];
        productArray.push(productObject);
        cart = new Cart({
            userid: req.user._id,
            products: productArray
        })
    }
    cart.cartTotal = await cartTotal(cart.products);
    await cart.save();
    res.send(cart);
});


// DELETE: Delte products from the cart
router.delete('/deleteProduct/:id/', auth, async(req, res, next) => {

    const { error } = validateProductId({id: req.params.id});
    if(error) return res.status(400).send('Invalid product id');

    const cart = await Cart.findOne({userid: req.user._id});
    if(!cart) return res.status(400).send('user cart does not exist');
    
    for(let i = 0; i < cart.products.length; i++) {
        if(cart.products[i].productId == req.params.id){
            // console.log('Inside compare');
            // console.log(i);
            cart.products.splice(i, 1);
            break;
        }
    }
    cart.cartTotal = await cartTotal(cart.products);
    await cart.save();
    res.send(cart);

});

// POST: Checkout option
router.post('/checkout', auth, async(req, res, next) => {
    const userId = req.user._id;
    const cart = await Cart.findOneAndDelete({userid: userId});
    if(!cart) return res.status(400).send('cart does not exist');

    const total = await cartTotal(cart.products);

    // Pending
    // Integrate payment gateway and update the product quantity in the database
    // Create a order against the customer

    // Creating a new order 

    const tax = calculateTax(total);
    const grandTotal = total + tax;

    let order = new Order({
        userid: userId,
        products: cart.products,
        cartTotal: total,
        tax: tax,
        grandTotal: grandTotal
    })
    await order.save();

    // Adding order to user collection
    const user = await User.findOne({_id: userId});
    user.orders.push(order._id);
    await user.save();
    
    res.send({message: "Order placed successfully", orderId: order._id});
})

// Calculate the total amount of user cart
async function cartTotal(products) {
    let totalAmount = 0;
    for(let i = 0; i <products.length; i++) {
        const productDoc = await Product.findOne({_id: products[i].productId});
        totalAmount = totalAmount + (productDoc.price * products[i].quantity);
    }
    return totalAmount;
}

function calculateTax(amount) {
    //calculating a default tax amount of 10%
    return (amount * 10) / 100;
}
module.exports = router;