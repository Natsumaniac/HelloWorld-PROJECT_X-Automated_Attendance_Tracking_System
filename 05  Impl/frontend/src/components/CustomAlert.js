import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomAlert = ({
  visible,
  type = 'success',
  message,
  onClose,
  showConfirmButton = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#ffe066',
          icon: 'checkmark-circle',
          iconColor: '#bfa100',
          title: 'Success!'
        };
      case 'error':
        return {
          backgroundColor: '#f44336',
          icon: 'alert-circle',
          iconColor: '#fffbe7',
          title: 'Error!'
        };
      case 'warning':
        return {
          backgroundColor: '#ff9800',
          icon: 'warning',
          iconColor: '#fffbe7',
          title: 'Warning!'
        };
      default:
        return {
          backgroundColor: '#ffe066',
          icon: 'checkmark-circle',
          iconColor: '#bfa100',
          title: 'Success!'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertContainer, { borderColor: typeStyles.backgroundColor }]}>
          <View style={[styles.iconContainer, { backgroundColor: typeStyles.backgroundColor }]}>
            <Ionicons
              name={typeStyles.icon}
              size={48}
              color={typeStyles.iconColor}
            />
          </View>
          <Text style={styles.title}>{typeStyles.title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {showConfirmButton ? (
              <>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#bfa100' }]}
                  onPress={onConfirm}
                >
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#fffbe7', borderWidth: 1, borderColor: '#bfa100', marginLeft: 10 }]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, { color: '#bfa100' }]}>{cancelText}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: typeStyles.backgroundColor }]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, { color: typeStyles.iconColor } ]}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(191, 161, 0, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: '#fffbe7',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    width: '82%',
    maxWidth: 340,
    borderWidth: 2,
    shadowColor: '#bfa100',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#fffbe7',
    shadowColor: '#ffe066',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#bfa100',
    letterSpacing: 1,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#22223b',
    marginBottom: 22,
    letterSpacing: 0.2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 110,
    alignItems: 'center',
    marginTop: 2,
  },
  buttonText: {
    color: '#fffbe7',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default CustomAlert;