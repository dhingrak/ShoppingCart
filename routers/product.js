const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const { Product, validateProduct, validateProductId } = require('../models/product');
const { File } = require('../models/file');
const { uploadProductImage } = require('../utils/upload');
const { deleteFiles, daleteDatabaseFiles } = require('../utils/unlinkFiles');

// GET: Get all the products
router.get('/', async(req, res, next) => {

    const products  = await Product.find();
    if(products.length <= 0){
        return res.status(400).send('No products found');
    }
    res.send(products);
});

// POST: Create a new product
router.post('/', [auth, admin], async(req, res, next) => {

    uploadProductImage(req, res, async function(err) {
        if(err){
            return res.status(400).send('Invalid file type');
        }

        const { error } = validateProduct(req.body);
        if(error) {
            if (req.files) deleteFiles(req.files);
            return res.status(400).send(error.details[0].message);
        }
        let product = await Product.findOne({upc: req.body.upc});
        if(product)  {
            if (req.files) deleteFiles(req.files);
            return res.status(400).send('UPC number already exists');
        }
        product = new Product(_.pick(req.body, ['name', 'description', 'brand', 'upc', 'category', 'quantity', 'price']));
        if(req.files){
            req.files.forEach(element => {
                const file = new File({
                    name: element.originalname,
                    fullPath: element.path,
                    relativePath: `/public/uploads/${element.filename}`
                })
                product.files.push(file);
            });
        }
        await product.save();
        res.send(product);
    })
   
});


// PUT: Update an existing product
router.post('/:id' , [auth, admin], async(req, res, next) => {

    const body = req.body;
    const validateId = validateProductId({id: req.params.id});
    if(validateId.error) return res.status(400).send(error.details[0].message);

    const { error } = validateProduct(body);
    if(error) return res.status(400).send(error.details[0].message);

    let product = await Product.findByIdAndUpdate({_id: req.params.id}, {$inc: {quantity: body.quantity}, 
         name: body.name,
         description: body.description,
         brand: body.brand,
         upc: body.upc,
         price: body.price
    }, {new: true})

    await product.save();
    res.send(product);
});


// DELETE: Delete an existing product
router.delete('/:id', [auth, admin], async(req, res, next) => {

    const { error } = validateProductId({id: req.params.id});
    if(error) return res.status(400).send(error.details[0].message);

    let product = await Product.findByIdAndDelete({_id: req.params.id});
    if(!product) return res.status(400).send('Product does not exist');

    daleteDatabaseFiles(product.files);
    res.send(product);
});


module.exports = router;