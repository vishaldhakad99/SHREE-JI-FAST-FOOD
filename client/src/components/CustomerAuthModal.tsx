import React, { useState, useEffect } from 'react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
  X,
  Phone,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, sendOtp, verifyOtp } = useCustomerAuth();

  const [authType, setAuthType] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);

  // Reset modal state whenever opened
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('input');
      setOtp('');
      setError(null);
      setInfoMessage(null);
      setPreviewOtp(null);
      setResendTimer(30);
    }
  }, [isAuthModalOpen]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isAuthModalOpen) return null;

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setError(authType === 'phone' ? 'Please enter your mobile number' : 'Please enter your email address');
      return;
    }

    if (authType === 'phone') {
      const digitsOnly = cleanInput.replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        setError('Please enter a valid 10-digit Indian mobile number');
        return;
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanInput)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setIsLoading(true);
    const res = await sendOtp(cleanInput, authType, name);
    setIsLoading(false);

    if (res.success) {
      setStep('verify');
      setResendTimer(30);
      setInfoMessage(res.message);
      if (res.previewOtp) {
        setPreviewOtp(res.previewOtp);
      }
    } else {
      setError(res.message);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length < 4) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    const res = await verifyOtp(identifier.trim(), cleanOtp, name);
    setIsLoading(false);

    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deepbrown-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-cream-300 overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-saffron-600 via-amber-500 to-warmamber-400" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-saffron-600 to-amber-500 flex items-center justify-center text-white shadow-md mb-3">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-deepbrown-900 leading-tight">
              SHREE JI FAST FOOD
            </h3>
            <p className="text-xs text-saffron-700 font-bold uppercase tracking-wider mt-0.5">
              Ghar Jaisa Swad, Har Din Kuch Khaas!
            </p>
            <p className="text-xs text-stone-600 mt-2">
              {step === 'input'
                ? 'Order karne ke liye please apna Mobile ya Gmail verify karein'
                : `Verification code sent to ${identifier}`}
            </p>
          </div>

          {/* Error / Alert Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <span className="font-bold">⚠️</span>
              <span className="flex-1 leading-snug">{error}</span>
            </div>
          )}

          {/* Info Message */}
          {infoMessage && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span className="flex-1 leading-snug">{infoMessage}</span>
            </div>
          )}

          {/* Test / Demo OTP Banner (Helper for testing) */}
          {previewOtp && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold block">Testing / Demo OTP:</span>
                <span className="font-mono font-black text-base text-emerald-700 tracking-wider">
                  {previewOtp}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOtp(previewOtp)}
                className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
              >
                Auto Fill
              </button>
            </div>
          )}

          {step === 'input' ? (
            <div>
              {/* Auth Method Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthType('phone');
                    setError(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    authType === 'phone'
                      ? 'bg-white text-saffron-700 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  Mobile Number
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthType('email');
                    setError(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    authType === 'email'
                      ? 'bg-white text-saffron-700 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Gmail / Email
                </button>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                {/* Optional Customer Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name (Aapka Naam)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Vishal Dhakad"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Identifier Input */}
                {authType === 'phone' ? (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 text-sm font-semibold text-stone-600 bg-stone-100 border border-r-0 border-stone-200 rounded-l-xl">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white transition-all tracking-wide font-medium"
                        required
                        autoFocus
                      />
                    </div>
                    <p className="text-[10px] text-stone-600 mt-1">
                      Aapke mobile par 6-digit OTP verification aayega
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Gmail Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white transition-all"
                        required
                        autoFocus
                      />
                    </div>
                    <p className="text-[10px] text-stone-600 mt-1">
                      Aapke Gmail inbox me verification code bheja jayega
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-saffron-600 to-amber-600 text-white font-bold text-sm rounded-xl shadow-md hover:from-saffron-700 hover:to-amber-700 transition-all disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      {authType === 'phone' ? 'Send Mobile OTP' : 'Send Gmail Code'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* Step 2: Verify Code */}
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-stone-700">
                      Enter 6-Digit Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep('input')}
                      className="text-xs font-semibold text-saffron-700 hover:underline flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" /> Change {authType === 'phone' ? 'Number' : 'Email'}
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full py-3 px-4 text-center text-2xl font-mono font-black tracking-widest text-deepbrown-900 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white transition-all"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 4}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-saffron-600 to-amber-600 text-white font-bold text-sm rounded-xl shadow-md hover:from-saffron-700 hover:to-amber-700 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Verify & Start Ordering
                    </>
                  )}
                </button>

                {/* Resend Code Section */}
                <div className="text-center pt-2">
                  {resendTimer > 0 ? (
                    <span className="text-xs text-stone-600 font-medium">
                      Resend code in <strong className="text-saffron-700">{resendTimer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendCode()}
                      disabled={isLoading}
                      className="text-xs font-bold text-saffron-700 hover:text-saffron-800 hover:underline"
                    >
                      Didn't get code? Resend Code
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Trust Banner at Bottom */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>100% Secure Login • Fresh Daily Food Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
