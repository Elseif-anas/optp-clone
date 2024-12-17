import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    <NavigationContainer>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </NavigationContainer>
  );
}