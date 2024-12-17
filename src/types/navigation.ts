import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Cart: undefined;
  Checkout: undefined;
};

export type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;
export type CheckoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;

