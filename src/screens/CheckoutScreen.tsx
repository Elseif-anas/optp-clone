import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import Colors from '../constants/Colors';
import { addOns } from '../data/products';
import { AddOn } from '../types/product';

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  deliveryAddress: string;
  instructions: string;
  paymentMethod: string;
}

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
}

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { getTotalPrice, items } = useCart();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    deliveryAddress: '',
    instructions: '',
    paymentMethod: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.15;
  const deliveryFee = 120;
  const addOnsCost = items.reduce((total, item) => {
    return total + item.selectedAddOns.reduce((addOnTotal, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return addOnTotal + (addOn ? addOn.price : 0);
    }, 0);
  }, 0);
  const total = subtotal + addOnsCost + tax + deliveryFee;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmOrder = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields correctly');
      return;
    }

    if (!privacyPolicyAccepted) {
      Alert.alert('Error', 'Please accept the privacy policy to continue');
      return;
    }

    Alert.alert('Success', 'Order placed successfully!');
  };

  const handleChoosePaymentMethod = () => {
    Alert.alert('Coming Soon', 'Payment method selection will be available soon');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image 
              source={require('../../assets/user-icon.png')} 
              style={styles.cardIcon} 
            />
            <Text style={styles.cardTitle}>Customer Details</Text>
          </View>
          
          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}
          </View>

          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Image 
                source={require('../../assets/pk-flag.png')} 
                style={styles.flagIcon} 
              />
              <Text style={styles.countryCodeText}>+92</Text>
            </View>
            <TextInput
              style={[
                styles.phoneInput,
                errors.phoneNumber && styles.inputError,
              ]}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            />
          </View>
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}

          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <TextInput
              style={[
                styles.input,
                styles.addressInput,
                errors.deliveryAddress && styles.inputError,
              ]}
              placeholder="Delivery Address"
              multiline
              value={formData.deliveryAddress}
              onChangeText={(text) => setFormData({ ...formData, deliveryAddress: text })}
            />
            {errors.deliveryAddress && (
              <Text style={styles.errorText}>{errors.deliveryAddress}</Text>
            )}
          </View>

          <TouchableOpacity 
            style={styles.instructionsButton}
            onPress={() => setShowInstructions(!showInstructions)}
          >
            <Text style={styles.instructionsButtonText}>
              + Add any instructions for your order
            </Text>
          </TouchableOpacity>

          {showInstructions && (
            <TextInput
              style={[styles.input, styles.instructionsInput]}
              placeholder="Special instructions..."
              multiline
              value={formData.instructions}
              onChangeText={(text) => setFormData({ ...formData, instructions: text })}
            />
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image 
              source={require('../../assets/payment-icon.png')} 
              style={styles.cardIcon} 
            />
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>
          <TouchableOpacity
            style={styles.paymentMethodButton}
            onPress={handleChoosePaymentMethod}
          >
            <View style={styles.paymentMethodLeft}>
              <Image 
                source={require('../../assets/card-icon.png')} 
                style={styles.paymentIcon} 
              />
              <Text style={styles.paymentMethodText}>Select Payment Method</Text>
            </View>
            <TouchableOpacity 
              style={styles.chooseButton}
              onPress={handleChoosePaymentMethod}
            >
              <Text style={styles.chooseButtonText}>Choose</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image 
              source={require('../../assets/delivery-icon.png')} 
              style={styles.cardIcon} 
            />
            <Text style={styles.cardTitle}>Estimated Delivery Time</Text>
          </View>
          <Text style={styles.deliveryTime}>ASAP~ 30 min(s)</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rs. {subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Add-ons</Text>
            <Text style={styles.summaryValue}>
              Rs. {addOnsCost.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Incl. 15.0% Tax</Text>
            <Text style={styles.summaryValue}>Rs. {tax.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>Rs. {deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>Rs. {total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.privacyPolicyContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setPrivacyPolicyAccepted(!privacyPolicyAccepted)}
          >
            <View style={[
              styles.checkboxInner,
              privacyPolicyAccepted && styles.checkboxChecked,
            ]} />
          </TouchableOpacity>
          <Text style={styles.privacyPolicyText}>
            By placing this order, I confirm that I have read and agreed with the{' '}
            <Text style={styles.privacyPolicyLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmOrder}
      >
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: Colors.primary,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: Colors.primary,
  },
  errorText: {
    color: Colors.primary,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  countryCode: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginRight: 8,
  },
  flagIcon: {
    width: 24,
    height: 16,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  instructionsButton: {
    paddingVertical: 8,
  },
  instructionsButtonText: {
    color: Colors.primary,
    fontSize: 16,
  },
  instructionsInput: {
    height: 80,
    marginTop: 8,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: Colors.gray,
  },
  paymentMethodText: {
    fontSize: 16,
    color: Colors.gray,
  },
  chooseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  chooseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  deliveryTime: {
    fontSize: 16,
    color: Colors.gray,
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
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  privacyPolicyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  privacyPolicyText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  privacyPolicyLink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

