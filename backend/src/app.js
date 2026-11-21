import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import salesOrderRoutes from './routes/salesOrderRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiCopilotRoutes from './routes/aiCopilotRoutes.js';

dotenv.config();

const app = express();

// Global Middlewares
const allowedOrigins = (process.env.CLIENT_URL || process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // In development or if explicitly wildcarded in config, allow all
    if (process.env.NODE_ENV !== 'production' || allowedOrigins.length === 0 || allowedOrigins.includes('*')) {
      return callback(null, origin);
    }
    
    // Check configured allowed origins or vercel preview domains
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, origin);
    }

    return callback(null, origin);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Product & Category Routes
app.use('/api', productRoutes);

// Inventory & Batches Routes
app.use('/api', inventoryRoutes);

// Customer & Credit Routes
app.use('/api', customerRoutes);

// Bulk Pricing Engine Routes
app.use('/api/pricing', pricingRoutes);

// Sales Order Routes
app.use('/api/sales', salesOrderRoutes);

// Invoice & Payment Routes
app.use('/api/invoices', invoiceRoutes);

// Dashboard & Reports Routes
app.use('/api/dashboard', dashboardRoutes);

// User Management Routes (OWNER only via users.manage permission)
app.use('/api/users', userRoutes);

// AI Operations Copilot: LLM-Powered Inventory & Sales Intelligence
app.use('/api/ai', aiCopilotRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    system: 'SmartAgri ERP Backend API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred on the server.',
    },
  });
});

export default app;
