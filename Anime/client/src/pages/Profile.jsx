import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Award, Package, Clock } from 'lucide-react';
import { setLoginDrawerOpen } from '../store/authSlice.js';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setLoginDrawerOpen(true));
      navigate('/');
    }
  }, [isAuthenticated, dispatch, navigate]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-anime-bg flex items-center justify-center font-outfit">
        <p className="text-anime-textMuted">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-anime-bg py-10 px-6 md:px-12 font-outfit text-left z-10 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* User Card banner */}
        <div className="bg-anime-card border border-anime-border/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-20 h-20 rounded-full bg-anime-pink/20 border border-anime-pink/40 flex items-center justify-center text-anime-pink shadow-neon-pink">
            <User className="w-10 h-10" />
          </div>
          <div className="space-y-1 text-center md:text-left flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white uppercase">{user.name}</h2>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-anime-cyan/20 border border-anime-cyan/30 text-anime-cyan text-[10px] font-black uppercase tracking-wider self-center">
                {user.role} Account
              </span>
            </div>
            <p className="text-sm text-anime-textMuted">{user.email}</p>
          </div>
          <div className="shrink-0 text-xs font-semibold px-4 py-2 border border-anime-border rounded bg-anime-darker flex items-center gap-1.5 text-anime-textMuted">
            <Award className="w-4 h-4 text-anime-purple glow-purple" />
            Otaku Rank: Bronze
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Order history panel */}
          <div className="bg-anime-card border border-anime-border/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-anime-border/40 pb-3">
              <Package className="w-5 h-5 text-anime-cyan glow-cyan" />
              <h3 className="text-sm font-extrabold uppercase text-white tracking-widest">Order Vault</h3>
            </div>
            
            <div className="space-y-4">
              {/* Mock order entry */}
              <div className="p-4 rounded-lg bg-anime-darker border border-anime-border/60 text-xs space-y-3">
                <div className="flex justify-between items-center text-anime-textMuted">
                  <span>Order #HK-827632</span>
                  <span className="px-2 py-0.5 bg-green-900/40 text-green-400 font-bold border border-green-700/50 rounded">Delivered</span>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Gojo Satoru 1/7 Scale (Shibuya Incident Ver.)</p>
                  <p className="text-anime-textMuted mt-1">Date: May 12, 2026</p>
                </div>
                <div className="flex justify-between items-center border-t border-anime-border/40 pt-2 font-bold text-white">
                  <span>Paid: ₹18,999</span>
                  <span className="text-anime-cyan">Track Parcel</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-anime-darker/50 border border-anime-border/30 text-xs text-center text-anime-textMuted py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 text-anime-border" />
                No pending pre-orders.
              </div>
            </div>
          </div>

          {/* Account Settings / Security panel */}
          <div className="bg-anime-card border border-anime-border/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-anime-border/40 pb-3">
              <ShieldAlert className="w-5 h-5 text-anime-pink glow-pink" />
              <h3 className="text-sm font-extrabold uppercase text-white tracking-widest">Account Security</h3>
            </div>
            <div className="text-xs text-anime-textMuted leading-relaxed space-y-4">
              <p>
                Your account is currently secured via OTP Authentication. Future integration with MSG91 SMS and Passport.js Google OAuth will be configured here.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 border border-anime-border/50 rounded bg-anime-darker">
                  <span>Linked Phone:</span>
                  <strong className="text-white">{user.phone || 'Not Linked'}</strong>
                </div>
                <div className="flex justify-between items-center p-3 border border-anime-border/50 rounded bg-anime-darker">
                  <span>OTP Provider:</span>
                  <strong className="text-anime-cyan font-bold">MSG91 active</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
