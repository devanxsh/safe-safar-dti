# SafeSafar 🚌

> **Smart Commuting, Safe Journey** — A production-ready full-stack public transport tracking application built with React (Vite + TypeScript + Tailwind) on the frontend and Node.js + Express + MongoDB on the backend.

---

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [Google Maps Setup](#google-maps-setup)
7. [API Reference](#api-reference)
8. [Deployment](#deployment)
9. [Security](#security)

---

## Features

| Category | Details |
|---|---|
| **Real-time map** | Google Maps with live bus markers, user location, and stop info windows |
| **Route discovery** | Search routes by name, stop, or destination with occupancy indicators |
| **Live tracking** | Real-time bus ETA countdown, route progress, and occupancy level |
| **Authentication** | JWT-based signup/login with bcrypt-hashed passwords and refresh-token rotation |
| **Email notifications** | Nodemailer-powered trip alerts, contact form, and emergency notifications |
| **Safety features** | Rotating safety tips, emergency contacts, trip share, and alert status |
| **Network awareness** | Online/offline detection, graceful fallback for geolocation |
| **Security** | Helmet, CORS, rate limiting, request validation, SQL-injection-safe Mongoose 8.9.5 |

---

## Architecture

```
safe-safar-dti/
├── src/                        # Frontend — Vite + React + TypeScript + Tailwind
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # Custom React hooks (use-geolocation, use-toast, …)
│   ├── pages/                  # Route-level page components
│   ├── services/               # API client layer (axios-based)
│   ├── store/                  # Zustand global state (auth)
│   ├── types/                  # Shared TypeScript types
│   └── lib/                    # Utility functions
│
└── server/                     # Backend — Node.js + Express + MongoDB
    ├── config/                 # Database connection
    ├── controllers/            # Business logic
    ├── middleware/             # Auth, error handling, rate limiting
    ├── models/                 # Mongoose schemas (User, Route, BusStop, Activity)
    ├── routes/                 # Express routers
    └── services/               # Email service (Nodemailer)
```

---

## Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **MongoDB** ≥ 6.0 (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Google Cloud** account with Maps JavaScript API, Places API, and Directions API enabled

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/devanxsh/safe-safar-dti.git
cd safe-safar-dti
```

### 2. Frontend setup

```bash
# Install dependencies
npm install

# Copy and configure env
cp .env.example .env
# → Fill in VITE_GOOGLE_MAPS_API_KEY and VITE_API_BASE_URL

# Start dev server (http://localhost:5173)
npm run dev
```

### 3. Backend setup

```bash
cd server

# Install dependencies
npm install

# Copy and configure env
cp .env.example .env
# → Fill in MONGODB_URI, JWT secrets, SMTP credentials

# Start dev server with auto-reload (http://localhost:5000)
npm run dev
```

### 4. Build for production

```bash
# Frontend
npm run build          # output → dist/

# Backend
cd server
npm start
```

---

## Environment Variables

### Frontend (`.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | ✅ |
| `VITE_API_BASE_URL` | Base URL of the Express API (e.g. `http://localhost:5000/api`) | ✅ |

### Backend (`server/.env`)

| Variable | Description | Required |
|---|---|---|
| `PORT` | HTTP port (default `5000`) | — |
| `NODE_ENV` | `development` / `production` | — |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_ACCESS_SECRET` | Long random string for access tokens | ✅ |
| `JWT_REFRESH_SECRET` | Long random string for refresh tokens | ✅ |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL (default `15m`) | — |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (default `7d`) | — |
| `SMTP_HOST` | SMTP server host | ✅ |
| `SMTP_PORT` | SMTP port (587 or 465) | ✅ |
| `SMTP_USER` | SMTP username / email | ✅ |
| `SMTP_PASS` | SMTP password / app password | ✅ |
| `EMAIL_FROM` | Sender name + email | — |
| `CLIENT_URL` | Frontend origin for CORS | ✅ |

---

## Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and enable:
   - **Maps JavaScript API**
   - **Places API** (for address autocomplete)
   - **Directions API** (for route paths)
3. Create an API key under **Credentials**.
4. Restrict the key to your frontend domain (highly recommended for production).
5. Add the key to `.env` as `VITE_GOOGLE_MAPS_API_KEY`.

> **Note:** The map renders a helpful placeholder UI when the key is not configured, so the app still works without it during development.

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new account |
| POST | `/api/auth/login` | Public | Log in and receive tokens |
| POST | `/api/auth/logout` | Public | Invalidate refresh token |
| POST | `/api/auth/refresh` | Public | Rotate access/refresh tokens |
| GET | `/api/auth/profile` | Bearer | Get current user profile |

### Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/routes` | Public | List all active routes |
| GET | `/api/routes/search?q=` | Public | Full-text search |
| GET | `/api/routes/stops?route=` | Public | List bus stops |
| GET | `/api/routes/path?origin=&destination=` | Public | Get route path |
| GET | `/api/routes/:id` | Public | Single route detail |

### Buses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/buses?route=` | Public | Active bus positions |
| GET | `/api/buses/:id/live` | Public | Single bus live data |
| GET | `/api/buses/route/live?route=` | Public | Route live summary |
| POST | `/api/buses/report` | Bearer | Report a bus issue |

### Email

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/email/contact` | Public | Send contact form |
| POST | `/api/email/trip-alert` | Bearer | Send trip ETA alert |
| POST | `/api/email/emergency` | Bearer | Send emergency alert |

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | Public | API health check |

---

## Deployment

### Frontend — Vercel / Netlify

```bash
npm run build
# Deploy the dist/ folder

# Set environment variables in the platform dashboard:
# VITE_GOOGLE_MAPS_API_KEY=...
# VITE_API_BASE_URL=https://your-backend-url/api
```

### Backend — Railway / Render / Fly.io

```bash
cd server
npm install --production

# Set all server environment variables in the platform dashboard
# Start command: node index.js
```

### MongoDB — Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Add your server IP to the Atlas IP access list.
3. Set `MONGODB_URI` to the Atlas connection string.

---

## Security

| Measure | How |
|---|---|
| Password hashing | bcrypt with salt factor 12 |
| JWT rotation | Refresh token is rotated on every use |
| Rate limiting | Global: 100 req/15 min; Auth endpoints: 20 req/15 min |
| Request validation | `express-validator` on all write endpoints |
| CORS | Restricted to configured `CLIENT_URL` |
| Security headers | `helmet` (CSP, HSTS, X-Frame-Options, …) |
| Body size limit | 10 KB max to prevent payload attacks |
| Dependency safety | All dependencies checked against GitHub Advisory Database |

---

## License

MIT © 2025 SafeSafar
