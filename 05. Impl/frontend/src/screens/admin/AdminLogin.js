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
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../../components/CustomAlert';
import { ADMIN_CREDENTIALS } from '../../config/auth';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const AdminLogin = () => {
  const navigation = useNavigation();
  const { loginAdmin } = useAuth();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'error'
  });

  const showAlert = (title, message, type = 'error') => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  const handleLogin = async () => {
    if (!adminId.trim() || !password.trim()) {
      showAlert('Error', 'Please enter both Admin ID and Password', 'error');
      return;
    }

    try {
      setIsLoading(true);

      if (
        adminId === ADMIN_CREDENTIALS.ADMIN_ID &&
        password === ADMIN_CREDENTIALS.ADMIN_PASSWORD
      ) {
        loginAdmin();
        showAlert('Success', 'Login successful!', 'success');
        setTimeout(() => {
          navigation.navigate('Dashboard');
        }, 1200);
      } else {
        showAlert('Error', 'Invalid admin credentials', 'error');
      }
    } catch (error) {
      showAlert('Error', 'Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#fffbe7', '#ffe066', '#FFD700']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#22223b" />
        </TouchableOpacity>
        <Image
          source={require('../../assets/images/log.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>ScanBee</Text>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formWrapper}
      >
        <View style={styles.formCard}>
          <Text style={styles.loginTitle}>Admin Login</Text>
          <Text style={styles.loginSubtitle}>Welcome back! Please enter your credentials.</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Admin ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your admin ID"
              value={adminId}
              onChangeText={text => {
                setAlertConfig({ ...alertConfig, visible: false });
                setAdminId(text);
              }}
              keyboardType="default"
              autoCapitalize="none"
              editable={!isLoading}
              placeholderTextColor="#bfa100"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={text => {
                  setAlertConfig({ ...alertConfig, visible: false });
                  setPassword(text);
                }}
                secureTextEntry={!showPassword}
                editable={!isLoading}
                placeholderTextColor="#bfa100"
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#bfa100"
                />
              </Pressable>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButtonWrapper}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#fffbe7', '#ffe066', '#FFD700', '#fffbe7']}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.9, y: 0.9 }}
              style={styles.loginButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#22223b" />
              ) : (
                <Text style={styles.loginButtonText}>Login🐝</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbe7',
  },
  headerGradient: {
    width: '100%',
    height: height * 0.28,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    marginBottom: 10,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 24,
    zIndex: 2,
    backgroundColor: '#fffbe7cc',
    borderRadius: 20,
    padding: 6,
  },
  logo: {
    width: width * 0.22,
    height: width * 0.22,
    marginBottom: 8,
    marginTop: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 2,
    textShadowColor: '#fff8',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    marginTop: -height * 0.09,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22223b',
    marginBottom: 6,
    letterSpacing: 1,
  },
  loginSubtitle: {
    fontSize: 15,
    color: '#bfa100',
    marginBottom: 18,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    color: '#bfa100',
    marginBottom: 6,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffe066',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fffbe7',
    color: '#22223b',
  },
  eyeIcon: {
    padding: 10,
  },
  loginButtonWrapper: {
    borderRadius: 32,
    overflow: 'hidden',
    marginTop: 18,
    shadowColor: '#22223b',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  loginButton: {
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#bfa100',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#22223b',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: '#fff8',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffe066',
    borderRadius: 8,
    backgroundColor: '#fffbe7',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#22223b',
  },
});

export default AdminLogin;