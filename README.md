
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
