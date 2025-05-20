import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';

const { width, height } = Dimensions.get('window');

const ManageInstructors = () => {
  const navigation = useNavigation();
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await axios.get(`${API_URL}/instructors`);
      setInstructors(res.data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load instructors.');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this instructor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              await axios.delete(`${API_URL}/instructors/${id}`);
              fetchInstructors();
              Alert.alert('Deleted', 'Instructor removed.');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete instructor.');
            }
          }
        }
      ]
    );
  };

  const filtered = instructors.filter(
    inst =>
      inst.firstName.toLowerCase().includes(search.toLowerCase()) ||
      inst.lastName.toLowerCase().includes(search.toLowerCase()) ||
      inst.idNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#bfa100" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Instructors</Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#bfa100" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ID"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.length === 0 && (
          <Text style={{ color: '#bfa100', textAlign: 'center', marginTop: 30 }}>No instructors found.</Text>
        )}
        {filtered.map(inst => (
          <View key={inst._id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{inst.lastName}, {inst.firstName} {inst.middleInitial ? inst.middleInitial + '.' : ''} {inst.extensionName && inst.extensionName !== 'N/A' ? inst.extensionName : ''}</Text>
              <Text style={styles.info}>ID: {inst.idNumber}</Text>
              <Text style={styles.info}>Faculty: {inst.faculty}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => {/* TODO: Edit logic */}}>
                <Ionicons name="create-outline" size={22} color="#165973" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(inst._id)}>
                <Ionicons name="trash-outline" size={22} color="#bfa100" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ffe066',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#22223b',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#fffbe7',
  },
});

export default ManageInstructors;