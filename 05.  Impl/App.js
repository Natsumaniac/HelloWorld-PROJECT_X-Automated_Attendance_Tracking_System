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
import ManageInstructors from './frontend/src/screens/admin/ManageInstructors';
import ManageDevices from './frontend/src/screens/admin/ManageDevices';
import RegisterInstructor from './frontend/src/screens/admin/RegisterInstructor';
import AssignCourses from './frontend/src/screens/admin/AssignCourses';
import ManageStudents from './frontend/src/screens/admin/ManageStudents';
import ManageCourses from './frontend/src/screens/admin/ManageCourses';
import EditStudent from './frontend/src/components/EditStudent';
import InstructorDetails from './frontend/src/components/InstructorDetails';
import EditInstructor from './frontend/src/components/EditInstructor';
import EditCourse from './frontend/src/components/EditCourse';
import StudentDetails from './frontend/src/components/StudentDetails';
import CourseDetails from './frontend/src/components/CourseDetails';
import ForgotPassword from './frontend/src/screens/instructor/ForgotPassword';
import ForgotPasswordStudent from './frontend/src/screens/students/ForgotPasswordStudent';
import QRScanner from './frontend/src/screens/instructor/QRScanner';
import QRCodeGenerator from './frontend/src/screens/students/QRCodeGenerator';

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
          <Stack.Screen name="ManageInstructors" component={ManageInstructors} />
          <Stack.Screen name="ManageDevices" component={ManageDevices} />
          <Stack.Screen name="RegisterInstructor" component={RegisterInstructor} />
          <Stack.Screen name="AssignCourses" component={AssignCourses} />
          <Stack.Screen name="ManageStudents" component={ManageStudents} />
          <Stack.Screen name="ManageCourses" component={ManageCourses} />
          <Stack.Screen name="EditStudent" component={EditStudent} />
          <Stack.Screen name="StudentDetails" component={StudentDetails} />
          <Stack.Screen name="InstructorDetails" component={InstructorDetails} />
          <Stack.Screen name="EditInstructor" component={EditInstructor} />
          <Stack.Screen name="EditCourse" component={EditCourse} />
          <Stack.Screen name="CourseDetails" component={CourseDetails} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ForgotPasswordStudent" component={ForgotPasswordStudent} />
          <Stack.Screen name="InstructorQRScanner" component={QRScanner} />
          <Stack.Screen name="StudentQRCode" component={QRCodeGenerator} />

          {/* Add other screens here */}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
