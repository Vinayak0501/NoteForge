// creating route handler for notes

const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const tokenVerificationMiddleware = require('../middleware/auth');

// create a note
router.post('/', tokenVerificationMiddleware, async function(req, res){

    try{

        const { title, content} = req.body;
        
        const note = new Note({
            userId: req.userId,
            title,
            content
        });

        await note.save();

        res.status(201).json(note);
    }

    catch(error){
        res.status(500).json({
            message: 'Something went wrong', error
        })
    }

})


// Get all notes for logged in user
router.get('/', tokenVerificationMiddleware, async function(req, res){

    try{

        const notes = await Note.find({
            userId: req.userId
        }).sort({createdAt: -1});

        res.json(notes);
    }

    catch(error){
        res.status(500).json({
            message: 'Something went wrong', error
        })
    }
})


// get a single note

router.get("/:id", tokenVerificationMiddleware, async function(req,res){

    try{

        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.userId
        })

        if(!note){

            return res.status(404).json({
                message: 'Note not found'
            })

        }

        res.json(note);

    }

    catch(error){

        res.status(500).json({
            message: 'Something went wrong', error
        })
    }

})

// delete a note
router.delete("/:id", tokenVerificationMiddleware, async function(req, res){

    try{

        await Note.findOneAndDelete({
            _id: req.params.id, 
            userId: req.userId
        })

        res.json({
            message: 'Note deleted'
        })
    }

    catch(error){
        res.status(500).json({
            message: 'Something went wrong', error
        })
    }

})

module.exports = router;