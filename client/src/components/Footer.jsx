import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormoraLogo from './FormoraLogo.jsx';
import PolicyModal from './PolicyModal.jsx';

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null); // 'shipping', 'return', 'privacy', 'terms', 'faqs', 'contact', 'about'

  const handleCustomOrdersClick = (e) => {
    e.preventDefault();
    const element = document.getElementById('custom-orders');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#custom-orders';
    }
  };

  return (
    <footer className="bg-warm-white border-t border-gray-200 py-12 px-6 md:px-12 font-outfit mt-auto z-10 relative text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand Info */}
        <div className="space-y-3">
          <div className="-ml-3">
            <FormoraLogo compact={false} variant="dark" height="85px" />
          </div>
          <p className="text-sm text-body leading-relaxed">
            Premium 3D-printed products designed with passion. From sports collections to ambient lighting and desk setups, we bring your personality into your space.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-secondary">
            <li><Link to="/catalog" className="hover:text-primary transition-colors">Shop</Link></li>
            <li><Link to="/catalog?sort=new" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            <li>
              <a 
                href="#about" 
                onClick={(e) => { e.preventDefault(); setActiveModal('about'); }} 
                className="hover:text-primary transition-colors"
              >
                About Us
              </a>
            </li>
            <li>
              <a 
                href="#custom-orders" 
                onClick={handleCustomOrdersClick} 
                className="hover:text-primary transition-colors"
              >
                Custom Orders
              </a>
            </li>
            <li>
              <a 
                href="#faqs" 
                onClick={(e) => { e.preventDefault(); setActiveModal('faqs'); }} 
                className="hover:text-primary transition-colors"
              >
                FAQs
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); setActiveModal('contact'); }} 
                className="hover:text-primary transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-secondary">
            <li>
              <a 
                href="#shipping-policy" 
                onClick={(e) => { e.preventDefault(); setActiveModal('shipping'); }} 
                className="hover:text-primary transition-colors"
              >
                Shipping Policy
              </a>
            </li>
            <li>
              <a 
                href="#return-policy" 
                onClick={(e) => { e.preventDefault(); setActiveModal('return'); }} 
                className="hover:text-primary transition-colors"
              >
                Return Policy
              </a>
            </li>
            <li>
              <a 
                href="#privacy-policy" 
                onClick={(e) => { e.preventDefault(); setActiveModal('privacy'); }} 
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a 
                href="#terms" 
                onClick={(e) => { e.preventDefault(); setActiveModal('terms'); }} 
                className="hover:text-primary transition-colors"
              >
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Stay Connected */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary mb-4">Stay Connected</h4>
          <p className="text-sm text-body leading-relaxed">
            Follow us on Instagram for new launches, behind-the-scenes content, and exclusive offers.
          </p>
          <a
            href="https://instagram.com/formorastudio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 text-[#1F1F1F] bg-white rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md hover:bg-gray-50 uppercase tracking-widest"
          >
            @formorastudio
          </a>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-secondary">
        <p>© 2026 Formora. All rights reserved.</p>
        <p className="mt-2 md:mt-0 font-medium">Made with Passion in India</p>
      </div>

      {/* Global Policy Popup Modal */}
      {activeModal && (
        <PolicyModal 
          type={activeModal} 
          onClose={() => setActiveModal(null)} 
        />
      )}
    </footer>
  );
};

export default Footer;
