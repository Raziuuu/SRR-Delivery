'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Profile, UserRole } from '@/types';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  sendPhoneOTP: (phone: string) => Promise<{ success: boolean; message?: string; error?: string }>;
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

  // Load user session from localStorage or Supabase on mount
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

  // Send 6-digit OTP code to Phone Number (Via MSG91 Real SMS API with Demo Fallback)
  const sendPhoneOTP = async (phoneInput: string) => {
    setIsLoading(true);
    const cleanPhone = phoneInput.startsWith('+') ? phoneInput : `+91${phoneInput.replace(/\D/g, '')}`;

    try {
      const res = await fetch('/api/msg91/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: cleanPhone }),
      });
      const data = await res.json();

      setIsLoading(false);
      return {
        success: true,
        message: data.message || `OTP sent to ${cleanPhone}!`,
      };
    } catch (error) {
      console.error('Send MSG91 OTP error', error);
      setIsLoading(false);
      return {
        success: true,
        message: `OTP request sent to ${cleanPhone}.`,
      };
    }
  };

  // Verify Phone OTP (Via MSG91 Real OTP Verification API)
  const verifyPhoneOTP = async (phoneInput: string, otpCode: string) => {
    setIsLoading(true);
    const cleanPhone = phoneInput.startsWith('+') ? phoneInput : `+91${phoneInput.replace(/\D/g, '')}`;

    try {
      const res = await fetch('/api/msg91/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: cleanPhone, otp: otpCode }),
      });
      const data = await res.json();

      if (!data.success) {
        setIsLoading(false);
        return {
          success: false,
          error: data.error || 'Invalid or expired OTP code entered',
        };
      }

      const authenticatedUserId = 'usr-' + cleanPhone.replace(/\D/g, '');
      const sessionUser: Profile = {
        id: authenticatedUserId,
        full_name: '',
        phone: cleanPhone,
        is_profile_completed: false,
        role: 'customer',
      };

      setUser(sessionUser);
      localStorage.setItem('srr_user_session', JSON.stringify(sessionUser));

      setIsLoading(false);
      return {
        success: true,
        isNewUser: true,
      };
    } catch (error) {
      console.error('Verify MSG91 OTP error', error);
      setIsLoading(false);
      return {
        success: false,
        error: 'Failed to verify OTP. Please try again.',
      };
    }
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
        if (supabase && supabase.auth) {
          await supabase.auth.signOut();
        }
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
