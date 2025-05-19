const config = {
    mongoURI: 'mongodb://127.0.0.1:27017/attendance_db',
    jwtSecret: 'your-secret-key',
    port: process.env.PORT || 5000,
};

module.exports = config; 
