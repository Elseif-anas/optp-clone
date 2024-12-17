import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  PanResponder,
} from 'react-native';
import { Product, AddOn } from '../types/product';
import { useCart } from '../context/CartContext';
import Colors from '../constants/Colors';
import { getAllowedAddOns } from '../data/products';

const { height } = Dimensions.get('window');
const INITIAL_HEIGHT = height * 0.8;

interface ProductModalProps {
  product: Product;
  visible: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, visible, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const { addToCart } = useCart();
  
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scrollOffset = useRef(0);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      if (scrollOffset.current <= 0 || gestureState.dy > 0) {
        slideAnim.setValue(Math.max(0, gestureState.dy));
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        onClose();
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(height);
    }
  }, [visible]);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedAddOns,
    });
    onClose();
  };

  const allowedAddOns = getAllowedAddOns(product);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          
          <ScrollView
            onScroll={(e) => {
              scrollOffset.current = e.nativeEvent.contentOffset.y;
            }}
            scrollEventThrottle={16}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />

            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>{product.name}</Text>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Text>♡</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.price}>Rs. {product.price.toFixed(2)}</Text>
              <Text style={styles.description}>{product.description}</Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Item</Text>
                <Text style={styles.required}>Required</Text>
                <TouchableOpacity style={styles.optionItem}>
                  <View style={styles.radio}>
                    <View style={styles.radioInner} />
                  </View>
                  <Text style={styles.optionText}>
                    {product.name} - Pure Beef Perfection
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Add-ons</Text>
                <Text style={styles.subtitle}>You may select multiple options</Text>
                {allowedAddOns.map((addOn) => (
                  <TouchableOpacity
                    key={addOn.id}
                    style={styles.optionItem}
                    onPress={() => {
                      if (selectedAddOns.includes(addOn.id)) {
                        setSelectedAddOns(selectedAddOns.filter(id => id !== addOn.id));
                      } else {
                        setSelectedAddOns([...selectedAddOns, addOn.id]);
                      }
                    }}
                  >
                    <View style={styles.checkbox}>
                      {selectedAddOns.includes(addOn.id) && (
                        <View style={styles.checkboxInner} />
                      )}
                    </View>
                    <Text style={styles.optionText}>{addOn.name}</Text>
                    <Text style={styles.optionPrice}>
                      Rs. {addOn.price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: INITIAL_HEIGHT,
    width: '100%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#000',
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  favoriteButton: {
    padding: 8,
  },
  price: {
    fontSize: 20,
    color: Colors.primary,
    marginVertical: 8,
  },
  description: {
    color: Colors.gray,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  required: {
    color: Colors.primary,
    fontSize: 12,
    marginBottom: 12,
  },
  subtitle: {
    color: Colors.gray,
    fontSize: 14,
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: Colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  optionPrice: {
    fontSize: 16,
    color: Colors.gray,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: 'white',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    color: Colors.primary,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

