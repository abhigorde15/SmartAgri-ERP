# SmartAgri ERP Control Center

SmartAgri ERP is an enterprise management system designed for fertilizer and agro-input manufacturing and distribution. It provides real-time tracking of manufacturing batches (FEFO allocation), credit limits, sales orders, invoices, payments, and an autonomous **Gemini AI Operations Copilot**.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router v6
- **Backend API**: Node.js (v18+), Express (ES Modules), Prisma ORM, PostgreSQL
- **AI Copilot**: Google Gemini API (`@google/genai`) for proactive inventory & seasonal risk intelligence
- **Authentication**: JWT token-based auth with Role-Based Access Control (RBAC)
- **Deployment**: Vercel (Frontend & Serverless API), PostgreSQL (Supabase / Neon / Railway / Vercel Postgres)

---

## 📁 Project Structure

```text
├── api/                  # Vercel Serverless Function entry point (Express adapter)
├── backend/              # Node.js + Express API server & Prisma schema
│   ├── prisma/           # schema.prisma and seed.js
│   └── src/              # Routes, controllers, services, middleware
├── frontend/             # React + Vite client application
│   ├── src/              # Components, contexts, utils
│   └── vercel.json       # SPA routing configuration for Vercel
├── .env.example          # Template for all environment variables
├── vercel.json           # Root Vercel deployment configuration
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18+)
- A PostgreSQL database instance (local PostgreSQL or cloud instance from [Neon](https://neon.tech) / [Supabase](https://supabase.com))

### 1. Backend Setup

```bash
cd backend
npm install

# Configure your environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, and GEMINI_API_KEY

# Push schema to database and generate Prisma Client
npx prisma db push

# Seed rich initial data
npm run seed

# Start development server
npm run dev
```
Backend runs at `http://localhost:5000`.

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
```
Frontend runs at `http://localhost:3000`.

---

## 🔑 Demo Login Credentials

After seeding the database (`npm run seed`), log in with:
- **Email:** `owner@goldenagro.com`
- **Password:** `password123`
- **Role:** System Owner (full access to all modules)

---

## 🌐 Production Deployment Guide (Vercel)

### Option A: Monorepo Deployment on Vercel (Recommended)

1. **Push your code to GitHub** (follow the Git instructions below).
2. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. **Environment Variables**: In the Vercel project settings, configure:
   - `DATABASE_URL`: Your PostgreSQL connection string (with `?sslmode=require`)
   - `JWT_SECRET`: A strong 32+ character random string
   - `JWT_EXPIRES_IN`: `1d`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-vercel-domain.vercel.app`
   - `GEMINI_API_KEY`: Your Google AI Studio API key
5. Deploy! Vercel builds the React frontend to static assets and runs the Express API via serverless functions under `/api`.

### Option B: Frontend on Vercel + Backend on Render / Railway

1. Deploy the `backend/` folder on [Render](https://render.com) or [Railway](https://railway.app):
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm run start`
   - Set environment variables (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, etc.)
2. Deploy the `frontend/` folder on [Vercel](https://vercel.com):
   - Root Directory: `frontend`
   - Set Environment Variable: `VITE_API_URL=https://your-backend.onrender.com`

---

## 🔒 Security Best Practices
- Never commit `.env` or sensitive credentials to source control.
- Ensure PostgreSQL connections enforce SSL (`sslmode=require`).
- Keep `JWT_SECRET` rotated and at least 32 characters long.
