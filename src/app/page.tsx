'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/customer/Navbar';
import { HeroSequence } from '@/components/hero/HeroSequence';
import { AnnouncementMarquee } from '@/components/banner/AnnouncementMarquee';
import { SearchHeader } from '@/components/customer/SearchHeader';
import { CategoryGrid } from '@/components/customer/CategoryGrid';
import { ProductCard } from '@/components/customer/ProductCard';
import { ProductDetailsModal } from '@/components/customer/ProductDetailsModal';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { CheckoutModal } from '@/components/customer/CheckoutModal';
import { LocationPickerModal } from '@/components/customer/LocationPickerModal';
import { LiveOrderTracker } from '@/components/customer/LiveOrderTracker';
import { AuthModal } from '@/components/customer/AuthModal';
import { WelcomeAuthGate } from '@/components/customer/WelcomeAuthGate';
import { WhyChooseUs } from '@/components/customer/WhyChooseUs';
import { AboutAndDeliveryInfo } from '@/components/customer/AboutAndDeliveryInfo';
import { Footer } from '@/components/customer/Footer';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/mockData';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Clock, ArrowRight } from 'lucide-react';

export default function CustomerHomePage() {
  const { user, isLoading } = useAuth();
  const { orders } = useCart();

  // Modals & Gate state
  const [guestUnlocked, setGuestUnlocked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);

  // Active tracking order if available
  const activeOrder = orders.find(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  );

  const displayedProducts = selectedCategory
    ? INITIAL_PRODUCTS.filter((p) => p.category_id === selectedCategory)
    : INITIAL_PRODUCTS;

  // Render Mandatory Welcome Auth Gate before opening website if user is not authenticated
  if (!user && !guestUnlocked && !isLoading) {
    return <WelcomeAuthGate onUnlockGuestMode={() => setGuestUnlocked(true)} />;
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* 1. Header Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLocationPicker={() => setIsLocationOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* 2. Hero Section (193-Frame Animated Canvas Hero) */}
      <HeroSequence />

      {/* 3. Floating Announcement Offer Banner */}
      <AnnouncementMarquee />

      {/* 4. Instant Search Header */}
      <SearchHeader onSelectProduct={(prod) => setSelectedProduct(prod)} />

      {/* Live Active Order Tracking Quick Banner */}
      {activeOrder && !trackedOrderId && (
        <div className="max-w-7xl mx-auto px-4 w-full mb-4">
          <div
            onClick={() => setTrackedOrderId(activeOrder.order_number)}
            className="p-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-2xl shadow-lg flex items-center justify-between cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-amber-300 animate-spin" />
              <div>
                <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider block">
                  Active Order in Progress
                </span>
                <span className="font-extrabold text-sm md:text-base">
                  Order #{activeOrder.order_number} • Status: {activeOrder.status}
                </span>
              </div>
            </div>
            <span className="text-xs font-black bg-white/20 hover:bg-white/30 text-white px-3.5 py-1.5 rounded-full border border-white/20 flex items-center space-x-1">
              <span>Track Live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}

      {/* Live Order Tracker Modal */}
      {trackedOrderId && (
        <div className="max-w-7xl mx-auto px-4 w-full mb-8">
          <LiveOrderTracker
            orderId={trackedOrderId}
            onClose={() => setTrackedOrderId(null)}
          />
        </div>
      )}

      {/* 5. Shop by Category Section */}
      <div id="categories">
        <CategoryGrid
          categories={INITIAL_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />
      </div>

      {/* 6. Products Grid Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {selectedCategory
                ? `${INITIAL_CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Category'} Products`
                : 'Featured Daily Essentials'}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Select brands & weights with instant price updating
            </p>
          </div>
          <span className="text-xs font-semibold text-neutral-400">
            Showing {displayedProducts.length} items
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
          {displayedProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetails={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 7. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 8. About Our Store & Delivery Info Section */}
      <AboutAndDeliveryInfo />

      {/* 10. Footer */}
      <Footer />

      {/* --- MODALS & DRAWERS --- */}
      {/* Product Details Modal (Brand & Variant Selector) */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onOpenLocationPicker={() => setIsLocationOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlacedSuccess={(orderId) => setTrackedOrderId(orderId)}
        onOpenLocationPicker={() => setIsLocationOpen(true)}
      />

      {/* Google Maps Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </main>
  );
}
