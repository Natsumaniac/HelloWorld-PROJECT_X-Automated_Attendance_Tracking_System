import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config';

const { width, height } = Dimensions.get('window');

const InstructorDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const instructorData = route.params?.instructorData || {};
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scannedStudent, setScannedStudent] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/instructors/${instructorData._id}/courses`);
        setCourses(res.data || []);
      } catch (err) {
        Alert.alert('Error', 'Failed to load courses.');
      } finally {
        setIsLoading(false);
      }
    };
    if (instructorData._id) fetchCourses();
  }, [instructorData._id]);

  // Simulate QR scan (replace with real QR scanner logic)
  const handleScanQR = async () => {
    // Simulate scanning a student
    // In production, use expo-barcode-scanner or similar
    const fakeStudent = {
      name: 'Juan Dela Cruz',
      id: '202312345',
      course: 'BSIT 3A',
      attendance: { present: 4, total: 5 }
    };
    setScannedStudent(fakeStudent);
    Alert.alert('Scan Complete', 'Student attendance recorded!');
  };

  // Simulate attendance summary
  useEffect(() => {
    // Replace with real API call for attendance summary
    const summary = courses.map(course => ({
      courseCode: course.courseCode,
      courseTitle: course.courseTitle,
      section: course.section,
      present: Math.floor(Math.random() * 10) + 10,
      total: 15,
    }));
    setAttendanceSummary(summary);
  }, [courses]);

  const handleExportCSV = () => {
    // Implement CSV export logic here
    Alert.alert('Export', 'Attendance CSV download feature coming soon!');
  };

  const handleLogout = () => {
    navigation.replace('InstructorLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <Image
            source={require('../../assets/images/log.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>{instructorData.fullName || 'Instructor'}</Text>
            <Text style={styles.headerSubtitle}>Welcome to your dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#bfa100" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBarContainer}>
        <TouchableOpacity
          style={[styles.tabCard, activeTab === 'courses' && styles.tabCardActive]}
          onPress={() => setActiveTab('courses')}
        >
          <Ionicons name="book-outline" size={22} color={activeTab === 'courses' ? '#bfa100' : '#22223b'} />
          <Text style={[styles.tabLabel, activeTab === 'courses' && styles.tabLabelActive]}>My Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabCard, activeTab === 'attendance' && styles.tabCardActive]}
          onPress={() => setActiveTab('attendance')}
        >
          <Ionicons name="stats-chart-outline" size={22} color={activeTab === 'attendance' ? '#bfa100' : '#22223b'} />
          <Text style={[styles.tabLabel, activeTab === 'attendance' && styles.tabLabelActive]}>Attendance Summary</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#bfa100" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {activeTab === 'courses' ? (
            <>
              <Text style={styles.sectionTitle}>📘 My Courses</Text>
              {courses.length === 0 && (
                <Text style={{ color: '#bfa100', textAlign: 'center', marginTop: 30 }}>No assigned courses.</Text>
              )}
              {courses.map((course, idx) => (
                <View key={course._id || idx} style={styles.courseCard}>
                  <Text style={styles.courseTitle}>{course.courseCode} - {course.courseTitle}</Text>
                  <Text style={styles.courseInfo}>Section: {course.section}</Text>
                  <Text style={styles.courseInfo}>Schedule: {course.schedule}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.qrButton} onPress={handleScanQR}>
                <Ionicons name="qr-code-outline" size={28} color="#fffbe7" />
                <Text style={styles.qrButtonText}>Scan QR for Attendance</Text>
              </TouchableOpacity>
              {/* Live Student Info */}
              {scannedStudent && (
                <View style={styles.studentInfoCard}>
                  <Text style={styles.studentInfoTitle}>👩‍🎓 Live Student Info</Text>
                  <Text style={styles.studentInfoText}>Name: {scannedStudent.name}</Text>
                  <Text style={styles.studentInfoText}>ID: {scannedStudent.id}</Text>
                  <Text style={styles.studentInfoText}>Course: {scannedStudent.course}</Text>
                  <Text style={styles.studentInfoText}>
                    Attendance: {scannedStudent.attendance.present}/{scannedStudent.attendance.total} (
                    {Math.round((scannedStudent.attendance.present / scannedStudent.attendance.total) * 100)}%)
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>📊 Attendance Summary</Text>
              {attendanceSummary.length === 0 && (
                <Text style={{ color: '#bfa100', textAlign: 'center', marginTop: 30 }}>No attendance records.</Text>
              )}
              {attendanceSummary.map((summary, idx) => (
                <View key={summary.courseCode || idx} style={styles.courseCard}>
                  <Text style={styles.courseTitle}>{summary.courseCode} - {summary.courseTitle}</Text>
                  <Text style={styles.courseInfo}>Section: {summary.section}</Text>
                  <Text style={styles.courseInfo}>Present: {summary.present} / {summary.total}</Text>
                  <Text style={styles.courseInfo}>Attendance: {Math.round((summary.present / summary.total) * 100)}%</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.exportButton} onPress={handleExportCSV}>
                <Ionicons name="download-outline" size={22} color="#bfa100" />
                <Text style={styles.exportButtonText}>Export Attendance (CSV)</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffbe7' },
  headerGradient: {
    width: '100%',
    height: height * 0.16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    marginBottom: 10,
    position: 'relative',
    paddingTop: 10,
    backgroundColor: '#ffe066',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  headerTextBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.16,
    height: width * 0.16,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 1,
    textShadowColor: '#fff8',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#bfa100',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  logoutButton: {
    backgroundColor: '#fffbe7cc',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  tabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ffe066',
  },
  tabCardActive: {
    backgroundColor: '#fffbe7',
    borderColor: '#bfa100',
    shadowOpacity: 0.22,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 1,
    marginLeft: 8,
  },
  tabLabelActive: {
    color: '#bfa100',
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#bfa100',
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: 'center',
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ffe066',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  courseTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#bfa100',
    marginBottom: 2,
  },
  courseInfo: {
    color: '#165973',
    fontSize: 14,
    marginBottom: 1,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bfa100',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  qrButtonText: {
    color: '#fffbe7',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
    letterSpacing: 1,
  },
  studentInfoCard: {
    backgroundColor: '#fffbe7',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ffe066',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  studentInfoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#bfa100',
    marginBottom: 6,
  },
  studentInfoText: {
    color: '#165973',
    fontSize: 14,
    marginBottom: 2,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffbe7',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bfa100',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  exportButtonText: {
    color: '#bfa100',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});

export default InstructorDashboard;