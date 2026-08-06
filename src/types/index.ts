export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  gender?: 'Male' | 'Female' | 'Other';
  date_of_birth?: string;
  avatar_url?: string;
  role: UserRole;
  is_profile_completed?: boolean;
  created_at?: string;
}

export interface Address {
  id: string;
  user_id?: string;
  title: string; // 'Home', 'Work', 'Other'
  address_line: string;
  landmark?: string;
  city: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  icon_name?: string;
  display_order?: number;
}

export interface Variant {
  id: string;
  brand_id: string;
  unit: 'kg' | 'gram' | 'liter' | 'ml' | 'pcs';
  quantity: string; // e.g. "100g", "500g", "1 kg"
  price: number;
  stock: number;
  is_available: boolean;
}

export interface Brand {
  id: string;
  product_id: string;
  name: string;
  image_url?: string;
  variants: Variant[];
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_available: boolean;
  brands: Brand[];
  category_name?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  min_order_amount: number;
  max_discount_amount: number;
  expiry_date?: string;
  is_active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  text: string;
  link?: string;
  is_active: boolean;
  display_order: number;
}

export interface CartItem {
  id: string; // unique cart item key (product_id + brand_id + variant_id)
  product_id: string;
  product_name: string;
  product_image: string;
  brand_id: string;
  brand_name: string;
  variant_id: string;
  variant_quantity: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Order Placed' | 'Shopping in Progress' | 'On the Way' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'UPI' | 'Debit Card' | 'Credit Card' | 'Cash on Delivery';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_name: string;
  brand_name: string;
  variant_quantity: string;
  price: number;
  quantity: number;
  subtotal: number;
  product_image: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  latitude?: number;
  longitude?: number;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'paid';
  status: OrderStatus;
  grocery_amount: number;
  discount_amount: number;
  delivery_charge: number;
  total_amount: number;
  coupon_code?: string;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface DeliverySettings {
  charge_per_km: number;
  min_delivery_charge: number;
  max_delivery_radius_km: number;
  free_delivery_threshold: number;
}

export interface StoreSettings {
  store_name: string;
  logo_url?: string;
  contact_number: string;
  whatsapp_number: string;
  business_address: string;
  working_hours: string;
}
