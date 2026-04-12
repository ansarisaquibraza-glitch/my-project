// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {
  signupRules,
  loginRules,
  handleValidation,
} = require('../middleware/validate');

router.post('/signup', signupRules, handleValidation, signup);
router.post('/login', loginRules, handleValidation, login);
router.get('/me', authenticate, getMe);

module.exports = router;
