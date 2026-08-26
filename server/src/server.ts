import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CONFIG } from './config.js';
import { persistenceService } from './services/persistence.service.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { securityHeaders } from './middleware/security.middleware.js';

// Import exactly 6 logical API groups
import authRoutes from './routes/auth.routes.js';
import customerRoutes from './routes/customer.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import adminRoutes from './routes/admin.routes.js';
import sessionRoutes from './routes/session.routes.js';
import systemRoutes from './routes/system.routes.js';
import labRoutes from './routes/lab.routes.js';

export const app = express();

// LAB ONLY: this server intentionally contains insecure patterns for local CTF work.
app.use(securityHeaders);
app.use(
  cors({
    origin: CONFIG.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '100kb' })); // Max payload size limit to prevent memory buffer overflow DOS
// LAB ONLY: input sanitization and rate limiting are deliberately disabled.
app.use('/api/auth', authRoutes);

app.use('/api/customer', customerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/lab', labRoutes);

// Global Error Handler (OWASP error masking - no stack traces exposed)
app.use(errorHandler);

// Start server after initializing runtime persistence
async function startServer() {
  await persistenceService.init();

  if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(CONFIG.PORT, () => {
      console.log(`====================================================`);
      console.log(`  Bank of AMR — Server Online `);
      console.log(`  Port: ${CONFIG.PORT}`);
      console.log(`  Mode: ${CONFIG.NODE_ENV}`);
      console.log(`====================================================`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${CONFIG.PORT} is already in use by another process.`);
        console.error(`👉 Please terminate the process using port ${CONFIG.PORT}.\n`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
      }
    });
  }
}

if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  startServer().catch(err => {
    console.error('Failed to start Bank of AMR lab server:', err);
    process.exit(1);
  });
}
