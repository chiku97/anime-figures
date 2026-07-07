# Formora Studio - Project Status & Features Matrix

This document provides a comprehensive mapping of tasks completed, features ready for production, and pending backlog items or bugs.

---

## 🛠️ Completed Tasks
- **Modular Project Structure**: Scaffolded and separated into clean `client/` (React + Redux Toolkit + Vite + TailwindCSS) and `server/` (Node + Express + MongoDB Atlas + Razorpay SDK) workspace folders.
- **Dynamic Database Layer**: Added schema models for users, products, reviews, and orders under `server/src/models/`.
- **Flexible OTP & OAuth Gateway**: Configured backend passwordless SMS OTP auth (via Twilio with live sandbox fallback logging) and direct Google Identity OAuth token verification.
- **Admin Control Dashboard**: Built full product CRUD (listings control) and order management pipelines (fulfillment checks, tracking codes, and status drop-down overrides).
- **Responsive Navigation Header & Banners**: Built sticky, responsive navbar featuring dynamic drawer toggle, Redux cart quantity counts, and authentic custom logos.
- **Production-Ready Login Security**: Removed sandbox bypass options (mock OTP bypass codes and mock social login triggers) and established cryptographically verified signature validators for Google OAuth and Firebase ID tokens.

---

## 🚀 Production-Ready Features
Below is a checklist of features that are fully functional and ready to deploy.

### 1. Authentication & Security
- [x] **Secure Passwordless OTP Sign-in**
  - **Desktop/Mobile**: Slide-out glassmorphic panel with phone/email inputs. Restricts input OTP to codes securely matched in memory on the backend.
- [x] **Google OAuth Login**
  - **Desktop/Mobile**: Official Google Identity rendering button. Tokens are verified cryptographically on the backend server using the Google Auth Library (`OAuth2Client`).
- [x] **Firebase Authentication Synchronization**
  - **Desktop/Mobile**: Tokens are verified cryptographically via Google's public certificates dynamically fetched and checked using the RS256 algorithm inside `jsonwebtoken`.

### 2. Catalog & Product Discovery
- [x] **Featured Collections & Layout Banners**
  - **Desktop**: Grid layouts with springy hover transformations (`no-pop` exclusions where necessary).
  - **Mobile**: Single-column vertical scroll layouts, with category navigation shortcuts.
- [x] **Catalog Search & Filtering**
  - **Desktop**: Left-aligned sticky sidebar filters (by Category, Size, Stock Availability) and Price sort selector.
  - **Mobile**: Drawer overlays for filters and sort options.
- [x] **Product Detail Sheets**
  - **Desktop**: Split screen showing high-resolution images alongside verified customer reviews and specifications.
  - **Mobile**: Responsive stacked columns, with sticky bottom Add-to-Cart buttons.

### 3. Order Placement & Checkout
- [x] **Saved Address Vault**
  - **Desktop/Mobile**: Create/delete addresses directly on the profile page or during checkout; addresses are saved in Mongoose user records.
- [x] **3-Step Checkout Wizard**
  - **Desktop**: Left-hand step details (Delivery Address selector -> Order Review -> Secure Payment description) paired with a sticky Order Summary sidebar.
  - **Mobile**: Simplified step progress header, stacked forms.
- [x] **Razorpay Payment Integration**
  - **Desktop/Mobile**: Dynamic checkout script loader with signature checks, seeder stock updates, and a custom popup interface. Auto-bypasses to Sandbox mode with full user prompt alerts if `.env` keys are unconfigured.

### 4. Admin Management Dashboard
- [x] **Inventory & Product CRUD**
  - **Desktop/Mobile**: Tables (desktop) and card grids (mobile) to list, edit details, adjust stock, delete records, and verify database connectivity.
- [x] **Customer Orders Fulfillment System**
  - **Desktop/Mobile**: Track all customer orders, inspect buyer addresses, read item list overrides, modify processing status, and insert blue-dart/dispatch tracking numbers.

---

## ⚠️ Pending Backlog & Known Gaps

| Feature / Issue | Description | Affected Layouts | File Reference |
| :--- | :--- | :--- | :--- |
| **Google Script Resiliency** | In slow network conditions, the Google Identity client script might load late, resulting in rendering glitches. Needs loading placeholder. | Desktop & Mobile | [LoginDrawer.jsx](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/client/src/components/LoginDrawer.jsx#L65-L92) |

*(Note: Seller dashboard, approvals, and application flows have been bypassed and skipped per project instructions.)*
