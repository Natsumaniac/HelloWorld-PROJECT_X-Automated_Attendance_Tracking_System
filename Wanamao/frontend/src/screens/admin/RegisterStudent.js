import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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
  const [year, setYear] = useState('');
  const [faculty, setFaculty] = useState('');
  const [program, setProgram] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const programOptions = faculty ? faculties[faculty] : [];

  const handleRegister = () => {
    if (!firstName || !lastName || !studentId || !year || !faculty || !program) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    // Password is set as studentId by default
    // TODO: Send data to backend here, including password: studentId and profilePic
    Alert.alert('Success', 'Student registered!\nDefault password is their Student ID. On first login, they will be asked to set a new password.');
    navigation.goBack();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* BEE THEME HEADER */}
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
          <Text style={styles.headerTitle}>Register Student</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.form}>
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
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Middle Initial"
          value={middleInitial}
          onChangeText={setMiddleInitial}
          maxLength={2}
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Extension Name</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Student ID"
          value={studentId}
          onChangeText={setStudentId}
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
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register Student</Text>
        </TouchableOpacity>
        <Text style={styles.infoText}>
          Default password will be the Student ID. On first login, the student will be prompted to set a new password.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width, height } = require('react-native').Dimensions.get('window');

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
  infoText: {
    marginTop: 18,
    color: '#bfa100',
    fontSize: 14,
    textAlign: 'center',
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
});

export default RegisterStudent;