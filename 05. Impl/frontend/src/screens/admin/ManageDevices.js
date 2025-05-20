import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../../config/api';

const { width, height } = Dimensions.get('window');

const ManageDevices = () => {
  const navigation = useNavigation();
  const [devices, setDevices] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState('');

  useEffect(() => {
    fetchDevices();
    fetchInstructors();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axios.get(`${API_URL}/devices`);
      setDevices(res.data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load devices.');
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await axios.get(`${API_URL}/instructors`);
      setInstructors(res.data || []);
    } catch (err) {
      setInstructors([]);
    }
  };

  const handleAssign = async () => {
    if (!selectedInstructor) {
      Alert.alert('Error', 'Please select an instructor.');
      return;
    }
    try {
      await axios.post(`${API_URL}/devices/assign`, {
        deviceId: selectedDevice._id,
        instructorId: selectedInstructor,
      });
      setAssignModal(false);
      setSelectedDevice(null);
      setSelectedInstructor('');
      fetchDevices();
      Alert.alert('Success', 'Device assigned.');
    } catch (err) {
      Alert.alert('Error', 'Failed to assign device.');
    }
  };

  const handleUnassign = async (deviceId) => {
    try {
      await axios.post(`${API_URL}/devices/unassign`, { deviceId });
      fetchDevices();
      Alert.alert('Success', 'Device unassigned.');
    } catch (err) {
      Alert.alert('Error', 'Failed to unassign device.');
    }
  };

  const handleUnregister = async (deviceId) => {
    Alert.alert(
      'Unregister Device',
      'Are you sure you want to unregister this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unregister', style: 'destructive', onPress: async () => {
            try {
              await axios.delete(`${API_URL}/devices/${deviceId}`);
              fetchDevices();
              Alert.alert('Device unregistered.');
            } catch (err) {
              Alert.alert('Error', 'Failed to unregister device.');
            }
          }
        }
      ]
    );
  };

  const handleLocate = (device) => {
    // Simulate locate (replace with real logic if available)
    Alert.alert('Locate Device', `Last known location: ${device.lastLocation || 'Unknown'}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#bfa100" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Devices</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {devices.length === 0 && (
          <Text style={{ color: '#bfa100', textAlign: 'center', marginTop: 30 }}>No devices registered.</Text>
        )}
        {devices.map(device => (
          <View key={device._id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{device.deviceName || 'Unnamed Device'}</Text>
              <Text style={styles.info}>ID: {device.deviceId || device._id}</Text>
              <Text style={styles.info}>Assigned To: {device.instructor ? `${device.instructor.lastName}, ${device.instructor.firstName}` : 'Unassigned'}</Text>
              <Text style={styles.info}>Status: {device.status || 'Active'}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  setSelectedDevice(device);
                  setAssignModal(true);
                }}
              >
                <Ionicons name="person-add-outline" size={22} color="#165973" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleUnassign(device._id)}>
                <Ionicons name="remove-circle-outline" size={22} color="#bfa100" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleLocate(device)}>
                <Ionicons name="locate-outline" size={22} color="#bfa100" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleUnregister(device._id)}>
                <Ionicons name="trash-outline" size={22} color="#bfa100" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Assign Modal */}
      <Modal visible={assignModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Device</Text>
            <Picker
              selectedValue={selectedInstructor}
              style={styles.picker}
              onValueChange={setSelectedInstructor}
            >
              <Picker.Item label="Select Instructor" value="" />
              {instructors.map(inst => (
                <Picker.Item
                  key={inst._id}
                  label={`${inst.lastName}, ${inst.firstName} (${inst.idNumber})`}
                  value={inst._id}
                />
              ))}
            </Picker>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 }}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setAssignModal(false)}>
                <Text style={{ color: '#bfa100', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { marginLeft: 12 }]} onPress={handleAssign}>
                <Text style={{ color: '#165973', fontWeight: 'bold' }}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffbe7' },
  headerGradient: {
    width: '100%',
    height: height * 0.10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    backgroundColor: '#ffe066',
    position: 'relative',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 10,
    backgroundColor: '#fffbe7cc',
    borderRadius: 20,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 2,
    textAlign: 'center',
    flex: 1,
    marginLeft: 10,
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffe066',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#bfa100',
    marginBottom: 2,
  },
  info: {
    color: '#165973',
    fontSize: 14,
    marginBottom: 1,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 12,
    gap: 6,
  },
  actionBtn: {
    marginVertical: 2,
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#fffbe7',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#0006',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#bfa100',
    marginBottom: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe066',
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#fffbe7',
    borderWidth: 1,
    borderColor: '#ffe066',
  },
});

export default ManageDevices;