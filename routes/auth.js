if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// signUp Route
router.post('/signUp', [ 
    // check with express-validator
    check('email', 'Invalid email').isEmail(),
    check('name', 'Name must be more than 2 symbols and less than 16').isString(),
    check('password', 'Password must be more than 9 symbols').isLength({ mim: 9, max: 32 }) 
    ], async (req, res) => {
    
    console.log(req.body.email, req.body.password, req.body.name)

    // Looking for errors
    const errors = validationResult(req);

    if(!errors.isEmpty()) return res.status(400).json({
        errors: errors.array(),
        message: 'Enter correct all information'
    })

    // Use request info
    const { email, password, name } = req.body; 
    const candidate = await User.findOne({ email });

    // Check for uniqueness email / 200 status because i wanna the clear console in auth page
    if(candidate) return res.json({ error: true, message: 'Email is already logged' });

    // Turn into a coded password with bcrypt js
    const hashPassword = (await bcrypt.hash(password, 12)).toString();
    console.log(hashPassword)

    // Save and check result
    const user = new User({ email, name, password: hashPassword });

    user.save()
    .then((result) => {        
        console.log(result)

        res.status(201).json({ message: 'Welcome, you created your profile', result });
    })
    .catch(err => {
        console.log(err)

        res.status(500).json({ message: 'Error on server' });
    })
})

// Login Route
router.post('/login', [
    check('email', 'Enter the correct email').normalizeEmail().isEmail(),
    check('password', 'Enter the correct password').exists()
    ], async (req, res) => {
    
    // Looking for errors
    const errors = validationResult(req);

    if(!errors.isEmpty()) return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid email or password'
    })

    // Find user in DB
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(!user) return res.json({ error: true, message: 'Email is not found' }); // Error

    // Compare passwords
    const compared = await bcrypt.compare(password, user.password);

    if(!compared) return res.json({ error: true, message: 'Password is incorrect' });

    try {
        const token = jwt.sign(
            { userId: user.id },
            process.env.jwtSecret,
            { expiresIn: '1h' }
        )

        res.json({ token, userId: user.id });
    }
    catch(err) {
        res.status(500).json({ message: 'Error with login' })
    }
})

module.exports = router;