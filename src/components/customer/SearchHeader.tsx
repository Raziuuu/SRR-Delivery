'use client';

import React, { useState } from 'react';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { Product } from '@/types';
import Image from 'next/image';

interface SearchHeaderProps {
  onSelectProduct?: (product: Product) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredProducts = searchTerm.trim()
    ? INITIAL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brands.some((b) => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 relative z-30">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-emerald-600 transition-colors group-focus-within:text-emerald-500" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search fresh vegetables, fruits, basmati rice, milk, cooking oils..."
          className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl shadow-lg border border-neutral-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 text-neutral-800 text-base placeholder-neutral-400 transition-all font-normal"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Autocomplete Search Dropdown */}
      {isFocused && searchTerm.trim() !== '' && (
        <div
          className="absolute left-4 right-4 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50 divide-y divide-neutral-100 max-h-96 overflow-y-auto"
          onMouseDown={(e) => e.preventDefault()}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => {
              const lowestPrice = Math.min(
                ...prod.brands.flatMap((b) => b.variants.map((v) => v.price))
              );
              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    if (onSelectProduct) onSelectProduct(prod);
                    setIsFocused(false);
                    setSearchTerm('');
                  }}
                  className="flex items-center justify-between p-3.5 hover:bg-emerald-50/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image
                        src={prod.image_url}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 text-sm">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        {prod.category_name} • {prod.brands.map((b) => b.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-emerald-700">
                      From ₹{lowestPrice}
                    </span>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-neutral-500">
              <ShoppingBag className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
              <p className="text-sm">No grocery items found for &quot;{searchTerm}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
