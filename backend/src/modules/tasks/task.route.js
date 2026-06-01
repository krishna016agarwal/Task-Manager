const express = require('express');
const taskController = require('./task.controller');
const validate = require('../../middlewares/validate.middleware');
const { createTaskSchema, updateTaskSchema } = require('./task.validation');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/', protect, validate(createTaskSchema), taskController.createTask);

router.get('/', protect, taskController.getTasks);

router.get('/:id', protect, taskController.getTaskById);

router.patch('/:id', protect, validate(updateTaskSchema), taskController.updateTask);

router.delete('/:id', protect, taskController.deleteTask);

module.exports = router;