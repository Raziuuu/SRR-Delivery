'use client';

import React from 'react';
import { Truck, Leaf, IndianRupee, ShieldCheck, MapPin, Headphones } from 'lucide-react';

const TRUST_FEATURES = [
  {
    icon: Truck,
    title: 'Home Delivery',
    description: 'Fresh groceries delivered directly to your doorstep.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Leaf,
    title: 'Fresh Products',
    description: 'Handpicked premium fruits & vegetables directly from local farms.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: IndianRupee,
    title: 'Affordable Prices',
    description: 'Competitive everyday low pricing with daily discount coupons.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Guaranteed',
    description: '100% freshness & quality replacement guarantee on all items.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: MapPin,
    title: 'Local Trusted Online Store',
    description: 'Proudly serving SRR city and surrounding neighborhood communities.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    description: 'Dedicated phone & WhatsApp support available from 7 AM to 10 PM.',
    color: 'bg-rose-50 text-rose-600',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Why SRR Delivery
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mt-2 tracking-tight">
          Why Choose Our Grocery Store
        </h2>
        <p className="text-sm text-neutral-500 mt-2">
          We bring quality, speed, and trust directly to your home every single day.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRUST_FEATURES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="group bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex items-start space-x-4"
            >
              <div className={`p-4 rounded-2xl ${item.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-lg group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-neutral-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
