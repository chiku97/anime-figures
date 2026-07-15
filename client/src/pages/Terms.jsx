import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-warm-white py-16 px-6 md:px-12 font-outfit text-left">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage bg-sage/10 px-3 py-1 rounded-full">
            <FileText className="w-3.5 h-3.5" /> Studio Guidelines
          </div>
          <h1 className="text-4xl font-extrabold text-heading uppercase tracking-wider">
            Terms & Conditions
          </h1>
          <p className="text-sm text-secondary">
            Please read these terms and policies carefully before making purchases with Formora Studio.
          </p>
        </div>

        {/* Content List */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
          <ul className="space-y-4 text-sm text-body leading-relaxed list-disc pl-5">
            <li>
              By placing an order with <strong className="text-heading">Formora Studio</strong>, you agree to our policies and terms.
            </li>
            <li>
              Product colors may vary slightly due to screen settings and lighting conditions.
            </li>
            <li>
              Minor layer lines or texture variations are a natural part of the <strong className="text-heading">3D printing process</strong> and are not considered defects.
            </li>
            <li>
              Once an order enters production, it cannot be modified or cancelled.
            </li>
            <li>
              We reserve the right to cancel orders in cases of pricing errors, stock limitations, or unforeseen circumstances. In such cases, a full refund will be issued.
            </li>
            <li>
              All product designs, images, logos, and content on this website are the intellectual property of Formora Studio and may not be copied or reproduced without written permission.
            </li>
            <li>
              Formora Studio reserves the right to update these policies at any time without prior notice.
            </li>
          </ul>
        </div>

        {/* Highlight Alert */}
        <div className="bg-clay/5 border border-clay/20 text-clay rounded-xl p-6 flex items-start gap-4 shadow-sm">
          <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm uppercase tracking-wide">Important Order Information</h4>
            <p className="text-xs leading-relaxed text-clay/90">
              Each product is custom crafted to order. We do not maintain standard industrial batches, meaning every item holds subtle individual properties resulting from custom layer-by-layer printing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
