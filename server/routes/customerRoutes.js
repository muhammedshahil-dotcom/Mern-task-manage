const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// Only logged-in users can access
router.get('/', protect, (req, res) => {
  res.json({ message: 'Customer list for authenticated users' });
});

// Only Admin can create
router.post('/', protect, adminOnly, (req, res) => {
  res.json({ message: 'Customer created by Admin' });
});

module.exports = router;
