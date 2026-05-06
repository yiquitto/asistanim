/**
 * ══════════════════════════════════════════════
 *  Bu katman Skills Agent tarafından optimize edilmiştir.
 *  Fonksiyon: Skills Agent AI Analiz Çekirdeği
 *  Prompt Stratejisi: IUR Skorlama (Impact-Urgency-Risk)
 * ══════════════════════════════════════════════
 */

import { maskPII } from './dataMasking.js';

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
    console.error('[Skills Agent] JSON Parse Hatası. Ham metin:', text);
    throw new Error('Geçersiz JSON formatı döndü.');
  }
};

/**
 * Ana analiz fonksiyonu — e-posta içeriğini analiz eder
 * @param {Object} emailData - { sender, subject, body, date }
 * @returns {Object} Analiz sonucu (IUR skorları, kategori, XAI açıklama)
 */
export const analyzeEmail = async (emailData) => {
  // 1. PII maskeleme
  const maskedBody = maskPII(emailData.body || '');
  const maskedSubject = maskPII(emailData.subject || '');

  // 2. AI API — öncelik: Groq > Gemini > OpenAI > Fallback
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // Groq (en hızlı)
  if (groqKey) {
    try {
      console.log('[Skills Agent] 🚀 Groq API ile analiz ediliyor...');
      return await callGroqAPI(emailData.sender, maskedSubject, maskedBody, emailData.date);
    } catch (error) {
      console.warn('[Skills Agent] Groq hatası:', error.message);
    }
  }

  // Gemini
  if (geminiKey) {
    try {
      console.log('[Skills Agent] Gemini API ile analiz ediliyor...');
      return await callGeminiAPI(emailData.sender, maskedSubject, maskedBody, emailData.date);
    } catch (error) {
      console.warn('[Skills Agent] Gemini hatası:', error.message);
    }
  }

  // OpenAI
  if (openaiKey) {
    try {
      console.log('[Skills Agent] OpenAI API ile analiz ediliyor...');
      return await callOpenAIAPI(emailData.sender, maskedSubject, maskedBody, emailData.date);
    } catch (error) {
      console.warn('[Skills Agent] OpenAI hatası:', error.message);
    }
  }

  // 3. Fallback: Keyword-based skorlama
  console.log('[Skills Agent] Fallback (keyword) analiz kullanılıyor');
  return keywordBasedScoring(emailData.sender, maskedSubject, maskedBody);
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

  console.log('[Skills Agent] ✅ Groq AI analiz başarılı');
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
      console.log(`[Skills Agent] Rate limit (429), ${waitMs}ms bekleyip tekrar deneniyor... (${attempt}/${retries})`);
      await new Promise(r => setTimeout(r, waitMs));
      continue;
    }

    if (!response.ok) throw new Error(`Gemini API: ${response.status}`);

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini boş yanıt döndü');

    console.log('[Skills Agent] ✅ Gemini AI analiz başarılı');
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
