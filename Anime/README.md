# HIKARI — Premium Anime Figure Store

HIKARI is a MERN-stack e-commerce application tailored for purchasing high-quality anime figures and accessories in India.

## Features (Sprint 1)
- Monorepo structure setup (`client` & `server` workspaces)
- Full core database schema using Mongoose (User, Seller, Product, Cart, Order, Review)
- Highly aesthetic, dark-themed manga style UI using React, React Router, Redux Toolkit, and Tailwind CSS
- Interactive floating canvas dust particles background
- Right-side sliding login drawer (Myntra-style) with mock credentials to facilitate early visual testing of checkout flows
- Guest browsing of products and catalog filters, with cart and checkout actions guarded by a required login

---

## Technical Stack
- **Frontend:** React, Vite, React Router, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB (Local or Atlas)
- **Auth (Future):** MSG91 (WhatsApp + Email OTP), Google OAuth, JWT
- **Payments (Future):** Razorpay (INR)

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (running locally or MongoDB Atlas connection string)

### Installation

1. Clone the repository and navigate to it:
   ```bash
   cd "Personal Project/Anime"
   ```

2. Copy the example environment file and set up your variables:
   ```bash
   copy .env.example .env
   # Make sure MONGODB_URI is set properly. For local, mongodb://localhost:27017/anime-figures is standard.
   ```

3. Install root dependencies and workspace dependencies:
   ```bash
   npm run install-all
   ```

### Running the Application

To run both the server and client dev servers concurrently, execute:
```bash
npm run dev
```

The frontend will run at [http://localhost:5173](http://localhost:5173) and the backend will run at [http://localhost:5000](http://localhost:5000).

To verify the server is running, visit the healthcheck endpoint:
[http://localhost:5000/api/health](http://localhost:5000/api/health)
