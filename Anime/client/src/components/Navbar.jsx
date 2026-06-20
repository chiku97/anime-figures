import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User as UserIcon, LogOut, Flame } from 'lucide-react';
import { logout, setLoginDrawerOpen } from '../store/authSlice.js';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

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

  return (
    <nav className="sticky top-0 z-40 bg-anime-bg/85 backdrop-blur-md border-b border-anime-border/50 py-4 px-6 md:px-12 flex items-center justify-between font-outfit">
      
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="p-1.5 bg-anime-pink rounded-lg shadow-neon-pink group-hover:scale-110 transition-transform">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <span className="font-manga text-2xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-anime-pink group-hover:glow-pink transition-all">
          HIKARI
        </span>
      </Link>

      {/* Nav Navigation Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider uppercase">
        <Link 
          to="/" 
          className={`transition-colors hover:text-anime-pink ${location.pathname === '/' ? 'text-anime-pink glow-pink' : 'text-gray-300'}`}
        >
          Home
        </Link>
        <Link 
          to="/catalog" 
          className={`transition-colors hover:text-anime-pink ${location.pathname === '/catalog' ? 'text-anime-pink glow-pink' : 'text-gray-300'}`}
        >
          Catalog
        </Link>
        <a 
          href="#categories" 
          className="transition-colors hover:text-anime-pink text-gray-300"
        >
          Categories
        </a>
      </div>

      {/* Nav Actions (Search / Cart / Auth) */}
      <div className="flex items-center gap-4">
        
        {/* Cart Trigger */}
        <button
          onClick={handleCartClick}
          className="relative p-2 text-gray-300 hover:text-anime-cyan hover:bg-anime-border/30 rounded-lg transition-all"
          title="Shopping Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-anime-pink text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-anime-bg animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Account / Profile Details */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3 border-l border-anime-border/50 pl-4">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 p-1 text-gray-300 hover:text-anime-pink transition-colors"
              title="User Profile"
            >
              <div className="w-8 h-8 rounded-full bg-anime-purple/20 border border-anime-purple/40 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-anime-purple" />
              </div>
              <span className="hidden lg:inline text-xs font-semibold max-w-[100px] truncate">
                {user?.name || 'Otaku'}
              </span>
            </button>
            
            <button
              onClick={() => dispatch(logout())}
              className="p-2 text-gray-400 hover:text-anime-pink rounded-lg hover:bg-anime-border/30 transition-all"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => dispatch(setLoginDrawerOpen(true))}
            className="px-4 py-2 border border-anime-pink text-anime-pink hover:bg-anime-pink hover:text-white rounded-lg text-sm font-bold tracking-wide transition-all shadow-sm hover:shadow-neon-pink"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
