# FitNote

FitNote is a full-stack workout tracking application that allows users to record workouts, track exercises, manage workout history, and view personal records.

The application uses a React frontend and an Express/MongoDB backend.

---

## Features

- Create users
- Create and record workouts
- Select exercises when recording workouts
- View workout history
- Search workouts by exercise
- Edit existing workouts
- Delete workouts
- Delete confirmation
- Track personal records
- View workout statistics
- MongoDB database integration
- REST API
- Responsive frontend design

---

# Technologies Used

## Frontend

- React
- Vite
- Axios
- JavaScript
- CSS

## Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Axios
- CORS
- dotenv
- Nodemon

---

# Project Structure

```text
FitNote/
│
├── backend/
│   ├── controllers/
│   │   ├── exerciseController.js
│   │   ├── userController.js
│   │   └── workoutController.js
│   │
│   ├── models/
│   │   ├── exercise.js
│   │   ├── user.js
│   │   └── workout.js
│   │
│   ├── routes/
│   │   ├── exercises.js
│   │   ├── users.js
│   │   └── workouts.js
│   │
│   ├── seed/
│   │   └── seed.js
│   │
│   ├── .env
│   ├── api-test.http
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── PersonalRecords.jsx
│   │   │   ├── WorkoutForm.jsx
│   │   │   └── WorkoutHistory.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── .gitignore
├── LICENSE
├── package.json
├── package-lock.json
└── README.md