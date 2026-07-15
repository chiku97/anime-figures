import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Sparkles, Mail } from 'lucide-react';
import { loginSuccess, setLoginDrawerOpen } from '../store/authSlice.js';
import apiClient from '../api/client.js';
import { auth } from '../config/firebase.js';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const LoginDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.auth.loginDrawerOpen);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiClient.post('/api/auth/google-login', { credential: response.credential });
      if (res.data.success) {
        dispatch(loginSuccess({
          user: res.data.user,
          token: res.data.token
        }));
        handleClose();
      } else {
        setErrorMsg(res.data.message || 'Google Login failed.');
      }
    } catch (err) {
      console.error('Google Sign-In backend verification failed:', err);
      setErrorMsg(err.response?.data?.message || 'Google connection failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let checkGoogle;
    if (isOpen) {
      // Check if google script is loaded on window
      checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          setGoogleAvailable(true);
          try {
            window.google.accounts.id.initialize({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com',
              callback: handleGoogleCredentialResponse,
            });
            window.google.accounts.id.renderButton(
              document.getElementById('google-signin-btn-div'),
              { theme: 'outline', size: 'large', width: '380' }
            );
          } catch (e) {
            console.warn('Google Identity initialization failed:', e);
          }
        }
      }, 150);
    }

    return () => {
      if (checkGoogle) clearInterval(checkGoogle);
    };
  }, [isOpen]);

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
    const isPhone = /^\+?[0-9]{10,14}$/.test(phoneOrEmail.replace(/[\s-]/g, ''));

    if (isPhone && auth) {
      try {
        const formattedPhone = phoneOrEmail.startsWith('+') ? phoneOrEmail : `+91${phoneOrEmail}`;
        console.log('[FIREBASE AUTH] Dispatching OTP to:', formattedPhone);

        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA resolved');
          }
        });

        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
        window.confirmationResult = confirmationResult;
        setOtpSent(true);
        console.log('[FIREBASE AUTH] OTP sent successfully');
      } catch (err) {
        console.error('[FIREBASE AUTH] Send OTP failed:', err);
        setErrorMsg(err.message || 'Failed to dispatch SMS verification. Please try again.');
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await apiClient.post('/api/auth/send-otp', { phoneOrEmail });
        if (res.data.success) {
          setOtpSent(true);
        } else {
          setErrorMsg(res.data.message || 'Failed to send verification code.');
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Failed to send verification code. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setErrorMsg('Please enter the 6-digit OTP.');

    setLoading(true);
    setErrorMsg('');
    const confirmationResult = window.confirmationResult;

    if (confirmationResult) {
      try {
        console.log('[FIREBASE AUTH] Confirming verification code...');
        const result = await confirmationResult.confirm(otp);
        const idToken = await result.user.getIdToken();
        console.log('[FIREBASE AUTH] Verification successful! Authenticating on backend...');

        const response = await apiClient.post('/api/auth/firebase-login', { idToken });
        if (response.data.success) {
          dispatch(loginSuccess({
            user: response.data.user,
            token: response.data.token
          }));
          handleClose();
        } else {
          setErrorMsg(response.data.message || 'Failed to provision session on backend.');
        }
      } catch (err) {
        console.error('[FIREBASE AUTH] Code verification failed:', err);
        setErrorMsg(err.message || 'Invalid verification code. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await apiClient.post('/api/auth/verify-otp', { phoneOrEmail, otp });
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-outfit">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Sliding Drawer Container */}
      <div className="relative w-full max-w-md bg-warm-white border-l border-gray-200 text-primary h-full flex flex-col shadow-2xl z-10 transition-transform duration-300 ease-out transform translate-x-0">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sage" />
            <h3 className="text-lg font-bold tracking-wider uppercase text-primary">Formora Account</h3>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1 rounded-full text-secondary hover:text-primary hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col justify-center">
          
          {/* Welcome Banner */}
          <div className="text-center mb-8">
            <h4 className="text-2xl font-extrabold text-heading">
              Studio Member Access
            </h4>
            <p className="text-sm text-secondary mt-2">
              Log in to access your cart, check out curated figures, and view order tracking.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-clay/10 border border-clay/30 text-clay text-sm rounded-lg p-3 mb-6">
              {errorMsg}
            </div>
          )}

          <div id="recaptcha-container"></div>

          {!otpSent ? (
            /* Step 1: Input Email/Phone */
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                  Enter Mobile Number or Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Mail className="w-4 h-4 text-secondary" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. creator@formorastudio.com or 9876543210"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-sage hover:border-gray-400 transition-colors placeholder:text-gray-400"
                    required
                  />
                </div>
                <p className="text-[11px] text-secondary mt-2">
                  We'll send an OTP code via Email or WhatsApp (MSG91 integration preview).
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sage hover:bg-opacity-90 text-white font-semibold rounded-lg shadow-sm hover:shadow-neon-sage transition-all duration-300"
              >
                {loading ? 'Sending...' : 'Get OTP Code'}
              </button>
            </form>
          ) : (
            /* Step 2: Verification Code Input */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full tracking-[0.5em] text-center text-2xl py-3 rounded-lg bg-white border border-gray-300 text-primary font-bold focus:outline-none focus:border-sage"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-clay hover:bg-opacity-90 text-white font-bold rounded-lg shadow-sm hover:shadow-neon-clay transition-all duration-300"
              >
                {loading ? 'Verifying...' : 'Verify & Enter'}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full py-2 bg-transparent text-sm hover:text-primary text-secondary font-semibold transition-colors"
              >
                Change Email / Mobile Number
              </button>
            </form>
          )}

          {/* Social login integration */}
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
            <div className="relative flex justify-center text-xs uppercase mb-2">
              <span className="bg-warm-white px-3 text-secondary">Or Connect With</span>
            </div>
            
            {/* Official Google Sign In Button Container */}
            <div className="flex justify-center">
              <div id="google-signin-btn-div" className="w-full min-h-[44px]"></div>
            </div>
          </div>
        </div>

        {/* Footer cancel option */}
        <div className="p-6 border-t border-gray-200 text-center">
          <button 
            type="button" 
            onClick={handleClose} 
            className="text-xs font-semibold text-sage hover:text-opacity-80 transition-colors tracking-widest uppercase"
          >
            Cancel and continue browsing
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginDrawer;
