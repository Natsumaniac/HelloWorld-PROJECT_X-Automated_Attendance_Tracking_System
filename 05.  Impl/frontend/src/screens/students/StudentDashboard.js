import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import CustomAlert from '../../components/CustomAlert';
import TabBar from '../../components/TabBar';
import StatisticsChart from '../../components/StatisticsChart';
import Header from '../../components/Header';

const StudentDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const studentData = route.params?.studentData || {};
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'error'
  });

  const studentTabs = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'home-outline',
      activeIcon: 'home',
    },
    {
      key: 'courses',
      label: 'Courses',
      icon: 'book-outline',
      activeIcon: 'book',
    }
  ];

  const stats = [
    {
      icon: 'calendar-outline',
      value: '85%',
      label: 'Attendance Rate',
      backgroundColor: '#165973',
      onPress: () => console.log('Attendance pressed')
    },
    {
      icon: 'time-outline',
      value: '12',
      label: 'Classes Today',
      backgroundColor: '#1E88E5',
      onPress: () => console.log('Classes pressed')
    }
  ];

  const handleTabPress = (tabKey) => {
    if (tabKey === 'courses') {
      navigation.navigate('StudentCourses', { studentData });
    } else {
      setActiveTab(tabKey);
    }
  };

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

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_URL}/api/students/logout`, {
        studentId: studentData.idNumber
      });

      if (response.data.success) {
        // Clear AsyncStorage
        await AsyncStorage.multiRemove(['studentId', 'studentName', 'userType']);
        
        showAlert('Success', 'Logged out successfully', 'success');
        setTimeout(() => {
          navigation.replace('StudentLogin');
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Logout failed');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={`Hi, ${studentData.fullName || 'Student'}`}
        subtitle="Welcome to your dashboard"
        onLogout={isLoading ? null : handleLogout}
      />

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.statContainer}>
          <StatisticsChart stats={stats} />
        </View>
      </View>

      {/* TabBar */}
      <TabBar
        tabs={studentTabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

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
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

export default StudentDashboard; 