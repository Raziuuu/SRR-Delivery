'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ProductManager } from '@/components/admin/ProductManager';
import { CouponManager } from '@/components/admin/CouponManager';
import { BannerManager } from '@/components/admin/BannerManager';
import { OrderManager } from '@/components/admin/OrderManager';
import { SettingsManager } from '@/components/admin/SettingsManager';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Truck,
  Package,
  Tag,
  Sparkles,
  Settings,
  LogOut,
  Home,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const { orders } = useCart();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'coupons' | 'banners' | 'orders' | 'settings'
  >('overview');

  if (!isAdmin && !isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-center text-white">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mb-4 border border-rose-500/30">
          <Settings className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Access Denied</h1>
        <p className="text-xs text-neutral-400 max-w-sm mb-6">
          This area is strictly restricted to store administrators. Customer accounts cannot access admin routes.
        </p>
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition-all shadow-lg"
          >
            Return to Customer Website
          </Link>
          <Link
            href="/admin/login"
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-2xl transition-all border border-neutral-700"
          >
            Admin Login
          </Link>
        </div>
      </div>
    );
  }

  // Metrics Calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === 'Order Placed' || o.status === 'Shopping in Progress' || o.status === 'On the Way'
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  const totalGrocerySales = orders.reduce((sum, o) => sum + o.grocery_amount - o.discount_amount, 0);
  const totalDeliveryCharges = orders.reduce((sum, o) => sum + o.delivery_charge, 0);
  const totalRevenue = totalGrocerySales + totalDeliveryCharges;

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-900 text-neutral-300 p-6 flex flex-col justify-between flex-shrink-0 border-r border-neutral-800">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-black shadow-lg">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black text-white block leading-none">
                SRR <span className="text-emerald-400">Admin</span>
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold block mt-0.5">
                Dashboard Portal
              </span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-bold">
            {[
              { id: 'overview', label: 'Overview Metrics', icon: TrendingUp },
              { id: 'orders', label: `Orders Queue (${pendingOrders})`, icon: Package },
              { id: 'products', label: 'Products & Brands', icon: ShoppingBag },
              { id: 'coupons', label: 'Coupons Manager', icon: Tag },
              { id: 'banners', label: 'Scrolling Banners', icon: Sparkles },
              { id: 'settings', label: 'Store & Delivery Settings', icon: Settings },
            ].map((nav) => {
              const Icon = nav.icon;
              const isSelected = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-extrabold shadow-md'
                      : 'hover:bg-neutral-800 text-neutral-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-neutral-800 space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Customer Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
                Store Operations Dashboard
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Real-time snapshot of sales, grocery bill revenues, delivery charges & pending dispatch queue.
              </p>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Today's Orders */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                    Today&apos;s Total Orders
                  </span>
                  <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-3xl font-black text-neutral-900 block">{totalOrders}</span>
                <p className="text-xs text-neutral-500">Total customer orders placed</p>
              </div>

              {/* Card 2: Pending Orders */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                    Pending Orders
                  </span>
                  <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-3xl font-black text-amber-600 block">{pendingOrders}</span>
                <p className="text-xs text-neutral-500">Orders currently in progress</p>
              </div>

              {/* Card 3: Delivered Orders */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                    Delivered Orders
                  </span>
                  <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-3xl font-black text-emerald-600 block">{deliveredOrders}</span>
                <p className="text-xs text-neutral-500">Successfully completed orders</p>
              </div>

              {/* Card 4: Total Revenue */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-md space-y-2 bg-gradient-to-br from-white to-emerald-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                    Today&apos;s Revenue
                  </span>
                  <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-3xl font-black text-emerald-700 block">₹{totalRevenue}</span>
                <p className="text-xs text-emerald-900 font-semibold">
                  Grocery Bill (₹{totalGrocerySales}) + Delivery Fee (₹{totalDeliveryCharges})
                </p>
              </div>

              {/* Card 5: Today's Grocery Sales */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                    Grocery Sales
                  </span>
                  <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-3xl font-black text-neutral-900 block">₹{totalGrocerySales}</span>
                <p className="text-xs text-neutral-500">Net grocery item billing</p>
              </div>

              {/* Card 6: Today's Delivery Charges */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                    Delivery Charges
                  </span>
                  <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-3xl font-black text-neutral-900 block">₹{totalDeliveryCharges}</span>
                <p className="text-xs text-neutral-500">Collected distance delivery fees</p>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-neutral-900">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  View All Orders Queue $\rightarrow$
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-400 font-bold uppercase tracking-wider border-b">
                      <th className="p-3">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-neutral-50/50">
                        <td className="p-3 font-bold">{o.order_number}</td>
                        <td className="p-3">
                          {o.customer_name} ({o.customer_phone})
                        </td>
                        <td className="p-3">{o.payment_method}</td>
                        <td className="p-3 font-black text-emerald-700">₹{o.total_amount}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'coupons' && <CouponManager />}
        {activeTab === 'banners' && <BannerManager />}
        {activeTab === 'orders' && <OrderManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </main>
    </div>
  );
}
