# Car Dekho - Car Marketplace Platform

A modern, full-stack car marketplace application built with React, Express.js, and MySQL. Features infinite scroll pagination, AI-powered car recommendations, server-side filtering, and seller contact management.

## 🚀 Features

### Frontend Features
- **Infinite Scroll Pagination**: Load cars seamlessly as you scroll
- **Advanced Filtering**: Filter by maker, fuel type, transmission, price range, and search text
- **AI-Powered Recommendations**: Get personalized car suggestions using Google Gemini AI
- **Contact Seller**: Submit contact requests with name, email, phone, and message
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Full dark mode theme support
- **Real-time Search**: Debounced search with 800ms throttle for optimal performance

### Backend Features
- **RESTful API**: Complete REST API with cursor-based pagination
- **Server-Side Filtering**: Filter cars with multiple criteria
- **AI Integration**: Google Gemini API integration for smart recommendations
- **Fallback Mechanism**: Automatic fallback when AI is unavailable
- **Contact Request Management**: Store and manage customer inquiries
- **Database Seeding**: Automatic seed data with 50 realistic car listings
- **Error Handling**: Comprehensive error handling and validation

### Database Features
- **MySQL Database**: Persistent data storage
- **Prisma ORM**: Type-safe database queries
- **Automatic Migrations**: Database schema auto-setup on startup
- **Indexed Queries**: Optimized queries with proper indexing

## 📋 Prerequisites

- Docker & Docker Compose (latest version)
- `.env` file with API keys (see [Environment Variables](#environment-variables))

## 🐳 Quick Start with Docker

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Personal\ Project
```

### 2. Configure Environment Variables

Create a `.env` file in `car_dekho_backend/` with the following:
for now i have added the env, later if anyone is trying after 15 june, then follow these steps to get the keys so that it runs on your local atleast.

```env
DATABASE_URL="mysql://user:password@host:3306/db_name"
GEMINI_API_KEY="your-gemini-api-key-here"
```

**Get Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Paste it in the `.env` file

### 3. Start the Application

```bash
# Build and start all services (MySQL, Backend, Frontend)
docker compose up --build

# Or if already built:
docker compose up

# Run in background:
docker compose up -d --build
```

### 4. Access the Application

- **Frontend**: http://localhost:5173 (or http://localhost:80 in production)
- **Backend API**: http://localhost:5000/api/v1
- **MySQL**: localhost:3307 (root/root) this changes if you tweek in docker-compose.yml

### 5. Stop the Application

```bash
# Stop and remove containers
docker compose down

# Stop, remove containers, and delete volumes
docker compose down -v
```

## 🏗️ Architecture

### Directory Structure
```
Personal Project/
├── car_dekho_backend/           # Express.js backend
│   ├── controllers/             # API logic
│   ├── routes/                  # API routes
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── migrations/          # Database migrations
│   ├── .env                     # Environment variables
│   ├── Dockerfile               # Backend Docker image
│   ├── docker-start.sh          # Container startup script
│   └── package.json
│
├── car-dekho-frontend/          # React Vite frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   └── App.jsx
│   ├── Dockerfile               # Frontend Docker image
│   ├── package.json
│   └── vite.config.js
│
└── docker-compose.yml           # Docker Compose configuration
```

### Services Architecture

```
┌─────────────────────────────────────────────┐
│         Docker Compose Network              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │   Frontend   │  │   Backend    │        │
│  │   (React)    │  │ (Express.js) │        │
│  │  Port 5173   │  │  Port 5000   │        │
│  └──────┬───────┘  └──────┬───────┘        │
│         │                 │                 │
│         └─────────┬───────┘                 │
│                   │                         │
│            ┌──────▼────────┐               │
│            │    MySQL      │               │
│            │   Port 3307   │               │
│            └───────────────┘               │
│                                             │
└─────────────────────────────────────────────┘
```

## 📡 API Endpoints

### Cars
- `GET /api/v1/home` - Get paginated cars
- `GET /api/v1/get-filtered-cars` - Get filtered and paginated cars
- `POST /api/v1/ai-recommended-cars` - Get AI-powered recommendations
- `GET /api/v1/car/:id` - Get car details

### Contact Requests
- `POST /api/v1/contact-seller` - Submit contact request
- `GET /api/v1/contact-requests` - Get all contact requests (admin) (this is not implemented)
- `DELETE /api/v1/contact-requests/:id` - Delete contact request (admin) (also this is not done)

## 🔧 Environment Variables

### Backend (car_dekho_backend/.env)
```env
# Database Connection
DATABASE_URL="mysql://user:password@host:port/database"

# AI Integration (Optional)
GEMINI_API_KEY="your-api-key"
```

### Frontend (car-dekho-frontend/package.json - build arg)
```env
VITE_API_BASE="https://your-backend-url/api/v1"
```

## 📊 Database Schema

### Car Model
```
- id (UUID)
- maker (String)
- model (String)
- varient (String)
- bodyType (Enum)
- fuelType (Enum)
- year (Int)
- transmission (String)
- exShowRoomPrice (Float)
- mileage (Float)
- engineCC (Float)
- powerBhp (Float)
- torqueNm (Float)
- seatCapacity (Int)
- safetyRating (Float)
- imageUrl (String)
- created_at, updated_at (DateTime)
```

### ContactRequest Model
```
- id (UUID)
- carId (Foreign Key)
- name (String)
- email (String)
- phone (String)
- message (Text, optional)
- created_at, updated_at (DateTime)
```

## 🎯 How Features Work

### 1. Infinite Scroll
- Frontend loads 12 cars per page using cursor-based pagination
- IntersectionObserver detects when user scrolls to bottom
- Automatically fetches next page of results
- Disabled when filters are active (AI mode)

### 2. Server-Side Filtering
- All filtering happens on the backend
- Filters: maker, fuelType, transmission, price range, search text
- 800ms debounce prevents excessive API calls during typing
- Cursor-based pagination maintains state across filter changes

### 3. AI Recommendations
- User enters natural language query (e.g., "I want a Honda with 20 KMPL mileage")
- Backend sends to Google Gemini API
- AI extracts: makers, models, body types, fuel types, transmission, mileage
- Database returns only cars matching extracted criteria
- Fallback regex extraction if API is unavailable

### 4. Contact Seller
- Click "Contact Seller" on any car card or details page
- Modal form appears with car information
- Submit name, email, phone, and optional message
- Backend saves to database and returns success response
- User sees success confirmation

---

**Last Updated**: May 31, 2026
**Version**: 1.0.0
