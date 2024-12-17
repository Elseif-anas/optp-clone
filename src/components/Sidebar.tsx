import React from 'react';
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

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onSupportPress: () => void;
  onLoginPress: () => void;
}

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

export default function Sidebar({ 
  isVisible, 
  onClose,
  onSupportPress,
  onLoginPress 
}: SidebarProps) {
  const translateX = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  React.useEffect(() => {
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

  if (!isVisible) return null;

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
            <Text style={styles.headerText}>Hi, Guest</Text>
          </View>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={onSupportPress}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🎧</Text>
            </View>
            <Text style={styles.menuText}>Support Center</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={onLoginPress}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>↪️</Text>
            </View>
            <Text style={styles.menuText}>Login</Text>
          </TouchableOpacity>
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

