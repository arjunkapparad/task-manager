const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];

// GET
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST
app.post("/tasks", (req, res) => {
  const task = req.body;
  tasks.push(task);
  res.json({ message: "Task added" });
});

// DELETE
app.delete("/tasks/:index", (req, res) => {
  const index = req.params.index;
  tasks.splice(index, 1);
  res.json({ message: "Task deleted" });
});

// PUT (EDIT)
app.put("/tasks/:index", (req, res) => {
  const index = req.params.index;
  tasks[index] = req.body;
  res.json({ message: "Task updated" });
});

// ALWAYS LAST
app.listen(3000, () => {
  console.log("Server running on port 3000");
});