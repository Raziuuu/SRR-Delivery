'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MapPin, User, Package, LogOut, Bell, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenLocationPicker: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenLocationPicker,
  onOpenAuth,
}) => {
  const router = useRouter();
  const { cart, grandTotal, selectedAddress } = useCart();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Left: Brand Logo & Location */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg md:text-xl font-black text-neutral-900 tracking-tight block leading-none">
                SRR <span className="text-emerald-600">Fresh</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mt-0.5">
                Grocery Delivery
              </span>
            </div>
          </Link>

          {/* Location Selector Pill */}
          <button
            onClick={onOpenLocationPicker}
            className="flex items-center space-x-1.5 bg-neutral-50 hover:bg-emerald-50/70 border border-neutral-200 hover:border-emerald-300 px-2.5 sm:px-3.5 py-1.5 rounded-full text-left transition-all max-w-[125px] sm:max-w-[220px]"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0 animate-pulse" />
            <div className="truncate">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-800 block leading-tight truncate">
                {selectedAddress?.title || 'Deliver To'}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-neutral-700 truncate block">
                {selectedAddress?.address_line || 'Select location'}
              </span>
            </div>
          </button>
        </div>

        {/* Right: Customer Actions ONLY (No Admin Links) */}
        <div className="flex items-center space-x-3">
          {/* Auth Button or User Profile Avatar Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 pr-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                    {getInitials(user.full_name)}
                  </div>
                )}
                <span className="text-xs font-black text-neutral-900 hidden sm:inline max-w-[100px] truncate">
                  {user.full_name.split(' ')[0] || 'My Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-50 animate-fade-in divide-y divide-neutral-100">
                  <div className="px-4 py-3">
                    <p className="text-xs font-extrabold text-neutral-900 truncate">
                      {user.full_name || 'Valued Customer'}
                    </p>
                    <p className="text-[11px] font-medium text-neutral-500 truncate mt-0.5">
                      {user.phone}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push('/profile');
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2.5 transition-colors"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push('/profile?tab=orders');
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2.5 transition-colors"
                    >
                      <Package className="w-4 h-4 text-emerald-600" />
                      <span>My Orders</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push('/profile?tab=addresses');
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2.5 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>Saved Addresses</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push('/profile?tab=notifications');
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2.5 transition-colors"
                    >
                      <Bell className="w-4 h-4 text-emerald-600" />
                      <span>Notifications</span>
                    </button>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={async () => {
                        setIsDropdownOpen(false);
                        await logout();
                        router.push('/');
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-neutral-100 hover:bg-emerald-50 text-neutral-800 hover:text-emerald-700 text-xs font-extrabold transition-all"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/20 font-bold text-xs md:text-sm transition-all active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>My Cart</span>
            {totalItems > 0 && (
              <>
                <span className="bg-white text-emerald-800 px-2 py-0.5 rounded-full text-xs font-extrabold shadow-sm">
                  {totalItems}
                </span>
                <span className="hidden md:inline font-extrabold border-l border-emerald-500 pl-2">
                  ₹{grandTotal}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
