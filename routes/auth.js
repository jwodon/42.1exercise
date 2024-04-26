const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { authenticateJWT, ensureLoggedIn } = require('../middleware/auth');
const router = express.Router();

router.post('/login', authenticateJWT, async function(req, res, next) {
  try {
    const { username, password } = req.body;
    if (await User.authenticate(username, password)) {
      await User.updateLoginTimestamp(username);
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token });
    }
    throw new Error("Invalid username/password");
  } catch (err) {
    return next(err);
  }
});

router.post('/register', async function(req, res, next) {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    await User.register({ username, password, first_name, last_name, phone });
    await User.updateLoginTimestamp(username);
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
