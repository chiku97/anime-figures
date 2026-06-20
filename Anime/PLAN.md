# HIKARI Sprint 1 — Scaffold Implementation Plan

## Phase 1: Repo & Tooling

| # | Change | Files | Tier | Done when | Blockers |
|---|--------|-------|------|-----------|----------|
| T1 | Create monorepo layout with `client/` and `server/` directories | `client/`, `server/` | cheap | Both directories exist with placeholder `package.json` files | None |
| T2 | Root `package.json` with npm workspaces (`client`, `server`) and a `dev` script using `concurrently` to start both | `package.json` | cheap | `npm install` succeeds; `npm run dev` is defined | None |
| T3 | `.gitignore` covering node_modules, .env, build artifacts, OS files, IDE configs | `.gitignore` | cheap | Tracked; `node_modules/` and `.env` excluded from git | None |
| T4 | `.env.example` listing all env var placeholders: `MONGODB_URI`, `PORT`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MSG91_AUTH_KEY`, `MSG91_SENDER`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | `.env.example` | cheap | File exists with all placeholders and comments | None |
| T5 | `README.md` with project overview, prerequisites (Node 18+, MongoDB), setup steps, env var table, and how to run client + server | `README.md` | cheap | README accurately documents setup and `npm run dev` | None |

**VERIFY V1:** `npm install` at root succeeds. `.gitignore`, `.env.example`, and `README.md` are present and correct. `npm run dev` script is defined in root `package.json`.

---

## Phase 2: Server Skeleton

| # | Change | Files | Tier | Done when | Blockers |
|---|--------|-------|------|-----------|----------|
| T6 | Server `package.json` with Express, Mongoose, cors, dotenv, and a `dev` script (nodemon) | `server/package.json` | cheap | `npm install` in server succeeds | Phase 1 complete |
| T7 | Config module that reads env vars and exports them; fails with clear error if `MONGODB_URI` is unset | `server/src/config/index.js` | cheap | Importing config returns env values; throws if `MONGODB_URI` missing | T6 |
| T8 | Create folder structure stubs: `models/`, `routes/`, `middleware/`, `services/` | `server/src/models/`, `server/src/routes/`, `server/src/middleware/`, `server/src/services/` | cheap | Directories exist | T6 |
| T9 | Mongoose connection module using `MONGODB_URI` with connection event logging and error handling | `server/src/config/db.js` | standard | Mongoose connects when valid URI provided; logs clear error otherwise | T7 |
| T10 | Express app setup: cors, JSON body parser, mount `/api/health` returning `{status:"ok"}` | `server/src/app.js` | standard | `GET /api/health` returns 200 `{status:"ok"}` | T7 |
| T11 | Error-handling middleware (404 handler + global error handler with structured JSON response) | `server/src/middleware/errorHandler.js` | standard | Unknown routes return 404 JSON; thrown errors return structured error | T10 |
| T12 | Server entry point (`server.js`) that connects to DB then starts Express | `server/src/server.js` | standard | `npm run dev` in server starts and listens on configured PORT | T9, T10, T11 |

**VERIFY V2:** `npm run dev` in `server/` starts Express. `GET http://localhost:<PORT>/api/health` returns `200 {status:"ok"}`. Server fails gracefully with a clear message if `MONGODB_URI` is unset. Unknown routes return 404 JSON.

---

## Phase 3: Core Mongoose Models

| # | Change | Files | Tier | Done when | Blockers |
|---|--------|-------|------|-----------|----------|
| T13 | User model — name, email, phone, role (enum: buyer/seller/admin), authProviders[], timestamps | `server/src/models/User.js` | standard | Model compiles; can be imported | Phase 2 complete |
| T14 | Seller model — userId (ref User), shopName, kyc, status (enum: pending/approved/rejected), payoutInfo, timestamps | `server/src/models/Seller.js` | standard | Model compiles; can be imported | T13 |
| T15 | Product model — sellerId (ref Seller), title, slug, category, scale, material, heightMm, price, stock, images[], status (enum: draft/active), badges, timestamps | `server/src/models/Product.js` | standard | Model compiles; can be imported | T13 |
| T16 | Cart model — userId (ref User), items[{productId (ref Product), qty}], timestamps | `server/src/models/Cart.js` | standard | Model compiles; can be imported | T13 |
| T17 | Order model — userId (ref User), items[], amount, status, razorpayOrderId, paymentStatus, shippingAddress, tracking, timestamps | `server/src/models/Order.js` | standard | Model compiles; can be imported | T13 |
| T18 | Review model — productId (ref Product), userId (ref User), rating (1-5), body, timestamps | `server/src/models/Review.js` | standard | Model compiles; can be imported | T13 |

**VERIFY V3:** All six models can be imported in a test script without errors. Schema fields match `design.md` data model.

---

## Phase 4: Client Skeleton

