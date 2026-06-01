const express = require('express');
const { getAllUsers } = require('./user.controller');
const { protect, authorizeRoles } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', protect, authorizeRoles('admin'), getAllUsers);

module.exports = router;