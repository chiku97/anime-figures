import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { logout, setLoginDrawerOpen } from '../store/authSlice.js';
import FormoraLogo from './FormoraLogo.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(setLoginDrawerOpen(true));
    } else {
      navigate('/cart');
    }
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(setLoginDrawerOpen(true));
    } else {
      navigate('/profile');
    }
  };

  const handleCategoriesClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      // Navigate to home with state so Landing.jsx can scroll after mount
      navigate('/', { state: { scrollTo: 'categories' } });
    } else {
      // Already on home page — scroll directly
      const el = document.getElementById('categories');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav 
        style={{ backgroundColor: 'rgba(250, 249, 246, 0.9)' }}
        className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-200 py-4 px-6 md:px-12 flex items-center justify-between font-outfit"
      >
        
        <div className="flex items-center gap-2">
          {/* Mobile Hamburger Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
            title="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center group">
            <FormoraLogo compact={true} variant="dark" height="38px" className="group-hover:scale-105 transition-transform duration-300" />
          </Link>
        </div>

        {/* Nav Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider uppercase">
          <Link 
            to="/" 
            className={`transition-colors hover:text-accent ${location.pathname === '/' ? 'text-primary glow-primary' : 'text-secondary'}`}
          >
            Home
          </Link>
          <Link 
            to="/catalog" 
            className={`transition-colors hover:text-accent ${location.pathname === '/catalog' ? 'text-primary glow-primary' : 'text-secondary'}`}
          >
            Catalog
          </Link>
          {user?.role === 'admin' && (
            <Link 
              to="/admin/dashboard" 
              className={`transition-colors hover:text-accent ${location.pathname === '/admin/dashboard' ? 'text-primary glow-primary' : 'text-secondary'}`}
            >
              Admin Portal
            </Link>
          )}
          <a 
            href="#categories" 
            onClick={handleCategoriesClick}
            className="transition-colors hover:text-accent text-secondary"
          >
            Categories
          </a>
        </div>

        {/* Nav Actions (Cart / Auth) */}
        <div className="flex items-center gap-4">
          
          {/* Cart Trigger */}
          <button
            onClick={handleCartClick}
            className="relative p-2 text-secondary hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-warm-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Profile Details */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l border-gray-300 pl-4">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 p-1 text-secondary hover:text-primary transition-colors"
                title="User Profile"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-accent" />
                </div>
                <span className="hidden lg:inline text-xs font-semibold max-w-[100px] truncate">
                  {user?.name || 'Visitor'}
                </span>
              </button>
              
              <button
                onClick={() => dispatch(logout())}
                className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-gray-100 transition-all"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => dispatch(setLoginDrawerOpen(true))}
              className="px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-white rounded-lg text-sm font-bold tracking-wide transition-all shadow-sm hover:shadow-neon-accent"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer Card */}
          <div 
            style={{ backgroundColor: '#FAF9F6' }}
            className="relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 animate-[slideInLeft_0.3s_cubic-bezier(0.16,1,0.3,1)]"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-primary/10 flex items-center justify-between">
              <FormoraLogo compact={true} variant="dark" height="32px" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 text-xs font-black tracking-widest uppercase text-left">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`pb-2 border-b border-primary/5 transition-colors hover:text-accent ${location.pathname === '/' ? 'text-primary' : 'text-secondary'}`}
              >
                Home
              </Link>
              <Link 
                to="/catalog" 
                onClick={() => setMobileMenuOpen(false)}
                className={`pb-2 border-b border-primary/5 transition-colors hover:text-accent ${location.pathname === '/catalog' ? 'text-primary' : 'text-secondary'}`}
              >
                Catalog
              </Link>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`pb-2 border-b border-primary/5 transition-colors hover:text-accent ${location.pathname === '/admin/dashboard' ? 'text-primary' : 'text-secondary'}`}
                >
                  Admin Portal
                </Link>
              )}
              <a 
                href="#categories" 
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleCategoriesClick(e);
                }}
                className="pb-2 border-b border-primary/5 transition-colors hover:text-accent text-secondary"
              >
                Categories
              </a>
            </div>

            {/* User Account Session Info at bottom */}
            <div className="p-6 border-t border-primary/10 bg-primary/5">
              {isAuthenticated ? (
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary truncate max-w-[150px]">{user?.name || 'Visitor'}</p>
                      <button 
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                          handleProfileClick(e);
                        }}
                        className="text-[10px] text-accent uppercase font-black tracking-wider hover:underline"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      dispatch(logout());
                    }}
                    className="w-full py-2.5 border border-clay/40 text-clay hover:bg-clay hover:text-white rounded-lg text-xs font-extrabold uppercase tracking-widest transition-all"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    dispatch(setLoginDrawerOpen(true));
                  }}
                  className="w-full py-3 bg-accent text-white font-extrabold rounded-lg text-xs uppercase tracking-widest transition-all hover:shadow-neon-accent"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
