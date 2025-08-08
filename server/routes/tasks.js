const express = require('express');
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// GET all tasks for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// CREATE a task
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const newTask = new Task({
      title,
      description,
      user: req.user.id
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE a task (PATCH or PUT)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.completed = completed ?? task.completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE a task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
