import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const StudentDetails = ({ route, navigation }) => {
  const { student } = route.params;
  if (!student) return <Text style={{ textAlign: 'center', marginTop: 40 }}>No student data.</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#bfa100" />
        </TouchableOpacity>
        <Text style={styles.title}>Student Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{student.fullName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Student ID:</Text>
          <Text style={styles.value}>{student.studentId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{student.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Faculty:</Text>
          <Text style={styles.value}>{student.faculty}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Program:</Text>
          <Text style={styles.value}>{student.program}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Year Level:</Text>
          <Text style={styles.value}>{student.year}</Text>
        </View>
        {/* Add more fields as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbe7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 10,
    elevation: 6,
    marginVertical: 30,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: '#fffbe7cc',
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#bfa100',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#22223b',
    width: 110,
    fontSize: 15,
  },
  value: {
    fontWeight: 'normal',
    color: '#444',
    fontSize: 15,
    flexShrink: 1,
  },
});

export default StudentDetails;