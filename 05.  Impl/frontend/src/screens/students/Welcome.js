import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/aaaaaa.jpg')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.centered}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/images/log.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>ScanBee</Text>
          <Text style={styles.tagline}>
            Buzz in. Mark attendance. Fly out.
          </Text>
          <TouchableOpacity
            style={styles.loginButtonWrapper}
            onPress={() => navigation.navigate('RoleSelection')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#fffbe7', '#ffe066', '#FFD700', '#fffbe7']}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.9, y: 0.9 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Enter the Hive</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={styles.footer}>© {new Date().getFullYear()} ScanBee</Text>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)', 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  logo: {
    width: width * 0.32,
    height: width * 0.32,
  },
  appName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff', // White text
    letterSpacing: 2,
    marginBottom: 8,
    textShadowColor: '#000a',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#fff', // White text
    marginBottom: 40,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 1,
    textShadowColor: '#000a',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  loginButtonWrapper: {
    borderRadius: 32,
    overflow: 'hidden',
    marginTop: 18,
    shadowColor: '#22223b',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  loginButton: {
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#bfa100',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#22223b',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: '#fff8',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  footer: {
    color: '#b0b0b0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 10,
  },
});

export default Welcome;