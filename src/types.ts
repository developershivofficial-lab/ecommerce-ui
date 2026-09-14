export interface Product {
  id: string;
  name: string;
  category: 'Electronics' | 'Fashion' | 'Audio' | 'Home' | 'Footwear' | 'Accessories';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  badge?: 'Trending' | 'Best Seller' | 'New' | '20% OFF' | 'Hot Deal';
  description: string;
  features: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  deliverySpeed: 'standard' | 'express';
}

export type PaymentMethod = 'upi' | 'card' | 'cod' | 'wallet';

export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  createdAt: string;
  estimatedDelivery: string;
}

export interface FilterState {
  category: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning';
}
