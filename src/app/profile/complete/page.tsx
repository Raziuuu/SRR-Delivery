'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserCheck, Camera, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.full_name) setFullName(user.full_name);
      if (user.gender) setGender(user.gender);
      if (user.date_of_birth) setDateOfBirth(user.date_of_birth);
      if (user.avatar_url) setAvatarUrl(user.avatar_url);
    }
  }, [user]);

  if (!user && !isLoading) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Full Name is required');
      return;
    }

    setIsSubmitting(true);
    const res = await updateProfile({
      full_name: fullName.trim(),
      gender,
      date_of_birth: dateOfBirth || undefined,
      avatar_url: avatarUrl || undefined,
      is_profile_completed: true,
    });
    setIsSubmitting(false);

    if (res.success) {
      router.push('/');
    } else {
      setErrorMessage(res.error || 'Failed to complete profile');
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <UserCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Complete Your Profile</h1>
          <p className="text-xs text-neutral-400">
            Please fill in your profile details to start ordering groceries with express delivery.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold rounded-2xl text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mobile Number (Auto-filled & Locked) */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-400 mb-1">
              Mobile Phone Number (Verified)
            </label>
            <input
              type="text"
              disabled
              value={user?.phone || ''}
              className="w-full p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-sm font-bold text-emerald-400 opacity-90 cursor-not-allowed"
            />
          </div>

          {/* Full Name (Required) */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-300 mb-1">
              Full Name <span className="text-emerald-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Kumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Gender Select (Required) */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-300 mb-1.5">
              Gender <span className="text-emerald-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Male', 'Female', 'Other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-3 rounded-xl text-xs font-extrabold border transition-all ${
                    gender === g
                      ? 'bg-emerald-500 text-neutral-950 border-emerald-500 shadow-md shadow-emerald-500/20'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth (Optional) */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-400 mb-1">
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Profile Photo URL (Optional) */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-400 mb-1">
              Profile Photo URL (Optional)
            </label>
            <div className="relative">
              <Camera className="w-4 h-4 text-neutral-500 absolute left-3.5 top-4" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full pl-10 pr-3 py-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-98"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Save Profile & Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
