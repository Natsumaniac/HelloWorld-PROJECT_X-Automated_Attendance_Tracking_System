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
import { API_URL } from '../../config/api';

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
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    console.log('Instructor Data:', instructorData); // Add this line
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/instructors/${instructorData._id}/courses`);
        console.log('Fetched courses:', res.data);
        setCourses(res.data || []);
      } catch (err) {
        console.error('Fetch courses error:', err); // Add this line
        Alert.alert('Error', 'Failed to load courses.');
      } finally {
        setIsLoading(false);
      }
    };
    if (instructorData._id) fetchCourses();
  }, [instructorData._id]);

  // Simulate QR scan (replace with real QR scanner logic)
  const handleScanQR = () => {
    navigation.navigate('InstructorQRScanner', {
      course: selectedCourse,
      session: sessionData,
    });
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
      <View style={styles.tabBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContainer}
        >
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
        </ScrollView>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#bfa100" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {activeTab === 'courses' ? (
            <>
              <Text style={styles.sectionTitle}>📘 My Courses</Text>
              <Text style={styles.sectionDesc}>List of your assigned courses and schedules.</Text>
              {!selectedCourse ? (
                <>
                  {courses.length === 0 && (
                    <Text style={{ color: '#bfa100', textAlign: 'center', marginTop: 30 }}>No assigned courses.</Text>
                  )}
                  {courses.map((course, idx) => (
                    <TouchableOpacity
                      key={course._id || idx}
                      style={styles.courseCard}
                      onPress={() => setSelectedCourse(course)}
                    >
                      <Text style={styles.courseTitle}>
                        {course.courseCode} - {course.courseTitle || course.courseName}
                      </Text>
                      <Text style={styles.courseInfo}>
                        Section: {course.section || course.yearSection || ''}
                      </Text>
                      <Text style={styles.courseInfo}>
                        Schedule: {Array.isArray(course.schedules)
                          ? course.schedules.map(s =>
                              `${s.day} ${s.startTime}-${s.endTime}`
                            ).join(', ')
                          : (course.schedule || 'No schedule')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              ) : (
                <>
                  <View style={styles.courseCard}>
                    <Text style={styles.courseTitle}>
                      {selectedCourse.courseCode} - {selectedCourse.courseTitle || selectedCourse.courseName}
                    </Text>
                    <Text style={styles.courseInfo}>
                      Section: {selectedCourse.section || selectedCourse.yearSection || ''}
                    </Text>
                    <Text style={styles.courseInfo}>
                      Schedule: {Array.isArray(selectedCourse.schedules)
                        ? selectedCourse.schedules.map(s =>
                            `${s.day} ${s.startTime}-${s.endTime}`
                          ).join(', ')
                        : (selectedCourse.schedule || 'No schedule')}
                    </Text>
                    {/* Place the actionRow INSIDE the courseCard for a compact, cute look */}
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[styles.smallButton, styles.backButton]}
                        onPress={() => setSelectedCourse(null)}
                      >
                        <Ionicons name="arrow-back-outline" size={18} color="#bfa100" />
                        <Text style={[styles.smallButtonText, { color: '#bfa100', marginLeft: 6 }]}>Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.smallButton} onPress={handleScanQR}>
                        <Ionicons name="qr-code-outline" size={20} color="#fffbe7" />
                        <Text style={styles.smallButtonText}>Scan QR</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {scannedStudent && (
                    <>
                      <Text style={styles.sectionTitle}>👩‍🎓 Live Student Info</Text>
                      <Text style={styles.sectionDesc}>Shows student's details after scanning.</Text>
                      <View style={styles.studentInfoCard}>
                        <Text style={styles.studentInfoText}>Name: {scannedStudent.name}</Text>
                        <Text style={styles.studentInfoText}>ID: {scannedStudent.id}</Text>
                        <Text style={styles.studentInfoText}>Course: {scannedStudent.course}</Text>
                        <Text style={styles.studentInfoText}>
                          Attendance: {scannedStudent.attendance.present}/{scannedStudent.attendance.total} (
                          {Math.round((scannedStudent.attendance.present / scannedStudent.attendance.total) * 100)}%)
                        </Text>
                      </View>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>📊 Attendance Summary</Text>
              <Text style={styles.sectionDesc}>% Present per student, total present/absent per course.</Text>
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
    height: height * 0.18, // slightly taller for spacing
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    marginBottom: 18, // more space below header
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
  tabBarWrapper: {
    backgroundColor: '#fffbe7',
    paddingBottom: 2,
    paddingTop: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100%',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ffe066',
    minWidth: 120,
  },
  tabCardActive: {
    backgroundColor: '#fffbe7',
    borderColor: '#bfa100',
    shadowOpacity: 0.22,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 15,
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
  sectionDesc: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,    
    marginBottom: 1,
    gap: 6, 
  },
  backButton: {
    backgroundColor: '#ffe066',
    marginRight: 10,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bfa100',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 90,
  },
  smallButtonText: {
    color: '#fffbe7',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
});

export default InstructorDashboard;