const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

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

// ROOT (for testing)
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// GET all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new task
app.post("/tasks", async (req, res) => {
  try {
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

    res.json(newTask);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task ✅ FIXED
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE task ✅ FIXED
app.put("/tasks/:id", async (req, res) => {
  try {
    const { name, date, completed, priority } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { name, date, completed, priority },
      { new: true }
    );

    res.json(updatedTask);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== SERVER ================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});