import React, { createContext, useContext, useState } from 'react';
import { CartItem, AddOn } from '../types/product';
import { addOns } from '../data/products';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                selectedAddOns: [...new Set([...i.selectedAddOns, ...item.selectedAddOns])],
              }
            : i
        );
      }
      return [...prevItems, item];
    });
  };

  const removeFromCart = (itemId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const addOnsTotal = item.selectedAddOns.reduce((acc, addOnId) => {
        const addOn = addOns.find(a => a.id === addOnId);
        return acc + (addOn ? addOn.price : 0);
      }, 0);
      return total + itemTotal + addOnsTotal;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

