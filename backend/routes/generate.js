const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');
const { generateFlashCards, generateQuiz, generateSummary } = require('../services/gemini');


// generate flashcards for a note

router.post('/flashcards/:noteId', auth, async function(req, res){

    try{

        const note = await Note.findOne({
            _id: req.params.noteId,
            userId: req.userId
        });

        if(!note){
            return res.status(404).json({
                message: 'Note not found'
            })
        }

        const flashCards = await generateFlashCards(note.content);
        note.flashcards = flashCards;
        await note.save();

        res.json({
            flashCards
        })
    }

    catch(error){

        res.status(500).json({
            message: 'Something went wrong', 
            error: error.message
        })
    }

})


// generate quiz for a note

router.post('/quiz/:noteId', auth, async function(req, res){

    try{

        const note = await Note.findOne({
            _id: req.params.noteId,
            userId: req.userId
        })

        if(!note){
            return res.status(404).json({
                message: 'Note not found'
            })
        }

        const quiz = await generateQuiz(note.content);
        note.quiz = quiz;
        await note.save();

        res.json({
            quiz
        })
    }

    catch(error){
        res.status(500).json({
            message: 'Something went wrong',
            error: error.message
        })
    }

});


//generate a summary for the note

router.post('/summary/:noteId', auth, async function(req, res){

    try{

        const note = await Note.findOne({
            _id: req.params.noteId,
            userId: req.userId
        })


        if(!note){
            return res.status(404).json({
                message: 'Note not found'
            })
        }

        const summary = await generateSummary(note.content);
        note.summary = summary;
        await note.save();

        res.json({
            summary
        })
    }

    catch(error){

        res.status(500).json({
            message: 'Something went wrong',
            error: error.message
        })
    }
})


module.exports = router;