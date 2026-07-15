import React from 'react';
import { Truck, CreditCard, Shield, MapPin } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-warm-white py-16 px-6 md:px-12 font-outfit text-left">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage bg-sage/10 px-3 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5" /> Logistic Operations
          </div>
          <h1 className="text-4xl font-extrabold text-heading uppercase tracking-wider">
            Shipping & Payment Policy
          </h1>
          <p className="text-sm text-secondary">
            Find everything you need to know about shipping charges, order delivery timelines, and accepted payments.
          </p>
        </div>

        {/* Content sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Shipping Policy */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 border-b border-gray-100 pb-3 uppercase tracking-wide">
              <Truck className="w-5 h-5 text-sage" /> Shipping Policy
            </h3>
            <ul className="space-y-3 text-xs leading-relaxed text-body list-disc pl-4">
              <li>Orders are usually processed within <strong className="text-heading">2–4 business days</strong>.</li>
              <li>Once dispatched, delivery generally takes <strong className="text-heading">3–7 business days</strong>, depending on your location.</li>
              <li>During festivals, sales, or unforeseen circumstances, delivery may take slightly longer.</li>
              <li>Customers will receive tracking details via Email, SMS, or WhatsApp once the order has been shipped.</li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 border-b border-gray-100 pb-3 uppercase tracking-wide">
              <CreditCard className="w-5 h-5 text-sage" /> Payment Methods
            </h3>
            <div className="space-y-3 text-xs text-body leading-relaxed">
              <p>We accept secure payments through:</p>
              <ul className="grid grid-cols-2 gap-2 font-semibold text-heading">
                <li>• UPI</li>
                <li>• Credit Cards</li>
                <li>• Debit Cards</li>
                <li>• Net Banking</li>
                <li>• Wallets</li>
                <li>• Razorpay</li>
                <li className="col-span-2">• Cash on Delivery (COD)</li>
              </ul>
              <p className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 mt-2 text-secondary">
                * For COD orders, additional verification may be required before dispatch. Available for eligible PIN codes only.
              </p>
            </div>
          </div>

          {/* Shipping Charges */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 border-b border-gray-100 pb-3 uppercase tracking-wide">
              <Shield className="w-5 h-5 text-sage" /> Shipping Charges
            </h3>
            <ul className="space-y-3 text-xs leading-relaxed text-body">
              <li>
                <strong className="text-heading uppercase block text-[10px] tracking-wider text-secondary mb-0.5">Prepaid Orders</strong>
                Free shipping across India.
              </li>
              <li>
                <strong className="text-heading uppercase block text-[10px] tracking-wider text-secondary mb-0.5">Cash on Delivery (COD)</strong>
                A nominal COD handling fee may apply depending on the order value and delivery location. The exact amount will be displayed during checkout.
              </li>
            </ul>
          </div>

          {/* Order Tracking & Delivery */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-heading flex items-center gap-2 border-b border-gray-100 pb-3 uppercase tracking-wide">
              <MapPin className="w-5 h-5 text-sage" /> Tracking & Delivery
            </h3>
            <ul className="space-y-3 text-xs leading-relaxed text-body list-disc pl-4">
              <li>As soon as your order is dispatched, you’ll receive a tracking link to monitor its progress.</li>
              <li>
                Delivery timelines may vary based on delivery location, courier partner operations, or weather circumstances.
              </li>
              <li>
                If your tracking hasn’t updated for more than <strong className="text-heading">48 hours</strong>, feel free to contact our support team.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
