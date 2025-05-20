import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../config';
import CustomAlert from '../../components/CustomAlert';

const { width, height } = Dimensions.get('window');

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
      backgroundColor: '#fffbe7',
      color: '#bfa100',
    },
    {
      icon: 'time-outline',
      value: '12',
      label: 'Classes Today',
      backgroundColor: '#fffbe7',
      color: '#bfa100',
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
        await AsyncStorage.multiRemove(['studentId', 'studentName', 'userType']);
        showAlert('Success', 'Logged out successfully', 'success');
        setTimeout(() => {
          navigation.replace('StudentLogin');
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Logout failed');
      }
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to logout');
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
        <View style={styles.headerRow}>
          {/* Logo Left */}
          <Image
            source={require('../../assets/images/log.png')}
            style={styles.logoNew}
            resizeMode="contain"
          />
          {/* Username & Welcome Center */}
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>{studentData.fullName || 'Student'}</Text>
            <Text style={styles.headerSubtitle}>Welcome to your dashboard</Text>
          </View>
          {/* Logout Button Right */}
          <TouchableOpacity
            style={styles.logoutButtonNew}
            onPress={isLoading ? null : handleLogout}
            disabled={isLoading}
          >
            <Ionicons name="log-out-outline" size={24} color="#bfa100" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsRow}>
          {stats.map((stat, idx) => (
            <View key={idx} style={[styles.statCard, { backgroundColor: stat.backgroundColor }]}>
              <Ionicons name={stat.icon} size={32} color={stat.color} style={{ marginBottom: 8 }} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Use the custom TabBar here */}
      <StudentTabBar
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

// Custom TabBar styled like RoleSelection
const StudentTabBar = ({ tabs, activeTab, onTabPress }) => (
  <View style={styles.tabBarContainer}>
    {tabs.map(tab => (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.tabCard,
          activeTab === tab.key && styles.tabCardActive
        ]}
        activeOpacity={0.85}
        onPress={() => onTabPress(tab.key)}
      >
        <Ionicons
          name={activeTab === tab.key ? tab.activeIcon : tab.icon}
          size={24}
          color={activeTab === tab.key ? '#bfa100' : '#22223b'}
          style={styles.tabIcon}
        />
        <Text style={[
          styles.tabLabel,
          activeTab === tab.key && styles.tabLabelActive
        ]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

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
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  headerTextBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoNew: {
    width: width * 0.16,
    height: width * 0.16,
    marginLeft: 10,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 18,
  },
  logo: {
    width: width * 0.18,
    height: width * 0.18,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 1,
    textShadowColor: '#fff8',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#bfa100',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  logoutButton: {
    position: 'absolute',
    top: 44,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbe7cc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonNew: {
    backgroundColor: '#fffbe7cc',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutText: {
    color: '#bfa100',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#bfa100',
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: '#fffbe7',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 7,
    borderWidth: 1,
    borderColor: '#ffe066',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 15,
    color: '#22223b',
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  tabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginHorizontal: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ffe066',
  },
  tabCardActive: {
    backgroundColor: '#fffbe7',
    borderColor: '#bfa100',
    shadowOpacity: 0.22,
    elevation: 8,
  },
  tabIcon: {
    marginRight: 10,
  },
  tabLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 1,
  },
  tabLabelActive: {
    color: '#bfa100',
  },
});

export default StudentDashboard;