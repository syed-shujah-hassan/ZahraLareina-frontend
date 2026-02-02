export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  images: string[];
  description: string;
  sizes: string[];
  inStock: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  status: 'active' | 'inactive';
  joinDate: string;
}
