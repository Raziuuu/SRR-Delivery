'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, ShieldCheck, MapPin } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onOpenLocationPicker: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  onOpenLocationPicker,
}) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    groceryAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    deliveryCharge,
    grandTotal,
    selectedAddress,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success?: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ success: res.success, text: res.message });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Cart Header */}
          <div className="p-5 bg-gradient-to-r from-emerald-600 to-green-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6 text-emerald-200" />
              <div>
                <h3 className="font-extrabold text-lg">My Shopping Cart</h3>
                <p className="text-xs text-emerald-100">{cart.length} item(s) selected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Location Header Bar */}
          <div
            onClick={onOpenLocationPicker}
            className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition-colors"
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div className="truncate">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Deliver To ({selectedAddress?.title || 'Location'})
                </span>
                <span className="text-xs text-neutral-700 font-medium truncate block">
                  {selectedAddress?.address_line || 'Select delivery address'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 hover:underline flex-shrink-0">
              Change
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-neutral-100">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-neutral-900 text-sm truncate">
                      {item.product_name}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {item.brand_name} • {item.variant_quantity}
                    </p>
                    <p className="text-sm font-extrabold text-neutral-900 mt-1">
                      ₹{item.price * item.quantity}{' '}
                      <span className="text-xs font-normal text-neutral-400">
                        (₹{item.price} each)
                      </span>
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-neutral-200 text-neutral-700"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-neutral-200 text-neutral-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-neutral-500 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-neutral-300" />
                <h4 className="font-bold text-neutral-800 text-base">Your cart is empty</h4>
                <p className="text-xs text-neutral-400">
                  Add fresh groceries, fruits & daily essentials to get started.
                </p>
              </div>
            )}
          </div>

          {/* Coupon Code Section */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 space-y-4">
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon Code (e.g. SRR10)"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 uppercase font-bold text-neutral-800"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between p-2.5 bg-emerald-100/60 border border-emerald-300/60 rounded-xl text-xs text-emerald-900 font-semibold">
                  <span>
                    🎉 Code &apos;{appliedCoupon.code}&apos; Applied (-₹{discountAmount})
                  </span>
                  <button onClick={removeCoupon} className="text-rose-700 hover:underline">
                    Remove
                  </button>
                </div>
              )}

              {couponMsg && !appliedCoupon && (
                <p
                  className={`text-xs font-semibold ${
                    couponMsg.success ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {couponMsg.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs pt-2">
                <div className="flex justify-between text-neutral-600">
                  <span>Total Grocery Bill</span>
                  <span className="font-semibold text-neutral-900">₹{groceryAmount}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Grand Total</span>
                  <span className="text-emerald-700">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                disabled={cart.length === 0}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm md:text-base rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:bg-neutral-300 shadow-emerald-500/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-neutral-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure Checkout & Freshness Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
