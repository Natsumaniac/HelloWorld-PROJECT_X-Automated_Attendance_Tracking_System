import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, endpoints } from '../../config/api';

const { width } = Dimensions.get('window');

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { courseCode, courseId } = route.params || {};

  // Function to record attendance in the backend
  const recordAttendance = async (studentId, courseCode, sessionId = null, expiresAt = null, isManualCode = false) => {
    try {
      setLoading(true);
      
      const requestBody = {
        studentId,
        courseCode,
        status: 'Present',
        isManualCode
      };
      
      // Add sessionId to request if available
      if (sessionId) {
        requestBody.sessionId = sessionId;
      }
      
      // Add uniqueCode if available in the scanned data
      if (sessionId?.uniqueCode) {
        requestBody.uniqueCode = sessionId.uniqueCode;
      }
      
      // Add expiration time if available
      if (expiresAt) {
        requestBody.expiresAt = expiresAt;
      }
      
      console.log("Sending attendance data:", requestBody);
      
      // Always use the new session-based endpoint
      const response = await fetch(`${API_URL}${endpoints.sessionRecord}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      let data = await response.json();
      console.log("Session attendance response:", data);
      
      if (response.ok && (data.success || !data.hasOwnProperty('success'))) {
        return {
          success: true,
          message: data.message || 'Attendance recorded successfully!',
          timeRecorded: data.student?.timeRecorded || null
        };
      } else {
        // Only if the session endpoint completely fails, try the legacy endpoint as fallback
        console.log("Falling back to legacy attendance system");
        
        const legacyResponse = await fetch(`${API_URL}${endpoints.attendanceRecord}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId,
            courseCode,
            status: 'Present'
          })
        });
        
        const legacyData = await legacyResponse.json();
        console.log("Legacy attendance response:", legacyData);
        
        if (legacyResponse.ok) {
          return {
            success: true,
            message: legacyData.message || 'Attendance recorded successfully (legacy)!'
          };
        }
        
        return {
          success: false,
          message: data.message || 'Failed to record attendance'
        };
      }
    } catch (error) {
      console.error('Error recording attendance:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = async (scanningResult) => {
    if (scanned || loading) return;

    try {
      const { data } = scanningResult;
      setScanned(true);

      let studentId = null;
      let parsedData = null;

      // Try to parse as JSON first (for session QR, which we do NOT want here)
      try {
        parsedData = JSON.parse(data);
        // If it's JSON, it's not a student QR code
        Alert.alert(
          'Invalid QR Code',
          'Please scan a student QR code (not a session QR code).',
          [
            { text: 'Scan Again', onPress: () => setScanned(false) },
            { text: 'Go Back', onPress: () => navigation.goBack(), style: 'cancel' }
          ]
        );
        return;
      } catch (e) {
        // Not JSON, treat as student ID
        studentId = data;
      }

      // Validate studentId (basic check)
      if (!studentId || studentId.length < 3) {
        Alert.alert(
          'Invalid QR Code',
          'This QR code does not contain a valid student ID.',
          [
            { text: 'Scan Again', onPress: () => setScanned(false) },
            { text: 'Go Back', onPress: () => navigation.goBack(), style: 'cancel' }
          ]
        );
        return;
      }

      // (Optional) Fetch student info from backend
      let studentInfo = null;
      try {
        const res = await fetch(`${API_URL}/api/students/${studentId}`);
        if (res.ok) {
          studentInfo = await res.json();
        }
      } catch (err) {
        // Ignore error, just don't show student info
      }

      // Record attendance for this student
      const attendanceResult = await recordAttendance(
        studentId,
        courseCode,
        null, // sessionId not needed for instructor scan
        null,
        false
      );

      if (attendanceResult.success) {
        setStudentInfo({
          schoolId: studentId,
          fullName: studentInfo && studentInfo.fullName ? studentInfo.fullName : '',
          courseCode: courseCode || '',
          courseTitle: studentInfo && studentInfo.course ? studentInfo.course : '', // Adjust if you want to fetch real course title
          status: 'PRESENT'
        });
        setShowInfoModal(true);
      } else {
        Alert.alert(
          'Error',
          attendanceResult.message,
          [
            { text: 'Try Again', onPress: () => setScanned(false) },
            { text: 'Go Back', onPress: () => navigation.goBack(), style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      setScanned(false);
      Alert.alert('Error', 'Could not process QR code. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Show loading indicator while checking permissions
  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>QR Scanner</Text>
        </View>
        <View style={styles.contentContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.messageText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  // If permission is not granted, show permission request
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Camera Permission Required</Text>
        </View>
        <View style={styles.contentContainer}>
          <Ionicons name="camera-off" size={80} color="#FF6B6B" />
          <Text style={styles.messageText}>
            Camera permission is required to scan QR codes
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera view for scanning QR codes
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>
              Scan QR Code for {courseCode || 'Course'}
            </Text>
          </View>
          
          <View style={styles.scanFrameContainer}>
            <View style={styles.scanFrame}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
            
            {scanned && (
              <TouchableOpacity
                style={styles.scanAgainButton}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.scanAgainButtonText}>Tap to Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Position QR code within the frame
            </Text>
          </View>
        </View>
      </CameraView>

      {/* Student Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fffbe7',
            borderRadius: 16,
            padding: 28,
            width: '85%',
            alignItems: 'center'
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#bfa100', marginBottom: 12 }}>
              Attendance Recorded
            </Text>
            {studentInfo && (
              <>
                <Text style={{ fontSize: 16, color: '#165973', marginBottom: 4 }}>
                  School ID: <Text style={{ fontWeight: 'bold' }}>{studentInfo.schoolId}</Text>
                </Text>
                <Text style={{ fontSize: 16, color: '#165973', marginBottom: 4 }}>
                  Name: <Text style={{ fontWeight: 'bold' }}>{studentInfo.fullName}</Text>
                </Text>
                <Text style={{ fontSize: 16, color: '#165973', marginBottom: 4 }}>
                  Course Code: <Text style={{ fontWeight: 'bold' }}>{studentInfo.courseCode}</Text>
                </Text>
                <Text style={{ fontSize: 16, color: '#165973', marginBottom: 4 }}>
                  Course Title: <Text style={{ fontWeight: 'bold' }}>{studentInfo.courseTitle}</Text>
                </Text>
                <Text style={{ fontSize: 18, color: '#388e3c', fontWeight: 'bold', marginTop: 10 }}>
                  {studentInfo.status}
                </Text>
              </>
            )}
            <TouchableOpacity
              style={{
                marginTop: 18,
                backgroundColor: '#bfa100',
                paddingVertical: 10,
                paddingHorizontal: 28,
                borderRadius: 24,
              }}
              onPress={() => {
                setShowInfoModal(false);
                setScanned(false);
              }}
            >
              <Text style={{ color: '#fffbe7', fontWeight: 'bold', fontSize: 16 }}>Scan Next</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#bfa100',
                paddingVertical: 8,
                paddingHorizontal: 24,
                borderRadius: 24,
              }}
              onPress={() => {
                setShowInfoModal(false);
                navigation.goBack();
              }}
            >
              <Text style={{ color: '#bfa100', fontWeight: 'bold', fontSize: 16 }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  messageText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  permissionButton: {
    backgroundColor: '#165973',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  scanFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
    borderRadius: 10,
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
    borderTopLeftRadius: 10,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
    borderTopRightRadius: 10,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
    borderBottomLeftRadius: 10,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
    borderBottomRightRadius: 10,
  },
  scanAgainButton: {
    backgroundColor: '#165973',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 30,
  },
  scanAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  studentInfoContainer: {
    width: '100%',
    marginBottom: 15,
  },
  studentInfoText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: '#165973',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});