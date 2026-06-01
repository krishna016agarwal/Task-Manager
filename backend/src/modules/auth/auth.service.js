const User = require('../users/user.model');
const AppError = require('../../utils/appError');
const generateToken = require('../../utils/generateToken');

const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    throw new AppError('User already exists with this email', 409);
  }

  const user = await User.create(userData);

  const token = generateToken(user);

  return {
    token
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user);

  return {
    token
  };
};

module.exports = { registerUser, loginUser };