if(process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verify = require('../middlewares/token_verify');

// Get user by Id
router.get('/me', verify, (req, res) => {
    const { userId } = req.data;

    User.findById( userId )
    .exec()
    .then(result => {
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
                    email: u.email
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