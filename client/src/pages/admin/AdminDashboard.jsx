import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Edit2, Trash2, Save, X, Database, 
  WifiOff, Package, Sparkles, RefreshCw, AlertTriangle,
  Clock, ShoppingBag, User, Mail, Phone, MapPin, Truck,
  ChevronDown, ChevronUp, ExternalLink, Upload

} from 'lucide-react';
import { addToast } from '../../store/toastSlice.js';
import apiClient from '../../api/client.js';

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Navigation state
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'orders'

  // Product List states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbLive, setDbLive] = useState(false);

  // Orders states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [trackingInputs, setTrackingInputs] = useState({}); // orderId -> { carrier, trackingNumber }

  // Form Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding a new product

  // Form Field states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Lamps');
  const [scale, setScale] = useState('Sporty');
  const [material, setMaterial] = useState('Acrylic & Silicone LED');
  const [heightMm, setHeightMm] = useState(200);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [badgeInput, setBadgeInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result;
      
      setUploadingImage(true);
      try {
        const response = await apiClient.post('/api/admin/upload-image', { image: base64data });
        if (response.data.success) {
          const uploadedUrl = response.data.url;
          setImageInput(prev => {
            const trimmed = prev ? prev.trim() : '';
            if (!trimmed) return uploadedUrl;
            return trimmed.endsWith(',') ? `${trimmed} ${uploadedUrl}` : `${trimmed}, ${uploadedUrl}`;
          });
          dispatch(addToast({ message: 'Image uploaded successfully!', type: 'success' }));
        } else {
          dispatch(addToast({ message: response.data.message || 'Image upload failed.', type: 'error' }));
        }
      } catch (err) {
        console.error('Image upload error:', err);
        dispatch(addToast({ message: err.response?.data?.message || 'Failed to upload image.', type: 'error' }));
      } finally {
        setUploadingImage(false);
      }
    };
  };


  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/products');
      if (res.data.success) {
        setProducts(res.data.products);
        // If some products have 24-character hex MongoDB ObjectIDs, we're live!
        const hasMongoIds = res.data.products.some(p => p._id && p._id.length === 24);
        setDbLive(hasMongoIds);
      }
    } catch (err) {
      console.error('Failed to fetch products for dashboard:', err);
      dispatch(addToast({ message: 'Error fetching products.', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await apiClient.get('/api/admin/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
        // Pre-fill tracking inputs from existing data
        const initialTracking = {};
        res.data.orders.forEach(o => {
          initialTracking[o._id || o.id] = {
            carrier: o.tracking?.carrier || '',
            trackingNumber: o.tracking?.trackingNumber || ''
          };
        });
        setTrackingInputs(initialTracking);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
      dispatch(addToast({ message: 'Error fetching admin orders.', type: 'error' }));
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Expand / Collapse Order Card
  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await apiClient.put(`/api/admin/orders/${orderId}`, { status });
      if (res.data.success) {
        dispatch(addToast({ message: `Order status updated to "${status}"`, type: 'success' }));
        // Sync local state
        setOrders(prev => prev.map(o => (o._id === orderId || o.id === orderId) ? res.data.order : o));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      dispatch(addToast({ message: 'Error updating status.', type: 'error' }));
    }
  };

  // Update Order Tracking Details
  const handleUpdateOrderTracking = async (orderId) => {
    const tracking = trackingInputs[orderId] || { carrier: '', trackingNumber: '' };
    try {
      const res = await apiClient.put(`/api/admin/orders/${orderId}`, { tracking });
      if (res.data.success) {
        dispatch(addToast({ message: 'Tracking details updated successfully!', type: 'success' }));
        setOrders(prev => prev.map(o => (o._id === orderId || o.id === orderId) ? res.data.order : o));
      }
    } catch (err) {
      console.error('Failed to update tracking:', err);
      dispatch(addToast({ message: 'Error updating tracking details.', type: 'error' }));
    }
  };

  const handleTrackingInputChange = (orderId, field, value) => {
    setTrackingInputs(prev => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || { carrier: '', trackingNumber: '' }),
        [field]: value
      }
    }));
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('Lamps');
    setScale('Sporty');
    setMaterial('Acrylic & Silicone LED');
    setHeightMm(200);
    setPrice('');
    setStock('');
    setImageInput('https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80');
    setBadgeInput('Sporty');
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setCategory(product.category);
    setScale(product.scale);
    setMaterial(product.material || 'Acrylic & Silicone LED');
    setHeightMm(product.heightMm || 200);
    setPrice(product.price);
    setStock(product.stock);
    setImageInput(product.images ? product.images.join(', ') : '');
    setBadgeInput(product.badges ? product.badges.join(', ') : '');
    setModalOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !price || stock === '') {
      dispatch(addToast({ message: 'Please fill in all required fields.', type: 'info' }));
      return;
    }

    const images = imageInput.split(',').map(s => s.trim()).filter(Boolean);
    const badges = badgeInput.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      title,
      category,
      scale,
      material,
      heightMm: Number(heightMm),
      price: Number(price),
      stock: Number(stock),
      images,
      badges
    };

    try {
      if (editingProduct) {
        const id = editingProduct.id || editingProduct._id;
        const res = await apiClient.put(`/api/products/${id}`, payload);
        if (res.data.success) {
          dispatch(addToast({ message: 'Product updated successfully!', type: 'success' }));
          setModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await apiClient.post('/api/products', payload);
        if (res.data.success) {
          dispatch(addToast({ message: 'Product created successfully!', type: 'success' }));
          setModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err) {
      console.error('Failed to save product:', err);
      dispatch(addToast({ message: err.response?.data?.message || 'Error saving product.', type: 'error' }));
    }
  };

  // Handle Delete
  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${product.title}"?`);
    if (!confirmDelete) return;

    const id = product.id || product._id;
    try {
      const res = await apiClient.delete(`/api/products/${id}`);
      if (res.data.success) {
        dispatch(addToast({ message: 'Product deleted successfully.', type: 'success' }));
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
      dispatch(addToast({ message: 'Error deleting product.', type: 'error' }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-cyan/15 text-cyan border-cyan/30';
      case 'shipped': return 'bg-gold/15 text-gold border-gold/30';
      case 'delivered': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled': return 'bg-clay/15 text-clay border-clay/30';
      default: return 'bg-primary/10 text-secondary border-primary/20';
    }
  };

  return (
    <div className="min-h-screen bg-warm-white py-10 px-6 md:px-12 font-outfit text-left relative z-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/40 pb-6">
          <div className="space-y-1">
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-secondary hover:text-primary transition-colors mb-2 font-bold uppercase tracking-wider">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <h1 className="text-3xl font-extrabold text-primary uppercase tracking-wider flex items-center gap-3">
              <Package className="w-8 h-8 text-primary animate-pulse" />
              Studio Control Portal
            </h1>
            <p className="text-xs text-secondary">
              Manage product listings, inventory logs, user transaction pipelines, and fulfillment statuses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Database Sync Badge */}
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${dbLive ? 'bg-green-500/10 border-green-500/30 text-green-600' : 'bg-clay/10 border-clay/30 text-clay'}`}>
              {dbLive ? <Database className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              {dbLive ? 'Live MongoDB Connected' : 'Offline In-Memory Mock'}
            </div>

            <button 
              onClick={activeTab === 'catalog' ? fetchProducts : fetchOrders} 
              className="p-2 border border-primary/50 text-secondary hover:text-primary rounded-lg hover:bg-gray-150 transition-colors"
              title="Refresh Current List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {activeTab === 'catalog' && (
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-primary text-white hover:bg-opacity-90 text-sm font-bold tracking-wide rounded-lg flex items-center gap-1.5 transition-all shadow hover:shadow-lg"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
          </div>
        </div>

        {/* Database Warning (only shown if catalog offline) */}
        {activeTab === 'catalog' && !dbLive && (
          <div className="p-4 bg-clay/10 border border-clay/30 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-clay shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-clay uppercase tracking-wider">Local MongoDB Offline</h4>
              <p className="text-xs text-secondary leading-relaxed">
                The local MongoDB service is offline. The dashboard has loaded mock products and will execute CRUD updates **in-memory** only. To sync to MongoDB, please ensure MongoDB is running locally (`Start-Service MongoDB` on Windows) and restart the backend server.
              </p>
            </div>
          </div>
        )}

        {/* TAB CONTROLS */}
        <div className="flex border-b border-primary/20 gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-6 py-3 text-xs uppercase font-extrabold tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'catalog' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
          >
            <ShoppingBag className="w-4 h-4" />
            Catalog Control ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 text-xs uppercase font-extrabold tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
          >
            <Clock className="w-4 h-4" />
            Customer Orders ({orders.length})
          </button>
        </div>

        {/* PRODUCT CATALOG TAB PANELS */}
        {activeTab === 'catalog' && (
          loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="card border border-primary/30 rounded-xl p-16 text-center text-secondary">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-base font-bold text-primary">No products available</p>
              <p className="text-xs mt-1">Click the "Add Product" button to create your first neon light catalog listing.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block bg-white border border-primary/30 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-primary/5 text-primary text-[10px] uppercase font-black tracking-widest border-b border-primary/20">
                      <th className="py-4 px-6 w-[80px]">Preview</th>
                      <th className="py-4 px-6">Title</th>
                      <th className="py-4 px-6 w-[150px]">Category</th>
                      <th className="py-4 px-6 w-[130px]">Theme / Style</th>
                      <th className="py-4 px-6 w-[120px] text-right">Price (₹)</th>
                      <th className="py-4 px-6 w-[100px] text-right">Stock</th>
                      <th className="py-4 px-6 w-[120px] text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-xs">
                    {products.map((p) => (
                      <tr key={p.id || p._id} className="hover:bg-warm-white/40 transition-colors">
                        <td className="py-3 px-6">
                          <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                            {p.images && p.images[0] ? (
                              <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-6 font-bold text-primary max-w-[250px] truncate">
                          {p.title}
                          {p.badges && p.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.badges.map((b, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded text-[8px] bg-primary/10 text-primary border border-primary/20 uppercase font-bold">
                                  {b}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-6 text-secondary font-semibold">{p.category}</td>
                        <td className="py-3 px-6">
                          <span className="px-2 py-0.5 rounded bg-accent/15 border border-accent/20 text-accent font-bold">
                            {p.scale}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-right font-bold text-primary">
                          ₹{p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-6 text-right">
                          <span className={`font-mono font-bold ${p.stock === 0 ? 'text-clay' : p.stock < 5 ? 'text-gold' : 'text-primary'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 border border-primary/45 rounded text-secondary hover:text-primary hover:bg-gray-100 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(p)}
                              className="p-1.5 border border-clay/40 rounded text-secondary hover:text-clay hover:bg-clay/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE INVENTORY CARDS VIEW */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {products.map((p) => (
                  <div key={p.id || p._id} className="bg-white border border-primary/20 rounded-xl p-4 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded overflow-hidden border border-primary/10 shrink-0 bg-gray-100 flex items-center justify-center">
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-primary text-sm truncate">{p.title}</h4>
                        <p className="text-secondary text-[11px] font-semibold mt-0.5">{p.category} · {p.scale}</p>
                        <div className="flex gap-1.5 mt-1.5">
                          <span className="text-xs font-black text-clay">₹{p.price.toLocaleString('en-IN')}</span>
                          <span className="text-secondary text-[10px]">•</span>
                          <span className={`text-[10px] font-bold ${p.stock === 0 ? 'text-clay' : 'text-primary'}`}>Stock: {p.stock}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 border-t border-primary/10 pt-3">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="flex-1 py-2 border border-primary/45 rounded-lg text-xs font-bold text-primary hover:bg-gray-100 flex items-center justify-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit details
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="flex-1 py-2 border border-clay/35 rounded-lg text-xs font-bold text-clay hover:bg-clay/5 flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* CUSTOMER ORDERS TAB PANEL */}
        {activeTab === 'orders' && (
          ordersLoading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="card border border-primary/30 rounded-xl p-16 text-center text-secondary">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-base font-bold text-primary">No orders placed yet</p>
              <p className="text-xs mt-1">Check back when users complete their mock payments.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => {
                const oid = o._id || o.id;
                const isExpanded = !!expandedOrders[oid];
                const orderTracking = trackingInputs[oid] || { carrier: '', trackingNumber: '' };

                return (
                  <div key={oid} className="bg-white border border-primary/30 rounded-xl overflow-hidden shadow-sm transition-all hover:border-primary/50">
                    
                    {/* Order summary header */}
                    <div 
                      onClick={() => toggleOrderExpanded(oid)}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none bg-primary/[0.02]"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-primary text-sm font-mono">#{oid.substring(0, 10)}...</span>
                            <span className={`px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase tracking-wide ${getStatusColor(o.status)}`}>
                              {o.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-secondary mt-0.5">
                            Customer: {o.userId?.name || 'Guest'} ({o.userId?.email || 'N/A'})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                        <div className="text-left md:text-right">
                          <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">Total Value</p>
                          <p className="text-sm font-black text-clay">₹{o.amount.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-left md:text-right hidden sm:block">
                          <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">Date</p>
                          <p className="text-xs text-primary font-medium">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          </p>
                        </div>
                        <div className="p-1 rounded-full text-secondary hover:text-primary hover:bg-gray-150 transition-all">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Order Details Panel */}
                    {isExpanded && (
                      <div className="border-t border-primary/20 p-5 bg-warm-white/20 space-y-6 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Shipping address & Customer info */}
                          <div className="bg-white p-4 border border-primary/20 rounded-xl space-y-4 text-left">
                            <div className="flex items-center gap-2 border-b border-primary/10 pb-2">
                              <MapPin className="w-4 h-4 text-accent" />
                              <h4 className="text-xs uppercase font-extrabold tracking-wider text-primary">Fulfillment details</h4>
                            </div>
                            {o.shippingAddress ? (
                              <div className="space-y-1.5 text-xs text-primary">
                                <p className="font-bold">{o.shippingAddress.name}</p>
                                <p className="text-secondary leading-relaxed">{o.shippingAddress.street}</p>
                                <p className="text-secondary">{o.shippingAddress.city}, {o.shippingAddress.state} — {o.shippingAddress.zipCode}</p>
                                <div className="flex items-center gap-1 text-[10px] font-mono text-secondary mt-2">
                                  <Phone className="w-3.5 h-3.5" /> +91 {o.shippingAddress.phone}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-secondary">No shipping details logged.</p>
                            )}

                            {/* Order Status Select Controls */}
                            <div className="pt-3 border-t border-primary/10 space-y-2">
                              <label className="block text-[10px] uppercase font-extrabold tracking-wider text-secondary">
                                Modify Status:
                              </label>
                              <select 
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(oid, e.target.value)}
                                className="px-3 py-2 border border-primary/30 rounded-lg bg-warm-white text-primary text-xs font-bold w-full cursor-pointer focus:outline-none focus:border-accent"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {/* Order items details */}
                          <div className="bg-white p-4 border border-primary/20 rounded-xl space-y-4 text-left">
                            <div className="flex items-center gap-2 border-b border-primary/10 pb-2">
                              <ShoppingBag className="w-4 h-4 text-accent" />
                              <h4 className="text-xs uppercase font-extrabold tracking-wider text-primary">Order items</h4>
                            </div>
                            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                              {o.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center gap-3 text-xs border-b border-dashed border-primary/10 pb-2 last:border-0 last:pb-0">
                                  <div className="min-w-0">
                                    <p className="font-bold text-primary truncate">{item.title}</p>
                                    <p className="text-secondary text-[10px] mt-0.5">Qty: {item.qty} · Rate: ₹{item.price}</p>
                                  </div>
                                  <span className="font-extrabold text-primary shrink-0">
                                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Tracking codes manager */}
                            <div className="pt-4 border-t border-primary/10 space-y-3">
                              <div className="flex items-center gap-1.5">
                                <Truck className="w-4 h-4 text-secondary" />
                                <span className="text-[10px] uppercase font-black text-secondary tracking-wide">Tracking / Dispatch codes</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="e.g. BlueDart"
                                  value={orderTracking.carrier}
                                  onChange={(e) => handleTrackingInputChange(oid, 'carrier', e.target.value)}
                                  className="px-2.5 py-1.5 border border-primary/30 rounded text-xs bg-warm-white focus:outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="Tracking #"
                                  value={orderTracking.trackingNumber}
                                  onChange={(e) => handleTrackingInputChange(oid, 'trackingNumber', e.target.value)}
                                  className="px-2.5 py-1.5 border border-primary/30 rounded text-xs bg-warm-white focus:outline-none"
                                />
                              </div>
                              <button
                                onClick={() => handleUpdateOrderTracking(oid)}
                                className="w-full py-2 bg-primary hover:bg-opacity-95 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Save className="w-3.5 h-3.5" /> Save Dispatch details
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}

      </div>

      {/* Modal Backdrop & Sliding Form Drawer (unchanged product add/edit form) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-outfit">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-warm-white border-l border-gray-200 text-primary h-full flex flex-col shadow-2xl z-10 transition-transform duration-300">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <h3 className="text-base font-extrabold uppercase tracking-wider text-primary">
                  {editingProduct ? 'Modify Figure Record' : 'Add New Light Design'}
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)} 
                className="p-1 rounded-full text-secondary hover:text-primary hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
              <div className="space-y-1">
                <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary">
                  Product Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leo Messi Silhouette 3D Acrylic Lamp"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-accent transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-accent cursor-pointer"
                  >
                    <option value="Lamps">Lamps</option>
                    <option value="Home Decor Desk Setup Items">Desk Setup Items</option>
                    <option value="Customized Products">Customized Products</option>
                    <option value="Organizers">Organizers</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary">
                    Theme / Style *
                  </label>
                  <select
                    value={scale}
                    onChange={e => setScale(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-accent cursor-pointer"
                  >
                    <option value="Sporty">Sporty</option>
                    <option value="Aesthetic Decor">Aesthetic Decor</option>
                    <option value="Customized">Customized</option>
                    <option value="Minimalist">Minimalist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary">
                    Price (MSRP ₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 2499"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary">
                    Stock Availability *
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 15"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary">
                    Material
                  </label>
                  <input
                    type="text"
                    placeholder="Laser-Etched Acrylic"
                    value={material}
                    onChange={e => setMaterial(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary">
                    Height (mm)
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="220"
                    value={heightMm}
                    onChange={e => setHeightMm(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary">
                    Image URLs (comma separated)
                  </label>
                  <label className="cursor-pointer text-xs font-extrabold text-accent hover:text-opacity-80 flex items-center gap-1 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingImage ? 'Uploading...' : 'Choose from Gallery'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  rows={2}
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageInput}
                  onChange={e => setImageInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-accent font-mono text-xs placeholder:text-gray-400"
                />
                {uploadingImage && (
                  <p className="text-[10px] text-accent animate-pulse font-medium">
                    Uploading selected image directly to Cloudinary...
                  </p>
                )}
              </div>


              <div className="space-y-1">
                <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary">
                  Badges (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Best Seller, New, Sporty"
                  value={badgeInput}
                  onChange={e => setBadgeInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 border border-primary/50 text-secondary hover:text-primary rounded-lg font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-opacity-95 text-white font-bold rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <Save className="w-4 h-4" /> Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
