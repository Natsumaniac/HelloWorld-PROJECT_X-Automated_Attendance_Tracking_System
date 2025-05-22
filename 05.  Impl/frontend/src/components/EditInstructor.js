import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config/api';

// Helper to parse "Last, First M. Ext" into fields
function parseFullName(fullName) {
  if (!fullName) return {};
  // Example: "Watts, Terry T. Jr."
  const [last, rest] = fullName.split(',');
  if (!rest) return { lastName: fullName };
  const parts = rest.trim().split(' ');
  const firstName = parts[0] || '';
  let middleInitial = '';
  let extensionName = '';
  if (parts.length > 1) {
    // Middle initial is usually like "T."
    if (/^[A-Z]\.$/.test(parts[1])) {
      middleInitial = parts[1].replace('.', '');
      if (parts.length > 2) {
        extensionName = parts.slice(2).join(' ');
      }
    } else {
      extensionName = parts.slice(1).join(' ');
    }
  }
  return {
    lastName: last.trim(),
    firstName,
    middleInitial,
    extensionName,
  };
}

const EditInstructor = ({ route, navigation }) => {
  const { instructor } = route.params;
  if (!instructor) return <Text>No instructor data.</Text>;

  // Construct the name for display
  const displayName =
    instructor.fullName ||
    `${instructor.lastName || ''}, ${instructor.firstName || ''} ${instructor.middleInitial ? instructor.middleInitial + '.' : ''}${instructor.extensionName && instructor.extensionName !== 'N/A' ? ' ' + instructor.extensionName : ''}`.trim() ||
    'No Name';

  // Parse fullName if fields are missing
  const parsed = (!instructor.firstName || !instructor.lastName)
    ? parseFullName(instructor.fullName)
    : {};

  const [firstName, setFirstName] = useState(instructor.firstName || parsed.firstName || '');
  const [lastName, setLastName] = useState(instructor.lastName || parsed.lastName || '');
  const [middleInitial, setMiddleInitial] = useState(instructor.middleInitial || parsed.middleInitial || '');
  const [extensionName, setExtensionName] = useState(instructor.extensionName || parsed.extensionName || '');
  const [instructorId, setInstructorId] = useState(instructor.instructorId || instructor.idNumber || '');
  const [email, setEmail] = useState(instructor.email || '');
  const [faculty, setFaculty] = useState(instructor.faculty || '');
  const [deviceName, setDeviceName] = useState(instructor.deviceName || instructor.assignedDevice || '');

  const handleSave = async () => {
    if (!firstName || !lastName || !instructorId || !email || !faculty) {
      Alert.alert('Error', 'First Name, Last Name, Instructor ID, Email, and Faculty are required.');
      return;
    }
    try {
      await axios.put(`${API_URL}/api/instructors/${instructor._id}`, {
        firstName,
        lastName,
        middleInitial,
        extensionName,
        instructorId,
        email,
        faculty,
        deviceName,
      }, {
        headers: {
          'admin-id': 'admin123',
          'admin-password': 'pass123'
        }
      });
      Alert.alert('Success', 'Instructor updated!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update instructor.');
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
          <Text style={styles.title}>Edit Instructor</Text>
          <Text style={styles.name}>{displayName}</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Middle Initial</Text>
            <TextInput style={styles.input} value={middleInitial} onChangeText={setMiddleInitial} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Extension Name</Text>
            <TextInput style={styles.input} value={extensionName} onChangeText={setExtensionName} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Instructor ID *</Text>
            <TextInput style={styles.input} value={instructorId} onChangeText={setInstructorId} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Faculty *</Text>
            <TextInput style={styles.input} value={faculty} onChangeText={setFaculty} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Device</Text>
            <TextInput style={styles.input} value={deviceName} onChangeText={setDeviceName} />
          </View>
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
  name: {
    fontSize: 18,
    color: '#22223b',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
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

export default EditInstructor;