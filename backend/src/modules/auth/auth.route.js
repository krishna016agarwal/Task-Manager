const express = require('express');
const { register, login, getMe } = require('./auth.controller');
const validate = require('../../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('./auth.validation');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

router.get('/me', protect, getMe);

module.exports = router;