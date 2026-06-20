# Requirements — Sprint 1: Project Scaffold

## Base Branch
`main` — fresh repo; sprint branch `sprint/scaffold` forks from and merges back to `main`.

## Goal
Stand up the HIKARI MERN project skeleton so later sprints (auth, catalog, checkout, dashboards) have a working foundation, with the manga-themed landing page rendered as the React homepage.

## Scope
- **Repo init** — monorepo with `client/` and `server/`, root README, `.gitignore`, `.env.example`, root scripts to run both.
- **Server skeleton** — Express app, `/api/health` route, Mongoose connection to MongoDB, env config, error-handling middleware, folder structure (models, routes, middleware, services, config).
- **Core Mongoose models** — User, Seller, Product, Cart, Order, Review (schemas only, per design.md data model).
- **Client skeleton** — React + Vite + Tailwind, React Router with route stubs (Landing, Catalog, Product, Cart, Checkout, Profile, seller/*, admin/*), Redux Toolkit store with `auth` + `cart` slices (stubs), axios api client.
- **Landing page integration** — port `hikari-landing.html` into the React Landing page as the homepage (convert markup to JSX/components, move CSS to a stylesheet or Tailwind, keep the canvas dust + ticker behaviour).
- **Dev runnable** — `npm run dev` (or documented equivalent) starts client + server locally.

## Out of Scope
- Real authentication (Google/OTP) — route + slice stubs only; implemented Sprint 2.
- Payments / Razorpay — Sprint 4.
- Seller & admin dashboard logic — page stubs only.
- Deployment — later.

## Constraints
- Stack locked: React+Vite+Tailwind / Node+Express / MongoDB (Mongoose). Currency ₹. India market.
- Windows local dev environment (members are Windows). Use cross-platform npm scripts.
- Node 18+ and a local or Atlas MongoDB connection string via `.env`.

## Acceptance Criteria
- [ ] `server` starts and `GET /api/health` returns 200 with `{status:"ok"}`.
- [ ] Mongoose connects to the configured `MONGODB_URI` (or fails with a clear message if unset).
- [ ] All six core models compile and are importable.
- [ ] `client` builds and runs; visiting `/` renders the HIKARI landing page (theme, ticker, animated dust, responsive).
- [ ] Route stubs resolve without error; nav links navigate.
- [ ] `README.md` documents setup, env vars, and how to run client + server.
- [ ] `.env.example` lists all required vars (MONGODB_URI, plus placeholders for later: JWT_SECRET, GOOGLE_*, MSG91_*, RAZORPAY_*, CLOUDINARY_*).
