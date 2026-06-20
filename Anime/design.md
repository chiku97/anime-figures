# Design — HIKARI Anime Figure Store

## Problem
- User wants to sell anime figures & accessories online in India.
- Needs: aesthetic landing page, buyer shopping flow (browse → cart → checkout), seller accounts (admin-approved), and multi-channel login (Google OAuth + Email OTP + WhatsApp OTP).

## Solution
A MERN application (MongoDB + Express + React + Node) with three roles (Buyer, Seller, Admin). Razorpay handles payments (UPI/cards/netbanking, ₹). MSG91 handles Email + WhatsApp OTP; Google OAuth for social login. Sellers self-register but are admin-approved before listing. The manga-themed landing page (already mocked as `hikari-landing.html`) becomes the React homepage.

## Architecture

```
client/  (React + Vite + Tailwind)
  ├─ pages: Landing, Catalog, Product, Cart, Checkout, OrderConfirm, Profile
  ├─ pages/seller: Apply, Dashboard, Listings, ListingEdit, Orders, Payouts
  ├─ pages/admin: SellerApprovals, Moderation
  ├─ store: Redux Toolkit (auth, cart)
  └─ api: axios client

server/  (Node + Express)
  ├─ models: User, Product, Seller, Cart, Order, Review
  ├─ routes: auth, products, cart, orders, sellers, admin, payments
  ├─ middleware: auth (JWT), role guard, error handler
  ├─ services: otp (MSG91), payments (Razorpay), mailer
  └─ config: db (Mongoose), env
```

## Tech Stack (locked)
- **Frontend:** React + Vite + React Router + Redux Toolkit + Tailwind CSS
- **Backend:** Node.js + Express
- **DB:** MongoDB (Mongoose) — MongoDB Atlas in prod
- **Auth:** JWT sessions; Google OAuth (passport-google-oauth20); Email + WhatsApp OTP via **MSG91**
- **Payments:** **Razorpay** (UPI, cards, netbanking) — currency ₹
- **Media:** Cloudinary (product images)

## Data Model (core collections)
- **User** — name, email, phone, role (buyer|seller|admin), authProviders[], passwordless
- **Seller** — userId, shopName, kyc, status (pending|approved|rejected), payoutInfo
- **Product** — sellerId, title, slug, category, scale, material, heightMm, price, stock, images[], status (draft|active), badges
- **Cart** — userId, items[{productId, qty}]
- **Order** — userId, items[], amount, status, razorpayOrderId, paymentStatus, shippingAddress, tracking
- **Review** — productId, userId, rating, body

## Auth Flows
- **Google:** OAuth2 redirect → callback → issue JWT.
- **Email/WhatsApp OTP:** request OTP → MSG91 sends 6-digit code (5-min expiry) → verify → issue JWT.
- All flows resolve to a User with a role; new accounts default to `buyer`.

## Roles & Gating
- **Buyer:** browse, cart, checkout, orders, reviews.
- **Seller:** self-register → **admin approval required** → then list/manage products, view orders & payouts.
- **Admin:** approve/reject sellers, moderate listings.

## Checkout Flow
Cart → address → server creates Razorpay order → client pays → webhook verifies signature → Order persisted → confirmation + OTP-channel/email notification.

## Sprint Roadmap
1. **Scaffold** (this sprint) — repo, server + client skeletons, DB connection, core models, landing page as homepage.
2. **Auth** — Google + Email OTP + WhatsApp OTP (MSG91), JWT, role guard.
3. **Catalog & Cart** — products CRUD (seller), catalog/filter UI, cart.
4. **Checkout** — Razorpay integration + orders.
5. **Seller dashboard** — listings, orders, payouts.
6. **Admin + polish** — approvals, moderation, reviews, SEO, deploy.

## Out of Scope (Sprint 1)
- Auth providers, payments, seller/admin dashboards — scaffolded structurally only, implemented in later sprints.
