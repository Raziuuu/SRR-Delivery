'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Smartphone, ArrowRight, ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { sendPhoneOTP, verifyPhoneOTP } = useAuth();

  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanDigits = phone.replace(/\D/g, '');

    if (cleanDigits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    const res = await sendPhoneOTP(phone);
    setIsSubmitting(false);

    if (res.success) {
      setStep('OTP');
      setInfoMessage(res.message || `OTP sent to +91 ${cleanDigits}`);
    } else {
      setErrorMessage(res.error || 'Failed to send OTP code');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otpCode.length < 6) {
      setErrorMessage('Please enter the 6-digit OTP code');
      return;
    }

    setIsSubmitting(true);
    const res = await verifyPhoneOTP(phone, otpCode);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
      if (res.isNewUser) {
        router.push('/profile/complete');
      }
    } else {
      setErrorMessage(res.error || 'Invalid OTP code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 p-6 md:p-8 space-y-6">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
            <Smartphone className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
            {step === 'PHONE' ? 'Sign In / Sign Up' : 'Verify Mobile OTP'}
          </h3>
          <p className="text-xs text-neutral-500 font-medium max-w-xs mx-auto">
            {step === 'PHONE'
              ? 'Enter your mobile number for instant OTP verification'
              : `Enter the 6-digit code sent to +91 ${phone.replace(/\D/g, '')}`}
          </p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-2xl border border-rose-200 text-center">
            {errorMessage}
          </div>
        )}

        {infoMessage && step === 'OTP' && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-2xl border border-emerald-200 text-center flex items-center justify-center space-x-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Step 1: Phone Input Form */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-1.5">
                Mobile Phone Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-sm font-extrabold text-neutral-700 pointer-events-none">
                  +91
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-14 pr-4 py-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-base font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || phone.length < 10}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:bg-neutral-300"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Send Verification OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification Form */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                  Enter 6-Digit OTP Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  Change Number
                </button>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.5em] py-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xl font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otpCode.length < 6}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:bg-neutral-300"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span>Verify OTP & Sign In</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-neutral-400 font-medium">
              Demo Test Code: <span className="font-bold text-emerald-700">123456</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
