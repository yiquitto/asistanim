/**
 * ══════════════════════════════════════════════
 *  Bu katman Skills Agent tarafından optimize edilmiştir.
 *  Fonksiyon: Skills Agent AI Analiz Çekirdeği
 *  Prompt Stratejisi: IUR Skorlama (Impact-Urgency-Risk)
 * ══════════════════════════════════════════════
 */

import { maskPII, detectPII } from './dataMasking.js';
import { broadcast } from './logBroadcaster.js';

// Keyword tabanlı fallback skorlama (AI API çalışmazsa)
const URGENCY_KEYWORDS = ['acil', 'urgent', 'deadline', 'hemen', 'bugün', 'derhal', 'son tarih'];
const IMPACT_KEYWORDS = ['ceo', 'genel müdür', 'yönetim kurulu', 'bütçe', 'strateji', 'müşteri kaybı'];
const RISK_KEYWORDS = ['kvkk', 'gdpr', 'gizli', 'confidential', 'şifreli', 'phishing', 'dolandırıcı'];
const TASK_KEYWORDS = ['lütfen yapınız', 'tamamlayınız', 'gönderiniz', 'hazırlayınız', 'raporlayınız'];

// JSON Markdown temizleyici
const parseAIResponse = (text) => {
  try {
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('[Skills Agent] JSON Parse Hatası. Ham metin:', text.substring(0, 300));
    throw new Error('Geçersiz JSON formatı döndü.');
  }
};

/**
 * Ana analiz fonksiyonu — e-posta içeriğini analiz eder
 * @param {Object} emailData - { sender, subject, body, date }
 * @returns {Object} Analiz sonucu (IUR skorları, kategori, XAI açıklama, _meta)
 */
