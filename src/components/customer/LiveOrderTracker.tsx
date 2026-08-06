'use client';

import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { useCart } from '@/context/CartContext';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { CheckCircle2, ShoppingBag, Truck, PackageCheck, Clock, MapPin, Phone } from 'lucide-react';

interface LiveOrderTrackerProps {
  orderId: string;
  onClose?: () => void;
}

const STAGES: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'Order Placed', label: 'Order Placed', icon: Clock },
  { status: 'Shopping in Progress', label: 'Shopping in Progress', icon: ShoppingBag },
  { status: 'On the Way', label: 'On the Way', icon: Truck },
  { status: 'Delivered', label: 'Delivered', icon: PackageCheck },
];

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({ orderId, onClose }) => {
  const { getOrderById } = useCart();
  const [currentOrder, setCurrentOrder] = useState<Order | undefined>(() => getOrderById(orderId));

  useEffect(() => {
    // Poll or sync with context
    const interval = setInterval(() => {
      const updated = getOrderById(orderId);
      if (updated) setCurrentOrder({ ...updated });
    }, 2000);

    // Supabase Realtime Subscription
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const channel = supabase
        .channel('order-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `order_number=eq.${orderId}`,
          },
          (payload: any) => {
            if (payload.new) {
              setCurrentOrder((prev) => (prev ? { ...prev, status: payload.new.status } : undefined));
            }
          }
        )
        .subscribe();

      return () => {
        clearInterval(interval);
        supabase.removeChannel(channel);
      };
    }

    return () => clearInterval(interval);
  }, [orderId, getOrderById]);

  if (!currentOrder) {
    return (
      <div className="p-8 text-center text-neutral-500 bg-white rounded-3xl shadow-xl max-w-lg mx-auto my-8">
        <Clock className="w-10 h-10 mx-auto text-neutral-300 animate-spin mb-3" />
        <p className="font-bold text-base text-neutral-800">Fetching live order status...</p>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex((s) => s.status === currentOrder.status);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 my-6">
      {/* Tracker Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-600 to-green-700 text-white flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block">
            Live Order Progress
          </span>
          <h3 className="text-xl font-black">Order #{currentOrder.order_number}</h3>
          <p className="text-xs text-emerald-100 mt-0.5">
            Placed on {new Date(currentOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold">
          {currentOrder.status}
        </div>
      </div>

      {/* Visual Progress Steps */}
      <div className="p-6 md:p-8 bg-neutral-50/50">
        <div className="relative flex items-center justify-between max-w-lg mx-auto">
          {/* Progress Bar Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-neutral-200 -translate-y-1/2 z-0 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-1.5 bg-emerald-500 -translate-y-1/2 z-0 rounded-full transition-all duration-700"
            style={{
              width: `${(Math.max(0, currentStageIndex) / (STAGES.length - 1)) * 100}%`,
            }}
          />

          {/* Stage Circles */}
          {STAGES.map((stage, idx) => {
            const isDone = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.status} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${
                    isDone
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                      : 'bg-white text-neutral-400 border border-neutral-300'
                  } ${isCurrent ? 'scale-110 animate-bounce' : ''}`}
                >
                  {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                </div>
                <span
                  className={`text-[11px] md:text-xs font-bold mt-2 text-center max-w-[80px] leading-tight ${
                    isDone ? 'text-emerald-800' : 'text-neutral-400'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details & Delivery Map Info */}
      <div className="p-6 space-y-4">
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-xs uppercase tracking-wider text-emerald-800 block">
              Delivery Address
            </span>
            <p className="text-xs text-neutral-800 font-semibold mt-0.5">
              {currentOrder.customer_name} ({currentOrder.customer_phone})
            </p>
            <p className="text-xs text-neutral-600">{currentOrder.delivery_address}</p>
          </div>
        </div>

        {/* Order Items Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
            Items in this Order ({currentOrder.items.length})
          </h4>
          <div className="divide-y divide-neutral-100 bg-neutral-50 rounded-2xl p-4 border border-neutral-200/60 text-xs">
            {currentOrder.items.map((item, index) => (
              <div key={index} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center">
                <div>
                  <span className="font-bold text-neutral-900">{item.product_name}</span>
                  <p className="text-[11px] text-neutral-500">
                    {item.brand_name} • {item.variant_quantity} x {item.quantity}
                  </p>
                </div>
                <span className="font-extrabold text-neutral-900">₹{item.subtotal}</span>
              </div>
            ))}
            <div className="pt-3 font-extrabold text-sm text-neutral-900 flex justify-between border-t border-neutral-200">
              <span>Total Bill</span>
              <span className="text-emerald-700">₹{currentOrder.total_amount}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Need Help? Contact Support</span>
          </a>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-900 px-3 py-2"
            >
              Close Tracker
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
