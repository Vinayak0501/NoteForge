const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Register
router.post('/register', async function(req, res){

    try{
        
        const {name, email, password} = req.body;

        // check if user already exist

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Hash the password using bcrypt 
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user
        const user = new User({name, email, password: hashedPassword});
        await user.save();

        res.status(201).json({
            message: 'User registerd successfully'
        });
    }

    catch(error){

        res.status(500).json({
            message: 'Something went wrong', error
        })
    }
});

// Login
router.post('/login', async function(req, res){

    try{

        const {email, password} = req.body;

        // find user
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message: 'Invalid email or password'
            })
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                message: 'Invali email or password'
            })
        }

        // if password correct --> create and assign a jwt token

        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.json({
            token: token,
            name: user.name
        });
    }

    catch(error){
        res.status(500).json({
            message: 'Something went wrong', error
        })
    }
});

module.exports = router;