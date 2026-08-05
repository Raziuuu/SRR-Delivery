'use client';

import React from 'react';
import { Category } from '@/types';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-100">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Fresh Department Store
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight mt-2">
            Shop by Category
          </h2>
          <p className="text-sm md:text-base text-neutral-500 font-medium mt-1">
            Browse our fresh farm essentials, daily dairy, snacks, bakery & premium meats
          </p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="mt-4 md:mt-0 self-start md:self-auto text-xs md:text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80 px-5 py-2.5 rounded-2xl transition-all shadow-sm flex items-center space-x-2"
          >
            <span>Show All 8 Categories</span>
          </button>
        )}
      </div>

      {/* 2 Items per row layout across all screens for a lengthier, premium feel */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`group relative flex flex-col md:flex-row items-center justify-between p-5 sm:p-6 md:p-8 rounded-3xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 shadow-md hover:shadow-2xl border ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white border-emerald-600 ring-4 ring-emerald-500/20 scale-[1.01]'
                  : 'bg-white text-neutral-800 border-neutral-100 hover:border-emerald-300'
              }`}
            >
              {/* Category Image */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden mb-3 md:mb-0 flex-shrink-0 bg-neutral-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="flex-1 md:ml-6 text-center md:text-left flex flex-col justify-center">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-1">
                  <span
                    className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    Express Delivery
                  </span>
                </div>
                <h3
                  className={`text-base sm:text-lg md:text-xl font-extrabold tracking-tight ${
                    isSelected ? 'text-white' : 'text-neutral-900 group-hover:text-emerald-700'
                  }`}
                >
                  {cat.name}
                </h3>
                <p
                  className={`text-xs md:text-sm mt-1 line-clamp-2 ${
                    isSelected ? 'text-emerald-100' : 'text-neutral-500'
                  }`}
                >
                  Fresh handpicked items delivered straight to your doorstep.
                </p>

                <div className="mt-3 flex items-center justify-center md:justify-start space-x-1.5 text-xs font-extrabold">
                  <span className={isSelected ? 'text-amber-300' : 'text-emerald-600'}>
                    {isSelected ? 'Currently Viewing' : 'Explore Items'}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 ${
                      isSelected ? 'text-amber-300' : 'text-emerald-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
