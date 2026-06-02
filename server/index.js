const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
// connectDB(); // Disabled: No MongoDB URI provided in Render

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://thelumoraweddings.com',
    'https://www.thelumoraweddings.com',
    /\.vercel\.app$/ 
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/quotations', require('./routes/quotations'));


// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Debug Route
app.get('/api/debug-db', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    readyState: mongoose.connection.readyState,
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) + '...' : 'none'
  });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
