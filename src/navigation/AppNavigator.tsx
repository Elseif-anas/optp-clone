import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import Colors from '../constants/Colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.background,
          headerTitle: '',
        }}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.background,
          headerTitle: 'My Cart',
        }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.background,
          headerTitle: 'Checkout',
        }}
      />
    </Stack.Navigator>
  );
}

