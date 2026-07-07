# README - Mongoose Buffering Timeout Fix

## Problem
During API execution (such as `users.findOne()`), the server returned the following buffering timeout error:
```json
{
    "success": false,
    "message": "Firebase authentication failed: Operation `users.findOne()` buffering timed out after 10000ms"
}
```

### Analysis
By default, Mongoose buffers queries indefinitely when the connection is disconnected or in the process of establishing, expecting a connection to resolve later. Because the backend caught database connection failures during startup (such as port blocks to MongoDB Atlas or local MongoDB service being stopped) and continued running, subsequent database queries buffered for 10 seconds before throwing this timeout exception.

---

## Resolution
Implemented two key SDE4 database resilience patterns:

### 1. Fail-Fast Query Execution
- **File**: [db.js](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/server/src/config/db.js#L5-L13)
- Disabled query buffering by calling `mongoose.set('bufferCommands', false)`. Now, if the database is disconnected, queries fail instantly instead of stalling client requests and consuming server resources for 10 seconds.

### 2. Connection Health Guard Middleware
- **File**: [app.js](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/server/src/app.js#L23-L34)
- Added an intercepting middleware right after standard parsing configurations. It checks if the requested route is a database-reliant API endpoint and validates `mongoose.connection.readyState`.
- If the connection state is offline, it immediately terminates the request and returns a `503 Service Unavailable` status with a clear, actionable instructions message.

```json
{
  "success": false,
  "message": "Database connection is offline. Please start your local MongoDB service (e.g. \"Start-Service MongoDB\" on Windows) or check your connection parameters to MongoDB Atlas."
}
```
