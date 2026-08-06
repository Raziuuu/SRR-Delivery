'use client';

import React from 'react';
import { X, MapPin, Frown, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';

interface OutOfServiceModalProps {
  isOpen: boolean;
  distanceKm: number;
  maxRadiusKm?: number;
  onClose: () => void;
  onOpenLocationPicker: () => void;
}

export const OutOfServiceModal: React.FC<OutOfServiceModalProps> = ({
  isOpen,
  distanceKm,
  maxRadiusKm = 6,
  onClose,
  onOpenLocationPicker,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 p-6 sm:p-8 text-center space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sad Cartoon Illustration & Icon */}
        <div className="relative w-24 h-24 mx-auto mt-2">
          {/* Pulsing ring background */}
          <div className="absolute inset-0 rounded-full bg-rose-100 animate-ping opacity-60" />
          
          <div className="relative w-full h-full rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-xl shadow-rose-500/20">
            <div className="flex flex-col items-center space-y-0.5">
              <span className="text-3xl">😔</span>
              <span className="text-xs font-black uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded-full">
                Out of Area
              </span>
            </div>
          </div>
        </div>

        {/* Title & Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-extrabold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Outside {maxRadiusKm} km Service Radius</span>
          </div>

          <h3 className="text-2xl font-black text-neutral-900 tracking-tight leading-snug">
            Sorry, We Don&apos;t Deliver Here Yet! 😔
          </h3>
          
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xs mx-auto">
            We currently deliver fresh groceries only within a <span className="font-bold text-neutral-900">{maxRadiusKm} km radius</span> from our <span className="font-bold text-emerald-700">Melkar store</span>.
          </p>
        </div>

        {/* Distance Info Card */}
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-left flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 block">
              Distance Check
            </span>
            <p className="text-xs font-bold text-neutral-800 mt-0.5">
              Your location is <span className="text-rose-600 font-extrabold text-sm">{distanceKm.toFixed(1)} km</span> away from Melkar.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <button
            onClick={() => {
              onClose();
              onOpenLocationPicker();
            }}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all active:scale-98"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Change Delivery Location</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-2xl transition-colors"
          >
            Browse Products Anyway
          </button>
        </div>
      </div>
    </div>
  );
};
