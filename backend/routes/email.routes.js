/**
 * ══════════════════════════════════════════════
 *  Bu katman Skills Agent tarafından optimize edilmiştir.
 *  Fonksiyon: E-Posta Analiz API Route'ları [MVP]
 * ══════════════════════════════════════════════
 */

import { Router } from 'express';
import { analyzeEmail } from '../services/skillsAgent.js';
import { broadcast } from '../services/logBroadcaster.js';

const router = Router();

/**
 * POST /api/email/analyze
 * Gelen e-postayı Skills Agent ile analiz eder
 */
router.post('/analyze', async (req, res) => {
  try {
    const { sender, subject, body, date } = req.body;

    if (!body && !subject) {
      return res.status(400).json({
        success: false,
        error: 'E-posta içeriği (body) veya konu (subject) gereklidir.',
      });
    }

    broadcast('📨', `Yeni analiz isteği: ${sender || 'Bilinmeyen'} — "${subject || '(Konusuz)'}"`, 'info', { stage: 'received' });

    // Skills Agent analizi (_meta artık otomatik ekleniyor)
    const analysis = await analyzeEmail({ sender, subject, body, date });

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('[E-Posta Analiz HATA]', error.message);
    broadcast('❌', `Analiz hatası: ${error.message}`, 'error');
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/email/demo
 * Demo e-posta listesini döndürür
 */
router.get('/demo', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        sender: 'Ahmet Yılmaz (CEO)',
        subject: 'ACİL: Q3 Bütçe Revizyonu',
        preview: 'Yönetim kurulu toplantısı öncesinde Q3 bütçe tahminlerinin güncellenmesi gerekiyor...',
        priority: 'urgent',
        time: '09:15',
      },
      {
        id: 2,
        sender: 'Güvenlik Bildirimi',
        subject: 'Hesabınız askıya alındı',
        preview: 'Hesabınızda şüpheli giriş tespit edilmiştir...',
        priority: 'urgent',
        time: '09:42',
      },
    ],
  });
});

export { router as emailRoutes };
