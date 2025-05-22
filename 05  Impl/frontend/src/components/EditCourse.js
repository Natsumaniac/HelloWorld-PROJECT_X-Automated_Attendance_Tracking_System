import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { API_URL } from '../config/api';

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

const reverseDayMap = Object.fromEntries(Object.entries(dayMap).map(([k, v]) => [v, k]));

const EditCourse = ({ route, navigation }) => {
  const { course } = route.params;
  if (!course) return <Text>No course data.</Text>;

  // Convert backend schedules to UI format
  function schedulesToUI(schedules) {
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return [{ label: '', days: [], startTime: new Date(), endTime: new Date() }];
    }
    // Group by start/end time (and label if you use it)
    const groups = [];
    schedules.forEach(s => {
      // Find group with same start/end time
      const key = `${s.startTime}-${s.endTime}`;
      let group = groups.find(g =>
        g.startTime === s.startTime &&
        g.endTime === s.endTime
      );
      if (!group) {
        group = {
          label: s.label || '',
          days: [],
          startTime: parseTime(s.startTime),
          endTime: parseTime(s.endTime)
        };
        groups.push(group);
      }
      group.days.push(reverseDayMap[s.day] || s.day);
    });
    return groups;
  }

  // Convert UI schedules to backend format
  function uiToSchedules(uiSchedules) {
    const arr = [];
    uiSchedules.forEach(s => {
      s.days.forEach(day => {
        arr.push({
          day: dayMap[day],
          startTime: formatTime(s.startTime),
          endTime: formatTime(s.endTime)
        });
      });
    });
    return arr;
  }

  // Helpers
  function parseTime(str) {
    // "12:00 AM" -> Date
    if (!str) return new Date();
    const [time, ampm] = str.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }
  function formatTime(date) {
    let h = date.getHours();
    let m = date.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m} ${ampm}`;
  }

  // State
  const [courseCode, setCourseCode] = useState(course.courseCode || '');
  const [courseTitle, setCourseTitle] = useState(course.courseTitle || '');
  const [faculty, setFaculty] = useState(course.faculty || '');
  const [program, setProgram] = useState(course.program || '');
  const [yearLevel, setYearLevel] = useState(course.yearLevel || '');
  const [yearSection, setYearSection] = useState(course.yearSection || '');
  const [classroom, setClassroom] = useState(course.classroom || '');
  const [schedules, setSchedules] = useState(schedulesToUI(course.schedules));
  const [showStartPicker, setShowStartPicker] = useState(null);
  const [showEndPicker, setShowEndPicker] = useState(null);

  const addSchedule = () => {
    setSchedules([...schedules, { label: '', days: [], startTime: new Date(), endTime: new Date() }]);
  };

  const removeSchedule = (idx) => {
    setSchedules(schedules.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!courseCode || !courseTitle || !faculty || !program || !yearLevel || !yearSection || schedules.some(s => s.days.length === 0)) {
      Alert.alert('Error', 'All fields except classroom are required, and each schedule must have at least one day.');
      return;
    }
    try {
      await axios.put(`${API_URL}/api/courses/${course._id}`, {
        courseCode,
        courseTitle,
        faculty,
        program,
        yearLevel,
        yearSection,
        classroom,
        schedules: uiToSchedules(schedules),
      }, {
        headers: {
          'admin-id': 'admin123',
          'admin-password': 'pass123'
        }
      });
      Alert.alert('Success', 'Course updated!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update course.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.panel}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#bfa100" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Course</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Course Code *</Text>
            <TextInput style={styles.input} value={courseCode} onChangeText={setCourseCode} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Course Title *</Text>
            <TextInput style={styles.input} value={courseTitle} onChangeText={setCourseTitle} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Faculty *</Text>
            <TextInput style={styles.input} value={faculty} onChangeText={setFaculty} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Program *</Text>
            <TextInput style={styles.input} value={program} onChangeText={setProgram} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Year Level *</Text>
            <TextInput style={styles.input} value={yearLevel} onChangeText={setYearLevel} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Section *</Text>
            <TextInput style={styles.input} value={yearSection} onChangeText={setYearSection} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Classroom</Text>
            <TextInput style={styles.input} value={classroom} onChangeText={setClassroom} />
          </View>
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
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbe7',
  },
  panel: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
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
    marginBottom: 8,
    letterSpacing: 1,
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    color: '#22223b',
    marginBottom: 6,
    marginLeft: 2,
    fontSize: 15,
  },
  input: {
    backgroundColor: '#fffbe7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe066',
    padding: 12,
    fontSize: 15,
    color: '#22223b',
  },
  scheduleText: {
    backgroundColor: '#fffbe7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe066',
    padding: 12,
    fontSize: 15,
    color: '#22223b',
    minHeight: 48,
  },
  button: {
    backgroundColor: '#bfa100',
    borderRadius: 10,
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

export default EditCourse;