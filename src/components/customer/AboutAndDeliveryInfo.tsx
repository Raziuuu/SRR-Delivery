'use client';

import React from 'react';
import Image from 'next/image';
import { Truck, MapPin, Banknote, ShieldCheck, Clock, Award } from 'lucide-react';

export const AboutAndDeliveryInfo: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-14 space-y-14">
      {/* About Our Store */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-neutral-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden bg-neutral-100 shadow-md">
          <Image
            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80"
            alt="SRR Fresh Grocery Store"
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Est. 2026</span>
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            About SRR Grocery
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
            Your Trusted Local Grocery Partner Since 2026
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Welcome to SRR Fresh Grocery Delivery. We are dedicated to providing our local community with fresh vegetables, seasonal fruits, premium aged Basmati rice, and everyday household essentials.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Our mission is simple: eliminate long supermarket lines by bringing hyper-fast, express delivery straight to your doorstep with guaranteed freshness and uncompromised quality.
          </p>
        </div>
      </div>

      {/* Delivery Information Cards */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Fast & Reliable
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mt-2 tracking-tight">
            Delivery Information & Guidelines
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              icon: MapPin,
              title: 'Service Within',
              text: 'BC Road, Melkar, Kalladka and more locations coming soon.',
            },
            {
              icon: Truck,
              title: 'Distance Pricing',
              text: '₹40 base fee up to 3 km, plus ₹10 for each additional km.',
            },
            {
              icon: Banknote,
              title: 'Cash on Delivery',
              text: 'Convenient Cash on Delivery (COD) payment upon doorstep arrival.',
            },
            {
              icon: ShieldCheck,
              title: 'Guaranteed Quality',
              text: '100% inspect-upon-delivery freshness & quality assurance.',
            },
            {
              icon: Clock,
              title: 'Doorstep Arrival',
              text: 'Fast & reliable doorstep delivery on every order.',
            },
          ].map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all text-center space-y-2"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-neutral-900">{card.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{card.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
