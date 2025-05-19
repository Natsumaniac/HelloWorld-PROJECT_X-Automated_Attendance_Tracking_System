const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const UserLog = require('../models/UserLog');
const { adminAuth } = require('../middleware/adminAuth');
const Course = require('../models/Course');

// Test endpoint without auth
router.get('/test', async (req, res) => {
    res.json({ message: 'Test endpoint working' });
});

// Search students route (must be before /:id route)
router.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        const students = await Student.find({
            $or: [
                { fullName: { $regex: searchQuery, $options: 'i' } },
                { idNumber: { $regex: searchQuery, $options: 'i' } }
            ]
        }).select('fullName idNumber');
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

        // Find student by ID
        const student = await Student.findOne({ idNumber: studentId });
        
        // If student doesn't exist
        if (!student) {
            return res.status(401).json({ message: 'Invalid student ID or password' });
        }

        // Check password using the new comparePassword method
        const isMatch = await student.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid student ID or password' });
        }

        // Create login log
        await UserLog.create({
            userId: student._id,
            userType: 'Student',
            fullName: student.fullName,
            idNumber: student.idNumber,
            action: 'login'
        });

        // Return student data (excluding password)
        res.json({
            success: true,
            student: {
                id: student._id,
                idNumber: student.idNumber,
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

        // Find student by ID
        const student = await Student.findOne({ idNumber: studentId });
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Create logout log
        await UserLog.create({
            userId: student._id,
            userType: 'Student',
            fullName: student.fullName,
            idNumber: student.idNumber,
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
        const { idNumber, fullName, password } = req.body;

        // Check if student ID already exists
        const existingStudent = await Student.findOne({ idNumber });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student ID already exists' });
        }

        // Create new student
        const student = await Student.create({
            idNumber,
            fullName,
            password
        });

        res.status(201).json({
            message: 'Student account created successfully',
            student: {
                idNumber: student.idNumber,
                fullName: student.fullName
            }
        });

    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update student
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const { idNumber, fullName } = req.body;

        // Check if new idNumber is already taken by another student
        if (idNumber !== student.idNumber) {
            const existingStudent = await Student.findOne({ idNumber });
            if (existingStudent) {
                return res.status(400).json({ message: 'ID Number is already taken' });
            }
        }

        student.idNumber = idNumber;
        student.fullName = fullName;

        await student.save();
        
        res.json({
            message: 'Student updated successfully',
            student: {
                _id: student._id,
                idNumber: student.idNumber,
                fullName: student.fullName
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get enrolled courses for a student
router.get('/enrolled-courses/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        console.log('Fetching enrolled courses for student:', studentId);

        // Find student by ID number
        const student = await Student.findOne({ idNumber: studentId });
        console.log('Found student:', student);

        if (!student) {
            return res.status(404).json({ 
                success: false,
                message: 'Student not found' 
            });
        }

        // Find all courses where student's idNumber is in the students array
        const courses = await Course.find({
            students: studentId  // Using the ID number directly since that's what we store
        });
        console.log('Found courses:', JSON.stringify(courses, null, 2));

        // Format the response
        const formattedCourses = await Promise.all(courses.map(async course => {
            // Get instructor details if needed
            let instructorName = course.instructor;
            try {
                const instructorModel = require('../models/Instructor');
                const instructorDoc = await instructorModel.findOne({ idNumber: course.instructor });
                if (instructorDoc) {
                    instructorName = instructorDoc.fullName;
                }
            } catch (err) {
                console.log('Error fetching instructor:', err);
            }

            return {
                id: course._id,
                courseCode: course.courseCode,
                courseName: course.courseName,
                instructor: instructorName,
                schedule: course.schedule || 'Schedule not set',
                room: course.room || 'Room not set'
            };
        }));

        console.log('Formatted courses:', JSON.stringify(formattedCourses, null, 2));

        res.json({
            success: true,
            courses: formattedCourses
        });

    } catch (error) {
        console.error('Error in enrolled-courses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enrolled courses',
            error: error.message
        });
    }
});

module.exports = router; 