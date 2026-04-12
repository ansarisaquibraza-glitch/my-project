# 🛣️ Smart Road Damage Reporting System

A production-grade civic-tech platform that empowers citizens to report road damage and enables authorities to track, manage, and resolve issues efficiently.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Supabase Setup](#-supabase-setup)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Default Admin Credentials](#-default-admin-credentials)
- [Deployment](#-deployment)

---

## ✨ Features

### Citizen (User)
- 📍 Report road damage with GPS auto-detection
- 📷 Upload photos of damage
- 🗺️ Interactive Leaflet map with custom markers per damage type
- 📋 Track report status (Pending → In Progress → Resolved)
- 🔍 Search and filter submitted reports
- 🌙 Dark mode toggle

### Admin
- 📊 Dashboard with live stats and Chart.js analytics
- 📋 Full reports management table (edit, delete, update status)
- ✅ Add admin notes for reporters
- ⬇️ Export all reports as JSON
- 🗺️ Map view of all city-wide reports

---

## 🛠 Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Frontend   | React 18 + Vite, React Router v6             |
| Styling    | CSS3 (Glassmorphism design system)           |
| Maps       | Leaflet.js + react-leaflet                   |
| Charts     | Chart.js + react-chartjs-2                   |
| Backend    | Node.js + Express.js                         |
| Database   | Supabase (PostgreSQL)                        |
| Auth       | JWT (jsonwebtoken) + bcryptjs                |
| Storage    | Supabase Storage (images)                    |
| Validation | express-validator (backend)                  |
| Security   | helmet, cors, express-rate-limit             |

---

## 📁 Project Structure

```
smart-road/
├── frontend/
│   ├── src/
│   │   ├── assets/          # global.css (design system)
│   │   ├── components/
│   │   │   ├── charts/      # DamageTypeChart, MonthlyTrendChart, StatsCards
│   │   │   ├── forms/       # ReportForm
│   │   │   ├── layout/      # Navbar
│   │   │   ├── map/         # ReportsMap, LocationPicker
│   │   │   └── ui/          # Modal, Pagination, ReportCard, StatusBadge, ProtectedRoute
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── hooks/           # useDebounce, useReports
│   │   ├── pages/
│   │   │   ├── admin/       # AdminLayout, AdminDashboard, AdminReports, AdminMapView
│   │   │   └── user/        # LandingPage, ReportPage, MapPage, UserDashboard, Login, Signup
│   │   ├── services/        # api.js (fetch wrapper), storage.js (Supabase)
│   │   ├── utils/           # helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   ├── supabase.js      # Supabase client
│   │   └── schema.sql       # Database schema + seed data
│   ├── controllers/
│   │   ├── authController.js
│   │   └── reportsController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT authenticate + requireAdmin
│   │   ├── errorHandler.js
│   │   └── validate.js      # express-validator rules
│   ├── routes/
│   │   ├── auth.js
│   │   └── reports.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 📦 Prerequisites

- **Node.js** v18+ and npm v9+
- **Supabase account** — free tier works: https://supabase.com
- A modern browser with Geolocation support

---

## 🗄️ Supabase Setup

### Step 1: Create a Supabase Project
1. Go to https://app.supabase.com
2. Click **New Project**, fill in project name and database password
3. Wait for the project to be provisioned (~2 minutes)

### Step 2: Run the SQL Schema
1. In your Supabase dashboard → **SQL Editor**
2. Open `backend/config/schema.sql`
3. Copy the entire file content and paste into SQL Editor
4. Click **Run** — this creates all tables, indexes, triggers, and seed data

### Step 3: Create Storage Bucket
1. Go to **Storage** in Supabase sidebar
2. Click **New Bucket**
3. Name: `road-damage-images`
4. Set to **Public** ✓
5. Go to **Policies** → Add policy:
   - Policy name: `Allow public uploads`
   - Operation: `INSERT`
   - Target roles: `anon, authenticated`
   - Policy definition: `bucket_id = 'road-damage-images'`

### Step 4: Get Your API Keys
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon / public key** → `SUPABASE_ANON_KEY`
   - **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY`

---

## ⚙️ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values (see Environment Variables section)
nano .env  # or use your editor

# Start development server
npm run dev

# Server starts at http://localhost:5000
# Health check: http://localhost:5000/health
```

---

## 🎨 Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your Supabase values
nano .env

# Start development server
npm run dev

# App starts at http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
NODE_ENV=development

# Supabase (from Settings → API)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...

# JWT — use a strong random string (min 32 chars)
JWT_SECRET=your-super-secret-key-at-least-32-chars-long
JWT_EXPIRES_IN=7d

# Frontend origin
CLIENT_URL=http://localhost:5173

# Storage bucket name
SUPABASE_STORAGE_BUCKET=road-damage-images
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhb...
VITE_SUPABASE_STORAGE_BUCKET=road-damage-images
```

> ⚠️ **Never commit `.env` files to version control.** Both `.env` files are gitignored. Only `.env.example` should be committed.

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint         | Auth     | Description          |
|--------|------------------|----------|----------------------|
| POST   | `/api/auth/signup` | Public | Register new user    |
| POST   | `/api/auth/login`  | Public | Login, returns JWT   |
| GET    | `/api/auth/me`     | Bearer | Get current user     |

### Reports

| Method | Endpoint                    | Auth         | Description               |
|--------|-----------------------------|--------------|---------------------------|
| GET    | `/api/reports`              | Public       | List reports (paginated, filterable) |
| GET    | `/api/reports/:id`          | Public       | Get single report         |
| POST   | `/api/reports`              | Public/Auth  | Submit new report         |
| PUT    | `/api/reports/:id`          | Admin        | Update status/notes       |
| DELETE | `/api/reports/:id`          | Admin        | Delete report             |
| GET    | `/api/reports/stats/summary`| Public       | Dashboard statistics      |
| GET    | `/api/reports/export`       | Admin        | Export all as JSON        |

### Query Parameters (GET /api/reports)

| Param        | Type   | Description                          |
|--------------|--------|--------------------------------------|
| `status`     | string | Filter: pending, in_progress, resolved, rejected |
| `damage_type`| string | Filter: pothole, crack, flooding, collapse, other |
| `search`     | string | Search description, name, address    |
| `page`       | number | Page number (default: 1)             |
| `limit`      | number | Items per page (default: 10)         |
| `sort`       | string | Sort field (default: created_at)     |
| `order`      | string | asc or desc (default: desc)          |

---

## 👤 Default Admin Credentials

After running the SQL schema, a default admin account is seeded:

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@smartroad.com`  |
| Password | `Admin@123`            |
| Role     | `admin`                |

> 🔒 **Change this password immediately after first login in production!**

---

## 🚀 Deployment

### Backend (Railway / Render / Fly.io)
```bash
# Set all environment variables in your hosting dashboard
# Deploy command:
npm start
```

### Frontend (Vercel / Netlify)
```bash
# Build command:
npm run build

# Output directory:
dist

# Set environment variables in hosting dashboard
# Update VITE_API_URL to your deployed backend URL
```

### Supabase Production Checklist
- [ ] Enable Row Level Security (RLS) on tables
- [ ] Set up proper RLS policies per user role
- [ ] Rotate service_role key periodically
- [ ] Enable email auth in Supabase if using Supabase Auth
- [ ] Set up database backups

---

## 🧪 Testing the App

1. Open http://localhost:5173
2. Click **Report Damage** — fill the form, use GPS, submit
3. View your report on the **Map View** page
4. Login as admin (`admin@smartroad.com` / `Admin@123`)
5. Navigate to **Admin Panel** → **Reports**
6. Edit status of the report you submitted
7. Check the **Dashboard** charts update

---

## 🔒 Security Notes

- JWT tokens expire in 7 days (configurable)
- All admin routes are double-protected (authenticate + requireAdmin middleware)
- API rate limited to 100 requests/15 min per IP
- Input validation on all POST/PUT endpoints via express-validator
- `helmet.js` sets secure HTTP headers
- Passwords hashed with bcrypt (12 salt rounds)
- Service role key only used server-side — never exposed to client

---

## 📈 Performance Notes

- Frontend pages are lazy-loaded via `React.lazy` + `Suspense`
- Search inputs are debounced (400ms) to prevent excessive API calls
- Images lazy-loaded with `loading="lazy"`
- Supabase queries use indexed columns for filtering/sorting
- Map markers are recreated only when the reports array changes

---

## 🗺️ Roadmap / Future Enhancements

- [ ] AI-based damage severity detection from uploaded photos
- [ ] React Native mobile app
- [ ] Government department integration APIs
- [ ] Real-time push notifications via Supabase Realtime
- [ ] Email notifications when report status changes
- [ ] Heatmap view of damage concentration
- [ ] QR code for physical damage tags

---

## 📄 License

MIT © SmartRoad Team
