require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../models/User");
const Exercise = require("../models/Exercise");
const Workout = require("../models/Workout");

mongoose.connect(process.env.MONGO_URI);

const seedDatabase = async () => {
  try {
    console.log("Clearing database...");

    await User.deleteMany();
    await Exercise.deleteMany();
    await Workout.deleteMany();

    console.log("Creating users...");

    const users = await User.insertMany([
      {
        username: "alexj",
        email: "alex.johnson@email.com",
        fitnessGoal: "Strength",
      },
      {
        username: "emmad",
        email: "emma.davis@email.com",
        fitnessGoal: "Muscle Gain",
      },
      {
        username: "lucasb",
        email: "lucas.brown@email.com",
        fitnessGoal: "Endurance",
      },
      {
        username: "sarahw",
        email: "sarah.wilson@email.com",
        fitnessGoal: "Weight Loss",
      },
      {
        username: "jamesm",
        email: "james.miller@email.com",
        fitnessGoal: "Strength",
      },
    ]);

    console.log("Creating exercises...");

    const exercises = await Exercise.insertMany([
      {
        name: "Bench Press",
        muscleGroup: "Chest",
        equipment: "Barbell",
        difficulty: "Intermediate",
        caloriesPerMinute: 8,
      },
      {
        name: "Back Squat",
        muscleGroup: "Legs",
        equipment: "Barbell",
        difficulty: "Advanced",
        caloriesPerMinute: 10,
      },
      {
        name: "Deadlift",
        muscleGroup: "Back",
        equipment: "Barbell",
        difficulty: "Advanced",
        caloriesPerMinute: 11,
      },
      {
        name: "Pull-Up",
        muscleGroup: "Back",
        equipment: "Bodyweight",
        difficulty: "Intermediate",
        caloriesPerMinute: 9,
      },
      {
        name: "Shoulder Press",
        muscleGroup: "Shoulders",
        equipment: "Dumbbell",
        difficulty: "Intermediate",
        caloriesPerMinute: 7,
      },
    ]);

    console.log("Creating workouts...");

    await Workout.insertMany([
      {
        userId: users[0]._id,
        exerciseId: exercises[0]._id,
        sets: 4,
        reps: 8,
        weight: 80,
        duration: 45,
        fatigueLevel: 7,
        isPR: true,
        prType: "Weight",
        notes: "New bench press PR.",
      },
      {
        userId: users[1]._id,
        exerciseId: exercises[1]._id,
        sets: 5,
        reps: 5,
        weight: 90,
        duration: 60,
        fatigueLevel: 8,
        isPR: false,
        prType: "None",
        notes: "Heavy squat session.",
      },
      {
        userId: users[2]._id,
        exerciseId: exercises[2]._id,
        sets: 3,
        reps: 5,
        weight: 140,
        duration: 50,
        fatigueLevel: 9,
        isPR: true,
        prType: "Weight",
        notes: "Deadlift personal best.",
      },
      {
        userId: users[3]._id,
        exerciseId: exercises[3]._id,
        sets: 4,
        reps: 10,
        weight: 0,
        duration: 30,
        fatigueLevel: 6,
        isPR: false,
        prType: "None",
        notes: "Bodyweight pull-ups.",
      },
      {
        userId: users[4]._id,
        exerciseId: exercises[4]._id,
        sets: 4,
        reps: 12,
        weight: 22,
        duration: 40,
        fatigueLevel: 7,
        isPR: false,
        prType: "None",
        notes: "Controlled shoulder workout.",
      },
    ]);

    console.log("Database seeded successfully!");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();