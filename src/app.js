require('dotenv').config();
const express = require('express');
const verifyJWT = require('./middleware/verifyJWT')
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

// ROTAS
app.use('/register', require('./routes/register'));
//app.use('/login', require('./routes/login'));
//app.use('/refresh', require('./routes/refresh'))

//app.use(verifyJWT)
//app.use('/transaction', require('./routes/transaction'));
//app.use('/home', require('./routes/home'));


// Start
const PORT = 5000;
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});