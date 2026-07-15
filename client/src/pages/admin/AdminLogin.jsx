import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowLeft, Sparkles } from 'lucide-react';
import { loginSuccess } from '../../store/authSlice.js';
import { addToast } from '../../store/toastSlice.js';
import apiClient from '../../api/client.js';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await apiClient.post('/api/auth/admin-login', {
        email,
        password,
      });

      if (response.data.success) {
        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          })
        );
        dispatch(
          addToast({
            message: 'Welcome back, Administrator!',
            type: 'success',
          })
        );
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(response.data.message || 'Authentication failed.');
      }
    } catch (err) {
      console.error('Admin Login Error:', err);
      setErrorMsg(
        err.response?.data?.message || 'Login connection failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center py-12 px-6 md:px-12 font-outfit relative">
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-sage/10 text-sage rounded-full mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-heading tracking-tight uppercase">
            Admin Portal
          </h1>
          <p className="text-sm text-secondary">
            Sign in with email and password to access the control panel.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-clay/10 border border-clay/30 text-clay text-sm rounded-lg p-3 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary">
              Admin Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Mail className="w-4 h-4 text-secondary" />
              </span>
              <input
                type="email"
                placeholder="admin@formorastudio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-sage hover:border-gray-400 transition-colors placeholder:text-gray-400 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Lock className="w-4 h-4 text-secondary" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-sage hover:border-gray-400 transition-colors placeholder:text-gray-400 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sage hover:bg-opacity-90 text-white font-semibold rounded-lg shadow-sm hover:shadow-neon-sage transition-all duration-300 flex justify-center items-center gap-2"
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
