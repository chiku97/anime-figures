import React from 'react';
import { 
  X, MessageSquare, Mail, Phone, Clock, Sparkles,
  FileText, Truck, CreditCard, ShieldAlert, RotateCcw, 
  ShieldCheck, HelpCircle, IndianRupee, Tag, Shield 
} from 'lucide-react';

const Instagram = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);


const PolicyModal = ({ type, onClose }) => {
  if (!type) return null;

  const renderContent = () => {
    switch (type) {
      case 'contact':
        return (
          <div className="space-y-6 text-left font-outfit">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-sage/10 text-sage rounded-full">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-heading uppercase tracking-wider">
                Let's Connect
              </h2>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                Have a question or need assistance with your order? Reach out to us through any of these channels.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 bg-sage/10 text-sage rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-heading text-xs uppercase tracking-wide">Email</h4>
                  <a href="mailto:hello@formorastudio.com" className="text-xs text-accent hover:underline font-semibold break-all">
                    hello@formorastudio.com
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 bg-sage/10 text-sage rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-heading text-xs uppercase tracking-wide">WhatsApp</h4>
                  <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline font-semibold">
                    +91-XXXXXXXXXX
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 bg-sage/10 text-sage rounded-lg">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-heading text-xs uppercase tracking-wide">Instagram</h4>
                  <a href="https://instagram.com/_formora_studio" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline font-semibold">
                    @_formora_studio
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-sage/5 border border-sage/20 rounded-xl p-4 text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-sage">
                <Clock className="w-3.5 h-3.5" /> Response Time
              </div>
              <p className="text-xs text-body">
                Our team typically responds within <strong className="text-heading">24–48 business hours</strong>.
              </p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6 text-left font-outfit">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-sage/10 text-sage rounded-full">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-heading uppercase tracking-wider">
                Terms & Conditions
              </h2>
              <p className="text-xs text-secondary">
                By placing an order with Formora Studio, you agree to our policies.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm max-h-[300px] overflow-y-auto">
              <ul className="space-y-3.5 text-xs text-body leading-relaxed list-disc pl-4">
                <li>
                  By placing an order with <strong className="text-heading">Formora Studio</strong>, you agree to our policies and terms.
                </li>
                <li>
                  Product colors may vary slightly due to screen settings and lighting conditions.
                </li>
                <li>
                  Minor layer lines or texture variations are a natural part of the 3D printing process and are not considered defects.
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
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6 text-left font-outfit max-h-[500px] overflow-y-auto pr-1">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-sage/10 text-sage rounded-full">
                <Truck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-heading uppercase tracking-wider">
                Shipping & Payment
              </h2>
            </div>

            <div className="space-y-5 text-xs">
              {/* Shipping Policy */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-heading text-xs uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                  <Truck className="w-4 h-4 text-sage" /> Shipping Policy
                </h3>
                <ul className="space-y-1.5 list-disc pl-4 text-body leading-relaxed">
                  <li>Orders are usually processed within 2–4 business days.</li>
                  <li>Once dispatched, delivery generally takes 3–7 business days, depending on your location.</li>
                  <li>During festivals, sales, or unforeseen circumstances, delivery may take slightly longer.</li>
                  <li>Customers will receive tracking details via Email, SMS, or WhatsApp once the order has been shipped.</li>
                </ul>
              </div>

              {/* Payment Methods */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-heading text-xs uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                  <CreditCard className="w-4 h-4 text-sage" /> Payment Methods
                </h3>
                <p className="text-body leading-relaxed mb-1.5">We accept secure payments through:</p>
                <div className="grid grid-cols-2 gap-1.5 font-bold text-heading">
                  <div>• UPI</div>
                  <div>• Credit Cards</div>
                  <div>• Debit Cards</div>
                  <div>• Net Banking</div>
                  <div>• Wallets</div>
                  <div>• Razorpay</div>
                </div>
                <p className="text-secondary mt-1.5">
                  * COD (Cash on Delivery) is available for eligible PIN codes. COD orders may require additional verification before dispatch.
                </p>
              </div>

              {/* Shipping Charges */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-heading text-xs uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                  <ShieldCheck className="w-4 h-4 text-sage" /> Shipping Charges
                </h3>
                <ul className="space-y-1 text-body">
                  <li><strong>Prepaid Orders:</strong> Free shipping across India.</li>
                  <li><strong>COD Handling Fee:</strong> A nominal handling fee may apply depending on order value/location (displayed during checkout).</li>
                </ul>
              </div>

              {/* Order Tracking & Delivery */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-heading text-xs uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                  <Tag className="w-4 h-4 text-sage" /> Tracking & Delivery
                </h3>
                <ul className="space-y-1.5 list-disc pl-4 text-body leading-relaxed">
                  <li>As soon as your order is dispatched, you’ll receive a tracking link to monitor its progress.</li>
                  <li>Delivery timelines may vary based on delivery location, courier partner operations, and weather.</li>
                  <li>If your tracking hasn’t updated for more than 48 hours, feel free to contact our support team.</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'return':
        return (
          <div className="space-y-6 text-left font-outfit max-h-[500px] overflow-y-auto pr-1">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-sage/10 text-sage rounded-full">
                <RotateCcw className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-heading uppercase tracking-wider">
                Returns & Refunds
              </h2>
            </div>

            <div className="space-y-5 text-xs">
              {/* Return Policy */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-heading text-xs uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                  <RotateCcw className="w-4 h-4 text-sage" /> Return Policy
                </h3>
                <p className="text-body leading-relaxed">
                  Every Formora Studio product is carefully made to order using 3D printing technology. Since our products are handcrafted specifically for each order, we do not accept returns for reasons such as change of mind, incorrect product selection, or personal preference.
                </p>
              </div>

              {/* Replacement Eligibility */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-heading text-xs uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                  <ShieldCheck className="w-4 h-4 text-sage" /> Replacement Eligibility
                </h3>
                <p className="text-body leading-relaxed mb-1">We will gladly replace your product if:</p>
                <ul className="space-y-1 font-semibold text-heading">
                  <li>• You receive a damaged item.</li>
                  <li>• You receive the wrong product.</li>
                  <li>• The product has a significant manufacturing defect.</li>
                </ul>
              </div>

              {/* How to Request a Replacement */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-heading text-xs uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                  <Mail className="w-4 h-4 text-sage" /> How to Claim
                </h3>
                <p className="text-body leading-relaxed">
                  Please contact us within 48 hours of receiving your order and provide your Order ID, clear photos of the product, and an unboxing video showing the issue. Once verified, we’ll arrange a replacement at no additional cost.
                </p>
              </div>

              {/* Refunds */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-heading text-xs uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                  <ShieldAlert className="w-4 h-4 text-sage" /> Refunds
                </h3>
                <p className="text-body leading-relaxed">
                  Refunds are only applicable if your order is cancelled before production begins, or if we are unable to provide a replacement for an approved claim. Approved refunds are processed within 5–7 business days to the original payment method.
                </p>
              </div>
            </div>
          </div>
        );

      case 'faqs':
        return (
          <div className="space-y-6 text-left font-outfit">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-sage/10 text-sage rounded-full">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-heading uppercase tracking-wider">
                FAQs & Pricing
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-xs">
                <h3 className="font-bold text-heading text-xs uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                  <IndianRupee className="w-4 h-4 text-sage" /> Pricing Policy
                </h3>
                <ul className="space-y-1.5 text-body leading-relaxed">
                  <li>• All prices are displayed in Indian Rupees (INR).</li>
                  <li>• GST, if applicable, is included in the product price.</li>
                  <li>• Shipping charges (if any) will be calculated and shown at checkout.</li>
                  <li>• Prices are subject to change without prior notice.</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-1 text-xs">
                <h4 className="font-bold text-heading flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-sage" /> What are 3D layer lines?
                </h4>
                <p className="text-secondary pl-5">
                  Minor layer lines or texture variations are a natural part of the 3D printing process and are not defects.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-1 text-xs">
                <h4 className="font-bold text-heading flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-sage" /> Can I cancel an active order?
                </h4>
                <p className="text-secondary pl-5">
                  Once an order enters production, it cannot be modified or cancelled.
                </p>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6 text-left font-outfit">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-sage/10 text-sage rounded-full">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-heading uppercase tracking-wider">
                Privacy Policy
              </h2>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 text-xs text-body leading-relaxed max-h-[300px] overflow-y-auto">
              <div className="space-y-1">
                <h4 className="font-bold text-heading uppercase tracking-wide">Information Collection</h4>
                <p>We collect your name, shipping addresses, email, and phone number to provision account sessions (via OTP) and organize deliveries.</p>
              </div>
              <div className="space-y-1 border-t border-gray-200 pt-3">
                <h4 className="font-bold text-heading uppercase tracking-wide">Usage</h4>
                <p>Your details are exclusively used to verify your identity, deliver orders, send transactional details, and customize your experience.</p>
              </div>
              <div className="space-y-1 border-t border-gray-200 pt-3">
                <h4 className="font-bold text-heading uppercase tracking-wide">Payment Security</h4>
                <p>All card and online transactions are processed through highly secure payment gateways (Razorpay) and are encrypted at rest.</p>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6 text-left font-outfit">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-sage/10 text-sage rounded-full">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-heading uppercase tracking-wider">
                About Formora Studio
              </h2>
              <p className="text-xs text-secondary uppercase tracking-widest">
                Where Vision Finds Form
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4 text-xs text-body leading-relaxed max-h-[350px] overflow-y-auto">
              <p>
                <strong className="text-heading">Formora Studio</strong> is a premier creative design and 3D printing studio based in India. We specialize in designing and crafting top-tier collectibles, ambient LED lighting fixtures, custom desk accessories, and modern fan merchandise.
              </p>
              <p>
                Every single piece is designed, optimized, and printed layer-by-layer in-house. We source only the finest biodegradable and eco-friendly filaments (primarily PLA) to ensure our creations have premium aesthetics while remaining sustainable.
              </p>
              <p>
                Whether it is custom gaming gear, customized corporate lamps, or precise anime silhouettes, our mission is to translate abstract vision into physical, artistic reality. Thank you for being a part of our journey!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center font-outfit p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl z-10 p-6 md:p-8 transition-transform duration-300 ease-out transform scale-100 flex flex-col max-h-[85vh] my-10 md:my-16">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 rounded-full text-secondary hover:text-primary hover:bg-gray-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dynamic Modal Content */}
        <div className="overflow-y-auto">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary text-white font-bold rounded-lg text-xs uppercase tracking-widest hover:bg-opacity-95 transition-all text-center"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
