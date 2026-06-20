import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Sparkles, Phone, Mail } from 'lucide-react';
import { loginSuccess, setLoginDrawerOpen } from '../store/authSlice.js';
import apiClient from '../api/client.js';

const LoginDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.auth.loginDrawerOpen);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(setLoginDrawerOpen(false));
    setErrorMsg('');
    setOtpSent(false);
    setOtp('');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneOrEmail) return setErrorMsg('Please enter an email or phone number.');
    
    setLoading(true);
    setErrorMsg('');
    try {
      // Simulate sending OTP or triggering MSG91 sequence
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
      }, 800);
    } catch (err) {
      setErrorMsg('Failed to send verification code. Please try again.');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setErrorMsg('Please enter the 6-digit OTP.');
    if (otp !== '123456' && otp !== '111111') {
      return setErrorMsg('Invalid OTP. Use "123456" for mock login.');
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const response = await apiClient.post('/api/auth/mock-login', { phoneOrEmail });
      if (response.data.success) {
        dispatch(loginSuccess({
          user: response.data.user,
          token: response.data.token
        }));
        handleClose();
      } else {
        setErrorMsg(response.data.message || 'Login failed.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-outfit">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Sliding Drawer Container */}
      <div className="relative w-full max-w-md bg-anime-card border-l border-anime-border/40 text-gray-100 h-full flex flex-col shadow-2xl z-10 transition-transform duration-300 ease-out transform translate-x-0">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-anime-border/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-anime-pink glow-pink" />
            <h3 className="text-xl font-bold tracking-wider">HIKARI ACCOUNT</h3>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-anime-border/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col justify-center">
          
          {/* Welcome Banner */}
          <div className="text-center mb-8">
            <h4 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-anime-pink via-anime-purple to-anime-cyan">
              Manga & Figure Realm
            </h4>
            <p className="text-sm text-anime-textMuted mt-2">
              Log in to access your cart, check out rare collectibles, and view order tracking.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-anime-pink/10 border border-anime-pink/30 text-anime-pink text-sm rounded-lg p-3 mb-6">
              {errorMsg}
            </div>
          )}

          {!otpSent ? (
            /* Step 1: Input Email/Phone */
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-anime-textMuted mb-2">
                  Enter Mobile Number or Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Mail className="w-4 h-4 text-anime-textMuted" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. otaku@hikari.com or 9876543210"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-anime-darker border border-anime-border/60 text-white focus:outline-none focus:border-anime-pink hover:border-anime-border transition-colors placeholder:text-gray-600"
                    required
                  />
                </div>
                <p className="text-[11px] text-anime-textMuted mt-2">
                  We'll send an OTP code via Email or WhatsApp (MSG91 integration preview).
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-anime-pink hover:bg-anime-pinkGlow text-white font-semibold rounded-lg shadow-neon-pink transition-all duration-300"
              >
                {loading ? 'Sending...' : 'Get OTP Code'}
              </button>
            </form>
          ) : (
            /* Step 2: Verification Code Input */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-anime-textMuted mb-2">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter code (use 123456)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full tracking-[0.5em] text-center text-2xl py-3 rounded-lg bg-anime-darker border border-anime-border/60 text-white font-bold focus:outline-none focus:border-anime-cyan"
                  required
                />
                <p className="text-xs text-anime-cyan mt-3 text-center glow-cyan">
                  * Demo bypass: Enter <strong>123456</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-anime-cyan hover:bg-cyan-400 text-anime-darker font-bold rounded-lg shadow-neon-cyan transition-all duration-300"
              >
                {loading ? 'Verifying...' : 'Verify & Enter Realm'}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full py-2 bg-transparent text-sm hover:text-white text-anime-textMuted font-semibold transition-colors"
              >
                Change Email / Mobile Number
              </button>
            </form>
          )}

          {/* Social login mock */}
          <div className="mt-8 pt-8 border-t border-anime-border/40">
            <div className="relative flex justify-center text-xs uppercase mb-6">
              <span className="bg-anime-card px-3 text-anime-textMuted">Or Connect With</span>
            </div>
            
            <button
              onClick={() => {
                dispatch(loginSuccess({
                  user: { id: 'g-123', name: 'Google Otaku', email: 'google.otaku@gmail.com', role: 'buyer' },
                  token: 'mock-google-oauth-token-123'
                }));
                handleClose();
              }}
              className="w-full flex items-center justify-center gap-3 py-3 border border-anime-border hover:bg-anime-border/40 rounded-lg text-sm font-semibold transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.13-5.136 4.13A5.78 5.78 0 0 1 8.2 12.75a5.78 5.78 0 0 1 5.79-5.78c1.545 0 2.955.59 4.027 1.56l3.056-3.056A9.92 9.92 0 0 0 13.99 2 9.99 9.99 0 0 0 4 12a9.99 9.99 0 0 0 9.99 10c5.513 0 9.99-4.477 9.99-10 0-.685-.06-1.353-.18-2H12.24z"
                />
              </svg>
              Sign In with Google
            </button>
          </div>

        </div>

        {/* Footer cancel option */}
        <div className="p-6 border-t border-anime-border/40 text-center">
          <button 
            type="button" 
            onClick={handleClose} 
            className="text-sm font-semibold text-anime-pink hover:text-anime-pinkGlow transition-colors tracking-wide"
          >
            CANCEL AND CONTINUE GUEST BROWSING
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginDrawer;
