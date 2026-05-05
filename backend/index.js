const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===== Middleware =====
app.use(express.json());

// CORS config (dev + production)
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://your-frontend.vercel.app" // production frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

// ===== Routes =====
app.get("/", (req, res) => {
  res.json({ message: "API is running ..." });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/generate', require('./routes/generate'));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// ===== Port (IMPORTANT for Render) =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});