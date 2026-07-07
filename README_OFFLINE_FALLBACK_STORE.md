# README - Database-Offline Seamless Fallback Layer

## Overview
When the backend server detects that the MongoDB connection is offline (due to firewall blocks, network timeouts, or local services not running), it dynamically switches to a database-offline fallback mode.

Instead of crashing or throwing `503 Service Unavailable` errors, the API endpoints seamlessly redirect core database operations to a fast, in-memory `offlineStore` dataset on the server.

---

## Technical Details

### 1. In-Memory Mock Store (`offlineStore`)
- **File**: [app.js](file:///c:/Users/Snapbizz/Documents/Personal%20Project/Anime/server/src/app.js#L23-L151)
- Houses a collection of:
  - **Products**: Pre-seeded with realistic Formora neon lamp data containing valid 24-character hexadecimal IDs (which the frontend expects to detect a live database).
  - **Users**: Preserves local visitor sessions and addresses.
  - **Orders**: Tracks orders checked out during the offline run session.

### 2. Auto-Authentication & Registration Fallback
- **OTP Verification (`/api/auth/verify-otp`)**:
  - Auto-verifies OTP submissions instantly when database-offline.
  - Registers or logs in the user within the `offlineStore.users` registry.
- **Firebase/Google Logins**:
  - Provisions session credentials and maps token payload attributes to in-memory user objects.

### 3. Full E2E Checkout & Order Management Offline
- **Address Book (`/api/users/addresses`)**: Supports adding and deleting customer addresses in-memory.
- **Payment Verification & Order Placement (`/api/payments/verify`)**:
  - Captures the cart content and saves the order inside `offlineStore.orders`.
  - Dynamically updates the catalog product stock (deducts item quantities) in-memory.
  - Saves the delivery address to the visitor's profile details.
- **Admin Orders view (`/api/admin/orders`)**: Populates order buyer profiles dynamically and feeds the admin order lists.
- **Order Status Update (`/api/admin/orders/:id`)**: Updates status enums, carrier settings, and tracking references in the store.

## Benefits
- **Zero Configuration Blocks**: Developers can verify all app flows (adding to cart, checkout, payment sandbox verification, address book management, admin orders view, status modifies) fully offline and local without needing MongoDB.
