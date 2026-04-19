const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST new task
app.post("/tasks", (req, res) => {
  const { name, date, completed } = req.body;

  if (!name || !date) {
    return res.status(400).json({ message: "Invalid task data" });
  }

  tasks.push({
    name,
    date,
    completed: completed || false
  });

  res.json({ message: "Task added" });
});

// DELETE task
app.delete("/tasks/:index", (req, res) => {
  const index = parseInt(req.params.index);

  if (index < 0 || index >= tasks.length) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(index, 1);
  res.json({ message: "Task deleted" });
});

// PUT (UPDATE task)
app.put("/tasks/:index", (req, res) => {
  const index = parseInt(req.params.index);

  if (index < 0 || index >= tasks.length) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { name, date, completed } = req.body;

  tasks[index] = {
    name,
    date,
    completed
  };

  res.json({ message: "Task updated" });
});

// START SERVER
app.listen(3000, () => {
  console.log("Server running on port 3000");
});