import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { Picker } from '@react-native-picker/picker'; // If not installed: npm install @react-native-picker/picker

const { width, height } = Dimensions.get('window');

const ManageDevices = () => {
  const navigation = useNavigation();
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDevice, setNewDevice] = useState({
    deviceName: '',
    deviceId: '',
    deviceType: 'Mobile',
  });

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(devices);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        devices.filter(
          dev =>
            dev.deviceName.toLowerCase().includes(s) ||
            (dev.deviceId && dev.deviceId.toLowerCase().includes(s)) ||
            (dev.status && dev.status.toLowerCase().includes(s)) ||
            (dev.assignedTo && dev.assignedTo.toLowerCase().includes(s))
        )
      );
    }
  }, [search, devices]);

  const fetchDevices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/devices`);
      setDevices(res.data || []);
    } catch (err) {
      console.log('Device fetch error:', err);
      Alert.alert('Error', 'Failed to load devices.');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Device', 'Are you sure you want to delete this device record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/devices/${id}`);
            fetchDevices();
            Alert.alert('Deleted', 'Device record deleted.');
          } catch {
            Alert.alert('Error', 'Failed to delete device.');
          }
        },
      },
    ]);
  };

  const handleAssign = (device) => {
    navigation.navigate('RegisterInstructor', { device });
  };

  const handleUnassign = async (device) => {
    try {
      await axios.post(`${API_URL}/api/devices/unassign`, { deviceId: device._id });
      fetchDevices();
      Alert.alert('Success', 'Device unassigned.');
    } catch {
      Alert.alert('Error', 'Failed to unassign device.');
    }
  };

  const handleMarkLost = async (device) => {
    try {
      await axios.post(`${API_URL}/api/devices/mark-lost`, { deviceId: device._id });
      fetchDevices();
      Alert.alert('Marked as Lost', 'Device marked as lost.');
    } catch {
      Alert.alert('Error', 'Failed to mark device as lost.');
    }
  };

  const handleAddDevice = async () => {
    if (!newDevice.deviceName || !newDevice.deviceId || !newDevice.deviceType) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    try {
      await axios.post(`${API_URL}/api/devices`, {
        deviceName: newDevice.deviceName,
        deviceId: newDevice.deviceId,
        deviceType: newDevice.deviceType,
        status: 'available',
        assignedTo: ''
      });
      setShowModal(false);
      setNewDevice({ deviceName: '', deviceId: '', deviceType: 'Mobile' });
      fetchDevices();
      Alert.alert('Success', 'Device added!');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to add device.');
    }
  };

  const renderDevice = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.deviceName}</Text>
        <Text style={styles.info}>ID: {item.deviceId}</Text>
        <Text style={styles.info}>Type: {item.deviceType}</Text>
        <Text style={styles.info}>Status: {item.status}</Text>
        <Text style={styles.info}>
          Assigned To: {item.assignedToName
            ? `${item.assignedToName} (${item.assignedTo})`
            : (item.assignedTo ? item.assignedTo : 'Not Assigned')}
        </Text>
      </View>
      <View style={styles.actions}>
        {item.status === 'available' && (
          <TouchableOpacity onPress={() => handleAssign(item)} style={styles.iconBtn}>
            <Ionicons name="person-add" size={22} color="#3b82f6" />
          </TouchableOpacity>
        )}
        {item.status === 'assigned' && (
          <TouchableOpacity onPress={() => handleUnassign(item)} style={styles.iconBtn}>
            <Ionicons name="remove-circle" size={22} color="#bfa100" />
          </TouchableOpacity>
        )}
        {item.status !== 'lost' && (
          <TouchableOpacity onPress={() => handleMarkLost(item)} style={styles.iconBtn}>
            <Ionicons name="alert-circle" size={22} color="#d7263d" />
          </TouchableOpacity>
        )}
        {(!item.assignedTo || item.status === 'available') && (
          <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.iconBtn}>
            <Ionicons name="trash" size={22} color="#d7263d" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#bfa100" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, ID, status..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="add-circle" size={22} color="#fffbe7" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={renderDevice}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#bfa100', marginTop: 40 }}>No devices found.</Text>}
      />
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: '#00000099',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            width: '85%',
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            alignItems: 'stretch',
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#bfa100', marginBottom: 16, textAlign: 'center' }}>Add New Device</Text>
            <TextInput
              style={styles.input}
              placeholder="Device Name"
              value={newDevice.deviceName}
              onChangeText={text => setNewDevice({ ...newDevice, deviceName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Device ID"
              value={newDevice.deviceId}
              onChangeText={text => setNewDevice({ ...newDevice, deviceId: text })}
            />
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: '#bfa100', marginBottom: 4 }}>Device Type</Text>
              <Picker
                selectedValue={newDevice.deviceType}
                style={{ height: 40, width: '100%' }}
                onValueChange={itemValue => setNewDevice({ ...newDevice, deviceType: itemValue })}
              >
                <Picker.Item label="Mobile" value="Mobile" />
                <Picker.Item label="Computer" value="Computer" />
              </Picker>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={[styles.modalBtn, { backgroundColor: '#ccc' }]}>
                <Text style={{ color: '#22223b' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddDevice} style={[styles.modalBtn, { backgroundColor: '#bfa100', marginLeft: 8 }]}>
                <Text style={{ color: '#fffbe7' }}>Add</Text>
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
    height: height * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    backgroundColor: '#ffe066',
    marginBottom: 10,
    position: 'relative',
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ffe066',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#22223b',
    paddingVertical: 6,
  },
  addBtn: {
    backgroundColor: '#bfa100',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffe066',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#22223b',
    marginBottom: 2,
  },
  info: {
    color: '#bfa100',
    fontSize: 13,
    marginBottom: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconBtn: {
    marginLeft: 8,
    padding: 4,
  },
  input: {
    backgroundColor: '#fffbe7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe066',
    padding: 12,
    fontSize: 15,
    color: '#22223b',
    marginBottom: 12,
  },
  modalBtn: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ManageDevices;