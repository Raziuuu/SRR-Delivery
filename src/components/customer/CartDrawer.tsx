'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, ShieldCheck, MapPin, AlertTriangle } from 'lucide-react';
import { OutOfServiceModal } from './OutOfServiceModal';

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
    deliveryDistanceKm,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success?: boolean; text: string } | null>(null);
  const [showOutOfServiceModal, setShowOutOfServiceModal] = useState(false);

  if (!isOpen) return null;

  const isOutOfRadius = deliveryDistanceKm > 6;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ success: res.success, text: res.message });
  };

  const handleCheckoutClick = () => {
    if (isOutOfRadius) {
      setShowOutOfServiceModal(true);
    } else {
      onClose();
      onProceedToCheckout();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
            {/* Cart Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-green-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-6 h-6 text-emerald-200" />
                <div>
                  <h3 className="font-extrabold text-lg">My Shopping Cart</h3>
                  <p className="text-xs text-emerald-100 font-medium">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} item(s) selected
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Address Bar */}
            <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 min-w-0 pr-2">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="truncate">
                  <span className="font-extrabold text-emerald-900 block uppercase text-[10px]">
                    DELIVER TO ({selectedAddress?.title || 'Location'})
                  </span>
                  <span className="text-neutral-600 truncate block">
                    {selectedAddress
                      ? `${selectedAddress.address_line}, ${selectedAddress.city}`
                      : 'Please select delivery address'}
                  </span>
                </div>
              </div>
              <button
                onClick={onOpenLocationPicker}
                className="font-extrabold text-emerald-700 hover:underline flex-shrink-0"
              >
                Change
              </button>
            </div>

            {/* Out of Radius Warning Banner */}
            {isOutOfRadius && (
              <div className="p-3 bg-rose-950 text-rose-200 border-b border-rose-800 flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Outside 6 km Service Zone ({deliveryDistanceKm.toFixed(1)} km)</span>
                </div>
                <button
                  onClick={() => setShowOutOfServiceModal(true)}
                  className="text-amber-300 underline text-[11px]"
                >
                  Details
                </button>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-2xl border border-neutral-100 shadow-sm flex items-center space-x-3"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-50 flex-shrink-0 border border-neutral-100">
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-sm text-neutral-900 truncate">
                          {item.product_name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-400 font-medium mt-0.5">
                        {item.brand_name} • {item.variant_quantity}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-extrabold text-neutral-900 text-sm">
                          ₹{item.price * item.quantity}{' '}
                          <span className="text-[10px] font-normal text-neutral-400">
                            (₹{item.price} each)
                          </span>
                        </span>

                        <div className="flex items-center space-x-2 bg-neutral-100 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-neutral-700 hover:bg-neutral-50"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-extrabold px-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-neutral-700 hover:bg-neutral-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
                      {isOutOfRadius ? (
                        <span className="text-rose-600 font-bold">Beyond 6 km Radius</span>
                      ) : deliveryCharge === 0 ? (
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
                  onClick={handleCheckoutClick}
                  disabled={cart.length === 0}
                  className={`w-full py-4 font-extrabold text-sm md:text-base rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:bg-neutral-300 ${
                    isOutOfRadius
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                  }`}
                >
                  <span>{isOutOfRadius ? 'Check Delivery Availability' : 'Proceed to Checkout'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-neutral-400 font-semibold text-center pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Secure Checkout & Freshness Guarantee</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Out of Service Modal Popup */}
      <OutOfServiceModal
        isOpen={showOutOfServiceModal}
        distanceKm={deliveryDistanceKm}
        maxRadiusKm={6}
        onClose={() => setShowOutOfServiceModal(false)}
        onOpenLocationPicker={() => {
          setShowOutOfServiceModal(false);
          onOpenLocationPicker();
        }}
      />
    </>
  );
};
