'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight,
  Loader2,
  CheckCircle,
  Eye,
  Sparkles,
} from 'lucide-react';

interface WelcomeAuthGateProps {
  onUnlockGuestMode: () => void;
}

export const WelcomeAuthGate: React.FC<WelcomeAuthGateProps> = ({ onUnlockGuestMode }) => {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await loginWithGoogle();
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Google Sign-In failed. Please try again.');
      }
    } catch (e) {
      setIsSubmitting(false);
      setErrorMessage('An unexpected error occurred during Google Sign-In.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col justify-between overflow-y-auto">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-600/20 blur-[120px] pointer-events-none rounded-full" />

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight block leading-none text-white">
              SRR <span className="text-emerald-400">Delivery</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest block mt-0.5">
              Express Delivery App
            </span>
          </div>
        </div>

        <button
          onClick={onUnlockGuestMode}
          className="text-xs font-bold text-neutral-400 hover:text-emerald-400 bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-2xl transition-all flex items-center space-x-1.5"
        >
          <Eye className="w-4 h-4" />
          <span>Preview Store as Guest</span>
        </button>
      </header>

      {/* Main Auth Gate Section */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Side: Brand Promise */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-extrabold">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Express 15-Minute Delivery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Fresh Products Delivered <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500">
              Direct to Your Doorstep
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Sign in instantly with your Google account to unlock member discounts, real-time order tracking, and cash on delivery.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2 max-w-md mx-auto lg:mx-0">
            <div className="p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800 text-center">
              <Truck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">Express Speed</span>
            </div>
            <div className="p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800 text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">Fresh Quality</span>
            </div>
            <div className="p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800 text-center">
              <span className="text-base font-extrabold text-amber-400 block mb-0.5">COD</span>
              <span className="text-xs font-bold text-white block">Pay on Arrival</span>
            </div>
          </div>
        </div>

        {/* Right Side: Google 1-Tap Sign In Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-inner">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Sign In to SRR Delivery</h2>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Click below for instant 1-tap authentication with your Google account.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold rounded-2xl text-center">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-white hover:bg-neutral-100 text-neutral-900 font-extrabold text-base rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/10 flex items-center justify-center space-x-3 transition-all active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin text-neutral-900" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-neutral-500 font-medium">
            🔒 Safe & Secure 256-Bit SSL Encrypted Login
          </p>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-neutral-500 border-t border-neutral-900">
        SRR Delivery App © 2026 • Hyperlocal 15-Minute Doorstep Delivery
      </footer>
    </div>
  );
};
