const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const Instructor = require('../models/Instructor');
const UserLog = require('../models/UserLog');
const Course = require('../models/Course');
const { adminAuth } = require('../middleware/adminAuth');
const { sendPasswordEmail } = require('../utils/mailer');

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all instructors
// GET /instructors
router.get('/', async (req, res) => {
  try {
    const instructors = await Instructor.find().select('-password');
    res.json(instructors);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single instructor
// GET /instructors/:id
router.get('/:id', adminAuth, async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id).select('-password');
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.json(instructor);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete instructor
// DELETE /instructors/:id
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        await instructor.deleteOne();
        res.json({ message: 'Instructor deleted successfully' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Instructor Login Route
// POST /instructors/login
router.post('/login', async (req, res) => {
  const { instructorId, password } = req.body;
  try {
    const instructor = await Instructor.findOne({ idNumber: instructorId });
    if (!instructor) {
      return res.json({ success: false, message: 'Instructor not found' });
    }
    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Incorrect password' });
    }
    // Log the instructor object to debug
    console.log('Instructor found:', instructor);
    res.json({
      success: true,
      instructor: {
        _id: instructor._id, // <-- Make sure this is present
        idNumber: instructor.idNumber,
        fullName: instructor.fullName,
        isTempPassword: instructor.isTempPassword
      }
    });
  } catch (err) {
    res.json({ success: false, message: 'Login failed' });
  }
});

// Instructor Logout Route
// POST /instructors/logout
router.post('/logout', async (req, res) => {
    try {
        const { instructorId } = req.body;

        // Find instructor by ID
        const instructor = await Instructor.findOne({ idNumber: instructorId });
        
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        // Create logout log
        await UserLog.create({
            userId: instructor._id,
            userType: 'Instructor',
            fullName: instructor.fullName,
            idNumber: instructor.idNumber,
            action: 'logout'
        });

        res.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route for admin to create an instructor account
// POST /instructors/create
router.post('/create', adminAuth, async (req, res) => {
    try {
        const { idNumber, fullName, password } = req.body;

        // Check if instructor ID already exists
        const existingInstructor = await Instructor.findOne({ idNumber });
        if (existingInstructor) {
            return res.status(400).json({ message: 'Instructor ID already exists' });
        }

        // Create new instructor
        const instructor = await Instructor.create({
            idNumber,
            fullName,
            password
        });

        res.status(201).json({
            message: 'Instructor account created successfully',
            instructor: {
                idNumber: instructor.idNumber,
                fullName: instructor.fullName
            }
        });

    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update instructor
// PUT /instructors/:id
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const instructor = await Instructor.findById(req.params.id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        const { idNumber, fullName } = req.body;

        // Check if new idNumber is already taken by another instructor
        if (idNumber !== instructor.idNumber) {
            const existingInstructor = await Instructor.findOne({ idNumber });
            if (existingInstructor) {
                return res.status(400).json({ message: 'ID Number is already taken' });
            }
        }

        instructor.idNumber = idNumber;
        instructor.fullName = fullName;

        await instructor.save();
        
        res.json({
            message: 'Instructor updated successfully',
            instructor: {
                _id: instructor._id,
                idNumber: instructor.idNumber,
                fullName: instructor.fullName
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Register instructor with photo
router.post('/register', adminAuth, upload.single('photo'), async (req, res) => {
  try {
    console.log('Received instructor registration:', req.body);

    const {
      lastName,
      firstName,
      middleInitial,
      extensionName,
      instructorId,
      faculty,
      email,
      assignedDevice
    } = req.body;

    // Check if instructor ID already exists
    const existing = await Instructor.findOne({ idNumber: instructorId });
    if (existing) {
      return res.status(400).json({ message: 'Instructor ID already exists' });
    }

    // Generate a random password
    const password = Math.random().toString(36).slice(-8);

    // Prepare full name
    const fullName = `${lastName}, ${firstName}${middleInitial ? ' ' + middleInitial + '.' : ''}${extensionName && extensionName !== 'N/A' ? ' ' + extensionName : ''}`;

    // Prepare photo as base64 (optional: you can store as buffer)
    let photoBase64 = null;
    if (req.file) {
      photoBase64 = req.file.buffer.toString('base64');
    }

    // Create instructor
    const instructor = await Instructor.create({
      idNumber: instructorId,
      fullName,
      faculty,
      email,
      password,
      assignedDevice,
      photo: photoBase64
    });
    console.log('Instructor created:', instructor);

    // Send password via email
    await sendPasswordEmail(email, password);

    res.status(201).json({
      message: 'Instructor registered successfully',
      instructor: {
        idNumber: instructor.idNumber,
        fullName: instructor.fullName,
        email: instructor.email
      }
    });
  } catch (error) {
    console.error('Instructor registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset password (ID, old password, new password)
router.post('/reset-password', async (req, res) => {
  const { idNumber, oldPassword, newPassword } = req.body;
  try {
    const instructor = await Instructor.findOne({ idNumber });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, instructor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    // DO NOT hash here, just assign
    instructor.password = newPassword;
    instructor.isTempPassword = false;
    await instructor.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Get all courses assigned to an instructor (by idNumber)
router.get('/:id/courses', async (req, res) => {
  try {
    // Find instructor by _id
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    // Find courses where instructorId matches instructor.idNumber
    const courses = await Course.find({ instructorId: instructor.idNumber });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

module.exports = router;