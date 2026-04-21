const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

/* ================== MONGODB CONNECTION ================== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("DB ERROR:", err));

/* ================== SCHEMA ================== */
const taskSchema = new mongoose.Schema({
  name: String,
  date: String,
  completed: Boolean,
  priority: String
});

const Task = mongoose.model("Task", taskSchema);

/* ================== ROUTES ================== */

// GET all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// POST new task
app.post("/tasks", async (req, res) => {
  const { name, date, completed, priority } = req.body;

  if (!name || !date) {
    return res.status(400).json({ message: "Invalid task data" });
  }

  const newTask = await Task.create({
    name,
    date,
    completed: completed || false,
    priority: priority || "Low"
  });

  res.json(newTask); // ✅ return created task (better)
});

// DELETE task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// UPDATE task
app.put("/tasks/:id", async (req, res) => {
  const { name, date, completed, priority } = req.body;

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { name, date, completed, priority },
    { new: true } // ✅ returns updated data
  );

  res.json(updatedTask);
});

/* ================== SERVER ================== */
const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});