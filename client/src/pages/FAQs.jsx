import React from 'react';
import { HelpCircle, IndianRupee, Tag, ShieldCheck } from 'lucide-react';

const FAQs = () => {
  return (
    <div className="min-h-screen bg-warm-white py-16 px-6 md:px-12 font-outfit text-left">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage bg-sage/10 px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5" /> Platform FAQs
          </div>
          <h1 className="text-4xl font-extrabold text-heading uppercase tracking-wider">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-secondary">
            Find answers to frequently asked questions about pricing, order placement, and 3D printing details.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-heading flex items-center gap-2 border-b border-gray-100 pb-3 uppercase tracking-wide">
            <IndianRupee className="w-5 h-5 text-sage" /> Pricing & GST
          </h3>
          <ul className="space-y-4 text-xs text-body leading-relaxed pl-4 list-disc">
            <li>
              All prices are displayed in <strong className="text-heading">Indian Rupees (INR)</strong>.
            </li>
            <li>
              GST, if applicable, is included in the product price.
            </li>
            <li>
              Shipping charges (if any) will be calculated and shown at checkout.
            </li>
            <li>
              Prices are subject to change without prior notice.
            </li>
          </ul>
        </div>

        {/* Dynamic Accordion items */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-secondary mb-2">General FAQs</h3>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2">
            <h4 className="font-bold text-sm text-heading flex items-start gap-2">
              <Tag className="w-4 h-4 text-sage mt-0.5" /> What makes 3D-printed figures unique?
            </h4>
            <p className="text-xs text-secondary leading-relaxed pl-6">
              Our figures are built layer-by-layer rather than molded. This means each item has its own unique texture fingerprint, giving it an authentic custom-crafted look.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2">
            <h4 className="font-bold text-sm text-heading flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-sage mt-0.5" /> Can I cancel my order?
            </h4>
            <p className="text-xs text-secondary leading-relaxed pl-6">
              Because our production is fully customized, orders cannot be modified or cancelled once printing has commenced. Please double-check all details before verifying payment!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
