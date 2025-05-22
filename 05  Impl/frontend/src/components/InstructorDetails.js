import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InstructorDetails = ({ route, navigation }) => {
  const { instructor } = route.params;
  console.log('Instructor details:', instructor); 
  if (!instructor) return <Text style={{ textAlign: 'center', marginTop: 40 }}>No instructor data.</Text>;

  // Prefer fullName if present
  const name =
    instructor.fullName ||
    `${instructor.lastName || ''}, ${instructor.firstName || ''} ${instructor.middleInitial ? instructor.middleInitial + '.' : ''}${instructor.extensionName && instructor.extensionName !== 'N/A' ? ' ' + instructor.extensionName : ''}`.trim() ||
    'No Name';

  const instructorId = instructor.instructorId || instructor.idNumber || instructor._id || '';
  const device = instructor.deviceName || instructor.device || instructor.assignedDevice || 'None';

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#bfa100" />
        </TouchableOpacity>
        <Text style={styles.title}>Instructor Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{instructorId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{instructor.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Faculty:</Text>
          <Text style={styles.value}>{instructor.faculty}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Device:</Text>
          <Text style={styles.value}>{device}</Text>
        </View>
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

export default InstructorDetails;