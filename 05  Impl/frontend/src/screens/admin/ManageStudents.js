import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';

const { width, height } = Dimensions.get('window');

const ManageStudents = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(students);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        students.filter(
          stu =>
            stu.firstName.toLowerCase().includes(s) ||
            stu.lastName.toLowerCase().includes(s) ||
            (stu.middleInitial && stu.middleInitial.toLowerCase().includes(s)) ||
            (stu.studentId && stu.studentId.toLowerCase().includes(s)) ||
            (stu.program && stu.program.toLowerCase().includes(s))
        )
      );
    }
  }, [search, students]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/students`, {
        headers: {
          'admin-id': 'admin123',
          'admin-password': 'pass123'
        }
      });
      setStudents(res.data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load students.');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Student', 'Are you sure you want to delete this student?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/students/${id}`, {
              headers: {
                'admin-id': 'admin123',
                'admin-password': 'pass123'
              }
            });
            fetchStudents();
            Alert.alert('Deleted', 'Student deleted.');
          } catch {
            Alert.alert('Error', 'Failed to delete student.');
          }
        },
      },
    ]);
  };

  const handleView = (student) => {
    navigation.navigate('StudentDetails', { student });
  };

  const handleEdit = (student) => {
    navigation.navigate('EditStudent', { student });
  };

  const renderStudent = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.lastName}, {item.firstName} {item.middleInitial && item.middleInitial + '.'}</Text>
        <Text style={styles.info}>ID: {item.studentId}</Text>
        <Text style={styles.info}>Program: {item.program}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleView(item)} style={styles.iconBtn}>
          <Ionicons name="eye" size={22} color="#bfa100" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconBtn}>
          <Ionicons name="create" size={22} color="#4e9b4e" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.iconBtn}>
          <Ionicons name="trash" size={22} color="#d7263d" />
        </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Manage Students</Text>
        </View>
      </View>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#bfa100" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, ID, program..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('RegisterStudent')}
        >
          <Ionicons name="person-add" size={22} color="#fffbe7" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: '#4e9b4e', marginLeft: 8 }]}
          onPress={fetchStudents}
        >
          <Ionicons name="refresh" size={22} color="#fffbe7" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={renderStudent}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#bfa100', marginTop: 40 }}>No students found.</Text>}
      />
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
});

export default ManageStudents;