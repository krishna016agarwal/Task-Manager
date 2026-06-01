const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/sendResponse');
const dashboardService = require('./dashboard.service');

const getAdminDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getAdminDashboard();

  sendResponse(res, {
    message: 'Admin dashboard fetched successfully',
    data: { dashboard },
  });
});

const getUserDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getUserDashboard(req.user._id);

  sendResponse(res, {
    message: 'User dashboard fetched successfully',
    data: { dashboard },
  });
});

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getDashboard(
    req.user._id,
    req.user.role
  );

  sendResponse(res, {
    message: 'Dashboard fetched successfully',
    data: { dashboard },
  });
});

module.exports = {
  getAdminDashboard,
  getUserDashboard,
  getDashboard,
};