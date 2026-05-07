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
import { addClient, broadcast, getClientCount } from './services/logBroadcaster.js';
import { startMailSimulator } from './services/mailSimulator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow all origins for local dev
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  // SSE endpoint'ini loglamayalım (sürekli bağlantı)
  if (req.url === '/api/logs/stream') return next();
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/email', emailRoutes);
app.use('/api/tasks', taskRoutes);

// ── SSE: Canlı Log Stream ──
app.get('/api/logs/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  res.write(`data: ${JSON.stringify({ id: Date.now(), time: new Date().toLocaleTimeString('tr-TR'), emoji: '🟢', message: 'Terminal bağlantısı kuruldu', type: 'success' })}\n\n`);
  addClient(res);
});

// ── Webhook: Dış Platformlardan E-Posta Kabul ──
app.post('/api/email/webhook', async (req, res) => {
  try {
    const { sender, subject, body, date, source } = req.body;
    if (!body && !subject) {
      return res.status(400).json({ success: false, error: 'E-posta içeriği gereklidir.' });
    }

    broadcast('📨', `Webhook'tan yeni e-posta: ${sender || 'Bilinmeyen'} — ${subject || '(Konusuz)'}`, 'info');
    broadcast('🔗', `Kaynak: ${source || 'External Webhook'}`, 'info');

    // Analiz için email routes'a yönlendir (aynı logic)
    const { analyzeEmail } = await import('./services/skillsAgent.js');
    const { detectPII } = await import('./services/dataMasking.js');
    
    const piiDetected = detectPII(`${subject} ${body}`);
    const analysis = await analyzeEmail({ sender, subject, body, date });

    broadcast('✅', `Webhook analizi tamamlandı — Öncelik: ${analysis.priority?.toUpperCase()}`, 'success');

    res.json({
      success: true,
      data: {
        ...analysis,
        piiDetected: piiDetected.length > 0,
        piiTypes: piiDetected,
        source: source || 'webhook',
        analyzedAt: new Date().toISOString(),
        engine: 'skills-agent-v0.1.0',
      },
    });
  } catch (error) {
    broadcast('❌', `Webhook hatası: ${error.message}`, 'error');
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'active',
      service: 'Asistanim Backend',
      version: '0.2.0',
      skillsAgent: 'online',
      sseClients: getClientCount(),
      webhookEndpoint: '/api/email/webhook',
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
  console.log(`📡 SSE Log Stream: http://localhost:${PORT}/api/logs/stream`);
  console.log(`🔗 Webhook: POST http://localhost:${PORT}/api/email/webhook`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health\n`);
  
  // Start the background mail simulator
  startMailSimulator();
});
