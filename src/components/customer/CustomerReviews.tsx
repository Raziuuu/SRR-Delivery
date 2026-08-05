'use client';

import React from 'react';
import { CUSTOMER_REVIEWS } from '@/lib/mockData';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-neutral-50 to-emerald-50/30 py-14 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
            Customer Love
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mt-2 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            Trusted by thousands of happy families in SRR city
          </p>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="flex space-x-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="flex-shrink-0 w-80 md:w-96 bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl border border-neutral-100 transition-all snap-center flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-emerald-200" />
                </div>
                <p className="text-xs md:text-sm text-neutral-700 leading-relaxed italic">
                  &quot;{rev.review}&quot;
                </p>
              </div>

              <div className="flex items-center space-x-3.5 mt-6 pt-4 border-t border-neutral-100">
                <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-emerald-500">
                  <Image
                    src={rev.photo}
                    alt={rev.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{rev.name}</h4>
                  <span className="text-[11px] text-emerald-700 font-semibold">Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
