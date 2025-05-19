import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const InstructorDashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Instructor Dashboard</Text>
      </View>
      {/* Empty dashboard content */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.18,
    backgroundColor: '#7FB3D1',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#165973',
    letterSpacing: 2,
  },
});

export default InstructorDashboard;