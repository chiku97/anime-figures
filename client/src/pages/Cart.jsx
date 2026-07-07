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
      <div className="min-h-screen bg-warm-white flex items-center justify-center font-outfit text-primary">
        <p className="text-secondary">Redirecting for authentication...</p>
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shippingFee = subtotal > 10000 ? 0 : 250;
  const grandTotal = subtotal + shippingFee;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-warm-white py-10 px-6 md:px-12 font-outfit text-left z-10 relative text-primary">
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-3xl font-extrabold text-primary uppercase tracking-wider mb-8">
          Shopping Cart ({cartItems.length} items)
        </h1>

        {cartItems.length === 0 ? (
          <div className="card border border-primary/30 rounded-xl p-12 text-center space-y-6 bg-white">
            <ShoppingBag className="w-16 h-16 text-sage mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-primary uppercase mb-2">Your cart is empty</h3>
              <p className="text-sm text-secondary max-w-sm mx-auto leading-relaxed">
                Add premium FIFA neon lights and custom 3D lamps to light up your space!
              </p>
            </div>
            <Link 
              to="/catalog" 
              className="inline-block px-8 py-3 btn-primary font-bold rounded-lg transition-colors text-white"
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
                  className="card border border-primary/20 rounded-xl p-4 flex gap-4 items-center justify-between bg-white"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-warm-white border border-primary/10 flex items-center justify-center p-1">
                      <img src={item.image} alt={item.title} className="object-cover h-full rounded" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-primary text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-secondary mt-0.5">Size: {item.scale}</p>
                      <p className="text-xs text-sage mt-1 font-bold">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-primary/30 rounded bg-warm-white/70 text-xs">
                      <button 
                        onClick={() => dispatch(updateQty({ id: item.id, qty: Math.max(1, item.qty - 1) }))}
                        className="px-2.5 py-1 text-gray-400 hover:text-primary hover:bg-gray-150"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-primary">{item.qty}</span>
                      <button 
                        onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
                        className="px-2.5 py-1 text-gray-400 hover:text-primary hover:bg-gray-150"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="p-2 text-gray-450 hover:text-clay hover:bg-gray-100 rounded-lg transition-colors"
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
                  className="text-xs font-semibold text-secondary hover:text-clay transition-colors uppercase tracking-wider"
                >
                  Clear Cart
                </button>
                <Link 
                  to="/catalog"
                  className="text-xs font-semibold text-sage hover:underline uppercase tracking-wider"
                >
                  + Add More Lights
                </Link>
              </div>

            </div>

            {/* Price Details Card */}
            <div>
              <div className="card border border-primary/30 rounded-xl p-5 space-y-6 bg-white">
                
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-primary border-b border-primary/10 pb-3">
                  Price Details
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotal</span>
                    <span className="font-semibold text-primary">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Shipping Duties</span>
                    <span className="text-green-600 font-bold">FREE (Fully Covered)</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Delivery Charges</span>
                    <span>{shippingFee === 0 ? <strong className="text-green-600">FREE</strong> : `₹${shippingFee}`}</span>
                  </div>
                  
                  <div className="border-t border-primary/10 pt-4 flex justify-between font-extrabold text-base text-primary">
                    <span>Grand Total</span>
                    <span className="text-sage">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 btn-cta text-white font-bold rounded-lg flex items-center justify-center gap-2 uppercase text-xs tracking-wider transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  Proceed to Checkout
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-secondary">
                  <ShieldCheck className="w-4 h-4 text-sage" />
                  <span>Quality transit guarantee and premium bubble-wrap packaging.</span>
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
