const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const UserLog = require('../models/UserLog');
const { adminAuth } = require('../middleware/adminAuth');
const Course = require('../models/Course');
const { sendPasswordEmail } = require('../utils/mailer');
const bcrypt = require('bcrypt'); // Add at the top if not present

// Test endpoint without auth
router.get('/test', async (req, res) => {
    res.json({ message: 'Test endpoint working' });
});

// Search students route
router.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        const students = await Student.find({
            $or: [
                { fullName: { $regex: searchQuery, $options: 'i' } },
                { studentId: { $regex: searchQuery, $options: 'i' } } // <-- changed
            ]
        }).select('fullName studentId');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all students
router.get('/', adminAuth, async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        res.json(students);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single student
router.get('/:id', adminAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete student
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await student.deleteOne();
        res.json({ message: 'Student deleted successfully' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Student Login Route
router.post('/login', async (req, res) => {
    try {
        const { studentId, password } = req.body;

        // Find student by studentId
        const student = await Student.findOne({ studentId }); // <-- changed
        
        if (!student) {
            return res.status(401).json({ message: 'Invalid student ID or password' });
        }

        const isMatch = await student.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid student ID or password' });
        }

        await UserLog.create({
            userId: student._id,
            userType: 'Student',
            fullName: student.fullName,
            studentId: student.studentId, // <-- changed
            action: 'login'
        });

        res.json({
            success: true,
            student: {
                id: student._id,
                studentId: student.studentId, // <-- changed
                fullName: student.fullName
            }
        });

    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Student Logout Route
router.post('/logout', async (req, res) => {
    try {
        const { studentId } = req.body;

        // Find student by studentId
        const student = await Student.findOne({ studentId }); // <-- changed
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await UserLog.create({
            userId: student._id,
            userType: 'Student',
            fullName: student.fullName,
            studentId: student.studentId, // <-- changed
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

// Route for admin to create a student account
router.post('/create', adminAuth, async (req, res) => {
    try {
        const { studentId, fullName, email, year, faculty, program, profilePic } = req.body;

        // Check if student ID already exists
        const existingStudent = await Student.findOne({ studentId }); // <-- changed
        if (existingStudent) {
            return res.status(400).json({ message: 'Student ID already exists' });
        }

        // Generate a random password
        const password = Math.random().toString(36).slice(-8);

        // Create new student
        const student = await Student.create({
            studentId,
            fullName,
            email,
            year,
            faculty,
            program,
            profilePic, // <-- save it
            password
        });

        await sendPasswordEmail(email, password);

        res.status(201).json({
            message: 'Student account created successfully',
            student: {
                studentId: student.studentId, // <-- changed
                fullName: student.fullName,
                email: student.email
            }
        });

    } catch (error) {
        console.error('Student registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update student
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const { studentId, fullName } = req.body; // <-- changed

        // Check if new studentId is already taken by another student
        if (studentId !== student.studentId) { // <-- changed
            const existingStudent = await Student.findOne({ studentId }); // <-- changed
            if (existingStudent) {
                return res.status(400).json({ message: 'Student ID is already taken' });
            }
        }

        student.studentId = studentId; // <-- changed
        student.fullName = fullName;

        await student.save();
        
        res.json({
            message: 'Student updated successfully',
            student: {
                _id: student._id,
                studentId: student.studentId, // <-- changed
                fullName: student.fullName
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const Attendance = require('../models/Attendance');

// Get enrolled courses for a student
router.get('/enrolled-courses/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        // This must match what is stored in Course.students
        const courses = await Course.find({ students: student.studentId });

        // Log the studentId param and the found student and courses
        console.log('studentId param:', studentId);
        console.log('Student found:', student);
        console.log('Courses found:', courses);

        // Format the response with attendance data
        const formattedCourses = await Promise.all(courses.map(async course => {
            // Get instructor details if needed
            let instructorName = course.instructor;
            try {
                const instructorModel = require('../models/Instructor');
                const instructorDoc = await instructorModel.findOne({ studentId: course.instructor });
                if (instructorDoc) {
                    instructorName = instructorDoc.fullName;
                }
            } catch (err) {
                console.log('Error fetching instructor:', err);
            }

            // Fetch attendance records for this course and student
            const attendanceRecords = await Attendance.find({
                courseCode: course.courseCode,
                studentId: student.studentId
            }).sort({ date: -1 });

            return {
                id: course._id,
                courseCode: course.courseCode,
                courseName: course.courseName,
                instructor: instructorName,
                schedule: course.schedule || 'Schedule not set',
                room: course.room || 'Room not set',
                attendance: attendanceRecords.map(record => ({
                    status: record.status,
                    date: record.date
                }))
            };
        }));

        res.json({
            success: true,
            courses: formattedCourses
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Reset password (Student ID, old password, new password)
router.post('/reset-password', async (req, res) => {
  const { studentId, oldPassword, newPassword } = req.body;
  try {
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    // Assign new password (will be hashed by pre-save hook)
    student.password = newPassword;
    await student.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

module.exports = router;