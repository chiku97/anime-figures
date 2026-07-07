# README - Task 2: Implement Admin Orders API Endpoints

## Completed Changes
We introduced two new administrative API endpoints to manage transaction/order statuses:
- **File**: [app.js](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/server/src/app.js#L823-L865)

### 1. Retrieve All Orders
- **Route**: `GET /api/admin/orders`
- **Middleware**: `requireAdmin` (validates admin credentials decoded from the JWT authorization token header)
- **Logic**: Queries all database records from the `Order` collection, populating user details (`name`, `email`, `phone`), sorted from newest to oldest.

### 2. Update Order Status & Delivery Tracking
- **Route**: `PUT /api/admin/orders/:id`
- **Middleware**: `requireAdmin`
- **Logic**: Updates an order's status and tracking details after validating that the requested status is one of the enum values: `pending`, `processing`, `shipped`, `delivered`, `cancelled`. On success, it returns the updated order document.

```javascript
const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
```

## Security & SDE3 Standards
- Enforces strict validation of enum parameters before invoking Mongoose schema database mutations.
- Gracefully handles database lookup failures by returning standard HTTP `404 Not Found`.
- Protects endpoints using combined authentication (`requireAuth`) and authorization (`requireAdmin`) middleware.
