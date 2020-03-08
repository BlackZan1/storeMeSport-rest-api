const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const User = require('../models/user');
const verify = require('../middlewares/token_verify');

router.get('/', verify, async (req, res) => {
    const { userId } = req.data;

    Cart.findOne({ owner: userId })
    .exec()
    .then(result => {
        if(result) {
            res.status(200).json({
                cart: {
                    products: result.products,
                    waitingList: result.waitingList
                },
                request: {
                    type: 'GET'
                }
            })
        }
        else {
            res.status(200).json({
                cart: undefined
            })
        }
    })
    .catch(err => {
        console.log(err)

        res.status(500).json({ message: err })
    })
})

router.post('/', verify, async (req, res) => {
    const { userId } = req.data;
    const user = await User.findById(userId)

    if(user) {
        let cart = await Cart.findOne({ owner: user._id })

        if(cart) {
            console.log(req.body)

            cart.products = req.body.products || []
            cart.waitingList = req.body.waitingList || []

            cart.save()
            .then(result => {
                console.log(result)

                return res.status(200).json({
                    cart: {
                        owner: result.owner,
                        products: result.products,
                        waitingList: result.waitingList
                    },
                    request: {
                        type: 'POST'
                    }
                })
            })
            .catch(err => {
                console.log(err)

                return res.status(400).json({ message: err })
            })
        }

        cart = new Cart({
            owner: user._id
        })
        
        cart.save()
        .then(result => {
            console.log(result)

            res.status(201).json({
                message: 'Cart created',
                cart: {
                    owner: result.owner,
                    products: result.products,
                    waitingList: result.waitingList
                },
                request: {
                    type: "POST"
                }
            })
        })
        .catch(err => {
            console.log(err)

            res.status(500).json({ message: err })
        })
    }
    else {
        res.json({
            message: 'User not found'
        })
    }
})

module.exports = router;