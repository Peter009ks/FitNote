# FitNote

FitNote is a full-stack workout tracking application that allows users to record workouts, track exercises, manage workout history, and view personal records.

The application uses React for the frontend and Node.js, Express, and MongoDB for the backend.

---

## Features

- Create users
- Create and record workouts
- Select exercises when recording workouts
- View workout history
- Search workouts by exercise
- Edit workouts
- Delete workouts
- Delete confirmation
- Track personal records
- View workout statistics
- MongoDB database integration
- REST API
- Responsive frontend design
- Automatic workout data refresh

---

## Technologies Used

### Frontend

- React
- Vite
- Axios
- JavaScript
- CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- CORS
- dotenv
- Nodemon

---

## Project Setup Instructions

Follow these steps to install and run FitNote locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Peter009ks/FitNote.git
cd FitNote
```

### 2. Install Dependencies

Install the root project dependencies:

```bash
npm install
```

Install the backend dependencies:

```bash
cd backend
npm install
```

Install the frontend dependencies:

```bash
cd ../frontend
npm install
```

Return to the project root:

```bash
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder:

```text
backend/.env
```

Add your MongoDB connection string and server port:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Replace `your_mongodb_connection_string` with your MongoDB connection string.

**Do not commit your `.env` file to GitHub.**

### 4. Seed the Database

From the project root, run:

```bash
npm run seed
```

This populates the MongoDB database with sample users, exercises, and workouts.

### 5. Start the Application

From the project root, run:

```bash
npm run dev
```

This starts both the backend and frontend at the same time.

The frontend will be available at:

```text
http://localhost:5173
```

The backend will run at:

```text
http://localhost:5000
```

Open the frontend in your browser:

```text
http://localhost:5173
```

---

## Running the Backend and Frontend Separately

If you prefer to run the services separately, open two terminals.

### Backend

In the first terminal:

```bash
cd backend
npm run server
```

The backend will run at:

```text
http://localhost:5000
```

### Frontend

In the second terminal:

```bash
cd frontend
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

## API

The backend provides REST API endpoints for:

- Users
- Exercises
- Workouts
- Personal records

The backend API runs at:

```text
http://localhost:5000
```

---

## Development

The root project uses `concurrently` to run the frontend and backend together.

Start the complete application with:

```bash
npm run dev
```

This starts:

```text
Backend  → http://localhost:5000
Frontend → http://localhost:5173
```

---

## Database Seeding

To reset and populate the database with sample data:

```bash
npm run seed
```

The seed script creates:

- Sample users
- Sample exercises
- Sample workouts

---

## Project Structure
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

## License

This project is licensed under the MIT License.