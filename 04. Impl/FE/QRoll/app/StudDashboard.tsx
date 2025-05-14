import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function StudentDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear session logic if needed
    router.push('/LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, Student 🎓</Text>
      <Text style={styles.subheader}>Here's your dashboard:</Text>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="eye-outline" size={30} color="#4e8cff" />
          <Text style={styles.cardText}>View Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="person-add-outline" size={30} color="#4e8cff" />
          <Text style={styles.cardText}>Join a Class</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="megaphone-outline" size={30} color="#4e8cff" />
          <Text style={styles.cardText}>View Announcements</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="calendar-outline" size={30} color="#4e8cff" />
          <Text style={styles.cardText}>Check Schedule</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f3',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
