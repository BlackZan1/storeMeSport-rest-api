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

    Product.find({})
    .exec()
    .then(result => {
        console.log(result);

        const response = {
            count: result.length,
            products: result.map(p => {
                return {
                    name: p.name,
                    price: p.price,
                    description: p.description,
                    productImage: p.productImage,
                    id: p._id,
                    request: {
                        type: "GET"
                    }
                }
            })
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
        // productImage: req.file.path,
        description: req.body.description,
        madeIn: req.body.madeIn,
        season: req.body.season
    })

    saveImage(product, req.file);

    product
    .save()
    .then(result => {
        console.log(result);

        res.status(201).json({
            message: 'Success created',
            createdProduct: {
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                productImageType: result.productImageType,
                description: result.description,
                madeIn: result.madeIn,
                season: result.season,
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
    .exec()
    .then(result => {
        console.log(result);

        if(result) {
            res.status(200).json({
                product: result,
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
    Product.findByIdAndRemove(req.params.id)
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

function saveImage(product, cover = null) {
    if(!cover) return;

    const image = cover;
    if(image && mimeTypes.includes(image.mimetype)) {
        product.productImage = image.buffer;
        product.productImageType = image.mimetype;
    }
}


module.exports = router;