/**
 * ══════════════════════════════════════════════
 *  Asistanim — Backend API Sunucusu
 *  Bu katman Skills Agent tarafından optimize edilmiştir.
 * ══════════════════════════════════════════════
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { emailRoutes } from './routes/email.routes.js';
import { taskRoutes } from './routes/task.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/email', emailRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'active',
      service: 'Asistanim Backend',
      version: '0.1.0',
      skillsAgent: 'online',
      timestamp: new Date().toISOString(),
    },
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🧠 Asistanim Backend çalışıyor: http://localhost:${PORT}`);
  console.log(`⚡ Skills Agent: Aktif`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health\n`);
});
