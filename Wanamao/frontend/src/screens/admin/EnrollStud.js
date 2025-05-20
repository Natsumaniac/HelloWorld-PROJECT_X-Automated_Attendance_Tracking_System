import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StyleSheet, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config/api';

const EnrollStudent = () => {
  const navigation = useNavigation();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [schoolYear, setSchoolYear] = useState('');
  const [semester, setSemester] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await axios.get(`${API_URL}/api/students`);
        setStudents(studentRes.data || []);

        const courseRes = await axios.get(`${API_URL}/api/courses`);
        setCourses(courseRes.data || []);
      } catch (err) {
        Alert.alert('Error fetching data', err.message);
      }
    };

    fetchData();
  }, []);

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleEnroll = async () => {
    if (!selectedStudent || selectedCourses.length === 0 || !semester || !schoolYear) {
      Alert.alert('Missing Info', 'Please complete all fields.');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/enrollments`, {
        studentId: selectedStudent,
        courseIds: selectedCourses,
        semester,
        schoolYear
      });

      Alert.alert('Success', 'Student enrolled successfully!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Enrollment failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Enroll Student</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Select Student</Text>
        <Picker
          selectedValue={selectedStudent}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedStudent(itemValue)}
        >
          <Picker.Item label="-- Choose Student --" value="" />
          {students.map((student) => (
            <Picker.Item
              key={student._id}
              label={`${student.lastName}, ${student.firstName} (${student.studentId})`}
              value={student._id}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Select Course(s)</Text>
        {courses.map((course) => (
          <TouchableOpacity
            key={course._id}
            onPress={() => toggleCourseSelection(course._id)}
            style={[
              styles.courseItem,
              selectedCourses.includes(course._id) && styles.selectedCourse
            ]}
          >
            <Text style={styles.courseText}>{course.courseCode} - {course.courseTitle}</Text>
          </TouchableOpacity>
        ))}

        <TextInput
          style={styles.input}
          placeholder="Semester (e.g., 1st Semester)"
          value={semester}
          onChangeText={setSemester}
        />
        <TextInput
          style={styles.input}
          placeholder="School Year (e.g., 2025-2026)"
          value={schoolYear}
          onChangeText={setSchoolYear}
        />

        <TouchableOpacity style={styles.button} onPress={handleEnroll}>
          <Text style={styles.buttonText}>Enroll Student</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffbe7' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffe066',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
  },
  backButton: { marginRight: 10, padding: 4 },
  backIcon: { fontSize: 22, color: '#22223b' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22223b',
    flex: 1,
    textAlign: 'center',
    marginRight: 36,
  },
  form: { padding: 24 },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#22223b',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  courseItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedCourse: {
    backgroundColor: '#cce5ff',
    borderColor: '#007acc',
  },
  courseText: { color: '#333', fontSize: 15 },
  button: {
    backgroundColor: '#165973',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EnrollStudent;
