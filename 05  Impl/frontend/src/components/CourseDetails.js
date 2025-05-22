import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CourseDetails = ({ route, navigation }) => {
  const { course } = route.params;
  if (!course) return <Text style={{ textAlign: 'center', marginTop: 40 }}>No course data.</Text>;

  // Format schedules for display
  const schedulesArr = Array.isArray(course.schedules) ? course.schedules : [];
  const scheduleText = schedulesArr.length > 0
    ? schedulesArr.map(
        (s, i) =>
          `${s.day || ''} ${s.startTime || ''}${s.endTime ? ' - ' + s.endTime : ''}`
      ).join('\n')
    : 'No schedule set';

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#bfa100" />
        </TouchableOpacity>
        <Text style={styles.title}>Course Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Course:</Text>
          <Text style={styles.value}>{course.courseCode} - {course.courseTitle}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Section:</Text>
          <Text style={styles.value}>{course.yearSection || course.section}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Program:</Text>
          <Text style={styles.value}>{course.program}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Year:</Text>
          <Text style={styles.value}>{course.yearLevel || course.year}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Faculty:</Text>
          <Text style={styles.value}>{course.faculty}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Classroom:</Text>
          <Text style={styles.value}>{course.classroom || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Instructor:</Text>
          <Text style={styles.value}>{course.instructorName || 'Unassigned'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Schedule:</Text>
          <Text style={styles.value}>{scheduleText}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbe7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 10,
    elevation: 6,
    marginVertical: 30,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: '#fffbe7cc',
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#bfa100',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#22223b',
    width: 110,
    fontSize: 15,
  },
  value: {
    fontWeight: 'normal',
    color: '#444',
    fontSize: 15,
    flexShrink: 1,
  },
});

export default CourseDetails;