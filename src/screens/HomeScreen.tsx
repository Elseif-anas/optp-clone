import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types/navigation';
import Carousel from '../components/Carousel';
import CategoryTabs from '../components/CategoryTabs';
import ProductModal from '../components/ProductModal';
import Sidebar from '../components/Sidebar';
import SearchModal from '../components/SearchModal';
import { useCart } from '../context/CartContext';
import Colors from '../constants/Colors';
import { Product } from '../types/product';
import { categories, products, getNewProducts, getProductsByCategory } from '../data/products';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { items } = useCart();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
  };

  const handleSupportPress = () => {
    setIsSidebarVisible(false);
    // TODO: Navigate to Support Center
  };

  const handleLoginPress = () => {
    setIsSidebarVisible(false);
    navigation.navigate('Login');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsSidebarVisible(false);
  };

  const renderProducts = () => {
    const productsToRender = selectedCategory === categories[0].id
      ? getNewProducts()
      : getProductsByCategory(selectedCategory);

    return productsToRender.map((product) => (
      <TouchableOpacity
        key={product.id}
        style={styles.productCard}
        onPress={() => setSelectedProduct(product)}
      >
        {product.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>
          <Text style={styles.productPrice}>
            Rs. {product.price.toFixed(2)}
          </Text>
        </View>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setSelectedProduct(product)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setIsSidebarVisible(true)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.locationContainer}>
          <Text style={styles.deliverTo}>Deliver To ▼</Text>
          <Text style={styles.location}>Agha Khan University Hospital</Text>
        </View>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => setIsSearchVisible(true)}
        >
          <Image
            source={require('../../assets/search-icon.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Carousel images={[
         'https://em-cdn.eatmubarak.pk/24/section_banner/1727763287.jpg',
         'https://em-cdn.eatmubarak.pk/24/section_banner/1706262003.jpg',
         'https://g-cdn.blinkco.io/ordering-system/24/section_banner/1729838957.jpeg',
        ]} />

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>
            {categories.find(cat => cat.id === selectedCategory)?.name || 'Products'}
          </Text>
          {renderProducts()}
        </View>
      </ScrollView>

      {totalItems > 0 && (
        <TouchableOpacity
          style={styles.viewCartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalItems}</Text>
          </View>
          <Text style={styles.viewCartText}>View Cart</Text>
          <Text style={styles.cartTotal}>
            Rs. {totalPrice.toFixed(2)}
          </Text>
        </TouchableOpacity>
      )}

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
        onSupportPress={handleSupportPress}
        onLoginPress={handleLoginPress}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      <SearchModal
        isVisible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        products={products}
        onProductSelect={setSelectedProduct}
      />

      {selectedProduct && (
        <ProductModal
          visible={selectedProduct !== null}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 16,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: 'white',
  },
  locationContainer: {
    flex: 1,
    marginLeft: 12,
  },
  deliverTo: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  location: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  productsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  banner: {
    width: '100%',
    height: 120,
    marginBottom: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    color: Colors.gray,
    fontSize: 14,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 16,
    paddingBottom: 32,
  },
  cartBadge: {
    backgroundColor: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewCartText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  cartTotal: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

