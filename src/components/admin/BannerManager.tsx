'use client';

import React, { useState } from 'react';
import { Banner } from '@/types';
import { INITIAL_BANNERS } from '@/lib/mockData';
import { Sparkles, Plus, Trash2 } from 'lucide-react';

export const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newBanner: Banner = {
      id: 'b-' + Date.now(),
      title: title || 'Offer Announcement',
      text: text.trim(),
      is_active: true,
      display_order: banners.length + 1,
    };

    setBanners([...banners, newBanner]);
    setTitle('');
    setText('');
  };

  const toggleBanner = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b))
    );
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-neutral-900">Announcement Banner Manager</h2>
        <p className="text-xs text-neutral-500 mt-1">
          Manage promotional notices, festival offers, and store announcement marquees.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-neutral-900">Add New Scrolling Announcement</h3>
        <form onSubmit={handleAddBanner} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Title (e.g. Festival Offer)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs"
          />
          <input
            type="text"
            required
            placeholder="Banner Text (e.g. 🚚 Free Delivery on orders above ₹499)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs md:col-span-2"
          />
          <button
            type="submit"
            className="md:col-span-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Announcement Banner</span>
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {banners.map((b) => (
          <div
            key={b.id}
            className="p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <span className="font-bold text-sm text-neutral-900">{b.title}</span>
                <p className="text-xs text-neutral-600 mt-0.5">{b.text}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleBanner(b.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  b.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {b.is_active ? 'Live' : 'Hidden'}
              </button>
              <button
                onClick={() => deleteBanner(b.id)}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
