import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LoginDrawer from './components/LoginDrawer.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Profile from './pages/Profile.jsx';
import SellerApply from './pages/SellerApply.jsx';
import SellerDashboard from './pages/seller/SellerDashboard.jsx';
import AdminApprovals from './pages/admin/AdminApprovals.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Contact from './pages/Contact.jsx';
import Terms from './pages/Terms.jsx';
import ShippingPolicy from './pages/ShippingPolicy.jsx';
import ReturnPolicy from './pages/ReturnPolicy.jsx';
import FAQs from './pages/FAQs.jsx';
import LegalNotice from './pages/LegalNotice.jsx';



function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-background text-primary selection:bg-accent selection:text-white">
          {/* Navigation Header */}
          <Navbar />

          {/* Global Login Drawer */}
          <LoginDrawer />

          {/* Global Toast Notifications */}
          <ToastContainer />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:idOrSlug" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />

              {/* Support & Policy Routes */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/privacy-policy" element={<LegalNotice />} />

              {/* Seller Routes */}
              <Route path="/seller/apply" element={<SellerApply />} />
              <Route path="/seller/dashboard" element={<SellerDashboard />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/approvals" element={<AdminApprovals />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Fallback route */}
              <Route path="*" element={<Landing />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>  );
}

export default App;
