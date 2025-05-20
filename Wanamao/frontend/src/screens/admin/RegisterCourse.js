import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';

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

const RegisterCourse = () => {
  const navigation = useNavigation();
  const [faculty, setFaculty] = useState('');
  const [program, setProgram] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [section, setSection] = useState('');
  const [year, setYear] = useState('');
  const [schedule, setSchedule] = useState('');
  const [instructor, setInstructor] = useState('');
  const [instructors, setInstructors] = useState([]);

  const programOptions = faculty ? faculties[faculty] : [];

  useEffect(() => {
    // Fetch instructors from backend
    const fetchInstructors = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/instructors`);
        setInstructors(res.data || []);
      } catch (err) {
        setInstructors([]);
      }
    };
    fetchInstructors();
  }, []);

  const handleRegister = async () => {
    if (!faculty || !program || !courseCode || !courseTitle || !section || !year || !schedule || !instructor) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      await axios.post(`${API_URL}/api/courses/create`, {
        faculty, program, courseCode, courseTitle, section, year, schedule, instructor
      });
      Alert.alert('Success', 'Course registered!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Registration failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={{ fontSize: 22, color: '#22223b' }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Register Course</Text>
      </View>
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Faculty</Text>
          <Picker
            selectedValue={faculty}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setFaculty(itemValue);
              setProgram('');
            }}
          >
            <Picker.Item label="Select Faculty" value="" />
            {Object.keys(faculties).map((fac) => (
              <Picker.Item key={fac} label={fac} value={fac} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Program</Text>
          <Picker
            selectedValue={program}
            style={styles.picker}
            enabled={!!faculty}
            onValueChange={setProgram}
          >
            <Picker.Item label="Select Program" value="" />
            {programOptions.map((prog) => (
              <Picker.Item key={prog} label={prog} value={prog} />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Course Code (e.g., ITC130)"
          value={courseCode}
          onChangeText={setCourseCode}
        />
        <TextInput
          style={styles.input}
          placeholder="Course Title"
          value={courseTitle}
          onChangeText={setCourseTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Section (e.g., BSIT3A, ITBAN)"
          value={section}
          onChangeText={setSection}
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Year Level</Text>
          <Picker
            selectedValue={year}
            style={styles.picker}
            onValueChange={setYear}
          >
            <Picker.Item label="Select Year Level" value="" />
            {yearLevels.map((lvl) => (
              <Picker.Item key={lvl} label={lvl} value={lvl} />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Schedule (e.g., Mon & Wed 10:00 AM – 11:30 AM)"
          value={schedule}
          onChangeText={setSchedule}
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Assign Instructor</Text>
          <Picker
            selectedValue={instructor}
            style={styles.picker}
            onValueChange={setInstructor}
          >
            <Picker.Item label="Select Instructor" value="" />
            {instructors.map((inst) => (
              <Picker.Item
                key={inst._id}
                label={`${inst.lastName}, ${inst.firstName}${inst.middleInitial ? ' ' + inst.middleInitial + '.' : ''}${inst.extensionName && inst.extensionName !== 'N/A' ? ' ' + inst.extensionName : ''}`}
                value={inst._id}
              />
            ))}
          </Picker>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register Course</Text>
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
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22223b',
    flex: 1,
    textAlign: 'center',
    marginRight: 36,
  },
  form: { padding: 24 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
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

export default RegisterCourse;