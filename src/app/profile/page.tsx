'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  User,
  MapPin,
  Package,
  Bell,
  LogOut,
  Plus,
  Trash2,
  Check,
  Edit2,
  Camera,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Home,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const { user, updateProfile, logout } = useAuth();
  const { userAddresses, addAddress, deleteAddress, setDefaultAddress, orders } = useCart();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'notifications'>(
    (tabParam as any) || 'profile'
  );

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(user?.gender || 'Male');
  const [dateOfBirth, setDateOfBirth] = useState(user?.date_of_birth || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Address Add Form Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrTitle, setAddrTitle] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addrLine, setAddrLine] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPincode, setAddrPincode] = useState('');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setGender(user.gender || 'Male');
      setDateOfBirth(user.date_of_birth || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-center text-white">
        <User className="w-12 h-12 text-emerald-500 mb-4" />
        <h2 className="text-2xl font-black mb-2">Please Sign In</h2>
        <p className="text-sm text-neutral-400 mb-6">
          Sign in to view your profile, saved addresses, and order history.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs rounded-2xl transition-all shadow-lg"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMsg(null);

    const res = await updateProfile({
      full_name: fullName.trim(),
      gender,
      date_of_birth: dateOfBirth || undefined,
      avatar_url: avatarUrl || undefined,
    });
    setIsUpdating(false);

    if (res.success) {
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine.trim()) return;

    addAddress({
      title: addrTitle,
      address_line: addrLine,
      landmark: addrLandmark,
      city: addrCity || 'Local Area',
      pincode: addrPincode || '500001',
      latitude: 17.385044,
      longitude: 78.486671,
      is_default: userAddresses.length === 0,
    });

    setShowAddressModal(false);
    setAddrLine('');
    setAddrLandmark('');
    setAddrCity('');
    setAddrPincode('');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-extrabold text-neutral-600 hover:text-emerald-700 bg-white px-4 py-2 rounded-2xl shadow-sm border border-neutral-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grocery Store</span>
        </Link>

        {/* Profile Banner Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/40 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/20 text-white font-black text-2xl flex items-center justify-center border-2 border-white/40 shadow-lg">
                {user.full_name ? user.full_name.slice(0, 2).toUpperCase() : 'U'}
              </div>
            )}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 bg-black/20 px-3 py-1 rounded-full">
                Verified Customer
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1.5">
                {user.full_name || 'Valued Customer'}
              </h1>
              <p className="text-xs text-emerald-100 mt-1 font-medium">{user.phone}</p>
            </div>
          </div>

          <button
            onClick={async () => {
              await logout();
              router.push('/');
            }}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 transition-all flex items-center space-x-2 self-stretch sm:self-auto justify-center"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Layout Grid (Navigation Tabs + Main Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Side Navigation */}
          <div className="bg-white rounded-3xl p-3 border border-neutral-200/80 shadow-sm space-y-1 self-start">
            {[
              { id: 'profile', label: 'Personal Details', icon: User },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'orders', label: 'My Orders', icon: Package },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full px-4 py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 font-black'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Tab Content */}
          <div className="lg:col-span-3">
            {/* Tab 1: Personal Details */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-black text-neutral-900">Personal Information</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Update your account details and profile preferences.
                  </p>
                </div>

                {successMsg && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Mobile Number (Verified)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.phone}
                      className="w-full p-3.5 bg-neutral-100 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Gender
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Male', 'Female', 'Other'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                            gender === g
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Profile Photo URL
                    </label>
                    <div className="relative">
                      <Camera className="w-4 h-4 text-neutral-400 absolute left-3.5 top-4" />
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full pl-10 pr-3 py-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-neutral-900">Saved Addresses</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Manage your delivery locations for 15-min doorstep delivery.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center space-x-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {userAddresses.length === 0 ? (
                    <div className="p-8 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                      <MapPin className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-neutral-600">No saved addresses yet</p>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Add an address to speed up your checkout process.
                      </p>
                    </div>
                  ) : (
                    userAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-start justify-between space-x-4"
                      >
                        <div className="flex items-start space-x-3.5">
                          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 mt-0.5">
                            {addr.title === 'Home' ? <Home className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-sm text-neutral-900">{addr.title}</span>
                              {addr.is_default && (
                                <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-medium text-neutral-700 mt-1">
                              {addr.address_line}, {addr.city} - {addr.pincode}
                            </p>
                            {addr.landmark && (
                              <p className="text-[11px] text-neutral-400 mt-0.5">
                                Landmark: {addr.landmark}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {!addr.is_default && (
                            <button
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-xs font-bold text-emerald-700 hover:underline px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Address Modal Form */}
                {showAddressModal && (
                  <form onSubmit={handleAddAddress} className="pt-6 border-t border-neutral-100 space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                      New Delivery Address
                    </h4>

                    <div className="grid grid-cols-3 gap-2">
                      {(['Home', 'Work', 'Other'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setAddrTitle(t)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            addrTitle === t
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="House No., Building Name, Street"
                      value={addrLine}
                      onChange={(e) => setAddrLine(e.target.value)}
                      className="w-full p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />

                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Landmark"
                        value={addrLandmark}
                        onChange={(e) => setAddrLandmark(e.target.value)}
                        className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
                      />
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Pincode"
                        value={addrPincode}
                        onChange={(e) => setAddrPincode(e.target.value)}
                        className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="px-4 py-2.5 text-xs font-bold text-neutral-500 hover:text-neutral-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Tab 3: My Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-black text-neutral-900">Order History</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Track live deliveries and view past grocery orders.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                    <Package className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-neutral-600">No orders placed yet</p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Your completed grocery orders will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-3xl border border-neutral-200 bg-neutral-50/60 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/60 pb-3">
                          <div>
                            <span className="font-black text-sm text-neutral-900 block">
                              Order #{ord.order_number}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-medium">
                              {new Date(ord.created_at).toLocaleString()}
                            </span>
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full">
                            {ord.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {ord.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-neutral-800">
                                {item.quantity}x {item.product_name} ({item.brand_name} - {item.variant_quantity})
                              </span>
                              <span className="font-bold text-neutral-900">₹{item.subtotal}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-neutral-200/60 pt-3 flex items-center justify-between font-extrabold text-sm">
                          <span className="text-neutral-600">Total Paid (COD)</span>
                          <span className="text-emerald-700 text-base">₹{ord.total_amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-black text-neutral-900">Account Notifications</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Updates on daily coupons, order tracking, and store announcements.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
                    <Bell className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-emerald-900 block">
                        Welcome to SRR Fresh Delivery!
                      </span>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Use coupon code <span className="font-black">SRR10</span> at checkout for 10% OFF your first grocery order above ₹499.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
