import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartScreenNavigationProp } from '../types/navigation';
import { useCart } from '../context/CartContext';
import Colors from '../constants/Colors';
import { addOns } from '../data/products';
import { AddOn } from '../types/product';

export default function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.15; // 15% tax
  const deliveryFee = 120; // Fixed delivery fee
  const total = subtotal + tax + deliveryFee;

  const renderCartItems = () => {
    return items.map((item) => (
      <View key={item.id} style={styles.cartItem}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>
            Item {item.quantity}x {item.name}
          </Text>
          <Text style={styles.itemPrice}>
            Rs. {item.price.toFixed(2)}
          </Text>
          {item.selectedAddOns.length > 0 && (
            <View>
              <Text style={styles.optionTitle}>Add-ons:</Text>
              {item.selectedAddOns.map((addOnId) => {
                const addOn = addOns.find(a => a.id === addOnId);
                return addOn ? (
                  <Text key={addOn.id} style={styles.optionItem}>
                    {addOn.name} - Rs. {addOn.price.toFixed(2)}
                  </Text>
                ) : null;
              })}
            </View>
          )}
        </View>
        <View style={styles.quantityAdjuster}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.deliverySection}>
        <View>
          <Text style={styles.deliveryLabel}>Deliver To</Text>
          <Text style={styles.deliveryAddress}>
            Agha Khan University Hospital
          </Text>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.changeButton}>Change</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Items</Text>
          {renderCartItems()}
        </View>

        <View style={styles.promoSection}>
          <Text style={styles.promoText}>
            Please login to apply promo code
          </Text>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              Rs. {subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Incl. 15.0% Tax</Text>
            <Text style={styles.summaryValue}>
              Rs. {tax.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>
              Rs. {deliveryFee.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>
              Rs. {total.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>Rs. {total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  deliverySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  deliveryLabel: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 16,
    fontWeight: '500',
  },
  changeButton: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContent: {
    flex: 1,
  },
  itemsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantityAdjuster: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  promoSection: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  promoText: {
    color: Colors.gray,
    fontSize: 16,
  },
  summarySection: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.gray,
  },
  summaryValue: {
    fontSize: 16,
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSection: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  optionItem: {
    fontSize: 12,
    color: Colors.gray,
  },
});

