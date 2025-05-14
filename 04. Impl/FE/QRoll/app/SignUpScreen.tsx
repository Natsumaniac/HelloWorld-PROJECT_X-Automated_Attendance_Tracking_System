import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const facultyPrograms = {
  'FaCET': ['BSIT', 'BSCE', 'BSMRS', 'BITM'],
  'FALS': ['BSAM', 'BSBIO', 'BSEnviSci', 'BSEE', 'BSEF'],
  'FTEd': ['BSM', 'BEE', 'BECE', 'BSNEd', 'BPE', 'BTLE', 'BSEE', 'BSEF', 'BSEM', 'BSES'],
  'FNAHS': ['BSN'],
  'FCJE': ['BSC'],
  'FBM': ['BSBA', 'BSHM'],
  'FHuSoCom': ['DevCom', 'BSA', 'BSCrim', 'BSHRM'],
};

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [role, setRole] = useState('Student');
  const [id, setId] = useState('');
  const [faculty, setFaculty] = useState('');
  const [program, setProgram] = useState('');
  const router = useRouter();
  const { width } = useWindowDimensions();

  const handleSignUp = async () => {
    const idFormat = /^\d{4}-\d{4}$/;

    if (!fullName || !email || !password || !confirmPassword || !id ||
        (role === 'Student' && (!faculty || !program)) ||
        (role === 'Instructor' && !faculty)) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    if (!idFormat.test(id)) {
      Alert.alert('Invalid ID Format', 'Student/Employee ID must be in the format ####-#### (e.g., 2021-3471).');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
          studentOrEmployeeId: id,
          program: role === 'Student' ? program : undefined,
          faculty,
        }),
      });

      if (response.status === 201) {
        Alert.alert('Success', `Welcome, ${fullName}!`);
        router.push('/LoginScreen');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
    }
  };

  const programs = facultyPrograms[faculty as keyof typeof facultyPrograms] || [];

  return (
    <KeyboardAvoidingView style={styles.outer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.container, width > 768 && styles.containerWeb]}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} style={styles.input} />
        <TextInput placeholder="Email Address" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />

        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={showPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={showConfirmPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Role</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(value) => {
              setRole(value);
              setFaculty('');
              setProgram('');
            }}
            style={styles.picker}
          >
            <Picker.Item label="Student" value="Student" />
            <Picker.Item label="Instructor" value="Instructor" />
          </Picker>
        </View>

        <TextInput
          placeholder="Student/Employee ID (e.g., 2021-3471)"
          value={id}
          onChangeText={(text) => {
            let cleaned = text.replace(/\D/g, '');
            if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
            let formatted = cleaned;
            if (cleaned.length > 4) {
              formatted = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
            }
            setId(formatted);
          }}
          style={styles.input}
          keyboardType="numeric"
        />

        {role === 'Student' && (
          <>
            <Text style={styles.label}>Faculty</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={faculty}
                onValueChange={(value) => {
                  setFaculty(value);
                  setProgram('');
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select Faculty" value="" />
                {Object.keys(facultyPrograms).map((fac) => (
                  <Picker.Item key={fac} label={fac} value={fac} />
                ))}
              </Picker>
            </View>

            {faculty !== '' && (
              <>
                <Text style={styles.label}>Program</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={program}
                    onValueChange={setProgram}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Program" value="" />
                    {programs.map((prog) => (
                      <Picker.Item key={prog} label={prog} value={prog} />
                    ))}
                  </Picker>
                </View>
              </>
            )}
          </>
        )}

        {role === 'Instructor' && (
          <>
            <Text style={styles.label}>Faculty</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={faculty}
                onValueChange={setFaculty}
                style={styles.picker}
              >
                <Picker.Item label="Select Faculty" value="" />
                {Object.keys(facultyPrograms).map((fac) => (
                  <Picker.Item key={fac} label={fac} value={fac} />
                ))}
              </Picker>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/LoginScreen')}>
          <Text style={styles.linkText}>Already have an account? Go to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#eef2f3',
  },
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  containerWeb: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 25,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 8,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 6,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#4e8cff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#4e8cff',
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
