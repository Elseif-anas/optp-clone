import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import Colors from '../constants/Colors';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onSupportPress: () => void;
  onLoginPress: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

export default function Sidebar({ 
  isVisible, 
  onClose,
  onSupportPress,
  onLoginPress,
  isLoggedIn,
  onLogout
}: SidebarProps) {
  const translateX = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(translateX, {
        toValue: -SIDEBAR_WIDTH,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (data) {
        setUserName(data.full_name);
      }
    }
  };

  if (!isVisible) return null;

  const menuItems = [
    {
      icon: '🎧',
      text: 'Support Center',
      onPress: onSupportPress,
    },
    {
      icon: '👤',
      text: isLoggedIn ? 'Logout' : 'Login',
      onPress: isLoggedIn ? onLogout : onLoginPress,
    },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View 
          style={[
            styles.sidebar,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {isLoggedIn ? `Welcome, ${userName}` : 'Hi, Guest'}
            </Text>
          </View>

          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 50,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  menuText: {
    fontSize: 18,
  },
});

