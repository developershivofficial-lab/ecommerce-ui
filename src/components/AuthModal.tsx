import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building,
  Home,
  Briefcase,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserDeliveryAddress } from '../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Delhi NCR', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

interface AuthModalProps {
  onSuccessToast?: (title: string, message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccessToast }) => {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    sendEmailOtp,
    verifyEmailOtp,
    registerUser,
    loginUser
  } = useAuth();

  // Wizard Step for Sign Up: 1 = Basic Info, 2 = Email Verification, 3 = Delivery Address
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInWithOtp, setSignInWithOtp] = useState(false);
  const [signInOtp, setSignInOtp] = useState('');

  // Sign Up Form States: Step 1 (Personal Details)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up Form States: Step 2 (Brevo Email Verification)
  const [otpCode, setOtpCode] = useState('');
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Sign Up Form States: Step 3 (Delivery Address & Other Details)
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [alternatePhone, setAlternatePhone] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setSignupStep(1);
      setErrorMessage(null);
      setOtpCode('');
      setOtpNotice(null);
    }
  }, [isAuthModalOpen, authModalMode]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  // STEP 1 HANDLER: Validate & Send Brevo Email OTP
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter both your first name and last name.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please provide a valid email address for verification.');
      return;
    }

    const cleanPhone = mobile.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const res = await sendEmailOtp(cleanEmail, fullName);
    setIsLoading(false);

    if (res.success) {
      setSignupStep(2);
      setResendCooldown(60);
      setOtpNotice(res.message || 'Verification code sent to your email.');
    } else {
      setErrorMessage(res.message || 'Could not send verification email. Please retry.');
    }
  };

  // STEP 2 HANDLER: Verify Brevo OTP Code
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanOtp = otpCode.trim();
    if (cleanOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    const res = await verifyEmailOtp(email, cleanOtp);
    setIsLoading(false);

    if (res.success) {
      setSignupStep(3);
    } else {
      setErrorMessage(res.message || 'Invalid verification code. Please check your email and try again.');
    }
  };

  // Resend OTP via Brevo
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage(null);
    setIsLoading(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const res = await sendEmailOtp(email, fullName);
    setIsLoading(false);

    if (res.success) {
      setResendCooldown(60);
      setOtpNotice(res.message || 'New verification code sent to your email.');
    } else {
      setErrorMessage(res.message || 'Failed to resend code.');
    }
  };

  // STEP 3 HANDLER: Save Delivery Address & Finalize Registration
  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!street.trim()) {
      setErrorMessage('Please enter your flat, house no. or street address.');
      return;
    }

    if (!city.trim()) {
      setErrorMessage('Please enter your city.');
      return;
    }

    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    const deliveryAddress: UserDeliveryAddress = {
      street: street.trim(),
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state: stateName,
      pincode: cleanPin,
      addressType,
      alternatePhone: alternatePhone.trim() || undefined
    };

    const result = registerUser({
      firstName,
      lastName,
      email,
      mobile,
      password,
      deliveryAddress
    });

    if (result.success) {
      if (onSuccessToast) {
        onSuccessToast('Account Created!', `Welcome to Gopal Bags, ${firstName}! Your email is verified.`);
      }
    } else {
      setErrorMessage(result.message);
    }
  };

  // SIGN IN SUBMIT HANDLER
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signInEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (signInWithOtp) {
      if (!signInOtp.trim()) {
        // Send OTP first
        setIsLoading(true);
        const res = await sendEmailOtp(signInEmail);
        setIsLoading(false);
        if (res.success) {
          setOtpNotice(res.message || 'Verification code sent to your email.');
          setResendCooldown(60);
        } else {
          setErrorMessage(res.message || 'Failed to send verification code.');
        }
        return;
      }

      // Verify OTP and sign in
      setIsLoading(true);
      const verifyRes = await verifyEmailOtp(signInEmail, signInOtp);
      setIsLoading(false);

      if (verifyRes.success) {
        const loginRes = loginUser(signInEmail);
        if (loginRes.success) {
          if (onSuccessToast) {
            onSuccessToast('Signed In', loginRes.message);
          }
        } else {
          setErrorMessage(loginRes.message);
        }
      } else {
        setErrorMessage(verifyRes.message);
      }
      return;
    }

    // Password sign in
    if (!signInPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const res = loginUser(signInEmail, signInPassword);
    if (res.success) {
      if (onSuccessToast) {
        onSuccessToast('Signed In', res.message);
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-zinc-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg bg-white rounded-3xl border border-yellow-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-6 py-4 flex items-center justify-between text-zinc-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-['Outfit',sans-serif] tracking-tight leading-none">
                {authModalMode === 'signup' ? 'Gopal Bags Member Registration' : 'Welcome Back'}
              </h2>
              <p className="text-[11px] font-semibold text-zinc-800 mt-0.5">
                {authModalMode === 'signup'
                  ? `Step ${signupStep} of 3: ${
                      signupStep === 1
                        ? 'Personal Details'
                        : signupStep === 2
                        ? 'Brevo Email Verification'
                        : 'Delivery Address'
                    }`
                  : 'Sign in to access your orders & saved bags'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full bg-zinc-950/10 hover:bg-zinc-950/20 text-zinc-900 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar for Sign Up */}
        {authModalMode === 'signup' && (
          <div className="px-6 pt-3 pb-1 border-b border-yellow-100 bg-amber-50/40 shrink-0">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600 mb-1.5">
              <span className={signupStep >= 1 ? 'text-amber-700' : 'text-zinc-400'}>
                1. Basic Info
              </span>
              <span className={signupStep >= 2 ? 'text-amber-700' : 'text-zinc-400'}>
                2. Email Verify (Brevo)
              </span>
              <span className={signupStep >= 3 ? 'text-amber-700' : 'text-zinc-400'}>
                3. Delivery Address
              </span>
            </div>
            <div className="w-full h-1.5 bg-yellow-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                style={{ width: `${(signupStep / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Error Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Brevo / OTP Dev Preview Notice */}
          {otpNotice && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2"
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Brevo Verification: </span>
                <span>{otpNotice}</span>
              </div>
            </motion.div>
          )}

          {/* =================================================== */}
          {/* SIGN UP FLOW: STEP 1 (FIRST NAME, LAST NAME, EMAIL, MOBILE) */}
          {/* =================================================== */}
          {authModalMode === 'signup' && signupStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="text-xs text-zinc-500 font-medium">
                Enter your details to create your handcrafted bag shopping account.
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Email Address * (For Brevo verification)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  A 6-digit confirmation code will be sent to this email via Brevo.
                </p>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Mobile Number *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-zinc-500 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all tracking-wider"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-[0.99] text-zinc-950 font-black text-xs shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Code via Brevo...</span>
                  </>
                ) : (
                  <>
                    <span>Next: Verify Email Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-zinc-500">Already registered? </span>
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  Sign In here
                </button>
              </div>
            </form>
          )}

          {/* =================================================== */}
          {/* SIGN UP FLOW: STEP 2 (BREVO EMAIL VERIFICATION) */}
          {/* =================================================== */}
          {authModalMode === 'signup' && signupStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-yellow-200 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 font-['Outfit',sans-serif]">
                  Email Verification Code
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  We have sent a 6-digit OTP to <strong className="text-zinc-900">{email}</strong> via Brevo.
                </p>
                <p className="text-[11px] text-amber-800/80 mt-1 font-medium">
                  Please check your inbox (and Spam or Promotions folder if not in Inbox).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <div className="relative max-w-[240px] mx-auto">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-2xl tracking-[12px] font-mono font-bold py-3 rounded-2xl bg-zinc-50 border-2 border-amber-300 text-zinc-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <p className="text-[11px] text-zinc-400 text-center mt-2">
                  Code expires in 10 minutes.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleResendOtp}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 disabled:text-zinc-400 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code via Brevo'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSignupStep(1)}
                  className="py-3 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Edit Info</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-[0.99] text-zinc-950 font-black text-xs shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* =================================================== */}
          {/* SIGN UP FLOW: STEP 3 (DELIVERY ADDRESS & DETAILS) */}
          {/* =================================================== */}
          {authModalMode === 'signup' && signupStep === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Email verified successfully! Now provide your delivery address for doorstep orders.</span>
              </div>

              {/* Address Type */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressType(type)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        addressType === type
                          ? 'border-amber-500 bg-amber-50 text-zinc-950 shadow-xs'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      {type === 'Home' && <Home className="w-3.5 h-3.5" />}
                      {type === 'Work' && <Briefcase className="w-3.5 h-3.5" />}
                      {type === 'Other' && <Building className="w-3.5 h-3.5" />}
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  House / Flat No. & Street Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Flat 402, Royal Residency, M.G. Road"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* Landmark & PIN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Landmark / Area (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Near City Mall"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="400001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all tracking-wider"
                  />
                </div>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    State *
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Alternate Phone */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Alternate Phone (Optional)
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Alternate phone for delivery coordinator"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-[0.99] text-zinc-950 font-black text-xs shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Account & Start Shopping</span>
              </button>
            </form>
          )}

          {/* =================================================== */}
          {/* SIGN IN FLOW */}
          {/* =================================================== */}
          {authModalMode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="flex items-center justify-between p-1 bg-zinc-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSignInWithOtp(false)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !signInWithOtp ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => setSignInWithOtp(true)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    signInWithOtp ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500'
                  }`}
                >
                  Brevo Email OTP
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {!signInWithOtp ? (
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Enter Verification OTP
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit Brevo code"
                      value={signInOtp}
                      onChange={(e) => setSignInOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-all font-mono tracking-widest"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-[0.99] text-zinc-950 font-black text-xs shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>{signInWithOtp && !signInOtp ? 'Send Brevo OTP' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-zinc-500">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  Register (3-Step Setup)
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
