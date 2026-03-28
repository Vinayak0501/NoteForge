const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json()); // lets you parse json data
app.use(cors());

// connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('DB error: ', err));

// connecting to routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


// connecting notes routes to index.js
const noteRoutes = require('./routes/notes');
app.use('/api/notes', noteRoutes);


// connecting to gemini routes
const generateRoutes = require('./routes/generate');
app.use('/api/generate', generateRoutes);

app.get("/", function(req, res){

    res.json({
        message: 'Server is running'
    })
})


app.listen(3000 , () => console.log("Server started on port 3000"));