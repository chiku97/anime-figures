import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LoginDrawer from './components/LoginDrawer.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-anime-bg text-gray-100 selection:bg-anime-pink selection:text-white">
        {/* Navigation Header */}
        <Navbar />

        {/* Global Login Drawer */}
        <LoginDrawer />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:idOrSlug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Landing />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
