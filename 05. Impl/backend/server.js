const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const courseRoutes = require('./routes/courseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const sessionAttendanceRoutes = require('./routes/sessionAttendanceRoutes');
const os = require('os');

const app = express();

// Get network interfaces
const getNetworkIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (!iface.internal && iface.family === 'IPv4') {
                return iface.address;
            }
        }
    }
    return '0.0.0.0';
};

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'admin-id', 'admin-password'],
    credentials: true
}));

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Automated Attendance System API' });
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/sessions', sessionAttendanceRoutes);
app.use('/api/session-attendance', sessionAttendanceRoutes);

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Server configuration
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Start server and connect to database
const startServer = async () => {
    try {
        // Connect to MongoDB
        const isConnected = await connectDB();
        
        if (!isConnected) {
            console.log('Failed to connect to MongoDB. Check your connection string.');
            process.exit(1);
        }

        // Start server after successful DB connection
        app.listen(PORT, HOST, () => {
            console.log(`Server running at http://${HOST}:${PORT}`);
            console.log('Connected to MongoDB');
        });
    } catch (error) {
        console.log('Server startup failed');
        process.exit(1);
    }
};

startServer(); 