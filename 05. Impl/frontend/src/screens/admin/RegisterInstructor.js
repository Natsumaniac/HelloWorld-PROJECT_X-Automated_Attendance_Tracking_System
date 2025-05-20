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
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const faculties = [
  "FaCET", "FALS", "FTEd", "FNAHS", "FCJE", "FoBM", "FHuSoCom"
];

const RegisterInstructor = () => {
  const navigation = useNavigation();
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [extensionName, setExtensionName] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [faculty, setFaculty] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [devices, setDevices] = useState([]);
  const [assignedDevice, setAssignedDevice] = useState('');

  useEffect(() => {
    // Fetch available devices for assignment
    const fetchDevices = async () => {
      try {
        const res = await axios.get(`${API_URL}/devices`);
        setDevices(res.data || []);
      } catch (err) {
        setDevices([]);
      }
    };
    fetchDevices();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    if (
      !lastName ||
      !firstName ||
      !instructorId ||
      !faculty ||
      !email ||
      !assignedDevice
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    try {
      let formData = new FormData();
      formData.append('lastName', lastName);
      formData.append('firstName', firstName);
      formData.append('middleInitial', middleInitial);
      formData.append('extensionName', extensionName);
      formData.append('instructorId', instructorId);
      formData.append('faculty', faculty);
      formData.append('email', email);
      if (photo) {
        formData.append('photo', {
          uri: photo.uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });
      }
      formData.append('assignedDevice', assignedDevice);

      await axios.post(`${API_URL}/instructors/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Instructor registered successfully! A temporary password will be sent to their email.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#bfa100" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register Instructor</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>👤 Instructor Information</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Last Name*"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              placeholder="First Name*"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Middle Initial"
              value={middleInitial}
              onChangeText={setMiddleInitial}
              maxLength={2}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              placeholder="Extension (Jr., III, etc)"
              value={extensionName}
              onChangeText={setExtensionName}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Instructor ID* (e.g. INST-2024-001)"
            value={instructorId}
            onChangeText={setInstructorId}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={faculty}
              style={styles.picker}
              onValueChange={setFaculty}
            >
              <Picker.Item label="Select Faculty*" value="" />
              {faculties.map(fac => (
                <Picker.Item key={fac} label={fac} value={fac} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email*"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {/* Profile Photo */}
          <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.photo} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={28} color="#bfa100" />
                <Text style={styles.photoText}>Upload Profile Photo</Text>
              </>
            )}
          </TouchableOpacity>
          {/* Assign Device */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={assignedDevice}
              style={styles.picker}
              onValueChange={setAssignedDevice}
            >
              <Picker.Item label="Assign Device*" value="" />
              {devices
                .filter(d => !d.instructor) // Only unassigned devices
                .map(d => (
                  <Picker.Item
                    key={d._id}
                    label={d.deviceName || d.deviceId || 'Device'}
                    value={d._id}
                  />
                ))}
            </Picker>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register Instructor</Text>
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
    marginBottom: 14,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
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
  picker: {
    width: '100%',
    color: '#22223b',
  },
  photoPicker: {
    backgroundColor: '#fffbe7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffe066',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 10,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  photoText: {
    color: '#bfa100',
    fontWeight: 'bold',
    marginLeft: 10,
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
});

export default RegisterInstructor;