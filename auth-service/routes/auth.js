const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Usuario ya existe' });

    try {
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token });
});

router.post("/validate-token", (req, res) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(400).send({ message: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).send({ decoded });
    } catch (error) {
      return res.status(401).send({ message: "Token is not valid" });
    }
});


module.exports = router;