export const analyzeEmail = async (emailData) => {
  const startTime = Date.now();

  // Stage 1: PII maskeleme
  broadcast('🛡️', `PII tarama başlatıldı — "${emailData.subject || '(Konusuz)'}..."`, 'stage', { stage: 'pii' });
  const piiFound = detectPII(`${emailData.subject || ''} ${emailData.body || ''}`);
  const maskedBody = maskPII(emailData.body || '');
  const maskedSubject = maskPII(emailData.subject || '');

  if (piiFound.length > 0) {
    const piiSummary = piiFound.map(p => `${p.type}(${p.count})`).join(', ');
    broadcast('🔒', `PII tespit edildi ve maskelendi: ${piiSummary}`, 'warning', { stage: 'pii_done', piiFound });
  } else {
    broadcast('✅', 'PII tarama temiz — hassas veri bulunamadı', 'success', { stage: 'pii_done' });
  }

  // Stage 2: AI API — öncelik: Groq > Gemini > OpenAI > Fallback
  broadcast('🧠', 'AI analiz motoru seçiliyor...', 'stage', { stage: 'ai_select' });

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const kimiKey = process.env.KIMI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const localLLMUrl = process.env.LOCAL_LLM_URL; // LM Studio veya Ollama

  let result = null;
  let modelUsed = 'fallback-keyword';

  // Groq (en hızlı — retry ile)
  if (groqKey) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        broadcast('🚀', `Groq API (llama-3.3-70b) ile analiz başlatıldı...${attempt > 1 ? ` (deneme ${attempt}/3)` : ''}`, 'info', { stage: 'ai_call' });
        result = await callGroqAPI(emailData.sender, maskedSubject, maskedBody, emailData.date);
        modelUsed = 'groq-llama-3.3-70b';
        broadcast('✅', 'Groq AI analiz başarılı', 'success', { stage: 'ai_done' });
        break;
      } catch (error) {
        if (error.message.includes('429') && attempt < 3) {
          const waitMs = attempt * 5000;
          broadcast('⏳', `Groq rate limit — ${waitMs / 1000}s bekleniyor (${attempt}/3)`, 'warning');
          await new Promise(r => setTimeout(r, waitMs));
        } else {
          broadcast('⚠️', `Groq hatası: ${error.message.substring(0, 100)}`, 'warning');
          break;
        }
      }
    }
  }

  // Gemini
  if (!result && geminiKey) {
    try {
      broadcast('🚀', 'Gemini API (gemini-2.0-flash) ile analiz başlatıldı...', 'info', { stage: 'ai_call' });
      result = await callGeminiAPI(emailData.sender, maskedSubject, maskedBody, emailData.date);
      modelUsed = 'gemini-2.0-flash';
      broadcast('✅', 'Gemini AI analiz başarılı', 'success', { stage: 'ai_done' });
    } catch (error) {
      broadcast('⚠️', `Gemini hatası: ${error.message.substring(0, 100)}`, 'warning');
    }
  }

  // Local LLM (LM Studio / Ollama — Mistral 7B)
  if (!result && localLLMUrl) {
    try {
      broadcast('🖥️', 'Yerel AI Motoru (Mistral-7B) ile analiz başlatıldı...', 'info', { stage: 'ai_call' });
      result = await callLocalLLM(emailData.sender, maskedSubject, maskedBody, emailData.date);
      modelUsed = 'local-mistral-7b';
      broadcast('✅', 'Yerel AI analiz başarılı (veri dışarı çıkmadı)', 'success', { stage: 'ai_done' });
    } catch (error) {
      broadcast('⚠️', `Yerel LLM hatası: ${error.message.substring(0, 100)}`, 'warning');
    }
  }

  // Kimi (Moonshot)
  if (!result && kimiKey) {
    try {
      broadcast('🚀', 'Kimi API (moonshot-v1-8k) ile analiz başlatıldı...', 'info', { stage: 'ai_call' });
      result = await callKimiAPI(emailData.sender, maskedSubject, maskedBody, emailData.date);
      modelUsed = 'kimi-moonshot-v1-8k';
      broadcast('✅', 'Kimi analiz başarılı', 'success', { stage: 'ai_done' });
    } catch (error) {
      broadcast('⚠️', `Kimi hatası: ${error.message.substring(0, 100)}`, 'warning');
    }
  }

  // OpenAI
  if (!result && openaiKey) {
    try {
      broadcast('🚀', 'OpenAI API (gpt-4o-mini) ile analiz başlatıldı...', 'info', { stage: 'ai_call' });
      result = await callOpenAIAPI(emailData.sender, maskedSubject, maskedBody, emailData.date);
      modelUsed = 'openai-gpt-4o-mini';
      broadcast('✅', 'OpenAI analiz başarılı', 'success', { stage: 'ai_done' });
    } catch (error) {
      broadcast('⚠️', `OpenAI hatası: ${error.message.substring(0, 100)}`, 'warning');
    }
  }

  // Fallback
  if (!result) {
    broadcast('🔄', 'AI API erişilemedi — Keyword tabanlı fallback analiz kullanılıyor', 'warning', { stage: 'ai_call' });
    result = keywordBasedScoring(emailData.sender, maskedSubject, maskedBody);
    broadcast('✅', 'Fallback analiz tamamlandı', 'success', { stage: 'ai_done' });
  }

  const responseTimeMs = Date.now() - startTime;

  // Stage 3: Skor hesaplama
  const priorityLabel = { urgent: 'ACİL', high: 'YÜKSEK', normal: 'NORMAL', low: 'DÜŞÜK' };
  broadcast('📊', `IUR Skoru: ${result.scores?.total || '?'} → ${priorityLabel[result.priority] || result.priority}`, 'info', { stage: 'scoring' });

  // Stage 4: Görev çıkarımı
  if (result.suggestedTasks?.length > 0) {
    broadcast('📋', `${result.suggestedTasks.length} görev çıkarıldı → Görev Motoru'na aktarılıyor`, 'success', { stage: 'tasks' });
  }

  // Stage 5: Taslak yanıt
  if (result.suggestedReply) {
    const wordCount = result.suggestedReply.split(/\s+/).length;
    broadcast('✉️', `Taslak yanıt oluşturuldu (${wordCount} kelime)`, 'success', { stage: 'reply' });
  }

  broadcast('🏁', `Analiz tamamlandı — ${modelUsed} · ${responseTimeMs}ms`, 'success', { stage: 'complete' });

  // Meta bilgileri ekle
  result._meta = {
    model: modelUsed,
    responseTimeMs,
    piiMaskedCount: piiFound.reduce((sum, p) => sum + p.count, 0),
    piiTypes: piiFound,
    analyzedAt: new Date().toISOString(),
    engine: 'skills-agent-v0.2.0',
  };

  return result;
};

/**
 * Groq API çağrısı (en hızlı — llama-3.3-70b)
 */
