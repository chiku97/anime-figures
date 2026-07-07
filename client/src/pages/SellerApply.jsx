import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Shield } from 'lucide-react';
import { addToast } from '../store/toastSlice.js';

const SellerApply = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    email: '',
    storeName: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1500));
    dispatch(addToast({ message: 'Seller application submitted! 📦', type: 'success' }));
    setSubmitting(false);
    // Reset form
    setForm({ name: '', email: '', storeName: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-warm-white py-10 px-6 md:px-12 font-outfit text-left relative">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      <h1 className="text-3xl font-extrabold text-primary uppercase tracking-wider mb-6 flex items-center gap-3">
        <Send className="w-7 h-7 text-primary" />
        Become a Seller
      </h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto card border border-primary/40 rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-secondary mb-2">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-warm-white border border-primary/60 text-primary placeholder:text-secondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-secondary mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-warm-white border border-primary/60 text-primary placeholder:text-secondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider text-secondary mb-2">Store Name</label>
          <input
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-warm-white border border-primary/60 text-primary placeholder:text-secondary focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider text-secondary mb-2">Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-warm-white border border-primary/60 text-primary placeholder:text-secondary focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 btn-primary hover:bg-primary/80 text-white font-bold rounded-lg shadow uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />Submit Application
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SellerApply;
