import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

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

const dayOptions = [
  { label: 'M', value: 'Mon' },
  { label: 'T', value: 'Tue' },
  { label: 'W', value: 'Wed' },
  { label: 'Th', value: 'Thu' },
  { label: 'F', value: 'Fri' },
  { label: 'Sat', value: 'Sat' },
  { label: 'Sun', value: 'Sun' },
];

const dayMap = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday'
};

const RegisterCourse = () => {
  const navigation = useNavigation();
  const [faculty, setFaculty] = useState('');
  const [program, setProgram] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [section, setSection] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(null);
  const [showEndPicker, setShowEndPicker] = useState(null);
  const [schedules, setSchedules] = useState([
    { label: '', days: [], startTime: new Date(), endTime: new Date() }
  ]);
  const [yearLevel, setYearLevel] = useState('');
  const [classroom, setClassroom] = useState('');

  const programOptions = faculty ? faculties[faculty] : [];

  const handleRegister = async () => {
    if (
      !faculty || !program || !courseCode || !courseTitle ||
      !yearLevel || !section || schedules.some(s => s.days.length === 0)
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Convert schedules to array of objects as expected by backend
    const schedulesArr = [];
    schedules.forEach(s => {
      s.days.forEach(day => {
        schedulesArr.push({
          day: dayMap[day], // <-- use full day name
          startTime: formatTime(s.startTime),
          endTime: formatTime(s.endTime)
        });
      });
    });

    try {
      await axios.post(`${API_URL}/api/courses/create`, {
        faculty,
        program,
        courseCode,
        courseTitle,
        yearLevel,
        yearSection: section,
        schedules: schedulesArr,
        classroom
      }, {
        headers: {
          'admin-id': 'admin123',
          'admin-password': 'pass123'
        }
      });
      Alert.alert('Success', 'Course registered!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Registration failed', err.response?.data?.message || err.message);
    }
  };

  // Helper to format time
  const formatTime = (date) => {
    let h = date.getHours();
    let m = date.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m} ${ampm}`;
  };

  const addSchedule = () => {
    setSchedules([...schedules, { label: '', days: [], startTime: new Date(), endTime: new Date() }]);
  };

  const removeSchedule = (idx) => {
    setSchedules(schedules.filter((_, i) => i !== idx));
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header matching RegisterStudent/RegisterInstructor */}
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#bfa100" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register Course</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>📚 Course Information</Text>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Faculty*</Text>
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
            <Text style={styles.label}>Program*</Text>
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
            placeholder="Course Code* (e.g., ITC130)"
            value={courseCode}
            onChangeText={setCourseCode}
          />
          <TextInput
            style={styles.input}
            placeholder="Course Title*"
            value={courseTitle}
            onChangeText={setCourseTitle}
          />
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Year Level*</Text>
            <Picker
              selectedValue={yearLevel}
              style={styles.picker}
              onValueChange={setYearLevel}
            >
              <Picker.Item label="Select Year Level" value="" />
              {yearLevels.map((lvl) => (
                <Picker.Item key={lvl} label={lvl} value={lvl} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Section* (e.g., BSIT3A,)"
            value={section}
            onChangeText={setSection}
          />
          <TextInput
            style={styles.input}
            placeholder="Classroom (optional)"
            value={classroom}
            onChangeText={setClassroom}
          />
        
          <Text style={styles.label}>Schedules*</Text>
          {schedules.map((sched, idx) => (
            <View key={idx} style={[styles.scheduleGroup, { borderWidth: 1, borderColor: '#ffe066', borderRadius: 10, marginBottom: 12, padding: 10 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Text style={styles.label}>Schedule {idx + 1}</Text>
                <TextInput
                  style={[styles.input, { flex: 1, marginLeft: 8 }]}
                  placeholder="Label (e.g., Lab Sched)"
                  value={sched.label}
                  onChangeText={txt => {
                    const updated = [...schedules];
                    updated[idx].label = txt;
                    setSchedules(updated);
                  }}
                />
                {schedules.length > 1 && (
                  <TouchableOpacity onPress={() => removeSchedule(idx)} style={{ marginLeft: 8 }}>
                    <Ionicons name="close-circle" size={22} color="#bfa100" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                {dayOptions.map(day => (
                  <TouchableOpacity
                    key={day.value}
                    style={[
                      styles.dayButton,
                      sched.days.includes(day.value) && styles.dayButtonSelected
                    ]}
                    onPress={() => {
                      const updated = [...schedules];
                      updated[idx].days = sched.days.includes(day.value)
                        ? sched.days.filter(d => d !== day.value)
                        : [...sched.days, day.value];
                      setSchedules(updated);
                    }}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      sched.days.includes(day.value) && styles.dayButtonTextSelected
                    ]}>{day.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.input, { flex: 1, marginRight: 8, justifyContent: 'center' }]}
                  onPress={() => setShowStartPicker(idx)}
                >
                  <Text style={{ color: '#22223b' }}>
                    Start: {formatTime(sched.startTime)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.input, { flex: 1, justifyContent: 'center' }]}
                  onPress={() => setShowEndPicker(idx)}
                >
                  <Text style={{ color: '#22223b' }}>
                    End: {formatTime(sched.endTime)}
                  </Text>
                </TouchableOpacity>
              </View>
              {showStartPicker === idx && (
                <DateTimePicker
                  value={sched.startTime}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={(_, selected) => {
                    setShowStartPicker(null);
                    if (selected) {
                      const updated = [...schedules];
                      updated[idx].startTime = selected;
                      setSchedules(updated);
                    }
                  }}
                />
              )}
              {showEndPicker === idx && (
                <DateTimePicker
                  value={sched.endTime}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={(_, selected) => {
                    setShowEndPicker(null);
                    if (selected) {
                      const updated = [...schedules];
                      updated[idx].endTime = selected;
                      setSchedules(updated);
                    }
                  }}
                />
              )}
            </View>
          ))}
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ffe066', marginBottom: 10 }]} onPress={addSchedule}>
            <Text style={[styles.buttonText, { color: '#bfa100' }]}>+ Add Another Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register Course</Text>
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
    height: height * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    backgroundColor: '#ffe066',
    marginBottom: 10,
    position: 'relative',
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
    flex: 1,
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
    marginBottom: 14,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#fffbe7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffe066',
    fontSize: 15,
    color: '#22223b',
  },
  pickerContainer: {
    backgroundColor: '#fffbe7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffe066',
    marginBottom: 10,
    overflow: 'hidden',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#bfa100',
    marginLeft: 4,
    marginTop: 6,
  },
  picker: {
    width: '100%',
    color: '#22223b',
  },
  button: {
    backgroundColor: '#bfa100',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
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
  scheduleGroup: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffe066',
    backgroundColor: '#fffbe7',
    marginRight: 6,
    marginBottom: 6,
  },
  dayButtonSelected: {
    backgroundColor: '#ffe066',
    borderColor: '#bfa100',
  },
  dayButtonText: {
    color: '#bfa100',
    fontWeight: 'bold',
  },
  dayButtonTextSelected: {
    color: '#22223b',
  },
});

export default RegisterCourse;