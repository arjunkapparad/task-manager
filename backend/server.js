const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // ✅ IMPORTANT

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

// DELETE task
app.delete("/tasks/", async (req, res) => {
try {
await Task.findByIdAndDelete(req.params.id);
res.json({ message: "Task deleted" });
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// UPDATE task
app.put("/tasks/", async (req, res) => {
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
const PORT = process.env.PORT || 3000; // ✅ IMPORTANT for Render

app.listen(PORT, () => {
console.log("Server running on port " + PORT);
});