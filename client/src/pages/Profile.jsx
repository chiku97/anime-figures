import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Award, Package, Clock, MapPin, Plus, Trash2, Edit, Save, Mail, Phone, Home } from 'lucide-react';
import { loginSuccess, setLoginDrawerOpen } from '../store/authSlice.js';
import { addToast } from '../store/toastSlice.js';
import apiClient from '../api/client.js';

const inputCls =
  'w-full px-3 py-2 text-sm rounded-lg bg-white border border-primary/30 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-accent transition-colors';
const labelCls = 'block text-[10px] uppercase font-extrabold tracking-wider text-secondary mb-1';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address1: '',
    address2: '',
    pincode: '',
    city: '',
    state: ''
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Fetch orders and addresses
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const res = await apiClient.get('/api/orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    const fetchAddresses = async () => {
      try {
        setAddressesLoading(true);
        const res = await apiClient.get('/api/users/addresses');
        if (res.data.success) {
          setAddresses(res.data.addresses);
        }
      } catch (err) {
        console.error('Failed to load user addresses:', err);
      } finally {
        setAddressesLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
      fetchAddresses();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setLoginDrawerOpen(true));
      navigate('/');
    }
  }, [isAuthenticated, dispatch, navigate]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center font-outfit">
        <p className="text-secondary">Redirecting to login...</p>
      </div>
    );
  }

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      dispatch(addToast({ message: 'Name is required.', type: 'error' }));
      return;
    }

    setProfileLoading(true);
    try {
      const res = await apiClient.put('/api/users/profile', profileForm);
      if (res.data.success) {
        dispatch(loginSuccess({
          user: res.data.user,
          token: res.data.token
        }));
        dispatch(addToast({ message: 'Profile updated successfully!', type: 'success' }));
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      dispatch(addToast({ message: err.response?.data?.message || 'Failed to update profile.', type: 'error' }));
    } finally {
      setProfileLoading(false);
    }
  };

  // Validate and Add Address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    // Validation
    const errs = {};
    if (!addressForm.name.trim()) errs.name = 'Name is required';
    if (!addressForm.phone.trim() || !/^\d{10}$/.test(addressForm.phone.trim()))
      errs.phone = 'Valid 10-digit phone required';
    if (!addressForm.address1.trim()) errs.address1 = 'Address line 1 is required';
    if (!addressForm.pincode.trim() || !/^\d{6}$/.test(addressForm.pincode.trim()))
      errs.pincode = 'Valid 6-digit pincode required';
    if (!addressForm.city.trim()) errs.city = 'City is required';
    if (!addressForm.state.trim()) errs.state = 'State is required';

    setAddressErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const res = await apiClient.post('/api/users/addresses', addressForm);
      if (res.data.success) {
        setAddresses(res.data.addresses);
        setShowAddressForm(false);
        setAddressForm({
          name: '',
          phone: '',
          address1: '',
          address2: '',
          pincode: '',
          city: '',
          state: ''
        });
        dispatch(addToast({ message: 'Shipping address added successfully!', type: 'success' }));
      }
    } catch (err) {
      console.error('Failed to add address:', err);
      dispatch(addToast({ message: 'Failed to add address.', type: 'error' }));
    }
  };

  // Delete Address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this shipping address?')) return;

    try {
      const res = await apiClient.delete(`/api/users/addresses/${addressId}`);
      if (res.data.success) {
        setAddresses(res.data.addresses);
        dispatch(addToast({ message: 'Address removed successfully.', type: 'success' }));
      }
    } catch (err) {
      console.error('Failed to delete address:', err);
      dispatch(addToast({ message: 'Failed to delete address.', type: 'error' }));
    }
  };

  return (
    <div className="min-h-screen bg-warm-white py-10 px-6 md:px-12 font-outfit text-left relative">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* User Card Banner */}
        <div className="card border border-primary/50 bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow shrink-0">
            <User className="w-10 h-10" />
          </div>
          <div className="space-y-1 text-center md:text-left flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-2xl font-extrabold text-primary uppercase">{user.name}</h2>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-[10px] font-black uppercase tracking-wider self-center">
                {user.role} Account
              </span>
            </div>
            <p className="text-sm text-secondary font-mono">{user.phone || 'No Phone Linked'} · {user.email || 'No Email Linked'}</p>
          </div>
          <div className="shrink-0 text-xs font-semibold px-4 py-2 border border-primary rounded bg-warm-white flex items-center gap-1.5 text-secondary">
            <Award className="w-4 h-4 text-primary" />
            Otaku Rank: Bronze
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Order vault (takes 1 column width) */}
          <div className="card border border-primary/40 bg-white rounded-xl p-5 space-y-4 text-left shadow-sm h-fit">
            <div className="flex items-center gap-2 border-b border-primary/40 pb-3">
              <Package className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-extrabold uppercase text-primary tracking-widest">Order Vault</h3>
            </div>
            <div className="space-y-4">
              {ordersLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="p-6 rounded-lg bg-warm-white border border-primary/20 text-xs text-center text-secondary py-8">
                  <Clock className="w-6 h-6 mx-auto mb-2 opacity-50 text-secondary" />
                  Your order vault is empty. Items you buy will appear here.
                </div>
              ) : (
                orders.map((o) => (
                  <div key={o._id} className="p-4 rounded-lg bg-warm-white border border-primary/30 text-xs space-y-3 shadow-sm">
                    <div className="flex justify-between items-center text-secondary font-semibold">
                      <span>Order #{o._id.substring(0, 10).toUpperCase()}</span>
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-700 font-bold border border-green-500/20 rounded uppercase text-[9px]">
                        {o.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {o.items.map((item, idx) => (
                        <p key={idx} className="font-bold text-primary text-sm">
                          {item.title} <span className="text-xs text-secondary font-normal">x{item.qty}</span>
                        </p>
                      ))}
                      <p className="text-secondary mt-1 text-[10px]">
                        Date: {new Date(o.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    {o.tracking && o.tracking.carrier && o.tracking.trackingNumber && (
                      <div className="p-2 bg-primary/5 border border-primary/10 rounded text-[10px] space-y-1 text-left text-primary mt-2">
                        <p className="font-extrabold uppercase tracking-widest text-[9px] flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-accent" /> Shipment Details
                        </p>
                        <p><span className="font-semibold text-secondary">Carrier:</span> {o.tracking.carrier}</p>
                        <p><span className="font-semibold text-secondary">Tracking #:</span> <span className="font-mono text-primary">{o.tracking.trackingNumber}</span></p>
                      </div>
                    )}

                    <div className="flex flex-col gap-1 border-t border-primary/10 pt-2 text-[11px] font-bold text-primary">
                      <div className="flex justify-between items-center">
                        {o.paymentMethod === 'partial' || o.paymentStatus === 'partially_paid' ? (
                          <span>Advance Paid: ₹{(o.paidAmount || Math.round(o.amount * 0.10)).toLocaleString('en-IN')}</span>
                        ) : o.paymentMethod === 'cod' ? (
                          <span>Paid: ₹0</span>
                        ) : (
                          <span>Paid: ₹{(o.paidAmount || o.amount).toLocaleString('en-IN')}</span>
                        )}
                        <span className="text-accent uppercase text-[9px] tracking-wider font-extrabold">
                          {o.paymentMethod === 'partial' || o.paymentStatus === 'partially_paid' 
                            ? 'Partial (10% Advance)' 
                            : o.paymentMethod === 'cod' 
                              ? 'Cash On Delivery' 
                              : 'Paid via Razorpay'}
                        </span>
                      </div>

                      {(o.paymentMethod === 'partial' || o.paymentMethod === 'cod' || (o.dueAmount && o.dueAmount > 0)) && (
                        <div className="flex justify-between items-center text-clay text-[10px]">
                          <span>Balance Due on Delivery:</span>
                          <span className="font-extrabold">₹{(o.dueAmount !== undefined ? o.dueAmount : (o.paymentMethod === 'cod' ? o.amount : o.amount - Math.round(o.amount * 0.10))).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2 & 3: Profile Settings & Address Book (takes 2 columns width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PROFILE EDIT PANEL */}
            <div className="card border border-primary/40 bg-white rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-primary/40 pb-3">
                <Edit className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-extrabold uppercase text-primary tracking-widest">Update Profile Info</h3>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Display Name</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Contact Email</label>
                    <input
                      type="email"
                      className={inputCls}
                      value={profileForm.email}
                      placeholder="e.g. you@example.com"
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-opacity-95 text-white font-bold rounded-lg uppercase tracking-wider text-[10px] transition-all disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {profileLoading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>

            {/* ADDRESS BOOK PANEL */}
            <div className="card border border-primary/40 bg-white rounded-xl p-5 space-y-5 shadow-sm text-xs">
              <div className="flex justify-between items-center border-b border-primary/40 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <h3 className="text-sm font-extrabold uppercase text-primary tracking-widest">Shipping Address Book</h3>
                </div>
                
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1 px-3 py-1.5 border border-primary/50 rounded-lg font-bold text-[10px] uppercase text-secondary hover:text-primary hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddressForm ? 'Cancel' : 'Add New Address'}
                </button>
              </div>

              {/* Collapsible Address Add Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="p-4 rounded-xl border border-primary/30 bg-warm-white space-y-4 text-left">
                  <h4 className="font-extrabold uppercase text-primary tracking-wider text-[10px] border-b border-primary/10 pb-1.5 text-left">
                    Add New Shipping Destination
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Recipient Full Name *</label>
                      <input
                        type="text"
                        className={`${inputCls} ${addressErrors.name ? 'border-clay' : ''}`}
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        placeholder="e.g. Leo Messi"
                      />
                      {addressErrors.name && <p className="text-clay text-[10px] mt-0.5 font-bold">{addressErrors.name}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Contact Phone *</label>
                      <input
                        type="text"
                        maxLength={10}
                        className={`${inputCls} ${addressErrors.phone ? 'border-clay' : ''}`}
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                      />
                      {addressErrors.phone && <p className="text-clay text-[10px] mt-0.5 font-bold">{addressErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Street / Flat / Block *</label>
                    <input
                      type="text"
                      className={`${inputCls} ${addressErrors.address1 ? 'border-clay' : ''}`}
                      value={addressForm.address1}
                      onChange={(e) => setAddressForm({ ...addressForm, address1: e.target.value })}
                      placeholder="House No, Apartment, Street name"
                    />
                    {addressErrors.address1 && <p className="text-clay text-[10px] mt-0.5 font-bold">{addressErrors.address1}</p>}
                  </div>

                  <div>
                    <label className={labelCls}>Area / Landmark (Optional)</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={addressForm.address2}
                      onChange={(e) => setAddressForm({ ...addressForm, address2: e.target.value })}
                      placeholder="Near bank, sector, or main road"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>Pincode *</label>
                      <input
                        type="text"
                        maxLength={6}
                        className={`${inputCls} ${addressErrors.pincode ? 'border-clay' : ''}`}
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        placeholder="400001"
                      />
                      {addressErrors.pincode && <p className="text-clay text-[10px] mt-0.5 font-bold">{addressErrors.pincode}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>City *</label>
                      <input
                        type="text"
                        className={`${inputCls} ${addressErrors.city ? 'border-clay' : ''}`}
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        placeholder="e.g. Mumbai"
                      />
                      {addressErrors.city && <p className="text-clay text-[10px] mt-0.5 font-bold">{addressErrors.city}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>State *</label>
                      <select
                        className={`${inputCls} ${addressErrors.state ? 'border-clay' : ''}`}
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
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
                      {addressErrors.state && <p className="text-clay text-[10px] mt-0.5 font-bold">{addressErrors.state}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-accent text-white hover:bg-opacity-95 font-bold rounded-lg uppercase tracking-wider text-[10px] transition-all"
                    >
                      Save Destination
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses list */}
              <div className="space-y-4">
                {addressesLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="p-6 rounded-lg bg-warm-white border border-primary/20 text-center text-secondary py-8">
                    <Home className="w-5 h-5 mx-auto mb-2 opacity-50 text-secondary" />
                    You haven't saved any shipping destinations yet. Add one to speed up checkout!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr._id} className="p-4 rounded-xl bg-warm-white border border-primary/30 shadow-sm relative flex flex-col justify-between text-left">
                        <div className="space-y-1 text-left">
                          <p className="font-extrabold text-primary text-sm flex items-center gap-1">
                            <Home className="w-3.5 h-3.5 text-accent" />
                            {addr.name}
                          </p>
                          <p className="text-secondary leading-relaxed font-semibold">
                            {addr.address1}
                            {addr.address2 ? `, ${addr.address2}` : ''}
                            <br />
                            {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                          <p className="text-secondary text-[10px] font-mono mt-1">+91 {addr.phone}</p>
                        </div>

                        <div className="flex justify-end mt-4 pt-2 border-t border-primary/10">
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="flex items-center gap-1 text-[10px] font-black uppercase text-clay hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
