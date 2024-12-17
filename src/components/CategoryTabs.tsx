import React from 'react';
import { 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import Colors from '../constants/Colors';
import { Category } from '../types/product';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: number;
  onSelectCategory: (categoryId: number) => void;
}

export default function CategoryTabs({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.tab,
            selectedCategory === category.id && styles.selectedTab,
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Text
            style={[
              styles.tabText,
              selectedCategory === category.id && styles.selectedTabText,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    color: Colors.gray,
    fontSize: 16,
  },
  selectedTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

