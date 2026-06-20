import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ShieldCheck, CreditCard } from 'lucide-react';
import { removeFromCart, updateQty, clearCart } from '../store/cartSlice.js';
import { setLoginDrawerOpen } from '../store/authSlice.js';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);

  // Guard access on Mount
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setLoginDrawerOpen(true));
      navigate('/');
    }
  }, [isAuthenticated, dispatch, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-anime-bg flex items-center justify-center font-outfit">
        <p className="text-anime-textMuted">Redirecting for authentication...</p>
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shippingFee = subtotal > 10000 ? 0 : 250;
  const grandTotal = subtotal + shippingFee;

  const handleCheckout = () => {
    alert('Mock Razorpay Checkout! Order successfully placed.');
    dispatch(clearCart());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-anime-bg py-10 px-6 md:px-12 font-outfit text-left z-10 relative">
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider mb-8">
          Shopping Cart ({cartItems.length} items)
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-anime-card border border-anime-border/40 rounded-xl p-12 text-center space-y-6">
            <ShoppingBag className="w-16 h-16 text-anime-pink mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-white uppercase mb-2">Your cart is empty</h3>
              <p className="text-sm text-anime-textMuted max-w-sm mx-auto leading-relaxed">
                Add rare collectibles and limited-edition statues to start your anime collection!
              </p>
            </div>
            <Link 
              to="/catalog" 
              className="inline-block px-8 py-3 bg-anime-pink hover:bg-anime-pinkGlow text-white font-bold rounded-lg transition-colors shadow-neon-pink"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-anime-card border border-anime-border/40 rounded-xl p-4 flex gap-4 items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-anime-darker border border-anime-border/40 flex items-center justify-center p-1">
                      <img src={item.image} alt={item.title} className="object-cover h-full rounded" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-anime-textMuted mt-0.5">Scale: {item.scale}</p>
                      <p className="text-xs text-anime-pink mt-1 font-bold">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-anime-border/60 rounded bg-anime-darker text-xs">
                      <button 
                        onClick={() => dispatch(updateQty({ id: item.id, qty: Math.max(1, item.qty - 1) }))}
                        className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-anime-border/30"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-white">{item.qty}</span>
                      <button 
                        onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
                        className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-anime-border/30"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="p-2 text-gray-500 hover:text-anime-pink hover:bg-anime-border/30 rounded-lg transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-xs font-semibold text-anime-textMuted hover:text-anime-pink transition-colors uppercase tracking-wider"
                >
                  Clear Cart
                </button>
                <Link 
                  to="/catalog"
                  className="text-xs font-semibold text-anime-cyan hover:underline uppercase tracking-wider"
                >
                  + Add More Figures
                </Link>
              </div>

            </div>

            {/* Price Details Card */}
            <div>
              <div className="bg-anime-card border border-anime-border/50 rounded-xl p-5 space-y-6">
                
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-white border-b border-anime-border/40 pb-3">
                  Price Details
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-anime-textMuted">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-anime-textMuted">
                    <span>Customs Duties</span>
                    <span className="text-green-500 font-bold">FREE (Fully Covered)</span>
                  </div>
                  <div className="flex justify-between text-anime-textMuted">
                    <span>Delivery Charges</span>
                    <span>{shippingFee === 0 ? <strong className="text-green-500">FREE</strong> : `₹${shippingFee}`}</span>
                  </div>
                  
                  <div className="border-t border-anime-border/40 pt-4 flex justify-between font-extrabold text-base text-white">
                    <span>Grand Total</span>
                    <span className="text-anime-pink">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-anime-pink hover:bg-anime-pinkGlow text-white font-bold rounded-lg shadow-neon-pink flex items-center justify-center gap-2 uppercase text-xs tracking-wider transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  Proceed to Checkout
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-anime-textMuted">
                  <ShieldCheck className="w-4 h-4 text-anime-cyan" />
                  <span>Licensed Guarantee and Double-box Transit</span>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
