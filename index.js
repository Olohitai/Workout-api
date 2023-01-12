const express = require("express");
const app = express();
const port = 8000;

const fs = require("fs");
let exercises;

fs.readFile("./exercise-data.json", "utf8", (err, data) => {
  if (err) throw err;
  exercises = JSON.parse(data);
});

app.get("/exercises", (req, res) => {
  res.json(exercises);
});

app.get("/workout/:muscleGroup", (req, res) => {
  const muscleGroup = req.params.muscleGroup;
  const regex = new RegExp(muscleGroup, "i");
  const muscleGroupExercises = exercises["Exercise List"].filter((exercise) =>
    exercise.MuscleGroup.match(regex)
  );
  const randomExercise =
    muscleGroupExercises[
      Math.floor(Math.random() * muscleGroupExercises.length)
    ];
  res.json({ exercise: randomExercise });
});
app.get("/workout-target/:target", (req, res) => {
  const target = req.params.target;
  const level = req.query.level;
  let targetExercises = exercises["Exercise List"].filter(
    (exercise) => exercise["U/L/C"].toLowerCase() === target.toLowerCase()
  );
  if (level) {
    targetExercises = targetExercises.filter((exercise) => {
      return exercise["Level"] === level;
    });
  }
  const randomExercise =
    targetExercises[Math.floor(Math.random() * targetExercises.length)];
  res.json({ exercise: randomExercise });
});

app.get("/random-workout", (req, res) => {
  // Get the muscle group and level from the query parameters
  const muscleGroup = req.query.muscleGroup;
  const level = req.query.level;
  const num = req.query.num;

  if (!muscleGroup) {
    return res.status(400).json({ error: "muscleGroup is required" });
  }

  // Use a regular expression to search for the muscle group in the JSON data
  const regex = new RegExp(muscleGroup, "i");
  // Filter the exercises based on the provided muscle group
  let filteredExercises = exercises["Exercise List"].filter((exercise) => {
    return exercise["MuscleGroup"].match(regex);
  });
  // if level is provided filter the filtered exercises based on level
  if (level) {
    filteredExercises = filteredExercises.filter((exercise) => {
      return exercise["Level"] === level;
    });
  }
  // if no exercise found return error
  if (!filteredExercises.length) {
    return res.status(400).json({
      error: "No exercises found for the provided muscle group and level",
    });
  }

  let workout = [];
  for (let i = 0; i < num; i++) {
    workout.push(
      filteredExercises[Math.floor(Math.random() * filteredExercises.length)]
    );
  }
  if (!num) {
    workout.push(
      filteredExercises[Math.floor(Math.random() * filteredExercises.length)]
    );
  }
  res.json(workout);
});

app.get("/exercises/level/:level", (req, res) => {
  const level = req.params.level;
  const exercisesByLevel = exercises["Exercise List"].filter(
    (exercise) => exercise["Level"].toLowerCase() === level.toLowerCase()
  );
  res.json({ exercises: exercisesByLevel });
});

app.listen(port, () => {
  console.log(`Fitness API listening on port ${port}!`);
});
