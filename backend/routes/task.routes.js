/**
 * ══════════════════════════════════════════════
 *  Bu katman Skills Agent tarafından optimize edilmiştir.
 *  Fonksiyon: Görev Motoru API Route'ları [MVP]
 * ══════════════════════════════════════════════
 */

import { Router } from 'express';
import { analyzeEmail } from '../services/skillsAgent.js';

const router = Router();

/**
 * POST /api/tasks/generate
 * Analiz edilmiş e-postalardan otomatik görev listesi üretir
 */
router.post('/generate', async (req, res) => {
  try {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'En az bir e-posta verisi gereklidir. Format: { emails: [...] }',
      });
    }

    console.log(`[Görev Motoru] ${emails.length} e-posta analiz ediliyor...`);

    const allTasks = [];

    for (const email of emails) {
      const analysis = await analyzeEmail(email);
      if (analysis.suggestedTasks && analysis.suggestedTasks.length > 0) {
        analysis.suggestedTasks.forEach((task, i) => {
          allTasks.push({
            id: `task-${Date.now()}-${allTasks.length + i}`,
            ...task,
            source: `${email.sender} — ${email.subject}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            aiGenerated: true,
          });
        });
      }
    }

    // Öncelik sıralama
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    allTasks.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));

    const totalMinutes = allTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0);

    res.json({
      success: true,
      data: {
        dailyPlan: {
          date: new Date().toISOString().split('T')[0],
          totalTasks: allTasks.length,
          estimatedHours: Math.round((totalMinutes / 60) * 10) / 10,
          tasks: allTasks,
        },
        generatedAt: new Date().toISOString(),
        engine: 'task-orchestration-v0.1.0',
      },
    });
  } catch (error) {
    console.error('[Görev Motoru HATA]', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as taskRoutes };
