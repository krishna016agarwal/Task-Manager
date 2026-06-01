const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const authRoutes = require('./modules/auth/auth.route');
const taskRoutes = require('./modules/tasks/task.route');
const userRoutes = require('./modules/users/user.route');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Too many requests from this IP, please try again later'
});

app.use('/api', limiter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Scalable REST API is running'
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;