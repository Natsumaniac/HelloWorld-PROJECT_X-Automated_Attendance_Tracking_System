import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const roles = [
  {
    key: 'admin',
    label: 'Admin',
    icon: <Ionicons name="settings" size={32} color="#bfa100" />,
    screen: 'AdminLogin',
  },
  {
    key: 'instructor',
    label: 'Instructor',
    icon: <MaterialCommunityIcons name="teach" size={32} color="#bfa100" />,
    screen: 'InstructorLogin',
  },
  {
    key: 'student',
    label: 'Student',
    icon: <Ionicons name="school" size={32} color="#bfa100" />,
    screen: 'StudentLogin',
  },
];

const RoleSelection = () => {
  const navigation = useNavigation();

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

      <View style={styles.cardList}>
        <Text style={styles.selectTitle}>Select Your Role</Text>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.key}
            style={styles.roleCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(role.screen)}
          >
            <View style={styles.iconWrapper}>{role.icon}</View>
            <Text style={styles.roleLabel}>{role.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  cardList: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  selectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#bfa100',
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: 'center',
  },
  roleCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 22,
    marginBottom: 18,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 7,
    borderWidth: 1,
    borderColor: '#ffe066',
    paddingHorizontal: 24,
  },
  iconWrapper: {
    marginRight: 18,
    backgroundColor: '#fffbe7',
    borderRadius: 16,
    padding: 10,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 1,
  },
});

export default RoleSelection;