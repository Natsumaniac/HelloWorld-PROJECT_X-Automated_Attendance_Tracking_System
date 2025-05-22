import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '../../config/api'; // Make sure this points to your backend

const { width, height } = Dimensions.get('window');

const faculties = {
  "FaCET": [
    "BITM - Bachelor in Industrial Technology Management major in Automotive Technology",
    "BSCE - Bachelor of Science in Civil Engineering",
    "BSIT - Bachelor of Science in Information Technology",
    "BSMath - Bachelor of Science in Mathematics",
    "BSMathStat - Bachelor of Science in Mathematics with Research Statistics"
  ],
  "FALS": [
    "BSAM - Bachelor of Science in Agribusiness Management",
    "BSA - Bachelor of Science in Agriculture major in Horticulture",
    "BSA - Bachelor of Science in Agriculture major in Animal Science",
    "BSA - Bachelor of Science in Agriculture major in Crop Science",
    "BSBio - Bachelor of Science in Biology",
    "BSBio - Bachelor of Science in Biology major in Animal Biology",
    "BSBio - Bachelor of Science in Biology major in Ecology",
    "BSES - Bachelor of Science in Environmental Science"
  ],
  "FTEd": [
    "BEED - Bachelor of Elementary Education",
    "BCED - Bachelor of Early Childhood Education",
    "BSNED - Bachelor of Special Needs Education",
    "BPED - Bachelor of Physical Education",
    "BTLED - Bachelor of Technology and Livelihood Education major in Home Economics",
    "BTLED - Bachelor of Technology and Livelihood Education major in Industrial Arts",
    "BSED English - Bachelor of Secondary Education major in English",
    "BSED Filipino - Bachelor of Secondary Education major in Filipino",
    "BSED Mathematics - Bachelor of Secondary Education major in Mathematics",
    "BSED Science - Bachelor of Secondary Education major in Science"
  ],
  "FNAHS": [
    "BSN - Bachelor of Science in Nursing"
  ],
  "FCJE": [
    "BSC - Bachelor of Science in Criminology"
  ],
  "FoBM": [
    "BSBA - Bachelor of Science in Business Administration major in Financial Management",
    "BSHM - Bachelor of Science in Hospitality Management"
  ],
  "FHuSoCom": [
    "BA PolSci - Bachelor of Arts in Political Science",
    "BSDevCom - Bachelor of Science in Development Communication",
    "BS Psychology - Bachelor of Science in Psychology"
  ]
};

const yearLevels = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year"
];

const extensionNames = [
  "N/A",
  "Jr.",
  "Sr.",
  "II",
  "III",
  "IV"
];

const RegisterStudent = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [extensionName, setExtensionName] = useState('N/A');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [faculty, setFaculty] = useState('');
  const [program, setProgram] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const programOptions = faculty ? faculties[faculty] : [];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const uriToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !studentId || !year || !faculty || !program || !email) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const fullName = `${lastName}, ${firstName}${middleInitial ? ' ' + middleInitial + '.' : ''}${extensionName && extensionName !== 'N/A' ? ' ' + extensionName : ''}`;
      let profilePicBase64 = null;
      if (profilePic) {
        profilePicBase64 = await uriToBase64(profilePic);
      }
      await axios.post(`${API_URL}/api/students/create`, {
        studentId: studentId,
        fullName,
        email,
        year,
        faculty,
        program,
        profilePic: profilePicBase64, // <-- send as base64 string
      }, {
        headers: {
          'admin-id': 'admin123',
          'admin-password': 'pass123'
        }
      });
      Alert.alert('Success', 'Student registered! A default password will be sent to the provided email address.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Registration failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#bfa100" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register Student</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>👤 Student Information</Text>
          {/* Profile Picture Upload */}
          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              {profilePic ? (
                <Image source={{ uri: profilePic }} style={styles.profilePic} />
              ) : (
                <View style={styles.profilePicPlaceholder}>
                  <Ionicons name="person-circle-outline" size={80} color="#ffe066" />
                  <Text style={styles.photoText}>Upload Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
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
            <View style={[styles.pickerContainer, { flex: 1, marginLeft: 8 }]}>
              <Picker
                selectedValue={extensionName}
                style={styles.picker}
                onValueChange={setExtensionName}
              >
                {extensionNames.map((ext) => (
                  <Picker.Item key={ext} label={ext} value={ext} />
                ))}
              </Picker>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Student ID*"
            value={studentId}
            onChangeText={setStudentId}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address*"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={year}
              style={styles.picker}
              onValueChange={setYear}
            >
              <Picker.Item label="Select Year Level*" value="" />
              {yearLevels.map((lvl) => (
                <Picker.Item key={lvl} label={lvl} value={lvl} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={faculty}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setFaculty(itemValue);
                setProgram('');
              }}
            >
              <Picker.Item label="Select Faculty*" value="" />
              {Object.keys(faculties).map((fac) => (
                <Picker.Item key={fac} label={fac} value={fac} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={program}
              style={styles.picker}
              enabled={!!faculty}
              onValueChange={setProgram}
            >
              <Picker.Item label="Select Program*" value="" />
              {programOptions.map((prog) => (
                <Picker.Item key={prog} label={prog} value={prog} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register Student</Text>
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
  photoSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  photoButton: {
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ffe066',
    backgroundColor: '#fffbe7',
    padding: 6,
    elevation: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#bfa100',
  },
  profilePicPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#fffbe7',
    borderWidth: 2,
    borderColor: '#ffe066',
  },
  photoText: {
    color: '#bfa100',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
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
  infoText: {
    marginTop: 18,
    color: '#bfa100',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default RegisterStudent;