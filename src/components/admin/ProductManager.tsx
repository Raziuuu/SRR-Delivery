'use client';

import React, { useState } from 'react';
import { Product, Brand, Variant, Category } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/mockData';
import { Plus, Edit3, Trash2, CheckCircle2, Image as ImageIcon, Package, Layers, Tag } from 'lucide-react';
import Image from 'next/image';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  // Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(categories[0]?.id || 'cat-1');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');

  // New Brand/Variant state
  const [brandName, setBrandName] = useState('India Gate');
  const [unit, setUnit] = useState<'kg' | 'gram' | 'liter' | 'ml' | 'pcs'>('kg');
  const [quantity, setQuantity] = useState('1 kg');
  const [price, setPrice] = useState('150');
  const [uploadingImg, setUploadingImg] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const filePath = `products/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('products').getPublicUrl(filePath);
          if (data?.publicUrl) {
            setNewProductImage(data.publicUrl);
          }
        }
      } catch (err) {
        console.error('Storage upload error', err);
      }
    } else {
      // Local object URL fallback
      const objectUrl = URL.createObjectURL(file);
      setNewProductImage(objectUrl);
    }
    setUploadingImg(false);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryObj = categories.find((c) => c.id === newProductCategory);
    const newProdId = 'prod-' + Date.now();
    const newBrandId = 'brand-' + Date.now();
    const newVariantId = 'v-' + Date.now();

    const createdVariant: Variant = {
      id: newVariantId,
      brand_id: newBrandId,
      unit,
      quantity,
      price: parseFloat(price) || 100,
      stock: 100,
      is_available: true,
    };

    const createdBrand: Brand = {
      id: newBrandId,
      product_id: newProdId,
      name: brandName,
      variants: [createdVariant],
    };

    const createdProduct: Product = {
      id: newProdId,
      category_id: newProductCategory,
      category_name: categoryObj?.name || 'Grocery',
      name: newProductName,
      slug: newProductName.toLowerCase().replace(/\s+/g, '-'),
      description: newProductDesc,
      image_url: newProductImage,
      is_available: true,
      brands: [createdBrand],
    };

    setProducts([createdProduct, ...products]);
    setIsAddProductOpen(false);
    setNewProductName('');
    setNewProductDesc('');
  };

  const toggleAvailability = (prodId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, is_available: !p.is_available } : p))
    );
  };

  const deleteProduct = (prodId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900">Product & Category Manager</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Manage Category $\rightarrow$ Product $\rightarrow$ Brand $\rightarrow$ Variant hierarchy
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex p-1 bg-neutral-100 rounded-xl">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'products' ? 'bg-white text-emerald-700 shadow-sm' : 'text-neutral-600'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'categories' ? 'bg-white text-emerald-700 shadow-sm' : 'text-neutral-600'
              }`}
            >
              Categories ({categories.length})
            </button>
          </div>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product List Table */}
      {activeTab === 'products' ? (
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="p-4">Item & Category</th>
                  <th className="p-4">Brand & Variants</th>
                  <th className="p-4">Price Range</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {products.map((p) => {
                  const prices = p.brands.flatMap((b) => b.variants.map((v) => v.price));
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                            <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 text-sm block">{p.name}</span>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              {p.category_name || 'Grocery'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          {p.brands.map((b) => (
                            <div key={b.id} className="text-neutral-700">
                              <span className="font-bold text-neutral-900">{b.name}:</span>{' '}
                              {b.variants.map((v) => `${v.quantity} (₹${v.price})`).join(', ')}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 font-black text-neutral-900">
                        ₹{minPrice} {minPrice !== maxPrice ? `- ₹${maxPrice}` : ''}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => toggleAvailability(p.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            p.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.is_available ? 'Available' : 'Disabled'}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Categories List Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm text-center">
              <div className="relative w-16 h-16 mx-auto rounded-xl overflow-hidden mb-2 bg-neutral-100">
                <Image src={c.image_url} alt={c.name} fill className="object-cover" />
              </div>
              <span className="font-bold text-xs text-neutral-900 block">{c.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-neutral-900 mb-4">Add New Grocery Product</h3>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Organic Brown Rice"
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Product Image (Supabase Storage)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. India Gate"
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border text-xs"
                  >
                    <option value="kg">kg</option>
                    <option value="gram">gram</option>
                    <option value="liter">liter</option>
                    <option value="ml">ml</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Quantity Label</label>
                  <input
                    type="text"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 500g, 1 kg"
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="150"
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border text-xs"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="w-1/2 py-3 bg-neutral-100 text-neutral-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImg}
                  className="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
