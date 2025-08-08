const Task = require('../models/Task');

// @desc Get all tasks for the logged-in user
async function getTasks(req, res) {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}

async function createTask(req, res) {
  try {
    const { title, description } = req.body;
    const task = new Task({ title, description, user: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}

async function updateTask(req, res) {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}

async function deleteTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
