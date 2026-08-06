'use client';

import React, { useState } from 'react';
import { X, MapPin, Check, Home, Briefcase, Plus } from 'lucide-react';
import { Address } from '@/types';
import { useCart } from '@/context/CartContext';
import { InteractiveMapPicker } from './InteractiveMapPicker';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { userAddresses, selectedAddress, setSelectedAddress, addAddress } = useCart();

  const [title, setTitle] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [houseNumber, setHouseNumber] = useState('');
  const [pinnedAddress, setPinnedAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [lat, setLat] = useState<number>(17.385044);
  const [lng, setLng] = useState<number>(78.486671);
  const [showAddForm, setShowAddForm] = useState(userAddresses.length === 0);

  if (!isOpen) return null;

  const handleLocationSelected = (data: {
    address: string;
    city: string;
    pincode: string;
    lat: number;
    lng: number;
  }) => {
    setPinnedAddress(data.address);
    if (data.city) setCity(data.city);
    if (data.pincode) setPincode(data.pincode);
    setLat(data.lat);
    setLng(data.lng);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = houseNumber.trim()
      ? `${houseNumber.trim()}, ${pinnedAddress}`
      : pinnedAddress;

    if (!fullAddress.trim()) return;

    const newAddr = addAddress({
      title,
      address_line: fullAddress,
      landmark,
      city: city || 'Local Area',
      pincode: pincode || '500001',
      latitude: lat,
      longitude: lng,
      is_default: true,
    });

    setSelectedAddress(newAddr);
    setShowAddForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-green-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <MapPin className="w-6 h-6 text-emerald-200 animate-bounce" />
            <div>
              <h3 className="font-extrabold text-lg">Select Delivery Location</h3>
              <p className="text-xs text-emerald-100">
                Drag map pin or click &apos;Locate Me&apos; to set your exact location
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Saved Delivery Addresses (if any exist) */}
          {userAddresses.length > 0 && !showAddForm && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                  Saved Addresses
                </h4>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-xs font-extrabold text-emerald-700 hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pin New Location on Map</span>
                </button>
              </div>

              <div className="space-y-3">
                {userAddresses.map((addr) => {
                  const isSelected = selectedAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddress(addr);
                        onClose();
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-white border-neutral-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-xl mt-0.5 ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {addr.title === 'Home' ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-neutral-900 block">{addr.title}</span>
                          <p className="text-xs text-neutral-600 mt-0.5">
                            {addr.address_line}, {addr.city} - {addr.pincode}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Map & Confirm Form */}
          {(showAddForm || userAddresses.length === 0) && (
            <div className="space-y-6">
              {userAddresses.length > 0 && (
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                    Pin exact location on map
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-xs font-bold text-neutral-500 hover:text-neutral-800"
                  >
                    Back to Saved Addresses
                  </button>
                </div>
              )}

              {/* Zomato / Swiggy Interactive Map Picker Component */}
              <InteractiveMapPicker
                initialLat={selectedAddress?.latitude || 17.385044}
                initialLng={selectedAddress?.longitude || 78.486671}
                onLocationSelected={handleLocationSelected}
              />

              {/* House Number & Address Tag Form */}
              <form onSubmit={handleSaveNewAddress} className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTitle(t)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        title === t
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      House / Flat / Floor No.
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 402, 4th Floor"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Opposite City Hospital"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!pinnedAddress}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all active:scale-98 disabled:bg-neutral-300 shadow-emerald-500/20"
                >
                  Confirm Location & Save Address
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
