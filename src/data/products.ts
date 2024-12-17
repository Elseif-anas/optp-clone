import { Product, AddOn, Category } from '../types/product';

export const categories: Category[] = [
  { id: 1, name: 'Deals', idPrefix: 100 },
  { id: 2, name: 'Loaded Fries', idPrefix: 200 },
  { id: 3, name: 'Flatbreads', idPrefix: 300 },
  { id: 4, name: 'Burgers', idPrefix: 400 },
  { id: 5, name: 'Sides', idPrefix: 500 },
  { id: 6, name: 'Desserts', idPrefix: 600 },
];

export const addOns: AddOn[] = [
  { id: 701, name: 'Ketchup', price: 20 },
  { id: 702, name: 'Mayonnaise', price: 20 },
  { id: 703, name: 'Garlic Mayo', price: 30 },
  { id: 704, name: 'Hot Sauce', price: 30 },
  { id: 801, name: 'Coca Cola', price: 80 },
  { id: 802, name: 'Sprite', price: 80 },
  { id: 803, name: 'Fanta', price: 80 },
];

export const products: Product[] = [
  {
    id: 107,
    name: '007',
    description: "The name's Seven..007. Pure beef perfection in every bite. 7 ounces of juicy goodness, pickles, double cheese, and our classified sauce.",
    price: 1190,
    image: 'https://em-cdn.eatmubarak.pk/24/dish_image/1725956033.png',
    isNew: true,
    calories: 985,
    categoryId: 1,
    allowedAddOns: [701, 702, 703, 704,801],
  },
  {
    id: 108,
    name: 'Fish & Chips',
    description: 'Fresh fish fillet, golden fried to perfection, served with our world-famous fries.',
    price: 1150,
    image: 'https://g-cdn.blinkco.io/ordering-system/24/dish_image/1729590129.png',
    isNew: true,
    calories: 750,
    categoryId: 1,
    allowedAddOns: [701, 702, 703, 704],
  },
  {
    id: 201,
    name: 'Classic Loaded Fries',
    description: 'Our signature fries topped with melted cheese and crispy bacon bits.',
    price: 450,
    image: 'https://example.com/classic-loaded-fries.jpg',
    isNew: false,
    calories: 600,
    categoryId: 2,
    allowedAddOns: [701, 702, 703, 704],
  },
  {
    id: 301,
    name: 'Chicken Tikka Flatbread',
    description: 'Tender chicken tikka pieces on a crispy flatbread with fresh veggies and our special sauce.',
    price: 550,
    image: 'https://example.com/chicken-tikka-flatbread.jpg',
    isNew: false,
    calories: 480,
    categoryId: 3,
    allowedAddOns: [701, 702, 703, 704],
  },
  {
    id: 401,
    name: 'Classic Beef Burger',
    description: 'Juicy beef patty with fresh lettuce, tomatoes, and our secret sauce on a toasted bun.',
    price: 650,
    image: 'https://example.com/classic-beef-burger.jpg',
    isNew: false,
    calories: 750,
    categoryId: 4,
    allowedAddOns: [701, 702, 703, 704],
  },
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: number): Product[] => {
  return products.filter(product => product.categoryId === categoryId);
};

export const getNewProducts = (): Product[] => {
  return products.filter(product => product.isNew);
};

export const getAllowedAddOns = (product: Product): AddOn[] => {
  return addOns.filter(addOn => product.allowedAddOns.includes(addOn.id));
};

