const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Instructor = require('../models/Instructor');

// Get counts for students and instructors
router.get('/counts', async (req, res) => {
  try {
    const students = await Student.countDocuments();
    const instructors = await Instructor.countDocuments();
    res.json({ students, instructors });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch counts' });
  }
});

module.exports = router;