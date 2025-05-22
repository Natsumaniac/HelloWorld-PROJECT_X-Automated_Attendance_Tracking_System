import React, { useState } from 'react';
import { View, Text, StyleSheet, /* other imports */ } from 'react-native';

const EditInstructor = ({ route, navigation }) => {
  const { instructor } = route.params;

  // ...your state and logic...

  return (
    <View style={styles.container}>
      {/* Show instructor name at the top */}
      <Text style={styles.name}>
        {instructor.fullName ||
          `${instructor.lastName || ''}, ${instructor.firstName || ''} ${instructor.middleInitial ? instructor.middleInitial + '.' : ''}${instructor.extensionName && instructor.extensionName !== 'N/A' ? ' ' + instructor.extensionName : ''}`.trim() ||
          'No Name'}
      </Text>
      {/* ...rest of your form fields... */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffbe7', padding: 20 },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#bfa100',
    marginBottom: 18,
    textAlign: 'center',
  },
  // ...other styles...
});

export default EditInstructor;