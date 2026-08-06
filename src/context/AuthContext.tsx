'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { isFirebaseConfigured, auth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from '@/lib/firebase/client';
import { Profile, UserRole } from '@/types';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  sendPhoneOTP: (phone: string, recaptchaContainerId?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyPhoneOTP: (phone: string, otp: string) => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Load user session from localStorage or Supabase/Firebase on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('srr_user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved session', e);
      }
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        if (supabase && supabase.auth) {
          supabase.auth.getUser().then(async (res: any) => {
            const data = res?.data;
            if (data?.user) {
              const { data: dbProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

              const profile: Profile = {
                id: data.user.id,
                full_name: dbProfile?.full_name || data.user.user_metadata?.full_name || '',
                phone: dbProfile?.phone || data.user.phone || data.user.user_metadata?.phone || '',
                gender: dbProfile?.gender,
                date_of_birth: dbProfile?.date_of_birth,
                avatar_url: dbProfile?.avatar_url,
                is_profile_completed: dbProfile?.is_profile_completed ?? Boolean(dbProfile?.full_name),
                role: dbProfile?.role || (data.user.email?.includes('admin') ? 'admin' : 'customer'),
              };
              setUser(profile);
              localStorage.setItem('srr_user_session', JSON.stringify(profile));
            }
            setIsLoading(false);
          }).catch((err: any) => {
            console.error('Supabase auth error', err);
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Auth context init error', err);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Send 6-digit OTP code to Phone Number (Supports Firebase SMS, Supabase & Demo Mode)
  const sendPhoneOTP = async (phoneInput: string, recaptchaContainerId = 'recaptcha-container') => {
    setIsLoading(true);
    const cleanPhone = phoneInput.startsWith('+') ? phoneInput : `+91${phoneInput.replace(/\D/g, '')}`;

    // 1. Firebase Phone Auth (Sends real free SMS if Firebase credentials are added)
    if (isFirebaseConfigured() && typeof window !== 'undefined' && auth) {
      try {
        let recaptcha = (window as any).recaptchaVerifier;
        if (!recaptcha) {
          recaptcha = new RecaptchaVerifier(auth, recaptchaContainerId, {
            size: 'invisible',
            callback: () => {},
          });
          (window as any).recaptchaVerifier = recaptcha;
        }

        const confirmation = await signInWithPhoneNumber(auth, cleanPhone, recaptcha);
        setConfirmationResult(confirmation);
        setIsLoading(false);
        return {
          success: true,
          message: `Real SMS OTP sent to ${cleanPhone} via Firebase!`,
        };
      } catch (err: any) {
        console.error('Firebase SMS error:', err);
        // Fall back to demo mode if recaptcha or API key issue
      }
    }

    // 2. Supabase Phone Auth (if enabled)
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signInWithOtp({ phone: cleanPhone });
      } catch (e) {
        console.warn('Supabase OTP notice', e);
      }
    }

    setIsLoading(false);
    return {
      success: true,
      message: `OTP sent to ${cleanPhone}. (Demo code: 123456)`,
    };
  };

  // Verify Phone OTP (Supports Firebase SMS, Supabase & Demo 123456)
  const verifyPhoneOTP = async (phoneInput: string, otpCode: string) => {
    setIsLoading(true);
    const cleanPhone = phoneInput.startsWith('+') ? phoneInput : `+91${phoneInput.replace(/\D/g, '')}`;

    let authenticatedUserId: string | null = null;
    let metadataName = '';

    // 1. Verify with Firebase if confirmationResult is present
    if (confirmationResult && otpCode !== '123456') {
      try {
        const result = await confirmationResult.confirm(otpCode);
        if (result.user) {
          authenticatedUserId = result.user.uid;
          metadataName = result.user.displayName || '';
        }
      } catch (err: any) {
        console.error('Firebase OTP verification failed', err);
        setIsLoading(false);
        return { success: false, error: 'Invalid OTP code entered. Please try again.' };
      }
    }

    // 2. Verify with Supabase if configured
    if (!authenticatedUserId && isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.verifyOtp({
          phone: cleanPhone,
          token: otpCode,
          type: 'sms',
        });
        if (data?.user) {
          authenticatedUserId = data.user.id;
          metadataName = data.user.user_metadata?.full_name || '';
        }
      } catch (e) {
        console.error('Supabase OTP verify error', e);
      }
    }

    // 3. Fallback Demo Mode (123456)
    if (!authenticatedUserId) {
      if (otpCode !== '123456') {
        setIsLoading(false);
        return { success: false, error: 'Invalid OTP code. Use demo code 123456 or real Firebase SMS code.' };
      }
      authenticatedUserId = 'usr-' + cleanPhone.replace(/\D/g, '');
    }

    const sessionUser: Profile = {
      id: authenticatedUserId,
      full_name: metadataName || '',
      phone: cleanPhone,
      is_profile_completed: Boolean(metadataName),
      role: 'customer',
    };

    setUser(sessionUser);
    localStorage.setItem('srr_user_session', JSON.stringify(sessionUser));

    setIsLoading(false);
    return {
      success: true,
      isNewUser: !sessionUser.is_profile_completed,
    };
  };

  // Admin Login
  const loginAdmin = async (email: string, pass: string) => {
    setIsLoading(true);
    if (email === 'admin@srrfresh.com' && pass === 'admin123') {
      const adminUser: Profile = {
        id: 'admin-1',
        full_name: 'SRR Admin Manager',
        phone: '+91 9876543210',
        is_profile_completed: true,
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('srr_user_session', JSON.stringify(adminUser));
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: 'Invalid admin credentials' };
  };

  // Update Profile
  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const updated = {
      ...user,
      ...data,
      is_profile_completed: Boolean(data.full_name || user.full_name),
    };

    setUser(updated);
    localStorage.setItem('srr_user_session', JSON.stringify(updated));
    return { success: true };
  };

  // Logout
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('srr_user_session');
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        sendPhoneOTP,
        verifyPhoneOTP,
        loginAdmin,
        updateProfile,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
      {/* Invisible Recaptcha container for Firebase Phone Auth */}
      <div id="recaptcha-container" />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
