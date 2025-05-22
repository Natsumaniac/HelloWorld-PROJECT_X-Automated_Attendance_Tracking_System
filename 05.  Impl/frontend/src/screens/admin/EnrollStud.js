import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Alert, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';

const { width, height } = Dimensions.get('window');

const faculties = {
  "FaCET": ["BSIT", "BSCE", "BSMath", "BITM"],
  "FALS": ["BSAM", "BSA", "BSBio", "BSES"],
  "FTEd": [
    "BEED", "BCED", "BSNED", "BPED", "BTLED Home Economics", "BTLED Industrial Arts",
    "BSED English", "BSED Filipino", "BSED Mathematics", "BSED Science"
  ],
  "FNAHS": ["BSN"],
  "FCJE": ["BSC"],
  "FoBM": ["BSBA", "BSHM"],
  "FHuSoCom": ["BA PolSci", "BSDevCom", "BS Psychology"]
};

const yearLevels = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year"
];

const EnrollStud = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    // Fetch students and courses from backend
    const fetchData = async () => {
      try {
        const headers = {
          'admin-id': 'admin123',
          'admin-password': 'pass123'
        };
        const [studRes, courseRes] = await Promise.all([
          axios.get(`${API_URL}/api/students`, { headers }),
          axios.get(`${API_URL}/api/courses`, { headers })
        ]);
        setStudents(studRes.data || []);
        setCourses(courseRes.data || []);
      } catch (err) {
        Alert.alert('Error', 'Failed to load students or courses.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedStudent) {
      setEnrolledCourses([]);
      return;
    }
    // Find the selected student object
    const studentObj = students.find(s => s._id === selectedStudent);
    if (!studentObj) {
      setEnrolledCourses([]);
      return;
    }
    // Find all courses where this student is enrolled (by studentId)
    const enrolled = courses.filter(
      c => Array.isArray(c.students) && c.students.includes(studentObj.studentId)
    );
    setEnrolledCourses(enrolled);
  }, [selectedStudent, courses, students]);

  // Helper to extract program code (e.g., "BSIT" from "BSIT - Bachelor of Science in Information Technology")
  const getProgramCode = (program) => {
    if (!program) return '';
    return program.split(' ')[0];
  };

  // Filter students based on selected faculty, program, and year
  const filteredStudents = students.filter(stud =>
    (!selectedFaculty || stud.faculty === selectedFaculty) &&
    (!selectedProgram || getProgramCode(stud.program) === selectedProgram) &&
    (!selectedYear || stud.year === selectedYear)
  );

  // Filter courses based on selected faculty and program
  const filteredCourses = courses.filter(
    c => (!selectedFaculty || c.faculty === selectedFaculty) &&
         (!selectedProgram || c.program === selectedProgram)
  );

  // Get program options based on selected faculty
  const programOptions = selectedFaculty ? faculties[selectedFaculty] : [];

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedCourse) {
      Alert.alert('Error', 'Please select both a student and a course.');
      return;
    }
    try {
      const studentObj = students.find(s => s._id === selectedStudent);
      await axios.post(`${API_URL}/api/courses/enroll`, {
        studentId: studentObj.studentId,   // ✅ This is the actual studentId string
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
      <View style={styles.form}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Select Faculty</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedFaculty}
              style={styles.picker}
              onValueChange={value => {
                setSelectedFaculty(value);
                setSelectedProgram('');
                setSelectedYear('');
                setSelectedStudent('');
              }}
            >
              <Picker.Item label="Choose Faculty" value="" />
              {Object.keys(faculties).map(fac => (
                <Picker.Item key={fac} label={fac} value={fac} />
              ))}
            </Picker>
          </View>
          <Text style={styles.panelTitle}>Select Program</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedProgram}
              style={styles.picker}
              enabled={!!selectedFaculty}
              onValueChange={value => {
                setSelectedProgram(value);
                setSelectedYear('');
                setSelectedStudent('');
              }}
            >
              <Picker.Item label="Choose Program" value="" />
              {programOptions.map(prog => (
                <Picker.Item key={prog} label={prog} value={prog} />
              ))}
            </Picker>
          </View>
          <Text style={styles.panelTitle}>Select Year Level</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedYear}
              style={styles.picker}
              enabled={!!selectedProgram}
              onValueChange={value => {
                setSelectedYear(value);
                setSelectedStudent('');
              }}
            >
              <Picker.Item label="Choose Year Level" value="" />
              {yearLevels.map(yr => (
                <Picker.Item key={yr} label={yr} value={yr} />
              ))}
            </Picker>
          </View>
          <Text style={styles.panelTitle}>Select Student</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStudent}
              style={styles.picker}
              enabled={!!selectedYear}
              onValueChange={setSelectedStudent}
            >
              <Picker.Item label="Choose Student" value="" />
              {filteredStudents.map((stud) => (
                <Picker.Item
                  key={stud._id}
                  label={`${stud.fullName} (${stud.studentId})`}
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
              {filteredCourses.map((course) => (
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
          {selectedStudent ? (
            <View style={{ marginTop: 24 }}>
              <Text style={styles.panelTitle}>Courses Enrolled</Text>
              {enrolledCourses.length === 0 ? (
                <Text style={{ color: '#888', marginBottom: 8 }}>No courses enrolled yet.</Text>
              ) : (
                <FlatList
                  data={enrolledCourses}
                  keyExtractor={item => item._id}
                  renderItem={({ item }) => (
                    <View style={{ padding: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
                      <Text style={{ fontWeight: 'bold', color: '#bfa100' }}>
                        {item.courseTitle} ({item.courseCode})
                      </Text>
                      <Text style={{ color: '#444' }}>{item.program} - {item.yearSection}</Text>
                    </View>
                  )}
                />
              )}
            </View>
          ) : null}
        </View>
      </View>
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