const express = require('express');
const router = express.Router();
const Product = require('../models/product');
// const multer = require('multer');

// Upload config
// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: function(req, file, cb) {
//         cb(null, Date.now() + file.originalname);
//     }
// })

const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype && mimeTypes.includes(file.mimetype)) cb(null, true);
//     else cb(null, false);
// }

// const upload = multer({ storage, limits: {
//     fileSize: 1024 * 1024 * 5
// }, fileFilter });

// GET route
router.get('/', (req, res) => {
    console.log('GET')

    Product.find({}).limit(10)
    .select('id name price description category productImagePath')
    .exec()
    .then(result => {

        const response = {
            count: result.length,
            products: result.map(p => ({
                id: p._id,
                name: p.name,
                description: p.description,
                price: p.price,
                category: p.category,
                productImagePath: p.productImagePath,
                request: {
                    type: "GET"
                }
            }))
        }

        if(result.length) {
            res.status(200).json(response);
        } else {
            res.status(404).json({
                message: 'No entries found'
            })
        }
    })
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error: err
        })
    })
})

// POST route
router.post('/',/* 1. */ (req, res) => { // 1. upload.single('productImage'), 
    console.log(req.body)
    console.log(req.file)

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        madeIn: req.body.madeIn,
        season: req.body.season,
        category: req.body.category
    })

    saveImage(product, req.file);

    product
    .save()
    .then(result => {
        console.log(result);

        res.status(201).json({
            message: 'Success created',
            createdProduct: {
                ...result,
                request: {
                    type: "POST"
                }
            }
        })
    })
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error: err
        })
    })
})

// GET Product by Id route
router.get('/:id', (req, res) => {
    Product.findById(req.params.id)
    .select()
    .exec()
    .then(result => {
        console.log(result);

        if(result) {
            res.status(200).json({
                product: {
                    id: result._id,
                    name: result.name,
                    price: result.price,
                    description: result.description,
                    madeIn: result.madeIn,
                    season: result.season,
                    category: result.category,
                    productImagePath: result.productImagePath
                },
                request: {
                    type: "GET"
                }
            })
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided ID'
            })
        }
    })
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error: err
        })
    }) 
})

// DELETE route
router.delete('/:id', (req, res) => {
    Product.findById(req.params.id)
    .remove()
    .exec()
    .then(result => {
        console.log(result);

        res.status(200).json({
            message: req.params.id + ': Product deleted',
            request: {
                type: 'DELETE',
            }
        })
    })
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error: err
        })
    })
})

// GET product by name
router.get('/search/:name', (req, res) => {
    let searchedOptions = {};

    if(req.params.name && req.params.name !== '') searchedOptions.name = new RegExp(req.params.name, 'i');

    Product.find(searchedOptions)
    .exec()
    .then(result => {
        console.log(result)

        const response = {
            count: result.length,
            products: result.map(p => ({
                name: p.name,
                description: p.description,
                id: p._id,
                price: p.price,
                category: p.category,
                productImagePath: p.productImagePath,
                request: {
                    type: 'GET'
                }
            }))
        }

        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);

        res.status(500).json({
            error: err
        })
    })
})

function saveImage(product, cover = null) {
    if(!cover) return;

    if(cover && mimeTypes.includes(cover.mimetype)) {
        product.productImagePath = `data:${cover.mimetype};charset=utf-8;base64,${cover.buffer.toString('base64')}`;
    }
}


module.exports = router;