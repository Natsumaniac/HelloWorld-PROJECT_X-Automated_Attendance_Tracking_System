import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../../components/CustomAlert';
import { ADMIN_CREDENTIALS } from '../../config/auth';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

const AdminLogin = () => {
  const navigation = useNavigation();
  const { loginAdmin } = useAuth();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      // Validate inputs
      if (!adminId || !password) {
        setAlert({
          visible: true,
          type: 'error',
          message: 'Please fill in all fields'
        });
        return;
      }

      setIsLoading(true);

      // Check admin credentials
      if (adminId === ADMIN_CREDENTIALS.ADMIN_ID && password === ADMIN_CREDENTIALS.ADMIN_PASSWORD) {
        // Set admin as logged in
        loginAdmin();
        
        setAlert({
          visible: true,
          type: 'success',
          message: 'Login successful!'
        });

        // Clear form
        setAdminId('');
        setPassword('');

        // Navigate to Dashboard after showing success message
        setTimeout(() => {
          navigation.navigate('Dashboard');
        }, 1000);
      } else {
        setAlert({
          visible: true,
          type: 'error',
          message: 'Invalid admin credentials'
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.background} onPress={Keyboard.dismiss} />
      
      {alert.visible && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Admin Login</Text>
          <Text style={styles.subtitle}>Please login with your admin credentials</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Admin ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your admin ID"
              value={adminId}
              onChangeText={setAdminId}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#999999"
                />
              </Pressable>
            </View>
          </View>

          <Pressable 
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          <Pressable 
            style={({pressed}) => [
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
              pressed && styles.loginButtonPressed
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#165973',
    borderBottomLeftRadius: width * 0.3,
    borderBottomRightRadius: width * 0.3,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: 30,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#165973',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#165973',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  loginButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
  loginButtonDisabled: {
    backgroundColor: '#165973aa', // Add transparency when disabled
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminLogin;