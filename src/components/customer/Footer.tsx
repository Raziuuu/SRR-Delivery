'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Phone, MessageSquare, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Store Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              SRR <span className="text-emerald-400">Fresh</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            SRR Fresh Grocery Delivery is your premium online supermarket for farm-fresh vegetables, organic fruits, grains, oils & everyday home essentials.
          </p>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Quality & Freshness Guarantee</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li>
              <Link href="/" className="hover:text-emerald-400 transition-colors">
                Home Page
              </Link>
            </li>
            <li>
              <Link href="/#categories" className="hover:text-emerald-400 transition-colors">
                Shop Categories
              </Link>
            </li>
            <li>
              <Link href="/#offers" className="hover:text-emerald-400 transition-colors">
                Special Offers & Coupons
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-emerald-400 transition-colors">
                My Profile & Orders
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-emerald-400 transition-colors">
                Admin Panel Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Grocery Categories
          </h4>
          <ul className="grid grid-cols-2 gap-2 text-xs text-neutral-400">
            {INITIAL_CATEGORIES.slice(0, 8).map((cat) => (
              <li key={cat.id}>
                <span className="hover:text-emerald-400 cursor-pointer transition-colors">
                  {cat.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact & Working Hours */}
        <div className="space-y-3">
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Store Contact
          </h4>
          <div className="space-y-2.5 text-xs text-neutral-400">
            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-emerald-400"
              >
                WhatsApp Order Support
              </a>
            </div>
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>123 SRR Main Road, Market Complex, SRR City</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>7:00 AM - 10:00 PM (Daily)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 space-y-4 md:space-y-0">
        <p>© {new Date().getFullYear()} SRR Delivery App. All rights reserved.</p>
        <div className="flex space-x-6">
          <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-neutral-400 cursor-pointer">Terms & Conditions</span>
          <span className="hover:text-neutral-400 cursor-pointer">Refund Policy</span>
        </div>
      </div>
    </footer>
  );
};
