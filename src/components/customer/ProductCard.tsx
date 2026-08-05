'use client';

import React from 'react';
import { Product } from '@/types';
import Image from 'next/image';
import { Plus, Check, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { cart, addToCart } = useCart();

  // Find lowest price variant across brands
  const defaultBrand = product.brands[0];
  const defaultVariant = defaultBrand?.variants[0];

  const lowestPrice = Math.min(
    ...product.brands.flatMap((b) => b.variants.map((v) => v.price))
  );

  const cartItemCount = cart
    .filter((i) => i.product_id === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!defaultBrand || !defaultVariant) return;
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      brand_id: defaultBrand.id,
      brand_name: defaultBrand.name,
      variant_id: defaultVariant.id,
      variant_quantity: defaultVariant.quantity,
      price: defaultVariant.price,
      quantity: 1,
    });
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative bg-white rounded-3xl p-4 shadow-sm hover:shadow-2xl border border-neutral-100 hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1.5"
    >
      {/* Category Badge & Availability */}
      <div className="flex items-center justify-between z-10 mb-2">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
          {product.category_name || 'Grocery'}
        </span>
        <span
          className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full ${
            product.is_available
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          {product.is_available ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-40 md:h-48 rounded-2xl overflow-hidden bg-neutral-50 my-2">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur-md text-neutral-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>Customize</span>
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-2 flex-grow">
        <h3 className="font-bold text-neutral-900 text-sm md:text-base line-clamp-1 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
          {product.brands.map((b) => b.name).join(' • ')}
        </p>

        {defaultVariant && (
          <p className="text-xs font-medium text-emerald-600 mt-1">
            {defaultBrand?.name} ({defaultVariant.quantity})
          </p>
        )}
      </div>

      {/* Price & Action */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-neutral-400 block font-normal">Starting at</span>
          <span className="text-base md:text-lg font-extrabold text-neutral-900">
            ₹{lowestPrice}
          </span>
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={!product.is_available}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            cartItemCount > 0
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg active:scale-95'
          } disabled:bg-neutral-200 disabled:text-neutral-400`}
        >
          {cartItemCount > 0 ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>{cartItemCount} in Cart</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
