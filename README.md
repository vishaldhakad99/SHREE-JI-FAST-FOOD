# 🍲 SHREE JI FAST FOOD – Premium Restaurant Website & Management System

> **Tagline:** *"Ghar Jaisa Swad, Har Din Kuch Khaas!"*  
> **Brand Identity:** Authentic Home-Style Indian Food, Famous Aloo Parathas, Daily Fresh Meals, Special Thalis, and Customized Food Orders.

---

## 📋 Table of Contents
1. [Overview & Highlights](#-overview--highlights)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [VS Code Me Run Kaise Kare (Step-by-Step Guide)](#-vs-code-me-run-kaise-kare-step-by-step-guide)
5. [MongoDB Database & Collections](#-mongodb-database--collections)
6. [Admin Portal & Credentials](#-admin-portal--credentials)
7. [Environment Variables](#-environment-variables)
8. [Testing & Verification](#-testing--verification)
9. [Render Deployment Guide](#-render-deployment-guide)
10. [Security Implementation](#-security-implementation)

---

## 🌟 Overview & Highlights
Shree Ji Fast Food is a production-ready, database-driven Indian restaurant platform featuring:
- **Daily Rotating Special Menu**: Dynamic daily specials board updated live from MongoDB. If no menu is set for the day, customers see *"Today's menu will be updated soon. Please contact us for availability."* (never fake menus).
- **Custom Food Orders**: Customers can request customized spice levels, no onion-garlic (Jain), extra ghee, or specific seasonal preparations. Inquiries are saved to the database and generate a pre-formatted WhatsApp chat.
- **Pure Veg Culinary Aesthetics**: Warm cream/off-white background, deep brown typography, and saffron accents.
- **Admin Management Portal (`/admin/login`, `/admin/dashboard`)**:
  - Live KPI stats (Total items, today's specials, pending inquiries).
  - Food Catalog CRUD with Cloudinary photo uploads, pricing, availability toggles, and spice levels.
  - Daily Menu Publisher with date scheduling, price adjustments, and announcement banners.
  - Order Inquiries manager with status tracker (`new`, `contacted`, `accepted`, `rejected`, `completed`) and 1-click WhatsApp customer replies.
  - Contact Enquiries manager for website messages.
  - Restaurant Settings manager (Address, Phone, WhatsApp, Timings, Delivery/Pickup toggles, Notice Banners).

---

## 🛠 Tech Stack

### Frontend (`client/`)
- **React.js 18** with **Vite 6** & **TypeScript**
- **Tailwind CSS 3** with custom Indian restaurant palette
- **Framer Motion** for animations
- **React Router 7**
- **Lucide React** for icons
- **Axios** with HTTP-only cookie support

### Backend (`server/`)
- **Node.js** & **Express.js** with **TypeScript**
- **MongoDB Atlas** & **Mongoose ODM**
- **JWT** with HTTP-only cookies and Authorization headers
- **bcryptjs** (12 salt rounds)
- **Zod** for schema validations
- **Helmet** for HTTP security headers
- **express-rate-limit** for DDoS/brute-force defense
- **Multer** & **Cloudinary** for food photography

---

## 📁 Project Structure

```text
shreeji/
├── client/                     # Frontend (React + Vite + TypeScript + Tailwind)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/         # Navbar, Footer, FoodCard, DailyMenuCard, etc.
│   │   ├── context/            # AuthContext, SettingsContext
│   │   ├── layouts/            # MainLayout, AdminLayout
│   │   ├── pages/              # Home, Menu, Today's Special, Custom Order, etc.
│   │   │   └── admin/          # Admin Dashboard, Food, Menu, Orders, Settings
│   │   ├── services/           # Axios API service
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Route definitions
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # Backend (Express + TypeScript + MongoDB)
│   ├── src/
│   │   ├── config/             # MongoDB connection, Cloudinary config
│   │   ├── controllers/        # Auth, Food, DailyMenu, Orders, Settings, Contact
│   │   ├── middleware/         # Auth, RateLimiter, ErrorHandler, Multer
│   │   ├── models/             # Mongoose schemas (Admins, FoodItems, etc.)
│   │   ├── routes/             # REST endpoints
│   │   ├── scripts/            # Seed Admin, Seed Sample Data
│   │   ├── tests/              # Vitest test suites (Health, Auth, Security, E2E)
│   │   ├── types/              # Express request types & payload interfaces
│   │   ├── validators/         # Zod schemas
│   │   ├── app.ts              # Express application setup
│   │   └── index.ts            # Server entrypoint
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── package.json                # Root monorepo scripts (concurrently dev runner)
├── render.yaml                 # Render Blueprint configuration
├── .gitignore
└── README.md
```

---

## 🚀 VS Code Me Run Kaise Kare (Step-by-Step Guide)

VS Code me project run karna bohot aasan hai. Aap niche diye gaye tareeqo me se koi bhi istemal kar sakte hain:

### Method 1: Single Command (Sabse Aasan Tareeqa)

1. **VS Code open karein**:
   - `File` -> `Open Folder...` me jakar `shreeji` folder select karein.
2. **Terminal open karein**:
   - Keyboard shortcut: `Ctrl + ~` (tilde) ya menu bar me `Terminal` -> `New Terminal`.
3. **Dependencies install karein** (agar pehli baar run kar rahe hain):
   ```bash
   npm install
   ```
4. **Seed database** (Admin user aur sample menu items add karne ke liye):
   ```bash
   npm run seed:admin
   npm run seed:sample
   ```
5. **Dono Servers Ek Saath Run Karein**:
   ```bash
   npm run dev
   ```
   Ye command backend server (port 5000) aur frontend Vite client (port 5173) dono ko ek saath start kar dega!

---

### Method 2: Two Terminals (Backend aur Frontend Alag-Alag)

Agar aap do alag terminals me logs dekhna chahte hain:

#### Terminal 1 (Backend Server):
```bash
cd server
npm install
npm run dev
```
👉 Backend run hoga: `http://localhost:5000`  
👉 Health check check karein: `http://localhost:5000/api/health`

#### Terminal 2 (Frontend React):
VS Code terminal me `+` icon daba kar doosra terminal kholein:
```bash
cd client
npm install
npm run dev
```
👉 Frontend run hoga: `http://localhost:5173`

---

## 🌐 URLs & Access Points
| Page | URL | Purpose |
|------|-----|---------|
| **Customer Homepage** | `http://localhost:5173/` | Hero, Specialities, Today's Specials, Menu highlights, Contact |
| **Our Menu** | `http://localhost:5173/menu` | Categorized dishes with filters, search, and prices |
| **Today's Special** | `http://localhost:5173/todays-special` | Real-time dynamic daily specials for today |
| **Custom Order** | `http://localhost:5173/custom-order` | Request custom meal preferences with WhatsApp generator |
| **Admin Login** | `http://localhost:5173/admin/login` | Secure admin credentials login |
| **Admin Dashboard** | `http://localhost:5173/admin/dashboard` | Food, Daily Menu, Order Inquiries, and Settings manager |
| **Backend Health** | `http://localhost:5000/api/health` | Live API and MongoDB connectivity status |

---

## 🔐 Admin Portal & Credentials

### Default Admin Login
- **Login URL:** `http://localhost:5173/admin/login`
- **Email:** `admin@shreejifastfood.com`
- **Password:** `ShreeJiAdmin#2026`

*(Admin credentials `server/.env` me `INITIAL_ADMIN_EMAIL` aur `INITIAL_ADMIN_PASSWORD` se change kiye ja sakte hain).*

---

## 🗄 MongoDB Database & Collections

The system connects via `MONGODB_URI` and defines 7 Mongoose collections:
1. `admins`: Admin accounts with bcrypt-hashed passwords (`select: false`).
2. `foodcategories`: Categories (`Special Parathas`, `Thali`, `Puri Sabji`, `Daily Meals`, `Other Food Items`).
3. `fooditems`: Full food items catalog with prices, veg tags, spice levels, images, and availability.
4. `dailymenus`: Daily menus tied to `dateString` (`YYYY-MM-DD`) with special announcements and dishes.
5. `orderenquiries`: Customer inquiries with status (`new`, `contacted`, `accepted`, `rejected`, `completed`).
6. `restaurantsettings`: Dynamic restaurant name, tagline, address, phone, WhatsApp, hours, and delivery toggles.
7. `contactenquiries`: Messages sent via the customer contact form.

---

## 🔑 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/shreeji_fastfood
JWT_SECRET=super_secret_shreeji_fastfood_jwt_token_key_2026_xyz
JWT_EXPIRES_IN=7d
COOKIE_SECRET=shreeji_cookie_secret_key_restaurant_2026_abc
INITIAL_ADMIN_EMAIL=admin@shreejifastfood.com
INITIAL_ADMIN_PASSWORD=ShreeJiAdmin#2026
INITIAL_ADMIN_NAME=Shree Ji Manager
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🧪 Testing & Verification

Comprehensive automated tests run via Vitest:
```bash
cd server
npm test
```
**Test Results (20/20 passed):**
- `health.test.ts`: Health check & 404 routing verification.
- `auth.test.ts`: Authentication, rate limiting, and token expiration tests.
- `security.test.ts`: Helmet headers, unauthorized endpoint rejection, and Zod input validation tests.
- `database.test.ts`: Live end-to-end integration with MongoDB models, daily menu publisher, and order submission.

---

## ☁ Render Deployment Guide

### Option 1: Render Blueprint (`render.yaml`)
1. Push code to your GitHub repository.
2. In [Render Dashboard](https://dashboard.render.com/), click **New** -> **Blueprint**.
3. Connect your repository. Render reads `render.yaml` automatically and configures:
   - Backend Web Service (`shreeji-fastfood-api`)
   - Frontend Static Site (`shreeji-fastfood-web`)
4. Fill in `MONGODB_URI` (from MongoDB Atlas) in the Render Web Service environment settings.

### Option 2: Manual Web Service & Static Site
1. **Backend Web Service**:
   - Environment: `Node`
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`
2. **Frontend Static Site**:
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Rewrite rule: `/*` -> `/index.html`
   - Environment variable: `VITE_API_URL=https://<your-backend-service>.onrender.com/api`

---

## 🛡 Security Implementation
- **Zero Hardcoded Secrets**: Secrets loaded exclusively via environment variables.
- **Password Protection**: bcrypt with 12 salt rounds; password hashes excluded from default Mongoose queries.
- **HTTP-only Cookies**: JWT stored in secure HTTP-only cookie with SameSite protection.
- **Rate Limiting**: `express-rate-limit` prevents brute-force login attacks and spam submissions.
- **NoSQL & XSS Sanitization**: Input validation on every endpoint via Zod schemas.
- **Helmet Headers**: Content Security Policy, X-Frame-Options, X-Content-Type-Options enabled.
- **Zero False Payment Claims**: Transparent inquiry model that requires verified restaurant confirmation.
