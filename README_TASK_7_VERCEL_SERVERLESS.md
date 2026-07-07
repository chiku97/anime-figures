# README - Task 7: Vercel Serverless Function Deployment Configuration

## Completed Changes
We have re-engineered the Express backend into a serverless-compatible architecture ready for deployment to Vercel:

### 1. Vercel Project Routing Configuration
- **File**: [vercel.json](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/server/vercel.json)
- Configured routes to map all incoming traffic to `src/app.js` using `@vercel/node`. This allows Vercel to route HTTP requests directly to the exported Express app.

### 2. Lazy Database Connection Middleware (Serverless Lifecycle)
- **File**: [app.js](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/server/src/app.js#L149-L160)
- Traditional Node apps connect to the database once during server startup (e.g. inside `server.js`). In serverless environments, Vercel loads the Express app directly, bypassing `server.js`.
- Implemented a lazy database loading middleware that runs on every request:
```javascript
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Lazy DB connection failed:', err.message);
  }
  next();
});
```

### 3. Database Connection & Seed Caching
- **Files**: [db.js](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/server/src/config/db.js), [seed.js](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/server/src/config/seed.js)
- Cached the active Mongoose database connection status using an in-memory `isConnected` flag. If the connection is already active and healthy, subsequent serverless invocations return immediately, avoiding connection pool leaks.
- Cached the seed state using an `isSeeded` flag to avoid querying MongoDB on every request in serverless execution paths.

---

## How to Deploy to Vercel
1. Ensure you have the Vercel CLI installed (`npm install -g vercel`).
2. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
3. Run the Vercel deploy command:
   ```bash
   vercel
   ```
4. Set up your environment variables (such as `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, etc.) in the Vercel Dashboard project settings.
