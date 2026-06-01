const mongoose = require('mongoose');

const User = require('../users/user.model');
const { Task } = require('../tasks/task.model');

const isAdmin = (role) => {
  return role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'admin' || role === 'super_admin';
};

const getTaskStatusStats = async (filter = {}) => {
  const stats = await Task.aggregate([
    {
      $match: filter,
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  return stats.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});
};

const getTaskPriorityStats = async (filter = {}) => {
  const stats = await Task.aggregate([
    {
      $match: filter,
    },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);

  return stats.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});
};

const getAdminDashboard = async () => {
  const [
    totalUsers,
    activeUsers,
    inactiveUsers,

    totalTasks,
    activeTasks,
    inactiveTasks,

    todoTasks,
    inProgressTasks,
    completedTasks,
    cancelledTasks,

    taskStatusStats,
    taskPriorityStats,

    recentUsers,
    recentTasks,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({ status: 'ACTIVE' }),

    User.countDocuments({ status: 'INACTIVE' }),

    Task.countDocuments(),

    Task.countDocuments({ isActive: true }),

    Task.countDocuments({ isActive: false }),

    Task.countDocuments({ status: 'TODO' }),

    Task.countDocuments({ status: 'IN_PROGRESS' }),

    Task.countDocuments({ status: 'COMPLETED' }),

    Task.countDocuments({ status: 'CANCELLED' }),

    getTaskStatusStats(),

    getTaskPriorityStats(),

    User.find()
      .select('name email role status createdAt')
      .sort({ createdAt: -1 })
      .limit(5),

    Task.find()
      .populate('createdBy', 'name email role')
      .populate('assignedBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  return {
    summary: {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
      },

      tasks: {
        total: totalTasks,
        active: activeTasks,
        inactive: inactiveTasks,
        todo: todoTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        cancelled: cancelledTasks,
      },
    },

    charts: {
      tasksByStatus: taskStatusStats,
      tasksByPriority: taskPriorityStats,
    },

    recent: {
      users: recentUsers,
      tasks: recentTasks,
    },
  };
};

const getUserDashboard = async (userId) => {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  const userTaskFilter = {
    $or: [
      { createdBy: objectUserId },
      { assignedTo: objectUserId },
    ],
  };

  const assignedTaskFilter = {
    assignedTo: objectUserId,
  };

  const createdTaskFilter = {
    createdBy: objectUserId,
  };

  const [
    totalMyTasks,
    createdByMeTasks,
    assignedToMeTasks,

    activeTasks,
    inactiveTasks,

    todoTasks,
    inProgressTasks,
    completedTasks,
    cancelledTasks,

    overdueTasks,

    taskStatusStats,
    taskPriorityStats,

    recentTasks,
    upcomingTasks,
  ] = await Promise.all([
    Task.countDocuments(userTaskFilter),

    Task.countDocuments(createdTaskFilter),

    Task.countDocuments(assignedTaskFilter),

    Task.countDocuments({
      ...userTaskFilter,
      isActive: true,
    }),

    Task.countDocuments({
      ...userTaskFilter,
      isActive: false,
    }),

    Task.countDocuments({
      ...userTaskFilter,
      status: 'TODO',
    }),

    Task.countDocuments({
      ...userTaskFilter,
      status: 'IN_PROGRESS',
    }),

    Task.countDocuments({
      ...userTaskFilter,
      status: 'COMPLETED',
    }),

    Task.countDocuments({
      ...userTaskFilter,
      status: 'CANCELLED',
    }),

    Task.countDocuments({
      ...userTaskFilter,
      dueDate: { $lt: new Date() },
      status: { $ne: 'COMPLETED' },
    }),

    getTaskStatusStats(userTaskFilter),

    getTaskPriorityStats(userTaskFilter),

    Task.find(userTaskFilter)
      .populate('createdBy', 'name email role')
      .populate('assignedBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .limit(5),

    Task.find({
      ...userTaskFilter,
      dueDate: { $gte: new Date() },
      status: { $ne: 'COMPLETED' },
    })
      .populate('createdBy', 'name email role')
      .populate('assignedBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ dueDate: 1 })
      .limit(5),
  ]);

  return {
    summary: {
      tasks: {
        total: totalMyTasks,
        createdByMe: createdByMeTasks,
        assignedToMe: assignedToMeTasks,
        active: activeTasks,
        inactive: inactiveTasks,
        todo: todoTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        cancelled: cancelledTasks,
        overdue: overdueTasks,
      },
    },

    charts: {
      tasksByStatus: taskStatusStats,
      tasksByPriority: taskPriorityStats,
    },

    recent: {
      tasks: recentTasks,
    },

    upcoming: {
      tasks: upcomingTasks,
    },
  };
};

const getDashboard = async (userId, role) => {
  if (isAdmin(role)) {
    return getAdminDashboard();
  }

  return getUserDashboard(userId);
};

module.exports = {
  getAdminDashboard,
  getUserDashboard,
  getDashboard,
};