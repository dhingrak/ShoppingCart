const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Cart, cartSchema } = require('../models/cart');
const { Product , validateProductId } = require('../models/product');
const auth = require('../middleware/auth');


// GET: Get the contents of a user cart
router.get('/', auth, async(req, res, next) => {

    const contents = await Cart.findOne({userid: req.user._id});
    if(!contents) return res.status(400).send('Empty cart');
    console.log(contents);
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
    await cart.save();
    res.send(cart);
});


// DELETE: Delte products from the cart

router.delete('/deleteProduct/:id/:quantity', auth, async(req, res, next) => {
    
});

module.exports = router;