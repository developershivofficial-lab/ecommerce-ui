import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserDeliveryAddress } from '../types';

interface SendOtpResponse {
  success: boolean;
  simulated?: boolean;
  previewOtp?: string;
  message: string;
}

interface VerifyOtpResponse {
  success: boolean;
  verified?: boolean;
  message: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  sendEmailOtp: (email: string, name?: string) => Promise<SendOtpResponse>;
  verifyEmailOtp: (email: string, otp: string) => Promise<VerifyOtpResponse>;
  registerUser: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    password?: string;
    deliveryAddress: UserDeliveryAddress;
  }) => { success: boolean; message: string };
  loginUser: (email: string, password?: string) => { success: boolean; message: string };
  logoutUser: () => void;
  updateDeliveryAddress: (address: UserDeliveryAddress) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_SESSION_KEY = 'gopal_bags_user_session_v1';
const REGISTERED_USERS_KEY = 'gopal_bags_registered_users_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');

  // Sync session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_SESSION_KEY);
    }
  }, [currentUser]);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Brevo API: Send OTP to user email
  const sendEmailOtp = async (email: string, name?: string): Promise<SendOtpResponse> => {
    try {
      const res = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), name })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return {
          success: false,
          message: err.message || 'Failed to send verification code. Please check your email format.'
        };
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn('Brevo API network error, using fallback:', err);
      // Generate a client fallback code in emergency offline mode
      const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem(`offline_otp_${email.toLowerCase()}`, fallbackOtp);
      return {
        success: true,
        simulated: true,
        previewOtp: fallbackOtp,
        message: `Offline mode: verification code generated (${fallbackOtp}).`
      };
    }
  };

  // Brevo API: Verify OTP
  const verifyEmailOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Check offline fallback if server was unavailable
        const offlineCode = sessionStorage.getItem(`offline_otp_${email.toLowerCase()}`);
        if (offlineCode && offlineCode === otp.trim()) {
          sessionStorage.removeItem(`offline_otp_${email.toLowerCase()}`);
          return { success: true, verified: true, message: 'Email verified successfully!' };
        }
        return {
          success: false,
          message: data.message || 'Invalid or expired verification code.'
        };
      }

      return data;
    } catch (err) {
      const offlineCode = sessionStorage.getItem(`offline_otp_${email.toLowerCase()}`);
      if (offlineCode && offlineCode === otp.trim()) {
        sessionStorage.removeItem(`offline_otp_${email.toLowerCase()}`);
        return { success: true, verified: true, message: 'Email verified successfully!' };
      }
      return {
        success: false,
        message: 'Could not connect to verification server. Please try again.'
      };
    }
  };

  // Complete Registration after email verification and address details
  const registerUser = (userData: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    password?: string;
    deliveryAddress: UserDeliveryAddress;
  }): { success: boolean; message: string } => {
    try {
      const normalizedEmail = userData.email.trim().toLowerCase();
      const existingUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const existingUsers: Record<string, any> = existingUsersRaw ? JSON.parse(existingUsersRaw) : {};

      const newProfile: UserProfile = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: normalizedEmail,
        mobile: userData.mobile.trim(),
        isEmailVerified: true,
        deliveryAddress: userData.deliveryAddress,
        createdAt: new Date().toISOString()
      };

      existingUsers[normalizedEmail] = {
        profile: newProfile,
        password: userData.password || ''
      };

      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existingUsers));
      setCurrentUser(newProfile);
      setIsAuthModalOpen(false);

      return {
        success: true,
        message: `Welcome to Gopal Bags, ${userData.firstName}! Your account is active.`
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to save account details.'
      };
    }
  };

  // Sign In with email & password or direct verified session
  const loginUser = (email: string, password?: string): { success: boolean; message: string } => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const existingUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const existingUsers: Record<string, any> = existingUsersRaw ? JSON.parse(existingUsersRaw) : {};

      const userRecord = existingUsers[normalizedEmail];

      if (!userRecord) {
        return {
          success: false,
          message: 'No account found with this email. Please sign up first.'
        };
      }

      if (password && userRecord.password && userRecord.password !== password) {
        return {
          success: false,
          message: 'Incorrect password. Please verify and try again.'
        };
      }

      setCurrentUser(userRecord.profile);
      setIsAuthModalOpen(false);

      return {
        success: true,
        message: `Welcome back, ${userRecord.profile.firstName}!`
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to sign in.'
      };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_SESSION_KEY);
  };

  const updateDeliveryAddress = (address: UserDeliveryAddress) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      deliveryAddress: address
    };
    setCurrentUser(updated);

    // Update in registered users database as well
    try {
      const existingUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      if (existingUsersRaw) {
        const existingUsers = JSON.parse(existingUsersRaw);
        if (existingUsers[currentUser.email.toLowerCase()]) {
          existingUsers[currentUser.email.toLowerCase()].profile = updated;
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existingUsers));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        sendEmailOtp,
        verifyEmailOtp,
        registerUser,
        loginUser,
        logoutUser,
        updateDeliveryAddress
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
