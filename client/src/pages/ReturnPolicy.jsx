import React from 'react';
import { RotateCcw, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-warm-white py-16 px-6 md:px-12 font-outfit text-left">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage bg-sage/10 px-3 py-1 rounded-full">
            <RotateCcw className="w-3.5 h-3.5" /> Guarantee Check
          </div>
          <h1 className="text-4xl font-extrabold text-heading uppercase tracking-wider">
            Return & Replacement Policy
          </h1>
          <p className="text-sm text-secondary">
            Understand details about replacement eligibility, refunds, and claiming guidelines for damaged goods.
          </p>
        </div>

        {/* Content sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* General Return Statement */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4 col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 border-b border-gray-100 pb-3 uppercase tracking-wide">
              <RotateCcw className="w-5 h-5 text-sage" /> General Returns
            </h3>
            <p className="text-sm leading-relaxed text-body">
              Every Formora Studio product is carefully made to order using 3D printing technology. Since our products are handcrafted specifically for each order, <strong className="text-heading">we do not accept returns</strong> for reasons such as change of mind, incorrect product selection, or personal preference.
            </p>
          </div>

          {/* Replacement Eligibility */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 border-b border-gray-100 pb-3 uppercase tracking-wide">
              <ShieldCheck className="w-5 h-5 text-sage" /> Replacement Eligibility
            </h3>
            <div className="space-y-3 text-xs text-body leading-relaxed">
              <p>We will gladly replace your product if:</p>
              <ul className="space-y-2 text-heading font-semibold">
                <li>• You receive a damaged item.</li>
                <li>• You receive the wrong product.</li>
                <li>• The product has a significant manufacturing defect.</li>
              </ul>
            </div>
          </div>

          {/* How to Request a Replacement */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 border-b border-gray-100 pb-3 uppercase tracking-wide">
              <Mail className="w-5 h-5 text-sage" /> How to Claim
            </h3>
            <div className="space-y-3 text-xs text-body leading-relaxed">
              <p>Please contact us within <strong className="text-heading">48 hours</strong> of receiving your order and provide:</p>
              <ul className="space-y-2 font-semibold text-heading">
                <li>• Your Order ID</li>
                <li>• Clear photos of the product</li>
                <li>• An unboxing video showing the issue</li>
              </ul>
              <p className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 mt-2 text-secondary">
                Once verified, we'll arrange a replacement at no additional cost.
              </p>
            </div>
          </div>

          {/* Refunds */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4 col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 border-b border-gray-100 pb-3 uppercase tracking-wide">
              <ShieldAlert className="w-5 h-5 text-sage" /> Refunds
            </h3>
            <div className="space-y-2 text-xs text-body leading-relaxed">
              <p>Refunds are only applicable if:</p>
              <ul className="space-y-1.5 list-disc pl-4 font-medium text-heading">
                <li>Your order is cancelled before production begins.</li>
                <li>We are unable to provide a replacement for an approved claim.</li>
              </ul>
              <p className="text-secondary mt-2">
                * Approved refunds are processed within <strong className="text-heading">5–7 business days</strong> to the original payment method.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
