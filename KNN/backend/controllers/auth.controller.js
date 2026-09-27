// backend/controllers/auth.controller.js
const authService = require('../services/auth.service');

async function signup(req, res, next) {
  try {
    const { username, password, phone_number } = req.body;
    if (!username || !password) {
      const e = new Error('username and password are required');
      e.status = 400;
      throw e;
    }
    const result = await authService.signUp({ username, password, phone_number });
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      const e = new Error('username and password are required');
      e.status = 400;
      throw e;
    }
    const result = await authService.logIn({ username, password });
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };
