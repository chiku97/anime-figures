import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin, ShoppingBag, CreditCard, CheckCircle2,
  ArrowLeft, ArrowRight, Shield, Truck, Sparkles, Banknote, Percent
} from 'lucide-react';
import { clearCart } from '../store/cartSlice.js';
import { setLoginDrawerOpen } from '../store/authSlice.js';
import { addToast } from '../store/toastSlice.js';
import apiClient from '../api/client.js';
import MapPickerModal from '../components/MapPickerModal.jsx';

const STEPS = ['Delivery Address', 'Order Review', 'Payment'];

const inputCls =
  'w-full px-4 py-3 rounded-lg bg-white border border-primary/30 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-accent transition-colors text-sm';
const labelCls = 'block text-xs uppercase font-extrabold tracking-wider text-secondary mb-1.5';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online', 'partial'
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Address form state
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    pincode: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    lat: null,
    lng: null
  });

  const handleLocationPicked = (loc) => {
    setAddress(prev => ({
      ...prev,
      address1: loc.address1 || prev.address1,
      city: loc.city || prev.city,
      state: loc.state || prev.state,
      pincode: loc.pincode || prev.pincode,
      lat: loc.lat,
      lng: loc.lng
    }));
    dispatch(addToast({ message: 'Location & address auto-filled from Map! 📍', type: 'success' }));
  };

  const [addressErrors, setAddressErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useCustomAddress, setUseCustomAddress] = useState(false);

  // Fetch saved addresses from backend MongoDB Atlas
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        setAddressesLoading(true);
        const res = await apiClient.get('/api/users/addresses');
        if (res.data.success) {
          setSavedAddresses(res.data.addresses);
          if (res.data.addresses.length > 0) {
            // Pre-select the default or first saved address
            const defaultAddr = res.data.addresses[0];
            setSelectedAddressId(defaultAddr._id);
            setAddress({
              name: defaultAddr.name,
              phone: defaultAddr.phone,
              pincode: defaultAddr.pincode,
              address1: defaultAddr.address1,
              address2: defaultAddr.address2 || '',
              city: defaultAddr.city,
              state: defaultAddr.state
            });
            setUseCustomAddress(false);
          } else {
            setUseCustomAddress(true);
          }
        }
      } catch (err) {
        console.error('Failed to load saved addresses:', err);
        setUseCustomAddress(true);
      } finally {
        setAddressesLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSavedAddresses();
    }
  }, [isAuthenticated]);

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setLoginDrawerOpen(true));
      navigate('/');
    }
  }, [isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    if (isAuthenticated && cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cartItems, isAuthenticated, navigate, orderPlaced]);

  if (!isAuthenticated) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const partialAdvance = Math.round(total * 0.10);
  const partialDue = total - partialAdvance;

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setAddress({
      name: addr.name,
      phone: addr.phone,
      pincode: addr.pincode,
      address1: addr.address1,
      address2: addr.address2 || '',
      city: addr.city,
      state: addr.state
    });
    setUseCustomAddress(false);
    setAddressErrors({});
  };

  const handleToggleCustomAddress = () => {
    setUseCustomAddress(true);
    setSelectedAddressId('');
    setAddress({
      name: user?.name || '',
      phone: user?.phone || '',
      pincode: '',
      address1: '',
      address2: '',
      city: '',
      state: ''
    });
    setAddressErrors({});
  };

  // ---------- Validation ----------
  const validateAddress = () => {
    const errs = {};
    if (!address.name.trim()) errs.name = 'Full name is required';
    if (!address.phone.trim() || !/^\d{10}$/.test(address.phone.trim()))
      errs.phone = 'Valid 10-digit mobile number required';
    if (!address.address1.trim()) errs.address1 = 'Street address is required';
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode.trim()))
      errs.pincode = 'Valid 6-digit PIN code required';
    if (!address.city.trim()) errs.city = 'City is required';
    if (!address.state) errs.state = 'State selection is required';

    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 0) {
      if (!validateAddress()) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  // Dynamically load Razorpay SDK script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Trigger payments & order placing
  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      // 1. Direct Cash on Delivery (COD) Flow
      if (paymentMethod === 'cod') {
        const codRes = await apiClient.post('/api/payments/cod', {
          address,
          cartItems,
          total
        });
        if (codRes.data.success) {
          setOrderId(codRes.data.order._id || codRes.data.order.razorpayOrderId);
          dispatch(clearCart());
          setOrderPlaced(true);
          dispatch(addToast({ message: 'Order Confirmed via Cash on Delivery! 📦', type: 'success' }));
        } else {
          dispatch(addToast({ message: 'Failed to place COD order.', type: 'error' }));
        }
        setPlacing(false);
        return;
      }

      // 2. Online / Partial Razorpay Payment Flow
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        dispatch(addToast({ message: 'Razorpay payment interface failed to load. Check connection.', type: 'error' }));
        setPlacing(false);
        return;
      }

      // Call backend to create Razorpay Order (Full or 10% Partial)
      const orderRes = await apiClient.post('/api/payments/order', { amount: total, paymentMethod });
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Payment initiation failed.');
      }

      const orderData = orderRes.data;

      // Fallback Sandbox Bypass if keys are unconfigured
      if (orderData.isMock) {
        const chargeText = paymentMethod === 'partial' 
          ? `10% Advance Payment of ₹${partialAdvance.toLocaleString('en-IN')} (Remaining ₹${partialDue.toLocaleString('en-IN')} on delivery)` 
          : `Full Payment of ₹${total.toLocaleString('en-IN')}`;
          
        const proceedMock = window.confirm(
          `Formora Razorpay Sandbox:\n\nNo active Razorpay API Keys were found in your .env file.\n\nClick OK to simulate a successful Razorpay payment of ${chargeText}.`
        );
        if (proceedMock) {
          const mockPaymentId = 'pay_mock_' + Math.floor(100000 + Math.random() * 900000);

          const verifyRes = await apiClient.post('/api/payments/verify', {
            razorpay_order_id: orderData.id,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: '', // Mock bypass bypasses signature
            address,
            cartItems,
            total,
            paymentMethod
          });

          if (verifyRes.data.success) {
            setOrderId(verifyRes.data.order._id || verifyRes.data.order.razorpayOrderId);
            dispatch(clearCart());
            setOrderPlaced(true);
            const msg = paymentMethod === 'partial' 
              ? 'Mock 10% Advance verified! Order created with COD balance.' 
              : 'Mock checkout verified! Order created.';
            dispatch(addToast({ message: msg, type: 'success' }));
          } else {
            dispatch(addToast({ message: 'Sandbox order verification failed.', type: 'error' }));
          }
        }
        setPlacing(false);
        return;
      }

      // Official Razorpay Checkout popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Formora Studio',
        description: paymentMethod === 'partial' 
          ? `10% Advance Payment (₹${partialAdvance})` 
          : 'Handcrafted Lights & Home Decor',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            setPlacing(true);
            // Verify payment signature in backend
            const verifyRes = await apiClient.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address,
              cartItems,
              total,
              paymentMethod
            });
            if (verifyRes.data.success) {
              setOrderId(verifyRes.data.order._id || verifyRes.data.order.razorpayOrderId);
              dispatch(clearCart());
              setOrderPlaced(true);
              const toastMsg = paymentMethod === 'partial' 
                ? '10% Advance Verified & Partial Order Confirmed! 🎉' 
                : 'Payment Verified & Order Confirmed! 🎉';
              dispatch(addToast({ message: toastMsg, type: 'success' }));
            } else {
              dispatch(addToast({ message: 'Payment verification failed.', type: 'error' }));
            }
          } catch (err) {
            console.error(err);
            dispatch(addToast({ message: 'Order verification error. Contact support.', type: 'error' }));
          } finally {
            setPlacing(false);
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
          email: user?.email || '',
        },
        theme: {
          color: '#A8B8A2', // Sage Green
        },
        modal: {
          ondismiss: function () {
            setPlacing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Razorpay payment failed:', response.error);
        dispatch(addToast({ 
          message: response.error.description || 'Payment failed. Please try again.', 
          type: 'error' 
        }));
        setPlacing(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      dispatch(addToast({ message: 'Failed to initiate order. Please try again.', type: 'error' }));
      setPlacing(false);
    }
  };

  // =========== ORDER SUCCESS ===========
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center px-6 font-outfit text-left">
        <div className="max-w-md w-full space-y-8 py-12">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-extrabold text-primary uppercase tracking-wider">
              Order Confirmed!
            </h1>
            <p className="text-secondary text-xs leading-relaxed">
              Your Formora design order has been placed. We'll dispatch it in handcrafted, premium custom packaging.
            </p>
            <div className="inline-block px-4 py-2 rounded-lg bg-white border border-primary/20">
              <span className="text-xs text-secondary uppercase tracking-wider">Order ID: </span>
              <span className="font-mono font-bold text-primary">#{orderId}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-left">
            <div className="bg-white border border-primary/20 rounded-xl p-4 space-y-1">
              <Truck className="w-5 h-5 text-accent mb-2" />
              <p className="font-bold text-primary">Estimated Dispatch</p>
              <p className="text-secondary text-[11px]">2–4 business days (India)</p>
            </div>
            <div className="bg-white border border-primary/20 rounded-xl p-4 space-y-1">
              <Shield className="w-5 h-5 text-clay mb-2" />
              <p className="font-bold text-primary">Authenticity Seal</p>
              <p className="text-secondary text-[11px]">Formora Handcrafted Studio</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/profile"
              className="flex-1 py-3 bg-primary text-white hover:bg-opacity-90 font-bold rounded-lg text-xs uppercase tracking-wider transition-all text-center shadow"
            >
              View Order Vault
            </Link>
            <Link
              to="/catalog"
              className="flex-1 py-3 border border-primary/50 hover:bg-gray-100 text-secondary font-bold rounded-lg text-xs uppercase tracking-wider transition-all text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========== CHECKOUT FORM ===========
  return (
    <div className="min-h-screen bg-warm-white py-10 px-6 md:px-12 font-outfit text-left z-10 relative">
      <div className="max-w-5xl mx-auto">

        {/* Back Link */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-extrabold text-primary uppercase tracking-wider mb-8 flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-primary animate-pulse" />
          Secure Checkout
        </h1>

        {/* Step Progress */}
        <div className="flex items-center gap-0 mb-10 max-w-xl">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm border-2 transition-all ${i < step
                    ? 'bg-green-500 border-green-500 text-white'
                    : i === step
                      ? 'bg-primary border-primary text-white shadow'
                      : 'bg-white border-primary/30 text-secondary'
                    }`}
                >
                  {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <span
                  className={`text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap ${i === step ? 'text-primary' : i < step ? 'text-green-600' : 'text-secondary'
                    }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 mb-5 transition-all ${i < step ? 'bg-green-500' : 'bg-primary/20'
                    }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ---- STEP CONTENT ---- */}
          <div className="lg:col-span-2">

            {/* STEP 0: Address */}
            {step === 0 && (
              <div className="bg-white border border-primary/30 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-primary/20 pb-4">
                  <MapPin className="w-5 h-5 text-accent" />
                  <h2 className="text-base font-extrabold uppercase tracking-wider text-primary">
                    Delivery Address
                  </h2>
                </div>

                {/* Saved Addresses Selector */}
                {!addressesLoading && savedAddresses.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-xs uppercase font-extrabold tracking-wider text-secondary">
                      Select a shipping destination
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all text-left relative flex flex-col justify-between ${selectedAddressId === addr._id
                              ? 'bg-sage/10 border-sage ring-1 ring-sage'
                              : 'bg-warm-white border-primary/20 hover:border-primary/50 shadow-sm'
                            }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-primary text-xs uppercase tracking-wider">
                                {addr.name}
                              </span>
                              <div
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedAddressId === addr._id
                                    ? 'border-sage bg-sage'
                                    : 'border-primary/30'
                                  }`}
                              >
                                {selectedAddressId === addr._id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </div>
                            </div>
                            <p className="text-secondary text-[11px] leading-relaxed font-semibold mt-1">
                              {addr.address1}
                              {addr.address2 ? `, ${addr.address2}` : ''}
                              <br />
                              {addr.city}, {addr.state} — {addr.pincode}
                            </p>
                            <p className="text-secondary text-[10px] font-mono mt-1">+91 {addr.phone}</p>
                          </div>
                        </div>
                      ))}

                      <div
                        onClick={handleToggleCustomAddress}
                        className={`p-4 rounded-xl border cursor-pointer transition-all text-left relative flex flex-col justify-center items-center py-6 ${useCustomAddress
                            ? 'bg-sage/10 border-sage ring-1 ring-sage'
                            : 'bg-warm-white border-dashed border-primary/30 hover:border-primary/50'
                          }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${useCustomAddress
                                ? 'border-sage bg-sage'
                                : 'border-primary/30'
                              }`}
                          >
                            {useCustomAddress && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="font-bold text-xs text-primary uppercase tracking-wider mt-1">
                            Deliver to a new address
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {addressesLoading && (
                  <div className="flex justify-center items-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
                  </div>
                )}

                {useCustomAddress && (
                  <div className="space-y-5 pt-4 border-t border-primary/10 transition-all duration-300 text-left">
                    {/* Map Location Picker Banner Button */}
                    <div className="p-4 rounded-xl border border-accent/30 bg-accent/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-left">
                        <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-primary text-xs uppercase tracking-wider">
                            Interactive Map Location Pinning
                          </p>
                          <p className="text-[11px] text-secondary">
                            Pick your exact delivery spot on map to auto-fill street, city, state & pincode.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsMapModalOpen(true)}
                        className="px-4 py-2 bg-accent hover:bg-opacity-95 text-white font-extrabold rounded-lg text-xs uppercase tracking-wider transition-all shadow flex items-center gap-1.5 shrink-0"
                      >
                        <MapPin className="w-4 h-4" />
                        Pick Location from Map
                      </button>
                    </div>

                    {address.lat && address.lng && (
                      <div className="p-3 bg-sage/10 border border-sage/30 rounded-xl text-xs font-bold text-primary flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <MapPin className="w-4 h-4 text-sage" /> GPS Map Coordinates Attached: <span className="font-mono">{address.lat}, {address.lng}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsMapModalOpen(true)}
                          className="text-[10px] text-accent underline uppercase tracking-wider font-extrabold"
                        >
                          Change Pin
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Full Name *</label>
                        <input
                          className={`${inputCls} ${addressErrors.name ? 'border-clay' : ''}`}
                          placeholder="e.g. Leo Messi"
                          value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        />
                        {addressErrors.name && (
                          <p className="text-clay text-[11px] mt-1 font-bold">{addressErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelCls}>Mobile Number *</label>
                        <input
                          className={`${inputCls} ${addressErrors.phone ? 'border-clay' : ''}`}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        />
                        {addressErrors.phone && (
                          <p className="text-clay text-[11px] mt-1 font-bold">{addressErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Street / Flat / Block *</label>
                      <input
                        className={`${inputCls} ${addressErrors.address1 ? 'border-clay' : ''}`}
                        placeholder="Flat / House / Floor No., Apartment / Area"
                        value={address.address1}
                        onChange={(e) => setAddress({ ...address, address1: e.target.value })}
                      />
                      {addressErrors.address1 && (
                        <p className="text-clay text-[11px] mt-1 font-bold">{addressErrors.address1}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelCls}>Area / Landmark (Optional)</label>
                      <input
                        className={inputCls}
                        placeholder="Near landmark, sector, or main road"
                        value={address.address2}
                        onChange={(e) => setAddress({ ...address, address2: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={labelCls}>PIN Code *</label>
                        <input
                          className={`${inputCls} ${addressErrors.pincode ? 'border-clay' : ''}`}
                          placeholder="400001"
                          maxLength={6}
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        />
                        {addressErrors.pincode && (
                          <p className="text-clay text-[11px] mt-1 font-bold">{addressErrors.pincode}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelCls}>City *</label>
                        <input
                          className={`${inputCls} ${addressErrors.city ? 'border-clay' : ''}`}
                          placeholder="Mumbai"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        />
                        {addressErrors.city && (
                          <p className="text-clay text-[11px] mt-1 font-bold">{addressErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelCls}>State *</label>
                        <select
                          className={`${inputCls} cursor-pointer ${addressErrors.state ? 'border-clay' : ''}`}
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        >
                          <option value="">Select State</option>
                          {[
                            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
                            'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
                            'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
                            'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
                            'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
                            'Uttarakhand', 'West Bengal',
                          ].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {addressErrors.state && (
                          <p className="text-clay text-[11px] mt-1 font-bold">{addressErrors.state}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 1: Order Review */}
            {step === 1 && (
              <div className="bg-white border border-primary/30 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-primary/20 pb-4">
                  <ShoppingBag className="w-5 h-5 text-accent" />
                  <h2 className="text-base font-extrabold uppercase tracking-wider text-primary">
                    Review Your Order
                  </h2>
                </div>

                {/* Delivery Address summary */}
                <div className="p-4 rounded-xl bg-warm-white border border-primary/30 text-xs">
                  <p className="text-[10px] uppercase font-extrabold text-secondary tracking-widest mb-1">
                    Delivering To
                  </p>
                  <p className="font-bold text-primary">{address.name}</p>
                  <p className="text-secondary mt-0.5">
                    {address.address1}{address.address2 ? `, ${address.address2}` : ''}, {address.city}, {address.state} — {address.pincode}
                  </p>
                  <p className="text-secondary font-mono mt-1">+91 {address.phone}</p>
                </div>

                {/* Items list */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 items-center p-3 rounded-xl bg-warm-white border border-primary/20"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-primary/25 shrink-0 flex items-center justify-center">
                        <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-primary text-sm line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-secondary mt-0.5">Theme: {item.scale} · Qty: {item.qty}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-primary">
                          ₹{(item.price * item.qty).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className="bg-white border border-primary/30 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 border-b border-primary/20 pb-4">
                  <CreditCard className="w-5 h-5 text-clay" />
                  <h2 className="text-base font-extrabold uppercase tracking-wider text-primary">
                    Select Payment Mode
                  </h2>
                </div>

                {/* Payment Option Cards */}
                <div className="space-y-3.5">
                  {/* Option 1: 100% Online Payment */}
                  <div
                    onClick={() => setPaymentMethod('online')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all text-left relative flex items-start gap-3.5 ${paymentMethod === 'online'
                        ? 'bg-sage/10 border-sage ring-1 ring-sage shadow-sm'
                        : 'bg-warm-white border-primary/20 hover:border-primary/40'
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-full border shrink-0 mt-1 flex items-center justify-center ${paymentMethod === 'online' ? 'border-sage bg-sage' : 'border-primary/40'}`}>
                      {paymentMethod === 'online' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-extrabold text-primary text-sm uppercase tracking-wide flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-primary shrink-0" /> Full Online Payment (100%)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-700 font-extrabold text-[9px] uppercase tracking-wider border border-green-500/20">
                          Fastest Dispatch
                        </span>
                      </div>
                      <p className="text-xs text-secondary leading-relaxed">
                        Pay 100% (₹{total.toLocaleString('en-IN')}) online securely via Razorpay (UPI, GPay, Cards, NetBanking).
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Partial Payment (10% Advance + 90% COD) */}
                  <div
                    onClick={() => setPaymentMethod('partial')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all text-left relative flex items-start gap-3.5 ${paymentMethod === 'partial'
                        ? 'bg-sage/10 border-sage ring-1 ring-sage shadow-sm'
                        : 'bg-warm-white border-primary/20 hover:border-primary/40'
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-full border shrink-0 mt-1 flex items-center justify-center ${paymentMethod === 'partial' ? 'border-sage bg-sage' : 'border-primary/40'}`}>
                      {paymentMethod === 'partial' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-extrabold text-primary text-sm uppercase tracking-wide flex items-center gap-1.5">
                          <Percent className="w-4 h-4 text-accent shrink-0" /> Partial Payment (10% Advance + 90% COD)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-accent/10 text-accent font-extrabold text-[9px] uppercase tracking-wider border border-accent/20">
                          Razorpay Partial
                        </span>
                      </div>
                      <p className="text-xs text-secondary leading-relaxed">
                        Pay 10% advance (₹{partialAdvance.toLocaleString('en-IN')}) online now via Razorpay. Pay remaining 90% (₹{partialDue.toLocaleString('en-IN')}) on delivery.
                      </p>
                    </div>
                  </div>

                  {/* Option 3: Full Cash on Delivery (COD) */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all text-left relative flex items-start gap-3.5 ${paymentMethod === 'cod'
                        ? 'bg-sage/10 border-sage ring-1 ring-sage shadow-sm'
                        : 'bg-warm-white border-primary/20 hover:border-primary/40'
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-full border shrink-0 mt-1 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-sage bg-sage' : 'border-primary/40'}`}>
                      {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-extrabold text-primary text-sm uppercase tracking-wide flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-clay shrink-0" /> Full Cash on Delivery (COD)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-clay/10 text-clay font-extrabold text-[9px] uppercase tracking-wider border border-clay/20">
                          Pay on Delivery
                        </span>
                      </div>
                      <p className="text-xs text-secondary leading-relaxed">
                        Pay full amount (₹{total.toLocaleString('en-IN')}) in cash upon delivery to your doorstep.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected Payment Breakdown Summary */}
                <div className="p-4 rounded-xl bg-warm-white border border-primary/30 space-y-2 text-xs text-left">
                  <div className="flex justify-between items-center text-secondary font-semibold">
                    <span>Payment Mode Selected:</span>
                    <span className="font-extrabold text-primary uppercase">
                      {paymentMethod === 'online' && '100% Online Payment'}
                      {paymentMethod === 'partial' && 'Partial (10% Online + 90% COD)'}
                      {paymentMethod === 'cod' && 'Full Cash on Delivery'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-secondary border-t border-primary/10 pt-2">
                    <span>Payable Online Now (via Razorpay):</span>
                    <span className="font-extrabold text-accent text-sm">
                      ₹{(paymentMethod === 'online' ? total : paymentMethod === 'partial' ? partialAdvance : 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-secondary">
                    <span>Balance Due on Delivery (COD):</span>
                    <span className="font-extrabold text-clay text-sm">
                      ₹{(paymentMethod === 'online' ? 0 : paymentMethod === 'partial' ? partialDue : total).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Razorpay Partner Info Banner (for Online or Partial modes) */}
                {paymentMethod !== 'cod' && (
                  <div className="p-4 rounded-xl border border-accent/30 bg-accent/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-[#072654] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
                          <path d="M10 30L20 10L30 30H10Z" fill="#3395FF" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-primary uppercase tracking-wider">Razorpay Gateway</p>
                        <p className="text-[10px] text-secondary">Supports UPI (GPay, PhonePe, Paytm), Cards & NetBanking</p>
                      </div>
                    </div>
                    <div className="flex gap-1 text-[9px] font-bold text-secondary uppercase shrink-0">
                      <span className="px-1.5 py-0.5 border border-primary/20 rounded bg-white">UPI</span>
                      <span className="px-1.5 py-0.5 border border-primary/20 rounded bg-white">Cards</span>
                    </div>
                  </div>
                )}

                {/* Security badges */}
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-warm-white border border-primary/20">
                    <Shield className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-primary">Secure Socket Layer</p>
                      <p className="text-secondary text-[10px]">Bank-grade AES-256 encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-warm-white border border-primary/20">
                    <Truck className="w-4 h-4 text-clay shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-primary">Fragile Dispatch</p>
                      <p className="text-secondary text-[10px]">Double-walled shockproof boxes</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full py-4 bg-primary hover:bg-opacity-95 text-white font-extrabold rounded-xl shadow uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {placing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Order...
                    </>
                  ) : paymentMethod === 'online' ? (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay ₹{total.toLocaleString('en-IN')} Now (100% Online)
                    </>
                  ) : paymentMethod === 'partial' ? (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay 10% Advance (₹{partialAdvance.toLocaleString('en-IN')}) via Razorpay
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Confirm Order with Cash on Delivery (₹{total.toLocaleString('en-IN')})
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 0 ? (
                <button
                  onClick={handleBack}
                  disabled={placing}
                  className="flex items-center gap-1.5 px-5 py-2.5 border border-primary/50 text-secondary hover:text-primary rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < STEPS.length - 1 && (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-primary text-white hover:bg-opacity-95 font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* ---- ORDER SUMMARY SIDEBAR ---- */}
          <div>
            <div className="bg-white border border-primary/30 rounded-2xl p-5 space-y-5 sticky top-24">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-warm-white border border-primary/20 shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-bold text-primary line-clamp-1">{item.title}</p>
                      <p className="text-secondary text-[10px] mt-0.5">Qty: {item.qty}</p>
                    </div>
                    <p className="text-xs font-bold text-primary shrink-0">
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs border-t border-primary/20 pt-4">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal</span>
                  <span className="text-primary font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Fragile Packing</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-primary font-semibold'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-primary border-t border-primary/20 pt-3">
                  <span>Total</span>
                  <span className="text-clay text-base">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] text-secondary justify-center uppercase font-bold tracking-wide">
                <Shield className="w-3.5 h-3.5 text-accent" />
                <span>Secured Gateway Integration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Leaflet Map Picker Modal */}
        <MapPickerModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          onSelectLocation={handleLocationPicked}
          initialCoords={address.lat && address.lng ? { lat: address.lat, lng: address.lng } : null}
        />
      </div>
    </div>
  );
};

export default Checkout;
