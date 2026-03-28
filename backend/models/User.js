// Defining the schema for how a User will look like in the database

// Every user must have
    // a name
    // email  --> must be unique
    // password
    // also add 'createdAt' and `updatedAt' time stamps

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }

}, {timestamps: true});


module.exports = mongoose.model('User', userSchema)