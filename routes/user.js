const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get user by Id
router.get('/:id', (req, res) => {
    User.findById( req.params.id )
    .exec()
    .then(result => {
        console.log(result)

        if(result) {
            return res.status(200).json({
                user: {
                    name: result.name,
                    email: result.email,
                    balance: result.balance,
                    purchases: result.purchases
                },
                request: {
                    type: 'GET'
                }
            })
        }
        else {
            res.status(400).json({
                message: 'No valid user found for provided ID' 
            })
        }
    })
    .catch(err => {
        console.log(err)

        res.status(500).json({
            error: err
        })
    }) 
})

// Get all users
router.get('/', async (req, res) => {
    User.find()
    .exec()
    .then(result => {
        if(result.length) {
            return res.status(200).json({
                count: result.length,
                users: result.map(u => ({
                    name: u.name,
                    email: u.email,
                    balance: u.balance,
                    purchases: u.purchases
                })),
                request: {
                    type: 'GET'
                }
            })
        }
        else {
            return res.status(400).json({
                message: 'No users'
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

module.exports = router;