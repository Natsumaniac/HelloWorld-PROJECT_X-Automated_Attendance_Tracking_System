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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';

const { width, height } = Dimensions.get('window');

const ManageCourses = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(courses);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        courses.filter(
          course =>
            course.courseCode.toLowerCase().includes(s) ||
            course.courseTitle.toLowerCase().includes(s) ||
            (course.section && course.section.toLowerCase().includes(s)) ||
            (course.program && course.program.toLowerCase().includes(s))
        )
      );
    }
  }, [search, courses]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses`, {
        headers: {
          'admin-id': 'admin123',
          'admin-password': 'pass123'
        }
      });
      setCourses(res.data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load courses.');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Course', 'Are you sure you want to delete this course?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/courses/delete/${id}`, {
              headers: {
                'admin-id': 'admin123',
                'admin-password': 'pass123'
              }
            });
            fetchCourses();
            Alert.alert('Deleted', 'Course deleted.');
          } catch (err) {
            Alert.alert('Error', 'Failed to delete course.');
          }
        },
      },
    ]);
  };

  const handleEdit = (course) => {
    navigation.navigate('EditCourse', { course });
  };

  const handleAssignInstructor = (course) => {
    navigation.navigate('AssignCourses', { course });
  };

  const handleEnrollStudents = (course) => {
    navigation.navigate('EnrollStud', { course });
  };

  const handleView = (course) => {
    navigation.navigate('CourseDetails', { course });
  };

  const renderCourse = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.courseCode} - {item.courseTitle}</Text>
        <Text style={styles.info}>Section: {item.section}</Text>
        <Text style={styles.info}>Program: {item.program}</Text>
        <Text style={styles.info}>Year: {item.year}</Text>
        <Text style={styles.info}>Faculty: {item.faculty}</Text>
        <Text style={styles.info}>Instructor: {item.instructorName || 'Unassigned'}</Text>
        <Text style={styles.info}>Schedule: {Array.isArray(item.schedule) ? item.schedule.join('\n') : item.schedule}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleView(item)} style={styles.iconBtn}>
          <Ionicons name="eye" size={22} color="#22223b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconBtn}>
          <Ionicons name="create" size={22} color="#4e9b4e" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAssignInstructor(item)} style={styles.iconBtn}>
          <Ionicons name="person" size={22} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEnrollStudents(item)} style={styles.iconBtn}>
          <Ionicons name="people" size={22} color="#bfa100" />
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
          <Text style={styles.headerTitle}>Manage Courses</Text>
        </View>
      </View>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#bfa100" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by code, title, section, program..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('RegisterCourse')}
        >
          <Ionicons name="add-circle" size={22} color="#fffbe7" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: '#4e9b4e' }]}
          onPress={fetchCourses}
        >
          <Ionicons name="refresh" size={22} color="#fffbe7" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={renderCourse}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#bfa100', marginTop: 40 }}>No courses found.</Text>}
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

export default ManageCourses;