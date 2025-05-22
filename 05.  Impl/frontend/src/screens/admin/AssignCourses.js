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

const EnrollCourseInstructor = () => {
  const navigation = useNavigation();
  const [allCourses, setAllCourses] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [faculty, setFaculty] = useState('');
  const [program, setProgram] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [assignedCourses, setAssignedCourses] = useState([]);

  // Fetch all courses and instructors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, instructorsRes] = await Promise.all([
          axios.get(`${API_URL}/api/courses`, {
            headers: {
              'admin-id': 'admin123',
              'admin-password': 'pass123'
            }
          }),
          axios.get(`${API_URL}/api/instructors`, {
            headers: {
              'admin-id': 'admin123',
              'admin-password': 'pass123'
            }
          })
        ]);
        setAllCourses(coursesRes.data);
        setAllInstructors(instructorsRes.data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  // Get program options based on selected faculty
  const programOptions = faculty ? faculties[faculty] : [];

  // Filter courses based on selected faculty and program
  const filteredCourses = allCourses.filter(
    c => c.faculty === faculty && c.program === program
  );

  // Filter instructors based on selected faculty only
  const filteredInstructors = allInstructors.filter(
    i => i.faculty === faculty
  );

  // When instructor changes, show assigned courses
  useEffect(() => {
    if (!selectedInstructor) {
      setAssignedCourses([]);
      return;
    }
    const instructorObj = allInstructors.find(i => i._id === selectedInstructor);
    if (!instructorObj) {
      Alert.alert('Error', 'Selected instructor not found.');
      return;
    }
    // Filter by idNumber
    const assigned = allCourses.filter(
      c => c.instructorId === instructorObj.idNumber
    );
    setAssignedCourses(assigned);
  }, [selectedInstructor, allCourses]);

  // Find the selected instructor object
  const instructorObj = allInstructors.find(i => i._id === selectedInstructor);

  // Prevent assigning the same course twice
  const isAlreadyAssigned = filteredCourses.some(
    c => c._id === selectedCourse && c.instructorId === (instructorObj ? instructorObj.idNumber : '')
  );

  const handleAssign = async () => {
    if (!faculty || !program || !selectedInstructor || !selectedCourse) {
      Alert.alert('Error', 'Please select faculty, program, instructor, and course.');
      return;
    }
    if (isAlreadyAssigned) {
      Alert.alert('Notice', 'This course is already assigned to the selected instructor.');
      return;
    }
    try {
      await axios.post(`${API_URL}/api/courses/assign-course`, {
        instructorId: selectedInstructor, // selectedInstructor should be the _id string
        courseId: selectedCourse,
      }, {
        headers: {
          'admin-id': 'admin123',
          'admin-password': 'pass123'
        }
      });
      Alert.alert('Success', 'Course assigned to instructor!');
      setSelectedCourse('');
      // Refresh courses to update assignment
      const coursesRes = await axios.get(`${API_URL}/api/courses`, {
        headers: {
          'admin-id': 'admin123',
          'admin-password': 'pass123'
        }
      });
      setAllCourses(coursesRes.data);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Assignment failed.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#bfa100" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assign Course to Instructor</Text>
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Select Faculty</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={faculty}
              style={styles.picker}
              onValueChange={value => {
                setFaculty(value);
                setProgram('');
                setSelectedCourse('');
                setSelectedInstructor('');
                setAssignedCourses([]);
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
              selectedValue={program}
              style={styles.picker}
              enabled={!!faculty}
              onValueChange={value => {
                setProgram(value);
                setSelectedCourse('');
              }}
            >
              <Picker.Item label="Choose Program" value="" />
              {programOptions.map(prog => (
                <Picker.Item key={prog} label={prog} value={prog} />
              ))}
            </Picker>
          </View>
          <Text style={styles.panelTitle}>Select Course</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCourse}
              enabled={!!program}
              onValueChange={setSelectedCourse}
            >
              <Picker.Item label="Choose Course" value="" />
              {filteredCourses.map(course => (
                <Picker.Item
                  key={course._id}
                  label={`${course.courseTitle} (${course.courseCode})`}
                  value={course._id}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.panelTitle}>Select Instructor</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedInstructor}
              style={styles.picker}
              enabled={!!faculty}
              onValueChange={setSelectedInstructor}
            >
              <Picker.Item label="Choose Instructor" value="" />
              {filteredInstructors.map(inst => (
                <Picker.Item
                  key={inst._id}
                  label={inst.fullName}
                  value={inst._id}
                />
              ))}
            </Picker>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleAssign}>
            <Text style={styles.buttonText}>Assign Course</Text>
          </TouchableOpacity>
          {selectedInstructor ? (
            <View style={{ marginTop: 24 }}>
              <Text style={styles.panelTitle}>Courses Assigned to Instructor</Text>
              {assignedCourses.length === 0 ? (
                <Text style={{ color: '#888', marginBottom: 8 }}>No courses assigned yet.</Text>
              ) : (
                <FlatList
                  data={assignedCourses}
                  keyExtractor={item => item._id}
                  renderItem={({ item }) => (
                    <View style={{ padding: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
                      <Text style={{ fontWeight: 'bold', color: '#bfa100' }}>{item.courseTitle} ({item.courseCode})</Text>
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

export default EnrollCourseInstructor;