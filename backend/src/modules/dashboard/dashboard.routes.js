const express = require('express');
const router = express.Router();

const dashboardController = require('./dashboard.controller');

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

router.use(authenticate);

// Admin dashboard
router.get(
  '/admin',
  authorize('ADMIN'),
  dashboardController.getAdminDashboard
);

// User dashboard
router.get(
  '/user',
  authorize('USER', 'ADMIN'),
  dashboardController.getUserDashboard
);

// Common dashboard
// Automatically returns dashboard based on logged-in user's role
router.get(
  '/',
  authorize('USER', 'ADMIN'),
  dashboardController.getDashboard
);

module.exports = router;