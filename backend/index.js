const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const generateRoutes = require('./routes/generate');

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', "https://note-forge-orpin.vercel.app"],
  credentials: true,
}));

app.use(express.json()); // lets you parse json data

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/generate', generateRoutes);

app.get("/", function(req, res){

    res.json({
        message: 'Server is running'
    })
})

// connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('DB error: ', err));

app.listen(3000 , () => console.log("Server started on port 3000"));