const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (name.length < 2 || !emailPattern.test(email) || password.length < 8) {
    res.status(400).json({
      message: 'Enter a valid name, email, and password of at least 8 characters',
    });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'An account with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(`Registration failed: ${error.message}`);
    res.status(500).json({ message: 'Unable to register user' });
  }
});

router.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!emailPattern.test(email) || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: 'Authentication is not configured' });
    return;
  }

  try {
    const user = await User.findOne({ email });
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(`Login failed: ${error.message}`);
    res.status(500).json({ message: 'Unable to sign in' });
  }
});

module.exports = router;
