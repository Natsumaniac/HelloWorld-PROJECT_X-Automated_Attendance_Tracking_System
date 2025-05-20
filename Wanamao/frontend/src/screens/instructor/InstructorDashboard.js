import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrendChart from '../../components/TrendChart';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Custom TabBar styled like StudentDashboard
const InstructorTabBar = ({ tabs, activeTab, onTabPress }) => (
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

const InstructorDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalCourses: 0,
    activeClasses: 0,
    attendanceRate: 0,
  });
  const [trendData, setTrendData] = useState({
    labels: [],
    datasets: [
      {
        data: [0],
      },
    ],
  });

  // Dummy instructor data for header
  const instructorData = { fullName: 'Instructor Name' };

  useEffect(() => {
    fetchStatistics();
    fetchTrendData();
  }, []);

  const fetchStatistics = async () => {
    try {
      setStatistics({
        totalStudents: 150,
        totalCourses: 5,
        activeClasses: 3,
        attendanceRate: 85,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchTrendData = async () => {
    try {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date;
      }).reverse();

      const mockAttendanceData = [75, 82, 88, 85, 90, 87, 85];

      const labels = last7Days.map(date => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
      });

      setTrendData({
        labels,
        datasets: [
          {
            data: mockAttendanceData,
            color: (opacity = 1) => `rgba(191, 161, 0, ${opacity})`, // gold
            strokeWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching trend data:', error);
    }
  };

  const handleLogout = () => {
    navigation.replace('RoleSelection');
  };

  const instructorTabs = [
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ScrollView style={styles.dashboardContent}>
            <View style={styles.chartSection}>
              <TrendChart
                data={trendData}
                title="Attendance Rate (Last 7 Days)"
              />
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Ionicons name="people-outline" size={32} color="#bfa100" />
                  <Text style={styles.statValue}>{statistics.totalStudents}</Text>
                  <Text style={styles.statLabel}>Total Students</Text>
                </View>
                <View style={styles.statCard}>
                  <Ionicons name="book-outline" size={32} color="#bfa100" />
                  <Text style={styles.statValue}>{statistics.totalCourses}</Text>
                  <Text style={styles.statLabel}>Total Courses</Text>
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Ionicons name="school-outline" size={32} color="#bfa100" />
                  <Text style={styles.statValue}>{statistics.activeClasses}</Text>
                  <Text style={styles.statLabel}>Active Classes</Text>
                </View>
                <View style={styles.statCard}>
                  <Ionicons name="stats-chart" size={32} color="#bfa100" />
                  <Text style={styles.statValue}>{statistics.attendanceRate}%</Text>
                  <Text style={styles.statLabel}>Attendance Rate</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );
      case 'courses':
        return <InstructorCourses />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
          {/* Name & Welcome Center */}
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>{instructorData.fullName || 'Instructor'}</Text>
            <Text style={styles.headerSubtitle}>Welcome to your dashboard</Text>
          </View>
          {/* Logout Button Right */}
          <TouchableOpacity
            style={styles.logoutButtonNew}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#bfa100" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {renderContent()}
      </View>

      <InstructorTabBar
        tabs={instructorTabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
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
  content: {
    flex: 1,
  },
  dashboardContent: {
    flex: 1,
    padding: 16,
  },
  chartSection: {
    alignItems: 'flex-end',
    paddingRight: 0,
    marginBottom: 20,
    marginRight: -2,
  },
  statsContainer: {
    padding: 16,
    gap: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    minHeight: 120,
    alignItems: 'center',
    backgroundColor: '#fffbe7',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 7,
    borderWidth: 1,
    borderColor: '#ffe066',
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#bfa100',
    marginTop: 10,
    marginBottom: 5,
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

export default InstructorDashboard;