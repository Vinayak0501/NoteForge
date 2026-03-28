// creating Note Model
// creating schema for how notes would be stored inside the database

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        default: ''
    },

    flashcards: [
        {
            front: String,
            back: String
        }
    ],

    quiz: [
        {
            question: String,
            options: [String],
            answer: String
        }
    ]
}, {timestamps: true});

module.exports = mongoose.model('Note', noteSchema);