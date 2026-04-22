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
  .catch(err => {
    console.error("DB ERROR:", err);
    process.exit(1); // 🔥 crash if DB fails (important in prod)
  });

/* ================== SCHEMA ================== */
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, default: "Low" }
});

const Task = mongoose.model("Task", taskSchema);

/* ================== ROUTES ================== */

// ROOT
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// GET all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST new task
app.post("/tasks", async (req, res) => {
  try {
    const { name, date, priority } = req.body;

    if (!name || !date) {
      return res.status(400).json({ error: "Name and date required" });
    }

    const newTask = await Task.create({
      name,
      date,
      priority
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// DELETE task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// UPDATE task
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

/* ================== SERVER ================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});