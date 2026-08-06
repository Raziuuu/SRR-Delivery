'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Smartphone,
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
  const { sendPhoneOTP, verifyPhoneOTP } = useAuth();

  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanDigits = phone.replace(/\D/g, '');

    if (cleanDigits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number');
      return;
    }

    setIsSubmitting(true);
    const res = await sendPhoneOTP(phone);
    setIsSubmitting(false);

    if (res.success) {
      setStep('OTP');
      setInfoMessage(res.message || `Verification code sent to +91 ${cleanDigits}`);
    } else {
      setErrorMessage(res.error || 'Failed to send OTP code');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otpCode.length < 6) {
      setErrorMessage('Please enter the 6-digit OTP verification code');
      return;
    }

    setIsSubmitting(true);
    const res = await verifyPhoneOTP(phone, otpCode);
    setIsSubmitting(false);

    if (res.success) {
      if (res.isNewUser) {
        router.push('/profile/complete');
      }
    } else {
      setErrorMessage(res.error || 'Invalid OTP code. Try 123456');
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
              SRR <span className="text-emerald-400">Fresh</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest block mt-0.5">
              Grocery Delivery
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
            <span>Express Doorstep Delivery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Fresh Groceries Delivered <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500">
              Direct to Your Home
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Sign in or create an account with your mobile number to unlock daily discounts, cash on delivery, and express grocery arrival.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2 max-w-md mx-auto lg:mx-0">
            <div className="p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800 text-center">
              <Truck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">Express Speed</span>
            </div>
            <div className="p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800 text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">Fresh Produce</span>
            </div>
            <div className="p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800 text-center">
              <span className="text-base font-extrabold text-amber-400 block mb-0.5">COD</span>
              <span className="text-xs font-bold text-white block">Pay on Arrival</span>
            </div>
          </div>
        </div>

        {/* Right Side: Phone + OTP Sign In / Sign Up Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {step === 'PHONE' ? 'Sign In / Create Account' : 'Verify 6-Digit OTP'}
            </h2>
            <p className="text-xs text-neutral-400">
              {step === 'PHONE'
                ? 'Enter your 10-digit mobile number to proceed'
                : `Verification code sent to +91 ${phone.replace(/\D/g, '')}`}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold rounded-2xl text-center">
              {errorMessage}
            </div>
          )}

          {infoMessage && step === 'OTP' && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-2xl text-center flex items-center justify-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Form Step 1: Mobile Phone Number */}
          {step === 'PHONE' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Mobile Phone Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-sm font-black text-neutral-400 pointer-events-none">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-14 pr-4 py-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || phone.length < 10}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Get Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Form Step 2: 6-Digit OTP */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                    Enter OTP Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="text-xs font-bold text-emerald-400 hover:underline"
                  >
                    Edit Number
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.5em] py-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-xl font-black text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpCode.length < 6}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Verify & Unlock Grocery Store</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-neutral-500 font-medium">
                Demo Test Verification Code: <span className="font-bold text-emerald-400">123456</span>
              </p>
            </form>
          )}
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-neutral-500 border-t border-neutral-900">
        SRR Fresh Grocery Delivery © 2026 • Hyperlocal 15-Minute Doorstep Delivery
      </footer>
    </div>
  );
};
