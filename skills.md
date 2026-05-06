# 🧠 Skills Agent — Teknik Tasarım Dokümanı

> Skills Agent, Asistanim'in AI çekirdeğidir. E-postaları analiz eder, önceliklendirir ve görev çıkarır.

---

## 1. Genel Bakış

Skills Agent şu çıktıları üretir:
- 📊 **Öncelik Skoru** — Impact / Urgency / Risk (1-10)
- 🏷️ **Kategori** — acil / normal / düşük / bilgi / risk
- 📝 **Görev Çıkarımı** — E-postadan otomatik To-Do
- 💬 **Cevap Taslağı** — Otomatik yanıt önerisi
- 🔍 **XAI Açıklama** — Kararın neden verildiği
- ⚠️ **Risk Tespiti** — Phishing, KVKK, sosyal mühendislik

---

## 2. IUR Skorlama Sistemi

```
Toplam = (Impact × 0.4) + (Urgency × 0.35) + (Risk × 0.25)
```

| Faktör | Ağırlık | 9-10 | 5-6 | 1-2 |
|---|---|---|---|---|
| **Impact** | %40 | Şirket geneli etki | Takım seviyesi | Minimal |
| **Urgency** | %35 | < 1 saat yanıt | < 2 gün | Süresiz |
| **Risk** | %25 | KVKK/güvenlik krizi | Deadline riski | Risk yok |

| Toplam | Etiket | Renk |
|---|---|---|
| 8.0–10.0 | 🔴 ACİL | danger |
| 6.0–7.9 | 🟠 YÜKSEK | warning |
| 4.0–5.9 | 🟡 NORMAL | yellow |
| 0.0–3.9 | 🟢 DÜŞÜK | success |

---

## 3. Ana Analiz Prompt'u

```
SİSTEM ROLÜ:
Sen kurumsal e-posta analiz uzmanısın. Gelen e-postaları analiz ederek
öncelik skorlaması, kategorizasyon, risk değerlendirmesi ve görev çıkarımı yaparsın.

ÇIKTI FORMATI (JSON):
{
  "priority": "urgent|high|normal|low",
  "scores": { "impact": <1-10>, "urgency": <1-10>, "risk": <1-10>, "total": <> },
  "category": "task|meeting|info|risk|complaint|approval",
  "summary": "<1-2 cümle özet>",
  "explanation": "<XAI — Bu skor neden verildi?>",
  "suggestedTasks": [
    { "title": "<görev>", "assignee": "user", "deadline": "<tarih>", "priority": "high|medium|low" }
  ],
  "risks": { "phishing": <0-10>, "kvkk_violation": <0-10>, "social_engineering": <0-10> },
  "suggestedReply": "<otomatik cevap taslağı>"
}

E-POSTA:
Gönderen: {{sender}} | Konu: {{subject}} | Tarih: {{date}}
{{body}}
```

---

## 4. Görev Çıkarım Prompt'u

```
Analiz edilmiş e-postalardan günlük yapılacaklar listesi oluştur.
Her görev atomik olsun, deadline ve tahmini süre içersin.

ÇIKTI:
{
  "dailyPlan": {
    "date": "<tarih>",
    "tasks": [
      { "title": "<görev>", "source": "<e-posta>", "priority": "critical|high|medium|low",
        "deadline": "<tarih>", "estimatedMinutes": <dk>, "status": "pending" }
    ]
  }
}
```

---

## 5. API Çağrı Akışı

```
[1] POST /api/email/analyze → body: { emailContent, sender, subject }
    ↓
[2] dataMasking.mask() → PII temizle (TC, tel, IBAN)
    ↓
[3] skillsAgent.analyze() → AI API → IUR skorlama + XAI
    ↓
[4] Response → { priority, scores, explanation, tasks, risks }
    ↓
[5] POST /api/tasks/generate → Görev listesi üret
    ↓
[6] TaskBoard UI
```

---

## 6. PII Maskeleme

| Veri | Pattern | Maske |
|---|---|---|
| TC Kimlik | `\b[1-9]\d{10}\b` | `[TC_MASKED]` |
| Telefon | `\b0?5\d{9}\b` | `[PHONE_MASKED]` |
| E-posta | `[\w.-]+@[\w.-]+\.\w+` | `[EMAIL_MASKED]` |
| IBAN | `\bTR\d{24}\b` | `[IBAN_MASKED]` |

---

## 7. Risk Analiz

- **Phishing:** Gönderen-imza uyuşmazlığı, acil eylem çağrısı, şüpheli URL
- **KVKK:** İzinsiz kişisel veri paylaşımı, toplu alıcıda PII
- **Sosyal Mühendislik:** CEO taklidi, yetkisiz bilgi talebi, olağandışı ödeme

---

## 8. Fallback Mekanizma

AI API başarısız olursa keyword-based basit skorlama devreye girer:
- `acil`, `urgent`, `deadline` → Urgency +3
- `CEO`, `genel müdür` → Impact +3
- `KVKK`, `gizli` → Risk +3

---

*Skills Agent v0.1.0 · 2026-05-06*
