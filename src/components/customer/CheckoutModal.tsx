'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { PaymentMethod } from '@/types';
import { X, CreditCard, Banknote, Smartphone, CheckCircle, ShieldCheck, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlacedSuccess: (orderId: string) => void;
  onOpenLocationPicker: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderPlacedSuccess,
  onOpenLocationPicker,
}) => {
  const { user } = useAuth();
  const {
    cart,
    groceryAmount,
    discountAmount,
    deliveryCharge,
    grandTotal,
    selectedAddress,
    placeOrder,
  } = useCart();

  const [name, setName] = useState(user?.full_name || 'Rahul Kumar');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      const newOrder = await placeOrder(name, phone, paymentMethod);

      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsSubmitting(false);
      onClose();
      onOrderPlacedSuccess(newOrder.order_number || newOrder.id);
    } catch (err) {
      console.error('Order error', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-green-700 text-white flex items-center justify-between shadow-md">
          <div>
            <h3 className="font-extrabold text-lg">Checkout Order</h3>
            <p className="text-xs text-emerald-100">Review address, payment & order summary</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto space-y-6">
          {/* Customer Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              1. Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>
          </div>

          {/* Delivery Location */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                2. Delivery Address (Google Maps Pin)
              </h4>
              <button
                type="button"
                onClick={onOpenLocationPicker}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Change Address
              </button>
            </div>
            <div
              onClick={onOpenLocationPicker}
              className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 cursor-pointer hover:bg-emerald-50 transition-all flex items-start space-x-3"
            >
              <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm text-neutral-900 block">
                  {selectedAddress?.title || 'Home Address'}
                </span>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {selectedAddress?.address_line}, {selectedAddress?.city} - {selectedAddress?.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              3. Select Payment Method
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { id: 'Cash on Delivery', label: 'Cash on Delivery (Pay upon arrival)', icon: Banknote },
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-emerald-200" />
                    <span className="text-sm font-bold">{pm.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              4. Order Summary ({cart.length} items)
            </h4>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2 text-xs">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-neutral-700">
                  <span>
                    {item.product_name} ({item.brand_name} • {item.variant_quantity}) x {item.quantity}
                  </span>
                  <span className="font-bold text-neutral-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="pt-3 mt-3 border-t border-neutral-200 space-y-1.5">
                <div className="flex justify-between text-neutral-600">
                  <span>Grocery Subtotal</span>
                  <span>₹{groceryAmount}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Charge</span>
                  <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span className="text-emerald-700">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:bg-neutral-300 shadow-emerald-500/20"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Confirm & Place Order (₹{grandTotal})</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-1 text-xs text-neutral-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed 15–25 Min Express Delivery</span>
          </div>
        </form>
      </div>
    </div>
  );
};
