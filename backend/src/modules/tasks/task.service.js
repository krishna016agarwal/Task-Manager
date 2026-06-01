const Task = require('./task.model');
const AppError = require('../../utils/appError');

const createTask = async (taskData, userId) => {
  return Task.create({
    ...taskData,
    createdBy: userId
  });
};

const getTasks = async (user) => {
  const filter = user.role === 'admin' ? {} : { createdBy: user._id };

  return Task.find(filter)
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });
};

const getTaskById = async (taskId, user) => {
  const task = await Task.findById(taskId).populate('createdBy', 'name email role');

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (user.role !== 'admin' && task.createdBy._id.toString() !== user._id.toString()) {
    throw new AppError('You are not allowed to access this task', 403);
  }

  return task;
};

const updateTask = async (taskId, taskData, user) => {
  const task = await getTaskById(taskId, user);

  Object.assign(task, taskData);
  await task.save();

  return task;
};

const deleteTask = async (taskId, user) => {
  const task = await getTaskById(taskId, user);

  await task.deleteOne();

  return task;
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};