| # | Change | Files | Tier | Done when | Blockers |
|---|--------|-------|------|-----------|----------|
| T19 | Scaffold Vite + React app in `client/` with Tailwind CSS configured | `client/` (Vite scaffold + `tailwind.config.js`, `postcss.config.js`, `src/index.css`) | standard | `npm run dev` in client starts Vite dev server; Tailwind utilities work | Phase 1 complete |
| T20 | React Router setup with route stubs: `/` (Landing), `/catalog` (Catalog), `/product/:id` (Product), `/cart` (Cart), `/checkout` (Checkout), `/profile` (Profile), `/seller/*` (Apply, Dashboard, Listings, ListingEdit, Orders, Payouts), `/admin/*` (SellerApprovals, Moderation) | `client/src/App.jsx`, `client/src/pages/**` | standard | All routes resolve without error; each renders a placeholder heading | T19 |
| T21 | Redux Toolkit store with `auth` slice (stub: user, token, isAuthenticated) and `cart` slice (stub: items[], addItem, removeItem, clearCart) | `client/src/store/index.js`, `client/src/store/authSlice.js`, `client/src/store/cartSlice.js` | standard | Store mounts in Provider; slices export reducers and actions | T19 |
| T22 | Axios API client configured with base URL from env (`VITE_API_URL` defaulting to `http://localhost:5000/api`) | `client/src/api/client.js` | standard | Axios instance importable; base URL configurable | T19 |

**VERIFY V4:** `npm run dev` in `client/` starts. Navigating to all route stubs renders placeholder pages without errors. Redux DevTools shows auth + cart slices. Axios client is importable.

---

## Phase 5: Landing Page Integration

| # | Change | Files | Tier | Done when | Blockers |
|---|--------|-------|------|-----------|----------|
| T23 | Port CSS from `hikari-landing.html` into a dedicated `client/src/styles/landing.css` stylesheet; define design tokens as `:root` CSS custom properties. **Decision: landing page styles remain hand-written CSS in a single stylesheet — do NOT convert to Tailwind utilities. Tailwind is used only for new app pages.** | `client/src/styles/landing.css` | premium | Visual output matches mockup; responsive breakpoints at 900px and 520px work; design tokens defined as `:root` CSS custom properties in `landing.css`; all landing styles are hand-written CSS, not Tailwind | Phase 4 complete |
| T24 | Convert `hikari-landing.html` nav + ticker + hero section to React JSX components | `client/src/pages/Landing.jsx`, `client/src/components/Navbar.jsx`, `client/src/components/Ticker.jsx`, `client/src/components/Hero.jsx` | premium | Components render the nav, ticker, and hero matching the mockup | T23 |
| T25 | Convert featured figures grid, categories, seller panel, how-it-works, and footer sections to React components | `client/src/components/FeaturedGrid.jsx`, `client/src/components/Categories.jsx`, `client/src/components/SellerPanel.jsx`, `client/src/components/HowItWorks.jsx`, `client/src/components/Footer.jsx` | premium | All sections render matching the mockup layout and styling | T23, T24 |
| T26 | Port canvas dust/motes animation as a React component with `useEffect` + `useRef`; respect `prefers-reduced-motion` | `client/src/components/Motes.jsx` | premium | Dust particles animate on hero; animation disabled when reduced motion preferred; `useEffect` cleanup cancels animation frame via `cancelAnimationFrame`, removes resize event listener, and nullifies canvas context on unmount | T23, T24 |
| T27 | Wire ticker scroll animation and speedlines; ensure `prefers-reduced-motion` disables all animations | `client/src/components/Ticker.jsx` (animation), CSS | premium | Ticker scrolls, speedlines rotate; all animations halt on `prefers-reduced-motion` | T23, T24 |

**VERIFY V5:** Visiting `/` renders the full HIKARI landing page. Visual fidelity matches the mockup. Canvas motes animate. Ticker scrolls. Page is responsive at 900px and 520px breakpoints. `prefers-reduced-motion` disables all animations. No console errors.

---

## Risk Register

| # | Risk | Impact | Likelihood | Mitigation |
|---|------|--------|------------|------------|
| R1 | MongoDB not installed locally — `MONGODB_URI` connection fails | Phase 2 verify blocked | Medium | Document MongoDB Atlas free tier as alternative in README; `.env.example` includes Atlas URI format |
| R2 | `concurrently` or npm workspaces may have Windows path issues | Root `npm run dev` fails on Windows | Low | Test on Windows; fall back to separate terminal instructions in README if needed |
| R3 | Tailwind CSS version/config drift between Vite scaffold defaults and project needs | Styling inconsistencies | Low | Pin Tailwind version in `package.json`; test utility classes early in Phase 4 verify |
| R4 | Landing page HTML uses raw DOM (`getElementById`, `getContext`) — needs careful React adaptation | Canvas animation breaks or leaks memory | Medium | Use `useRef` + `useEffect` with proper cleanup (cancelAnimationFrame, removeEventListener) |
| R5 | Large CSS port from monolithic HTML to component styles may introduce specificity conflicts | Visual regressions | Medium | **Decided:** landing page keeps its hand-written CSS in a single `landing.css` with `:root` design tokens; Tailwind is not used for landing styles, avoiding utility/hand-written conflicts. Component-specific class names are scoped by existing prefixes (`.card`, `.hero`, `.seller`, etc.) |
| R6 | Node 18 requirement not met on dev machines | Build/run failures | Low | Document Node version requirement in README; suggest `nvm` or `nvm-windows` |
| R7 | `hikari-landing.html` reference file missing or modified during sprint | Phase 5 port has no stable reference | Low | File is committed to the `sprint/scaffold` branch and frozen for the sprint; any design changes require a separate update commit before Phase 5 tasks resume |
