'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Address, CartItem, Coupon, Order, OrderStatus, PaymentMethod } from '@/types';
import { INITIAL_COUPONS, INITIAL_DELIVERY_SETTINGS } from '@/lib/mockData';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

const STORE_LAT = 12.86356450672943;
const STORE_LNG = 75.05230341291362;

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.max(0.5, Math.round(d * 10) / 10);
}

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
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState<number>(2.5);
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
    }

    // Always request live device GPS location when user opens the website
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          fetch(`/api/geocode?lat=${lat}&lng=${lng}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.formatted_address) {
                const detectedAddress: Address = {
                  id: 'addr-live-gps',
                  title: 'Current Location',
                  address_line: data.formatted_address,
                  city: data.city || 'Local Area',
                  pincode: data.pincode || '',
                  latitude: lat,
                  longitude: lng,
                  is_default: true,
                };
                setSelectedAddress(detectedAddress);
              }
            })
            .catch((err) => console.error('Geocode init error', err));
        },
        (err) => {
          console.log('Location permission denied or timeout on website load', err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('srr_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('srr_addresses', JSON.stringify(userAddresses));
  }, [userAddresses]);

  useEffect(() => {
    localStorage.setItem('srr_orders', JSON.stringify(orders));
  }, [orders]);

  // Recalculate distance whenever selected address changes
  useEffect(() => {
    if (selectedAddress && selectedAddress.latitude && selectedAddress.longitude) {
      const dist = calculateDistanceKm(
        STORE_LAT,
        STORE_LNG,
        selectedAddress.latitude,
        selectedAddress.longitude
      );
      setDeliveryDistanceKm(dist);
    }
  }, [selectedAddress]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCart((prev) => {
      const itemKey = `${newItem.product_id}-${newItem.brand_name}-${newItem.variant_quantity}`;
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
    setUserAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddress?.id === id) {
      const remaining = userAddresses.filter((a) => a.id !== id);
      setSelectedAddress(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const setDefaultAddress = (id: string) => {
    setUserAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
    const target = userAddresses.find((a) => a.id === id);
    if (target) setSelectedAddress(target);
  };

  const placeOrder = async (
    customerName: string,
    customerPhone: string,
    paymentMethod: PaymentMethod
  ): Promise<Order> => {
    const orderNum = 'SRR-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      order_number: orderNum,
      customer_name: customerName,
      customer_phone: customerPhone,
      delivery_address: selectedAddress
        ? `${selectedAddress.address_line}, ${selectedAddress.city} - ${selectedAddress.pincode}`
        : 'Store Pickup Address',
      latitude: selectedAddress?.latitude,
      longitude: selectedAddress?.longitude,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid',
      status: 'Order Placed',
      grocery_amount: groceryAmount,
      discount_amount: discountAmount,
      delivery_charge: deliveryCharge,
      total_amount: grandTotal,
      coupon_code: appliedCoupon?.code,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: cart.map((c) => ({
        id: 'item-' + Math.random().toString(36).substring(2, 9),
        product_name: c.product_name,
        brand_name: c.brand_name,
        variant_quantity: c.variant_quantity,
        price: c.price,
        quantity: c.quantity,
        subtotal: c.price * c.quantity,
        product_image: c.product_image,
      })),
    };

    // Save to Supabase DB if client is configured
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      try {
        const { data: dbOrder, error: orderErr } = await supabase
          .from('orders')
          .insert({
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
          })
          .select()
          .single();

        if (!orderErr && dbOrder) {
          const itemsToInsert = newOrder.items.map((i) => ({
            order_id: dbOrder.id,
            product_name: i.product_name,
            brand_name: i.brand_name,
            variant_quantity: i.variant_quantity,
            price: i.price,
            quantity: i.quantity,
            subtotal: i.subtotal,
            product_image: i.product_image,
          }));
          await supabase.from('order_items').insert(itemsToInsert);
        }
      } catch (e) {
        console.error('Failed to sync order to Supabase', e);
      }
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
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
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
