export interface Category {
  id: number;
  name: string;
  idPrefix: number;
}

export interface AddOn {
  id: number;
  name: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isNew?: boolean;
  calories?: number;
  categoryId: number;
  allowedAddOns: number[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedAddOns: number[];
}

