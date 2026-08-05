'use client';

import React, { useState } from 'react';
import { Coupon } from '@/types';
import { INITIAL_COUPONS } from '@/lib/mockData';
import { Tag, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export const CouponManager: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('10');
  const [minOrder, setMinOrder] = useState('199');
  const [maxDiscount, setMaxDiscount] = useState('50');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const created: Coupon = {
      id: 'c-' + Date.now(),
      code: code.trim().toUpperCase(),
      discount_percentage: parseFloat(discountPercent) || 10,
      min_order_amount: parseFloat(minOrder) || 0,
      max_discount_amount: parseFloat(maxDiscount) || 50,
      is_active: true,
    };

    setCoupons([created, ...coupons]);
    setIsAddOpen(false);
    setCode('');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900">Coupon Code Manager</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Active coupons automatically sync to the customer announcement scrolling marquee!
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              c.is_active
                ? 'bg-white border-emerald-200 shadow-sm hover:shadow-md'
                : 'bg-neutral-50 border-neutral-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-black text-neutral-900 block">{c.code}</span>
                  <span className="text-xs font-bold text-emerald-700">
                    {c.discount_percentage}% OFF
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleCouponStatus(c.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {c.is_active ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div className="text-xs text-neutral-600 space-y-1 bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
              <div className="flex justify-between">
                <span>Min Order Amount:</span>
                <span className="font-bold text-neutral-900">₹{c.min_order_amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Discount Limit:</span>
                <span className="font-bold text-neutral-900">₹{c.max_discount_amount}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => deleteCoupon(c.id)}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-neutral-100">
            <h3 className="text-lg font-black text-neutral-900 mb-4">Create Promo Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. SRR25"
                  className="w-full p-3 bg-neutral-50 rounded-xl border uppercase font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    required
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border text-xs"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="w-1/2 py-3 bg-neutral-100 text-neutral-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
