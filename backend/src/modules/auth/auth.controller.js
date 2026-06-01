const authService = require('./auth.service');
const sendResponse = require('../../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    sendResponse(res, 201, 'User registered successfully', result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    sendResponse(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  sendResponse(res, 200, 'Current user fetched successfully', req.user);
};

module.exports = { register, login, getMe };