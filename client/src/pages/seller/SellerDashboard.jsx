import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Box } from 'lucide-react';

const SellerDashboard = () => {
  return (
    <div className="min-h-screen bg-warm-white py-10 px-6 md:px-12 font-outfit text-left relative">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      <h1 className="text-3xl font-extrabold text-primary uppercase tracking-wider mb-6 flex items-center gap-3">
        <Box className="w-7 h-7 text-primary" />
        Seller Dashboard
      </h1>
      <p className="text-secondary mb-4">
        Here you can manage your store, view orders, and update listings. (Coming soon!)
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card border border-primary/40 rounded-xl p-6 text-center">
          <Shield className="w-12 h-12 mx-auto text-cyan mb-4" />
          <h2 className="text-xl font-bold text-primary mb-2">Store Settings</h2>
          <p className="text-secondary text-sm">
            Configure your store details, branding, and policies.
          </p>
        </div>
        <div className="card border border-primary/40 rounded-xl p-6 text-center">
          <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-bold text-primary mb-2">Order Management</h2>
          <p className="text-secondary text-sm">
            Track orders, update statuses, and handle shipments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