const callGroqAPI = async (sender, subject, body, date) => {
  const prompt = buildAnalysisPrompt(sender, subject, body, date);

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Groq API: ${response.status} — ${errBody.substring(0, 200)}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq boş yanıt döndü');

  return parseAIResponse(text);
};

/**
 * Gemini API çağrısı (retry + backoff)
 */
const callGeminiAPI = async (sender, subject, body, date, retries = 3) => {
  const prompt = buildAnalysisPrompt(sender, subject, body, date);

  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (response.status === 429 && attempt < retries) {
      const waitMs = attempt * 2000;
      broadcast('⏳', `Rate limit — ${waitMs}ms beklenip tekrar deneniyor (${attempt}/${retries})`, 'warning');
      await new Promise(r => setTimeout(r, waitMs));
      continue;
    }

    if (!response.ok) throw new Error(`Gemini API: ${response.status}`);

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini boş yanıt döndü');

    return parseAIResponse(text);
  }

  throw new Error('Gemini API: Tüm denemeler başarısız');
};

/**
 * OpenAI API çağrısı
 */
const callOpenAIAPI = async (sender, subject, body, date) => {
  const prompt = buildAnalysisPrompt(sender, subject, body, date);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API: ${response.status}`);

  const data = await response.json();
  return parseAIResponse(data.choices[0].message.content);
};

/**
 * Kimi (Moonshot) API çağrısı
 */
const callKimiAPI = async (sender, subject, body, date) => {
  const prompt = buildAnalysisPrompt(sender, subject, body, date);

  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'moonshot-v1-8k',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) throw new Error(`Kimi API: ${response.status}`);

  const data = await response.json();
  return parseAIResponse(data.choices[0].message.content);
};

/**
 * Local LLM çağrısı (LM Studio / Ollama — OpenAI uyumlu endpoint)
 * Veri dışarı çıkmaz, rate limit yok, tamamen ücretsiz
 */
const callLocalLLM = async (sender, subject, body, date) => {
  const localUrl = process.env.LOCAL_LLM_URL || 'http://localhost:1234/v1/chat/completions';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  try {
    broadcast('🔗', `Yerel LLM bağlantısı: ${localUrl}`, 'info');
    
    const response = await fetch(localUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct-v0.3',
        messages: [
          {
            role: 'user',
            content: `E-posta: Gönderen: ceo@sirket.com Konu: Acil toplantı İçerik: Yarın saat 10'da bütçe toplantısı var.

Analiz JSON:`
          },
          {
            role: 'assistant',
            content: `{"priority":"urgent","scores":{"impact":8,"urgency":9,"risk":1,"total":7.0},"category":"meeting","summary":"CEO yarın saat 10'da acil bütçe toplantısı çağrısı yapıyor.","explanation":"CEO'dan gelen acil toplantı daveti, yüksek iş etkisi ve aciliyet içeriyor.","suggestedTasks":[{"title":"Bütçe toplantısına hazırlan","assignee":"user","deadline":"Yarın 10:00","priority":"high"}],"risks":{"phishing":0,"kvkk_violation":0,"social_engineering":0,"details":"Risk tespit edilmedi"},"suggestedReply":"Sayın CEO, toplantıya katılacağım. Bütçe dokümanlarını hazırlıyorum."}`
          },
          {
            role: 'user',
            content: `E-posta: Gönderen: ${sender} Konu: ${subject} İçerik: ${body.substring(0, 500)}

Analiz JSON:`
          }
        ],
        temperature: 0.1,
        max_tokens: 1024,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Local LLM: ${response.status} — ${errText.substring(0, 100)}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Yerel model boş yanıt döndü');

    broadcast('📄', `Yerel LLM ham yanıt: ${text.substring(0, 80)}...`, 'info');
    const parsed = parseAIResponse(text);

    // Mistral bazen total'i yanlış hesaplar — düzelt
    if (parsed.scores) {
      const i = parsed.scores.impact || 5;
      const u = parsed.scores.urgency || 5;
      const r = parsed.scores.risk || 1;
      parsed.scores.total = Math.round((i * 0.4 + u * 0.35 + r * 0.25) * 100) / 100;
      parsed.priority = parsed.scores.total >= 8 ? 'urgent' : parsed.scores.total >= 6 ? 'high' : parsed.scores.total >= 4 ? 'normal' : 'low';
    }

    return parsed;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Yerel LLM: 120s timeout aşıldı');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Analiz prompt'u oluştur
 */
const buildAnalysisPrompt = (sender, subject, body, date) => {
  return `Sen kurumsal bir e-posta analiz uzmanısın. Gelen e-postayı analiz ederek öncelik skorlaması, kategorizasyon, risk değerlendirmesi ve görev çıkarımı yap.

ANALIZ KRITERLERİ:
1. Impact (1-10): İş etkisi
2. Urgency (1-10): Aciliyet
3. Risk (1-10): Güvenlik/uyum riski

TOPLAM SKOR FORMÜLÜ: (Impact × 0.4) + (Urgency × 0.35) + (Risk × 0.25)
Lütfen JSON içindeki "total" kısmına sadece çıkan SAYIYI yazın (örn: 7.2). Kesinlikle matematiksel formül veya işlem yazmayın!

Öncelik eşikleri: 8.0-10.0=urgent, 6.0-7.9=high, 4.0-5.9=normal, 0.0-3.9=low

ÖNEMLİ KURAL: Yalnızca ve yalnızca geçerli bir JSON objesi döndür. Sadece JSON formatında çıktı ver.

JSON ÇIKTI:
{
  "priority": "urgent|high|normal|low",
  "scores": { "impact": <1-10>, "urgency": <1-10>, "risk": <1-10>, "total": <SADECE SAYI> },
  "category": "task|meeting|info|risk|complaint|approval",
  "summary": "<1-2 cümle Türkçe özet>",
  "explanation": "<Türkçe XAI açıklama — bu skor neden verildi?>",
  "suggestedTasks": [{ "title": "<görev>", "assignee": "user", "deadline": "<tarih>", "priority": "high|medium|low" }],
  "risks": { "phishing": <0-10>, "kvkk_violation": <0-10>, "social_engineering": <0-10>, "details": "<risk açıklaması>" },
  "suggestedReply": "<varsa Türkçe cevap taslağı, yoksa null>"
}

E-POSTA:
Gönderen: ${sender}
Konu: ${subject}
Tarih: ${date || new Date().toISOString()}
İçerik:
${body}`;
};

/**
 * Fallback: Keyword tabanlı basit skorlama
 */
const keywordBasedScoring = (sender, subject, body) => {
  const fullText = `${sender} ${subject} ${body}`.toLowerCase();

  let impact = 3, urgency = 3, risk = 1;

  URGENCY_KEYWORDS.forEach(k => { if (fullText.includes(k)) urgency = Math.min(urgency + 2, 10); });
  IMPACT_KEYWORDS.forEach(k => { if (fullText.includes(k)) impact = Math.min(impact + 2, 10); });
  RISK_KEYWORDS.forEach(k => { if (fullText.includes(k)) risk = Math.min(risk + 3, 10); });

  const total = (impact * 0.4) + (urgency * 0.35) + (risk * 0.25);
  const priority = total >= 8 ? 'urgent' : total >= 6 ? 'high' : total >= 4 ? 'normal' : 'low';

  // Kategori tahmini
  let category = 'info';
  if (TASK_KEYWORDS.some(k => fullText.includes(k))) category = 'task';
  if (fullText.includes('toplantı') || fullText.includes('meeting')) category = 'meeting';
  if (risk >= 5) category = 'risk';

  return {
    priority,
    scores: { impact, urgency, risk, total: Math.round(total * 100) / 100 },
    category,
    summary: `${subject} — ${sender} tarafından gönderildi`,
    explanation: `Keyword analizi: Impact=${impact}/10, Urgency=${urgency}/10, Risk=${risk}/10. ${priority === 'urgent' ? 'Acil anahtar kelimeler tespit edildi.' : 'Standart seviye e-posta.'}`,
    suggestedTasks: category === 'task' ? [{ title: subject, assignee: 'user', deadline: 'Bu hafta', priority: priority === 'urgent' ? 'high' : 'medium' }] : [],
    risks: { phishing: risk >= 7 ? 8 : 0, kvkk_violation: fullText.includes('kvkk') ? 6 : 0, social_engineering: 0, details: risk >= 5 ? 'Risk anahtar kelimeleri tespit edildi' : 'Risk tespit edilmedi' },
    suggestedReply: null,
  };
};

export default { analyzeEmail };
