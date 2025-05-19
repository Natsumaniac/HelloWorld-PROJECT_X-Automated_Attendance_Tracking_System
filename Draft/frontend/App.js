import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './src/screens/admin/Register';
import AssignCourses from './src/screens/admin/AssignCourses';
import EnrollStudents from './src/screens/admin/EnrollStudents';
import Manage from './src/screens/admin/Manage';

const Stack = createStackNavigator();

function AdminStack() {
  return (
    <Stack.Navigator>
      {/* ...other screens... */}
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="AssignCourses" component={AssignCourses} />
      <Stack.Screen name="EnrollStudents" component={EnrollStudents} />
      <Stack.Screen name="Manage" component={Manage} />
    </Stack.Navigator>
  );
}

export default AdminStack;