import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';

const { width, height } = Dimensions.get('window');

const EnrollStud = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    // Fetch students and courses from backend
    const fetchData = async () => {
      try {
        const [studRes, courseRes] = await Promise.all([
          axios.get(`${API_URL}/students`),
          axios.get(`${API_URL}/courses`)
        ]);
        setStudents(studRes.data || []);
        setCourses(courseRes.data || []);
      } catch (err) {
        Alert.alert('Error', 'Failed to load students or courses.');
      }
    };
    fetchData();
  }, []);

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedCourse) {
      Alert.alert('Error', 'Please select both a student and a course.');
      return;
    }
    try {
      await axios.post(`${API_URL}/enroll`, {
        studentId: selectedStudent,
        courseId: selectedCourse,
      });
      Alert.alert('Success', 'Student enrolled in course!');
      setSelectedStudent('');
      setSelectedCourse('');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Enrollment failed.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#bfa100" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enroll Student to Course</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Select Student</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStudent}
              style={styles.picker}
              onValueChange={setSelectedStudent}
            >
              <Picker.Item label="Choose Student" value="" />
              {students.map((stud) => (
                <Picker.Item
                  key={stud._id}
                  label={`${stud.lastName}, ${stud.firstName} (${stud.idNumber})`}
                  value={stud._id}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.panelTitle}>Select Course</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCourse}
              style={styles.picker}
              onValueChange={setSelectedCourse}
            >
              <Picker.Item label="Choose Course" value="" />
              {courses.map((course) => (
                <Picker.Item
                  key={course._id}
                  label={`${course.courseCode} - ${course.courseTitle} (${course.section})`}
                  value={course._id}
                />
              ))}
            </Picker>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleEnroll}>
            <Text style={styles.buttonText}>Enroll Student</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffbe7' },
  headerGradient: {
    width: '100%',
    height: height * 0.10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    backgroundColor: '#ffe066',
    position: 'relative',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 10,
    backgroundColor: '#fffbe7cc',
    borderRadius: 20,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 2,
    textAlign: 'center',
    flex: 1,
    marginLeft: 10,
  },
  form: { padding: 24 },
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
    marginBottom: 10,
    letterSpacing: 1,
  },
  pickerContainer: {
    marginBottom: 18,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe066',
  },
  button: {
    backgroundColor: '#bfa100',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fffbe7',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default EnrollStud;