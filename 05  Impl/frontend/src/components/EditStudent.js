import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config/api';

const EditStudent = ({ route, navigation }) => {
  const { student } = route.params;
  if (!student) return <Text>No student data.</Text>;

  const [fullName, setFullName] = useState(student.fullName);
  const [studentId, setStudentId] = useState(student.studentId);
  const [email, setEmail] = useState(student.email);
  const [faculty, setFaculty] = useState(student.faculty);
  const [program, setProgram] = useState(student.program);
  const [year, setYear] = useState(student.year);

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/api/students/${student._id}`, {
        fullName,
        studentId,
        email,
        faculty,
        program,
        year,
      }, {
        headers: {
          'admin-id': 'admin123',
          'admin-password': 'pass123'
        }
      });
      Alert.alert('Success', 'Student updated!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update student.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.panel}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#bfa100" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Student</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Student ID</Text>
          <TextInput style={styles.input} value={studentId} onChangeText={setStudentId} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Faculty</Text>
          <TextInput style={styles.input} value={faculty} onChangeText={setFaculty} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Program</Text>
          <TextInput style={styles.input} value={program} onChangeText={setProgram} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Year Level</Text>
          <TextInput style={styles.input} value={year} onChangeText={setYear} />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: 24,
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
});

export default EditStudent;