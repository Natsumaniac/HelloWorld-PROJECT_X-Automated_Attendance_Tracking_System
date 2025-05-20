import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView, Image, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { Ionicons } from '@expo/vector-icons';

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
      {/* Header matching RegisterStudent */}
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#bfa100" />
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/log.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Register Course</Text>
        </View>
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
  headerGradient: {
    width: '100%',
    height: height * 0.10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    backgroundColor: '#ffe066',
    position: 'relative',
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 20,
    backgroundColor: '#fffbe7cc',
    borderRadius: 20,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.11,
    height: width * 0.11,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 2,
    textShadowColor: '#fff8',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  form: { padding: 24 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffe066',
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#bfa100',
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
    marginTop: 12,
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

export default RegisterCourse;