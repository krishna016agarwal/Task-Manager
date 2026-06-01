const User = require('./user.model');
const sendResponse = require('../../utils/apiResponse');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    sendResponse(res, 200, 'Users fetched successfully', users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers };