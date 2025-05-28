import { Platform } from 'react-native';

// API Configuration
// IMPORTANT: When changing WiFi networks:
// 1. Run 'ipconfig' in Command Prompt/PowerShell
// 2. Find your new IPv4 address
// 3. Replace the IP address below with your new IP
export const API_URL = Platform.select({
  android: 'http://10.0.39.93:5000',  
  ios: 'http://10.0.39.93:5000',       
  default: 'http://localhost:5000'
});

export const endpoints = {
    studentCreate: '/api/students/create',
    instructorCreate: '/api/instructors/create',
    studentLogin: '/api/students/login',
    studentLogout: '/api/students/logout',
    instructorLogin: '/api/instructors/login',
    instructorLogout: '/api/instructors/logout',
    courses: '/api/courses',
    courseCreate: '/api/courses',
    courseUpdate: '/api/courses/update',
    courseDelete: '/api/courses/delete',
    courseVerifyCode: '/api/courses/verify-code',
    instructorCourses: '/api/courses/instructor',
    courseStudents: '/api/courses/students',
    
    // Legacy Attendance endpoints
    attendanceRecord: '/api/attendance/record',
    courseAttendance: '/api/attendance/course',
    studentAttendance: '/api/attendance/student',
    updateAttendance: '/api/attendance',
    
    // New Session-based Attendance endpoints
    sessions: '/api/sessions',
    sessionCreate: '/api/sessions/create',
    sessionAttendance: '/api/session-attendance',
    sessionRecord: '/api/session-attendance/record',
    sessionStudentAttendance: '/api/sessions/student',
    sessionStats: '/api/sessions/stats/course'
}; 