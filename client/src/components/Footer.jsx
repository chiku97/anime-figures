import React from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import FormoraLogo from './FormoraLogo.jsx';

const Footer = () => {
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
            <li><a href="#story" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="#custom-orders" className="hover:text-primary transition-colors">Custom Orders</a></li>
            <li><Link to="/faqs" className="hover:text-primary transition-colors">FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-primary mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-secondary">
            <li><Link to="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
            <li><Link to="/return-policy" className="hover:text-primary transition-colors">Return Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
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
    </footer>
  );
};

export default Footer;
