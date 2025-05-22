import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image, Pressable } from 'react-native';
import { API_URL } from '../../config';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordStudent = ({ navigation }) => {
  const [studentId, setStudentId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    if (!studentId.trim() || !oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/api/students/reset-password`, {
        studentId: studentId.trim(),
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim()
      });
      Alert.alert('Success', res.data.message || 'Password updated! Please log in.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/log.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Student ID"
        value={studentId}
        onChangeText={setStudentId}
        autoCapitalize="none"
      />
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={!showOld}
        />
        <Pressable style={styles.eyeIcon} onPress={() => setShowOld(!showOld)}>
          <Ionicons name={showOld ? 'eye-off' : 'eye'} size={22} color="#bfa100" />
        </Pressable>
      </View>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNew}
        />
        <Pressable style={styles.eyeIcon} onPress={() => setShowNew(!showNew)}>
          <Ionicons name={showNew ? 'eye-off' : 'eye'} size={22} color="#bfa100" />
        </Pressable>
      </View>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
        />
        <Pressable style={styles.eyeIcon} onPress={() => setShowConfirm(!showConfirm)}>
          <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={22} color="#bfa100" />
        </Pressable>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Updating...' : 'Reset Password'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
        <Text style={{ color: '#bfa100', textAlign: 'center' }}>Back to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fffbe7' },
  logo: { width: 90, height: 90, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#bfa100' },
  input: { width: '80%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ffe066', padding: 12, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#bfa100', borderRadius: 8, padding: 14, alignItems: 'center', width: '80%', marginTop: 10 },
  buttonText: { color: '#fffbe7', fontWeight: 'bold', fontSize: 16 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', width: '80%', marginBottom: 16 },
  eyeIcon: { marginLeft: -36, padding: 8 }
});

export default ForgotPasswordStudent;