'use client';

import React, { useState } from 'react';
import { Product, Brand, Variant } from '@/types';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
}) => {
  const { addToCart } = useCart();

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(
    product?.brands[0] || null
  );

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product?.brands[0]?.variants[0] || null
  );

  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // When product prop changes, initialize brand and variant
  React.useEffect(() => {
    if (product && product.brands.length > 0) {
      const b = product.brands[0];
      setSelectedBrand(b);
      if (b.variants.length > 0) {
        setSelectedVariant(b.variants[0]);
      }
      setQuantity(1);
    }
  }, [product]);

  if (!product || !selectedBrand) return null;

  const handleBrandChange = (brand: Brand) => {
    setSelectedBrand(brand);
    if (brand.variants.length > 0) {
      setSelectedVariant(brand.variants[0]);
    }
  };

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      brand_id: selectedBrand.id,
      brand_name: selectedBrand.name,
      variant_id: selectedVariant.id,
      variant_quantity: selectedVariant.quantity,
      price: selectedVariant.price,
      quantity,
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/80 backdrop-blur-md hover:bg-white text-neutral-600 hover:text-neutral-900 rounded-full flex items-center justify-center shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="relative w-full md:w-1/2 h-56 md:h-auto bg-neutral-100 flex-shrink-0">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {product.category_name || 'Grocery'}
          </div>
        </div>

        {/* Product Info & Controls Section */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 leading-tight">
              {product.name}
            </h2>
            <p className="text-xs text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Brand Selector */}
            <div className="mt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Select Brand
              </label>
              <div className="flex flex-wrap gap-2">
                {product.brands.map((b) => {
                  const isSelected = selectedBrand.id === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => handleBrandChange(b)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {b.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Variant Selector */}
            <div className="mt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Select Weight / Volume
              </label>
              <div className="grid grid-cols-3 gap-2">
                {selectedBrand.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleVariantChange(v)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="font-extrabold">{v.quantity}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">₹{v.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price & Stock Display */}
            {selectedVariant && (
              <div className="mt-6 flex items-center justify-between p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Item Price</span>
                  <span className="text-2xl font-black text-neutral-900">
                    ₹{selectedVariant.price}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedVariant.is_available && selectedVariant.stock > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {selectedVariant.is_available && selectedVariant.stock > 0
                      ? 'In Stock'
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Quantity
              </span>
              <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={
                !selectedVariant ||
                !selectedVariant.is_available ||
                selectedVariant.stock <= 0
              }
              className={`w-full py-4 rounded-2xl font-extrabold text-sm md:text-base flex items-center justify-center space-x-2 transition-all shadow-xl active:scale-98 ${
                addedSuccess
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-2xl'
              } disabled:bg-neutral-200 disabled:text-neutral-400 shadow-emerald-500/20`}
            >
              {addedSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    Add to Cart • ₹{(selectedVariant?.price || 0) * quantity}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
