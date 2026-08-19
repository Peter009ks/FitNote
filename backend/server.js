const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const usersRouter = require("./routes/users");
const exercisesRouter = require("./routes/exercises");
const workoutsRouter = require("./routes/workouts");

const app = express();


// ==============================
// Middleware
// ==============================

app.use(cors());
app.use(express.json());


// ==============================
// Routes
// ==============================

app.use("/api/users", usersRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/workouts", workoutsRouter);


// ==============================
// Test Route
// ==============================

app.get("/", (req, res) => {
  res.json({
    message: "FitNote API is running",
  });
});


// ==============================
// Database + Server
// ==============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();