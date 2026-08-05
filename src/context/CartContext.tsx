'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Address, CartItem, Coupon, Order, OrderStatus, PaymentMethod } from '@/types';
import { INITIAL_COUPONS, INITIAL_DELIVERY_SETTINGS } from '@/lib/mockData';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  groceryAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address | null) => void;
  userAddresses: Address[];
  addAddress: (addr: Omit<Address, 'id'>) => Address;
  editAddress: (id: string, addr: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  deliveryDistanceKm: number;
  setDeliveryDistanceKm: (dist: number) => void;
  placeOrder: (customerName: string, customerPhone: string, paymentMethod: PaymentMethod) => Promise<Order>;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState<number>(3.5);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('srr_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
    const savedAddr = localStorage.getItem('srr_addresses');
    if (savedAddr) {
      try {
        const parsed: Address[] = JSON.parse(savedAddr);
        setUserAddresses(parsed);
        if (parsed.length > 0) setSelectedAddress(parsed[0]);
      } catch (e) { console.error(e); }
    }
    const savedOrders = localStorage.getItem('srr_orders');
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) { console.error(e); }
    } else {
      // Seed a sample order for demonstration
      const sampleOrder: Order = {
        id: 'ord-sample-1',
        order_number: 'SRR-882091',
        customer_name: 'Rahul Kumar',
        customer_phone: '+91 98765 43210',
        delivery_address: 'Flat 402, SRR Residency, Main Market Road, SRR City',
        payment_method: 'UPI',
        payment_status: 'paid',
        status: 'Shopping in Progress',
        grocery_amount: 540,
        discount_amount: 54,
        delivery_charge: 0,
        total_amount: 486,
        coupon_code: 'SRR10',
        items: [
          {
            product_name: 'Premium Basmati Rice',
            brand_name: 'India Gate',
            variant_quantity: '1 kg',
            price: 185,
            quantity: 2,
            subtotal: 370,
            product_image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
          },
          {
            product_name: 'Fresh Cow Milk',
            brand_name: 'Amul Taaza',
            variant_quantity: '1 L',
            price: 54,
            quantity: 3,
            subtotal: 162,
            product_image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
          },
        ],
        created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      };
      setOrders([sampleOrder]);
      localStorage.setItem('srr_orders', JSON.stringify([sampleOrder]));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('srr_cart', JSON.stringify(cart));
  }, [cart]);

  // Save addresses to localStorage
  useEffect(() => {
    if (userAddresses.length > 0) {
      localStorage.setItem('srr_addresses', JSON.stringify(userAddresses));
    }
  }, [userAddresses]);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('srr_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const itemKey = `${newItem.product_id}_${newItem.brand_id}_${newItem.variant_id}`;
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      } else {
        return [...prev, { ...newItem, id: itemKey }];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const groceryAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === cleanCode && c.is_active
    );

    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    if (groceryAmount < coupon.min_order_amount) {
      return {
        success: false,
        message: `Minimum order amount of ₹${coupon.min_order_amount} required for this coupon`,
      };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon '${coupon.code}' applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const discountAmount = React.useMemo(() => {
    if (!appliedCoupon || groceryAmount < appliedCoupon.min_order_amount) return 0;
    const calc = (groceryAmount * appliedCoupon.discount_percentage) / 100;
    return Math.min(calc, appliedCoupon.max_discount_amount);
  }, [appliedCoupon, groceryAmount]);

  const deliveryCharge = React.useMemo(() => {
    if (cart.length === 0) return 0;
    if (groceryAmount >= INITIAL_DELIVERY_SETTINGS.free_delivery_threshold) return 0;
    if (deliveryDistanceKm <= 3) return 40;
    const extraKm = Math.ceil(deliveryDistanceKm - 3);
    return 40 + extraKm * 10;
  }, [cart, groceryAmount, deliveryDistanceKm]);

  const grandTotal = Math.max(0, groceryAmount - discountAmount + deliveryCharge);

  const addAddress = (newAddr: Omit<Address, 'id'>): Address => {
    const created: Address = { ...newAddr, id: 'addr-' + Date.now() };
    setUserAddresses((prev) => {
      const updated = newAddr.is_default ? prev.map((a) => ({ ...a, is_default: false })) : prev;
      return [...updated, created];
    });
    setSelectedAddress(created);
    return created;
  };

  const editAddress = (id: string, updatedFields: Partial<Address>) => {
    setUserAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a))
    );
    if (selectedAddress?.id === id) {
      setSelectedAddress((prev) => (prev ? { ...prev, ...updatedFields } : null));
    }
  };

  const deleteAddress = (id: string) => {
    setUserAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (selectedAddress?.id === id) {
        setSelectedAddress(filtered[0] || null);
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setUserAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
    const found = userAddresses.find((a) => a.id === id);
    if (found) setSelectedAddress({ ...found, is_default: true });
  };

  const placeOrder = async (
    customerName: string,
    customerPhone: string,
    paymentMethod: PaymentMethod
  ): Promise<Order> => {
    const orderNum = 'SRR-' + Math.floor(100000 + Math.random() * 900000);
    const addressStr = selectedAddress
      ? `${selectedAddress.address_line}, ${selectedAddress.city} - ${selectedAddress.pincode}`
      : 'Customer Delivery Location';

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      order_number: orderNum,
      customer_name: customerName,
      customer_phone: customerPhone,
      delivery_address: addressStr,
      latitude: selectedAddress?.latitude || 17.385044,
      longitude: selectedAddress?.longitude || 78.486671,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid',
      status: 'Order Placed',
      grocery_amount: groceryAmount,
      discount_amount: discountAmount,
      delivery_charge: deliveryCharge,
      total_amount: grandTotal,
      coupon_code: appliedCoupon?.code,
      items: cart.map((i) => ({
        product_name: i.product_name,
        brand_name: i.brand_name,
        variant_quantity: i.variant_quantity,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
        product_image: i.product_image,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.from('orders').insert({
          order_number: newOrder.order_number,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          delivery_address: newOrder.delivery_address,
          latitude: newOrder.latitude,
          longitude: newOrder.longitude,
          payment_method: newOrder.payment_method,
          payment_status: newOrder.payment_status,
          status: newOrder.status,
          grocery_amount: newOrder.grocery_amount,
          discount_amount: newOrder.discount_amount,
          delivery_charge: newOrder.delivery_charge,
          total_amount: newOrder.total_amount,
          coupon_code: newOrder.coupon_code,
        });
      } catch (e) {
        console.error('Supabase order insert error', e);
      }
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.order_number === orderId
          ? { ...o, status, updated_at: new Date().toISOString() }
          : o
      )
    );

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .then(() => {});
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.order_number === orderId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        groceryAmount,
        deliveryCharge,
        grandTotal,
        selectedAddress,
        setSelectedAddress,
        userAddresses,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress,
        deliveryDistanceKm,
        setDeliveryDistanceKm,
        placeOrder,
        orders,
        updateOrderStatus,
        getOrderById,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
