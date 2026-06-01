# Task Manager

Task Manager is a full-stack web application built with **Node.js**, **Express.js**, **MongoDB**, and **React.js**. It provides secure user authentication, role-based access control, and complete task management functionality.

The backend is built as a scalable REST API with a modular folder structure. The frontend is a simple React interface that allows users to register, log in, access a protected dashboard, and perform CRUD operations on tasks.

---

## Features

### Backend

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- User and admin roles
- Task CRUD APIs
- API versioning using `/api/v1`
- Centralized error handling
- Request validation using Zod
- Secure HTTP headers using Helmet
- API rate limiting
- MongoDB database integration using Mongoose
- Modular backend structure with controllers, services, routes, models, validations, and middlewares

### Frontend

- React.js frontend built with Vite
- Register and login pages
- Protected dashboard
- Create, read, update, and delete tasks
- JWT token-based API communication
- Success and error messages from API responses
- Simple responsive user interface

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- Zod
- Helmet
- CORS
- Express Rate Limit
- Morgan
- Dotenv

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- CSS

---

## Project Structure

```txt
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.route.js
│   │   │   │   ├── auth.service.js
│   │   │   │   └── auth.validation.js
│   │   │   ├── tasks/
│   │   │   │   ├── task.controller.js
│   │   │   │   ├── task.model.js
│   │   │   │   ├── task.route.js
│   │   │   │   ├── task.service.js
│   │   │   │   └── task.validation.js
│   │   │   └── users/
│   │   │       ├── user.controller.js
│   │   │       ├── user.model.js
│   │   │       └── user.route.js
│   │   ├── utils/
│   │   │   ├── apiResponse.js
│   │   │   ├── appError.js
│   │   │   └── generateToken.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Message.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── style.css
    ├── .env
    ├── index.html
    └── package.json
```

---

## Backend Setup

### 1. Go to the backend folder

```bash
cd backend
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_manager
JWT_SECRET=my_super_secret_key_12345
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

### 4. Start the backend server

```bash
npm run dev
```

The backend will run on:

```txt
http://localhost:5000
```

---

## Frontend Setup

### 1. Go to the frontend folder

```bash
cd frontend
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file inside the `frontend` folder.

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Start the frontend server

