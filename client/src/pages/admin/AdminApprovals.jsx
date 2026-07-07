import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const AdminApprovals = () => {
  return (
    <div className="min-h-screen bg-anime-bg py-10 px-6 md:px-12 font-outfit text-left relative">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-anime-textMuted hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-3">
        <Shield className="w-7 h-7 text-anime-pink" />
        Admin Approvals
      </h1>
      <p className="text-anime-textMuted mb-4">Review seller applications and manage platform approvals. (Coming soon!)</p>
      {/* Placeholder content */}
      <div className="bg-anime-card border border-anime-border/40 rounded-xl p-6 text-center">
        <p className="text-anime-textMuted">No pending approvals at the moment.</p>
      </div>
    </div>
  );
};

export default AdminApprovals;
