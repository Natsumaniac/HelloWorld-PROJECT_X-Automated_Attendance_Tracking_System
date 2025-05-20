import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../config';

const { width, height } = Dimensions.get('window');

const StudentDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const studentData = route.params?.studentData || {};
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch enrolled courses and attendance stats
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/students/${studentData._id}/courses`, {
          // Add headers if needed
        });
        setCourses(res.data || []);
      } catch (err) {
        Alert.alert('Error', 'Failed to load courses.');
      } finally {
        setIsLoading(false);
      }
    };
    if (studentData._id) fetchCourses();
  }, [studentData._id]);

  // Logout handler
  const handleLogout = () => {
    navigation.replace('StudentLogin');
  };

  // Drop warning logic
  const hasDropWarning = (attendance) => {
    if (!attendance || attendance.length < 3) return false;
    const lastThree = attendance.slice(-3);
    return lastThree.every(a => a.status === 'Absent');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <Image
            source={require('../../assets/images/log.png')}
            style={styles.logoNew}
            resizeMode="contain"
          />
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>{studentData.fullName || 'Student'}</Text>
            <Text style={styles.headerSubtitle}>Welcome to your dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButtonNew}
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
          style={[styles.tabCard, activeTab === 'stats' && styles.tabCardActive]}
          onPress={() => setActiveTab('stats')}
        >
          <Ionicons name="stats-chart-outline" size={22} color={activeTab === 'stats' ? '#bfa100' : '#22223b'} />
          <Text style={[styles.tabLabel, activeTab === 'stats' && styles.tabLabelActive]}>Attendance Stats</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#bfa100" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {activeTab === 'courses' ? (
            <>
              <Text style={styles.sectionTitle}>My Enrolled Courses</Text>
              {courses.length === 0 && (
                <Text style={{ color: '#bfa100', textAlign: 'center', marginTop: 30 }}>No courses enrolled.</Text>
              )}
              {courses.map((course, idx) => (
                <View key={course._id || idx} style={styles.courseCard}>
                  <Text style={styles.courseTitle}>{course.courseCode} - {course.courseTitle}</Text>
                  <Text style={styles.courseInfo}>Section: {course.section}</Text>
                  <Text style={styles.courseInfo}>Schedule: {course.schedule}</Text>
                  <Text style={styles.courseInfo}>Instructor: {course.instructor?.lastName}, {course.instructor?.firstName}</Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Attendance Stats</Text>
              {courses.length === 0 && (
                <Text style={{ color: '#bfa100', textAlign: 'center', marginTop: 30 }}>No attendance records.</Text>
              )}
              {courses.map((course, idx) => {
                const total = course.attendance?.length || 0;
                const present = course.attendance?.filter(a => a.status === 'Present').length || 0;
                const absent = course.attendance?.filter(a => a.status === 'Absent').length || 0;
                const percent = total > 0 ? Math.round((present / total) * 100) : 0;
                return (
                  <View key={course._id || idx} style={styles.courseCard}>
                    <Text style={styles.courseTitle}>{course.courseCode} - {course.courseTitle}</Text>
                    <Text style={styles.courseInfo}>Present: {present} / {total}</Text>
                    <Text style={styles.courseInfo}>Absent: {absent}</Text>
                    <Text style={styles.courseInfo}>Attendance: {percent}%</Text>
                    {hasDropWarning(course.attendance) && (
                      <Text style={styles.dropWarning}>⚠️ Warning: 3 consecutive absents!</Text>
                    )}
                  </View>
                );
              })}
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
    height: height * 0.18,
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
  logoNew: {
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
  logoutButtonNew: {
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
  dropWarning: {
    color: '#d90429',
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 15,
  },
});

export default StudentDashboard;