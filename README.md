# Konvo Backend

REST API for the Konvo Project & Task Manager App.

## Tech Stack
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Nodemailer (OTP via Gmail)

## API Endpoints

### Auth
- POST `/api/auth/send-otp` - Send OTP to email
- POST `/api/auth/verify-otp` - Verify OTP and get JWT token

### Projects (Protected)
- GET `/api/projects` - Get all projects
- POST `/api/projects` - Create a project
- DELETE `/api/projects/:id` - Delete a project

### Tasks (Protected)
- GET `/api/projects/:projectId/tasks` - Get all tasks
- POST `/api/projects/:projectId/tasks` - Create a task
- PATCH `/api/projects/:projectId/tasks/:taskId` - Toggle task status
- DELETE `/api/projects/:projectId/tasks/:taskId` - Delete a task

## Setup
1. Clone the repo
2. Run `npm install`
3. Create `.env` file with your credentials
4. Run `node server.js`
