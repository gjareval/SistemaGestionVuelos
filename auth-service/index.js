require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => console.log(`Auth Service corriendo en http://localhost:${process.env.PORT}`));
