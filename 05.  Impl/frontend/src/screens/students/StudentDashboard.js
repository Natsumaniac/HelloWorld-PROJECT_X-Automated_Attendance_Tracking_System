import React, { useEffect, useState, useRef } from 'react';
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
  Animated,
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
  const [activeTab, setActiveTab] = useState(0); // 0: Courses, 1: Stats
  const [courses, setCourses] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/students/enrolled-courses/${studentData.idNumber || studentData.studentId}`);
        setCourses(res.data.courses || []);
      } catch (err) {
        Alert.alert('Error', 'Failed to load courses.');
      } finally {
        setIsLoading(false);
      }
    };
    if (studentData.idNumber || studentData.studentId) fetchCourses();
  }, [studentData.idNumber, studentData.studentId]);

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/students/${studentData.idNumber || studentData.studentId}/attendance-stats`);
        setAttendanceStats(res.data.stats || []);
      } catch (err) {
        setAttendanceStats([]);
      }
    };
    if (studentData.idNumber || studentData.studentId) fetchAttendanceStats();
  }, [studentData.idNumber, studentData.studentId]);

  const handleLogout = () => {
    navigation.replace('StudentLogin');
  };

  const hasDropWarning = (attendance) => {
    if (!attendance || attendance.length < 3) return false;
    const lastThree = attendance.slice(-3);
    return lastThree.every(a => a.status === 'Absent');
  };

  // Handle tab press and scroll to the correct view
  const handleTabPress = (tabIndex) => {
    setActiveTab(tabIndex);
    scrollRef.current?.scrollTo({ x: tabIndex * width, animated: true });
  };

  // Handle swipe
  const handleScroll = (event) => {
    const tabIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveTab(tabIndex);
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
          style={[
            styles.tabCard,
            activeTab === 0 && styles.tabCardActive,
            { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
          ]}
          onPress={() => handleTabPress(0)}
        >
          <Ionicons name="book-outline" size={20} color={activeTab === 0 ? '#bfa100' : '#22223b'} />
          <Text style={[styles.tabLabel, activeTab === 0 && styles.tabLabelActive]}>My Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabCard,
            activeTab === 1 && styles.tabCardActive,
            { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
          ]}
          onPress={() => handleTabPress(1)}
        >
          <Ionicons name="stats-chart-outline" size={20} color={activeTab === 1 ? '#bfa100' : '#22223b'} />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 1 && styles.tabLabelActive,
              { fontSize: 15 }
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Attendance Stats
          </Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Content */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#bfa100" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* My Courses Tab */}
          <View style={{ width, paddingHorizontal: 18, paddingBottom: 32 }}>
            <Text style={styles.sectionTitle}>My Enrolled Courses</Text>
            {courses.length === 0 && (
              <Text style={{ color: '#bfa100', textAlign: 'center', marginTop: 30 }}>No courses enrolled.</Text>
            )}
            {courses.map((course, idx) => (
              <View key={course.id || idx} style={styles.courseCard}>
                <Text style={styles.courseTitle}>{course.courseCode} - {course.courseName}</Text>
                <Text style={styles.courseInfo}>Section: {course.section}</Text>
                <Text style={styles.courseInfo}>Schedule: {course.schedule}</Text>
                <Text style={styles.courseInfo}>Instructor: {course.instructor}</Text>
                <Text style={styles.courseInfo}>Room: {course.room}</Text>
              </View>
            ))}
          </View>
          {/* Attendance Stats Tab */}
          <View style={{ width, paddingHorizontal: 18, paddingBottom: 32 }}>
            <Text style={styles.sectionTitle}>Attendance Stats</Text>
            {courses.length === 0 && (
              <Text style={{ color: '#bfa100', textAlign: 'center', marginTop: 30 }}>No attendance records.</Text>
            )}
            {attendanceStats.map((stat, idx) => {
              const percent = stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0;
              return (
                <View key={stat.courseCode || idx} style={styles.courseCard}>
                  <Text style={styles.courseTitle}>{stat.courseCode} - {stat.courseTitle}</Text>
                  <Text style={styles.courseInfo}>Present: {stat.present} / {stat.total}</Text>
                  <Text style={styles.courseInfo}>Absent: {stat.absent}</Text>
                  <Text style={styles.courseInfo}>Attendance: {percent}%</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Generate QR Code Button */}
      <View style={{ alignItems: 'center', marginTop: 18, marginBottom: 6 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#bfa100',
            paddingVertical: 12,
            paddingHorizontal: 28,
            borderRadius: 24,
            flexDirection: 'row',
            alignItems: 'center',
            elevation: 3,
            marginBottom: 10,
          }}
          onPress={() => navigation.navigate('StudentQRCode', { studentId: studentData.idNumber || studentData.studentId })}
        >
          <Ionicons name="qr-code-outline" size={22} color="#fffbe7" style={{ marginRight: 8 }} />
          <Text style={{ color: '#fffbe7', fontWeight: 'bold', fontSize: 16 }}>Generate QR Code</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: '#fffbe7',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ffe066',
  },
  tabCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tabCardActive: {
    backgroundColor: '#ffe066',
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#22223b',
    marginLeft: 6,
    flexShrink: 1,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#bfa100',
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