import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const StudentDashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Dashboard</Text>
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
    backgroundColor: '#ffe066',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22223b',
    letterSpacing: 2,
  },
});

export default StudentDashboard;