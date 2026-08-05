'use client';

import React, { useState } from 'react';
import { INITIAL_DELIVERY_SETTINGS, INITIAL_STORE_SETTINGS } from '@/lib/mockData';
import { DeliverySettings, StoreSettings } from '@/types';
import { Save, Truck, Store, CheckCircle } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const [delivery, setDelivery] = useState<DeliverySettings>(INITIAL_DELIVERY_SETTINGS);
  const [store, setStore] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-neutral-900">Delivery & Store Settings</h2>
        <p className="text-xs text-neutral-500 mt-1">
          Configure per-km delivery rates, radius limits, store operating hours, and contact details.
        </p>
      </div>

      {/* Delivery Settings Card */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-emerald-700">
          <Truck className="w-5 h-5" />
          <h3 className="text-base font-bold">Delivery Rate Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Charge Per Kilometer (₹)</label>
            <input
              type="number"
              value={delivery.charge_per_km}
              onChange={(e) => setDelivery({ ...delivery, charge_per_km: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Minimum Delivery Charge (₹)</label>
            <input
              type="number"
              value={delivery.min_delivery_charge}
              onChange={(e) => setDelivery({ ...delivery, min_delivery_charge: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Max Delivery Radius (km)</label>
            <input
              type="number"
              value={delivery.max_delivery_radius_km}
              onChange={(e) => setDelivery({ ...delivery, max_delivery_radius_km: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Free Delivery Threshold (₹)</label>
            <input
              type="number"
              value={delivery.free_delivery_threshold}
              onChange={(e) => setDelivery({ ...delivery, free_delivery_threshold: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200"
            />
          </div>
        </div>
      </div>

      {/* Store Settings Card */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-emerald-700">
          <Store className="w-5 h-5" />
          <h3 className="text-base font-bold">Store Business Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Store Name</label>
            <input
              type="text"
              value={store.store_name}
              onChange={(e) => setStore({ ...store, store_name: e.target.value })}
              className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Contact Phone Number</label>
            <input
              type="text"
              value={store.contact_number}
              onChange={(e) => setStore({ ...store, contact_number: e.target.value })}
              className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">WhatsApp Support Number</label>
            <input
              type="text"
              value={store.whatsapp_number}
              onChange={(e) => setStore({ ...store, whatsapp_number: e.target.value })}
              className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Working Hours</label>
            <input
              type="text"
              value={store.working_hours}
              onChange={(e) => setStore({ ...store, working_hours: e.target.value })}
              className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-neutral-700 mb-1">Business Address</label>
            <input
              type="text"
              value={store.business_address}
              onChange={(e) => setStore({ ...store, business_address: e.target.value })}
              className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all"
      >
        {savedSuccess ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Settings Saved Successfully!</span>
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>Save Store & Delivery Settings</span>
          </>
        )}
      </button>
    </form>
  );
};
