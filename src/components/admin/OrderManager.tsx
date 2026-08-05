'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { OrderStatus } from '@/types';
import { Package, Clock, ShoppingBag, Truck, CheckCircle2, MapPin, Phone } from 'lucide-react';

const STATUS_OPTIONS: OrderStatus[] = [
  'Order Placed',
  'Shopping in Progress',
  'On the Way',
  'Delivered',
  'Cancelled',
];

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus } = useCart();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-neutral-900">Live Order Queue & Dispatch</h2>
        <p className="text-xs text-neutral-500 mt-1">
          Changes to order status immediately update the customer live tracking screen via Supabase Realtime!
        </p>
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Top info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-base text-neutral-900">
                      Order #{ord.order_number}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      ₹{ord.total_amount}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Customer: <span className="font-bold text-neutral-800">{ord.customer_name}</span> ({ord.customer_phone})
                  </p>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold text-neutral-400">Update Status:</label>
                  <select
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                    className="p-2 bg-emerald-50 text-emerald-900 font-extrabold rounded-xl border border-emerald-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delivery details & items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-neutral-50 rounded-2xl space-y-1">
                  <div className="flex items-center space-x-1.5 text-neutral-500 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Delivery Location</span>
                  </div>
                  <p className="text-neutral-800 font-medium">{ord.delivery_address}</p>
                  <p className="text-neutral-400 text-[11px]">Payment: {ord.payment_method} ({ord.payment_status})</p>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-2xl space-y-1">
                  <span className="font-bold text-neutral-500 block">Items in Order ({ord.items.length})</span>
                  <div className="space-y-1">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-neutral-700">
                        <span>{it.product_name} ({it.brand_name} {it.variant_quantity}) x {it.quantity}</span>
                        <span className="font-bold">₹{it.subtotal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-neutral-500 bg-white rounded-3xl border border-neutral-100">
            <Package className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
            <p className="font-bold text-sm">No recent orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
