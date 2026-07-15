import React from 'react';
import { Shield } from 'lucide-react';

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-warm-white py-16 px-6 md:px-12 font-outfit text-left">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage bg-sage/10 px-3 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5" /> Trust Vault
          </div>
          <h1 className="text-4xl font-extrabold text-heading uppercase tracking-wider">
            Privacy Policy
          </h1>
          <p className="text-sm text-secondary">
            Your trust is our priority. Read about how we collect, handle, and secure your profile details.
          </p>
        </div>

        {/* Content Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6 text-xs text-body leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-bold text-sm text-heading uppercase tracking-wide">Information Collection</h3>
            <p>
              We collect your name, shipping addresses, email address, and phone number when you register a Formora Studio account, submit product reviews, or make custom orders.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-heading uppercase tracking-wide">Use of Information</h3>
            <p>
              Your contact details are exclusively utilized to authorize account access (via OTP or OAuth), deliver transaction invoices, dispatch shipping links, and organize courier logistics.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-sm text-heading uppercase tracking-wide">Data Security</h3>
            <p>
              We process secure payments using verified payment processors (e.g. Razorpay) and execute cryptographically signed verification operations on the server to prevent token interception.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
