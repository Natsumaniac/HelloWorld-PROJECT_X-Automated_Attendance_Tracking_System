import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './frontend/src/screens/students/Welcome';
import StudentLogin from './frontend/src/screens/students/StudentLogin';
import AdminLogin from './frontend/src/screens/admin/AdminLogin';
import Dashboard from './frontend/src/screens/admin/Dashboard';
import RoleSelection from './frontend/src/screens/students/RoleSelection';
import StudentDashboard from './frontend/src/screens/students/StudentDashboard';
import InstructorDashboard from './frontend/src/screens/instructor/InstructorDashboard';
import InstructorLogin from './frontend/src/screens/instructor/InstructorLogin';
import { AuthProvider } from './frontend/src/context/AuthContext';
import RegisterStudent from './frontend/src/screens/admin/RegisterStudent';
import RegisterCourse from './frontend/src/screens/admin/RegisterCourse';
import EnrollStud from './frontend/src/screens/admin/EnrollStud';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="StudentLogin" component={StudentLogin} />
          <Stack.Screen name="AdminLogin" component={AdminLogin} />
          <Stack.Screen name="InstructorLogin" component={InstructorLogin} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="RoleSelection" component={RoleSelection} />
          <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
          <Stack.Screen name="InstructorDashboard" component={InstructorDashboard} />
          <Stack.Screen name="RegisterStudent" component={RegisterStudent} />
          <Stack.Screen name="RegisterCourse" component={RegisterCourse} />
          <Stack.Screen name="EnrollStud" component={EnrollStud} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
