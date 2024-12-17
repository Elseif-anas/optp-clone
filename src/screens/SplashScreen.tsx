import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import { SplashScreenNavigationProp } from '../types/navigation';

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/optp-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to OPTP</Text>
        <Text style={styles.subtitle}>
          Please select your order type to continue
        </Text>
        
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Image
            source={require('../../assets/delivery-icon.png')}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Delivery</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Image
            source={require('../../assets/pickup-icon.png')}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Pick-Up</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    tintColor: Colors.secondary,
  },
  contentContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  chevron: {
    fontSize: 24,
    color: Colors.gray,
  },
});