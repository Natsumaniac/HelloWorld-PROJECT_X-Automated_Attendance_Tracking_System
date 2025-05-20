import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('window');

const Dashboard = () => {
  const navigation = useNavigation();

  // Mocked data for demonstration; replace with real data fetching
  const [stats, setStats] = useState({
    students: 120,
    instructors: 15,
  });

  // Navigation handlers for each panel
  const goToRegisterStudent = () => {
    navigation.navigate('RegisterStudent');
  };
  const goToRegisterInstructor = () => {
    navigation.navigate('RegisterInstructor');
  };
  const goToRegisterCourse = () => {
    navigation.navigate('RegisterCourse');
  };
  const goToAssignCourses = () => {
    navigation.navigate('AssignCourses');
  };
  const goToEnrollStudents = () => {
    navigation.navigate('EnrollStud');
  };
  const goToManage = (type) => {
    navigation.navigate('Manage', { type });
  };

  // Logout handler
  const handleLogout = () => {
    // TODO: Add your logout logic here (clear tokens, etc.)
    navigation.replace('RoleSelection');
  };

  // Calculate bar widths for the graph
  const maxCount = Math.max(stats.students, stats.instructors, 1);
  const studentBarWidth = (stats.students / maxCount) * 180;
  const instructorBarWidth = (stats.instructors / maxCount) * 180;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#fffbe7', '#ffe066', '#FFD700']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Image
            source={require('../../assets/images/log.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#bfa100" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Users Overview with Graph */}
        <View style={styles.overviewPanel}>
          <Text style={styles.overviewTitle}>Users Overview</Text>
          <View style={styles.graphContainer}>
            <View style={styles.graphRow}>
              <Text style={styles.graphLabel}>Students</Text>
              <View style={[styles.bar, { width: studentBarWidth, backgroundColor: '#ffe066' }]} />
              <Text style={styles.graphValue}>{stats.students}</Text>
            </View>
            <View style={styles.graphRow}>
              <Text style={styles.graphLabel}>Instructors</Text>
              <View style={[styles.bar, { width: instructorBarWidth, backgroundColor: '#bfa100' }]} />
              <Text style={styles.graphValue}>{stats.instructors}</Text>
            </View>
          </View>
        </View>

        {/* Registration Panel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Registration Panel</Text>
          <View style={styles.panelRow}>
            <TouchableOpacity style={styles.panelButton} onPress={goToRegisterStudent}>
              <Ionicons name="person-add-outline" size={28} color="#bfa100" />
              <Text style={styles.panelButtonText}>Register Student</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={goToRegisterInstructor}>
              <Ionicons name="person-add" size={28} color="#bfa100" />
              <Text style={styles.panelButtonText}>Register Instructor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={goToRegisterCourse}>
              <Ionicons name="book-outline" size={28} color="#bfa100" />
              <Text style={styles.panelButtonText}>Register Course</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Course Assignment Panel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Course Assignment Panel</Text>
          <TouchableOpacity style={styles.panelButtonWide} onPress={goToAssignCourses}>
            <Ionicons name="swap-horizontal-outline" size={28} color="#bfa100" />
            <Text style={styles.panelButtonText}>Assign Courses to Instructors</Text>
          </TouchableOpacity>
        </View>

        {/* Enrollment Panel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Enrollment Panel</Text>
          <TouchableOpacity style={styles.panelButtonWide} onPress={goToEnrollStudents}>
            <Ionicons name="school-outline" size={28} color="#bfa100" />
            <Text style={styles.panelButtonText}>Enroll Students to Courses</Text>
          </TouchableOpacity>
        </View>

        {/* Data Management Panel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Manage Data</Text>
          <View style={styles.panelRow}>
            <TouchableOpacity style={styles.panelButton} onPress={() => goToManage('students')}>
              <Ionicons name="people-outline" size={28} color="#bfa100" />
              <Text style={styles.panelButtonText}>Manage Students</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={() => goToManage('instructors')}>
              <Ionicons name="people-circle-outline" size={28} color="#bfa100" />
              <Text style={styles.panelButtonText}>Manage Instructors</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={() => goToManage('courses')}>
              <Ionicons name="book" size={28} color="#bfa100" />
              <Text style={styles.panelButtonText}>Manage Courses</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbe7',
  },
  headerGradient: {
    width: '100%',
    height: height * 0.22,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    marginBottom: 10,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  logo: {
    width: width * 0.18,
    height: width * 0.18,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 2,
    textShadowColor: '#fff8',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  content: {
    padding: 18,
    paddingBottom: 32,
  },
  overviewPanel: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#bfa100',
    marginBottom: 14,
    letterSpacing: 1,
  },
  graphContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  graphRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  graphLabel: {
    width: 90,
    fontSize: 15,
    color: '#22223b',
    fontWeight: 'bold',
  },
  bar: {
    height: 18,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  graphValue: {
    width: 36,
    fontSize: 15,
    color: '#bfa100',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#bfa100',
    marginBottom: 14,
    letterSpacing: 1,
  },
  panelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  panelButton: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fffbe7',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ffe066',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  panelButtonWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fffbe7',
    marginTop: 4,
    marginBottom: 4,
    gap: 10,
    borderWidth: 1,
    borderColor: '#ffe066',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  panelButtonText: {
    fontSize: 15,
    color: '#bfa100',
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  beeContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  beeWingLeft: {
    position: 'absolute',
    width: 18,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 18,
    left: -2,
    top: 0,
    opacity: 0.7,
    transform: [{ rotate: '-25deg' }],
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#ffe066',
  },
  beeBody: {
    width: 36,
    height: 36,
    backgroundColor: '#ffe066',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#bfa100',
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beeStripe: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    top: 10,
    backgroundColor: '#22223b',
    borderRadius: 3,
    marginHorizontal: 4,
  },
  beeWingRight: {
    position: 'absolute',
    width: 18,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 18,
    right: -2,
    top: 0,
    opacity: 0.7,
    transform: [{ rotate: '25deg' }],
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#ffe066',
  },
  beeEyeLeft: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#22223b',
    borderRadius: 2,
    top: 20,
    left: 18,
    zIndex: 3,
  },
  beeEyeRight: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#22223b',
    borderRadius: 2,
    top: 20,
    left: 28,
    zIndex: 3,
  },
  logoutButton: {
    position: 'absolute',
    top: 36,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbe7cc',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 14,
    zIndex: 10,
  },
  logoutText: {
    color: '#bfa100',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

export default Dashboard;