```bash
npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

---

## API Base URL

```txt
http://localhost:5000/api/v1
```

---

## Authentication Flow

Task Manager uses JWT authentication.

When a user registers or logs in, the backend generates a JWT token. The frontend stores the token and sends it with every protected API request using the Authorization header.

```txt
Authorization: Bearer your_jwt_token
```

The backend verifies the token using authentication middleware before allowing access to protected routes.

---

## JWT Token Handling

The frontend stores only the JWT token. User details such as name, email, and role can be decoded from the JWT payload for display purposes.

Actual authentication and authorization are always handled on the backend using middleware.

---

## Role-Based Access Control

The application supports two roles:

```txt
user
admin
```

### User Role

A normal user can:

- Register
- Login
- Create tasks
- View their own tasks
- Update their own tasks
- Delete their own tasks

### Admin Role

An admin can:

- Login
- View all tasks
- View all users
- Manage tasks

Role-based access is enforced on the backend.

---

## API Endpoints

## Auth APIs

### Register User

```txt
POST /api/v1/auth/register
```

#### Request Body

```json
{
  "name": "Krishna Agarwal",
  "email": "krishna@example.com",
  "password": "123456",
  "role": "user"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here"
  }
}
```

---

### Login User

```txt
POST /api/v1/auth/login
```

#### Request Body

```json
{
  "email": "krishna@example.com",
  "password": "123456"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here"
  }
}
```

---

### Get Logged-In User

```txt
GET /api/v1/auth/me
```

#### Headers

```txt
Authorization: Bearer your_jwt_token
```

#### Success Response

```json
{
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "_id": "user_id",
    "name": "Krishna Agarwal",
    "email": "krishna@example.com",
    "role": "user"
  }
}
```

---

## Task APIs

### Create Task

```txt
POST /api/v1/tasks
```

#### Headers

```txt
Authorization: Bearer your_jwt_token
```

#### Request Body

```json
{
  "title": "Complete backend API",
  "description": "Create authentication and task APIs",
  "status": "pending",
  "priority": "high"
}
```

---

### Get Tasks

```txt
GET /api/v1/tasks
```

#### Headers

```txt
Authorization: Bearer your_jwt_token
```

#### Behavior

- A normal user gets only their own tasks.
- An admin gets all tasks.

---

### Get Single Task

```txt
GET /api/v1/tasks/:id
```

#### Headers

```txt
Authorization: Bearer your_jwt_token
```

---

### Update Task

```txt
PATCH /api/v1/tasks/:id
```

#### Headers

```txt
Authorization: Bearer your_jwt_token
```

#### Request Body

```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "status": "completed",
  "priority": "medium"
}
```

---

### Delete Task

```txt
DELETE /api/v1/tasks/:id
```

#### Headers

```txt
Authorization: Bearer your_jwt_token
```

---

## User APIs

### Get All Users

```txt
GET /api/v1/users
```

#### Headers

```txt
Authorization: Bearer admin_jwt_token
```

#### Access

Only users with the `admin` role can access this route.

---

## Database Models

## User Model

```js
{
  name: String,
  email: String,
  password: String,
  role: "user" | "admin"
}
```

## Task Model

```js
{
  title: String,
  description: String,
  status: "pending" | "in-progress" | "completed",
  priority: "low" | "medium" | "high",
  createdBy: ObjectId
}
```

---

## Validation Rules

The backend uses Zod for request validation.

### User Validation

- Name must be at least 2 characters
- Email must be valid
- Password must be at least 6 characters
- Role must be either `user` or `admin`

### Task Validation

- Task title must be at least 3 characters
- Status must be one of:
  - `pending`
  - `in-progress`
  - `completed`
- Priority must be one of:
  - `low`
  - `medium`
  - `high`

---

## Security Features

- Passwords are hashed using bcrypt before saving to the database.
- JWT is used for authentication.
- Protected routes require a valid token.
- Admin-only routes require admin role.
- Helmet is used to secure HTTP headers.
- API rate limiting is applied.
- Request body size is limited.
- Zod validation is applied before saving data.
- Frontend stores only the JWT token.
- Backend performs authorization checks.

---

## Error Handling

The backend uses centralized error handling.

### Example Error Response

```json
{
  "success": false,
  "status": "fail",
  "message": "Invalid email or password"
}
```

### Common Status Codes

```txt
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

---

## Postman Testing Guide

Use this base URL:

```txt
http://localhost:5000/api/v1
```

### Steps

1. Register a user using `/auth/register`.
2. Login using `/auth/login`.
3. Copy the JWT token from the response.
4. Open Postman Headers tab.
5. Add the Authorization header.

```txt
Key: Authorization
Value: Bearer your_jwt_token
```

6. Test protected routes such as `/auth/me` and `/tasks`.

---

## Scalability Notes

The project follows a modular architecture. Each feature is separated into its own module with route, controller, service, model, and validation files.

This structure makes the backend easier to maintain and scale as more features are added.

### Possible Future Improvements

- Add refresh token authentication
- Add Redis caching
- Add Docker support
- Add centralized logging using Winston
- Add pagination and filtering for tasks
- Add automated testing using Jest and Supertest
- Add database indexing for faster queries
- Add cloud deployment support
- Add microservice-based separation for larger scale

---

## Deployment

## Backend Deployment

The backend can be deployed on:

- Render
- Railway
- Cyclic
- AWS EC2
- VPS

Required backend environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_production_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=your_frontend_url
```

## Frontend Deployment

The frontend can be deployed on:

- Vercel
- Netlify
- Render

Required frontend environment variable:

```env
VITE_API_URL=your_backend_url/api/v1
```

---

## Local Development URLs

```txt
Backend: http://localhost:5000
Frontend: http://localhost:5173
API Base URL: http://localhost:5000/api/v1
```

---

## Author

Krishna Agarwal
