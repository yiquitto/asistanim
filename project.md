# 🧠 Asistanim — Kurumsal AI İş Akış Optimizasyon Sistemi

> **"Bilgi tüketen değil, karar üreten kurumsal zekâ."**

---

## 📌 Proje Kimliği

| Alan | Detay |
|---|---|
| **Proje Adı** | Asistanim |
| **Versiyon** | v0.1.0-hackathon |
| **Takım** | Yiğit (Lead), Ümmühan (Feature Dev), Ömer (Feature Dev) |
| **Süre** | 5 Saat (Hackathon Sprint) |
| **Teknoloji** | React + Tailwind CSS · Node.js/Express · OpenAI/Gemini API |

---

## 1. Problem

Kurumsal çalışanlar günde 120+ e-posta, 3-5 toplantı ve onlarca mesajla boğuşur. Sonuç: **Information Overload** ve **Decision Fatigue** → verimlilik kaybı.

## 2. Çözüm

Tüm kurumsal iletişimi tek bir AI katmanında birleştiren **"Bilişsel Çalışma İşletim Sistemi"**.

```
  CEO DASHBOARD
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐
  │ E-Posta  │ │ Toplantı │ │ Görev    │ │ Risk   │
  │ Zekâsı   │ │ Zekâsı   │ │ Motoru   │ │ Paneli │
  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘
       └─────────────┴────────────┴────────────┘
                🧠 SKILLS AGENT
          Impact · Urgency · Risk Motoru
```

## 3. Hackathon Stratejisi: "Wizard of Oz"

> 5 saatte jüriye ürünün *nasıl çalışacağını* göstermek.

### 🟢 Gerçek MVP (Fonksiyonel)

| Modül | Açıklama |
|---|---|
| **E-Posta Zekâ Katmanı** | AI ile analiz, önceliklendirme (Impact/Urgency/Risk), otomatik cevap, XAI açıklama |
| **Görev Motoru** | E-postadan otomatik görev çıkarma, öncelik sıralaması, günlük To-Do |

### 🟡 Mock UI (Dummy Data ile Vizyon)

| Modül | Durum |
|---|---|
| Toplantı Zekâsı | 🎭 MOCK |
| Kurumsal Hafıza | 🎭 MOCK |
| Risk & Uyum Dashboard | 🎭 MOCK |
| Çok Dilli İşleme | 🎭 MOCK |
| Omni-Input Entegrasyon | 🎭 MOCK |

### 🔴 Kapsam Dışı
- Gerçek IMAP/SMTP entegrasyonu
- RAG veritabanı
- Gerçek zamanlı Teams/Slack
- → `[SIMULATION]` etiketi ile işaretlenir

## 4. Güvenlik DNA'sı

| Katman | Açıklama |
|---|---|
| **XAI** | Her AI kararı için "neden?" açıklaması |
| **Risk Skorlama** | Phishing · KVKK ihlali · Sosyal mühendislik |
| **PII Maskeleme** | AI'ya gönderilmeden önce hassas veri maskeleme |

## 5. Teknik Mimari

```
Frontend (React + Tailwind)
├── pages/
│   ├── Dashboard.jsx        ← CEO Dashboard
│   ├── EmailInbox.jsx       ← [MVP]
│   ├── TaskBoard.jsx        ← [MVP]
│   ├── MeetingPanel.jsx     ← [MOCK]
│   ├── MemorySearch.jsx     ← [MOCK]
│   └── RiskPanel.jsx        ← [MOCK]
│
Backend (Node.js + Express)
├── services/
│   ├── skillsAgent.js       ← 🧠 AI Çekirdeği [MVP]
│   ├── dataMasking.js       ← PII maskeleme
│   └── priorityEngine.js    ← Skorlama motoru
├── data/
│   ├── dummyEmails.json
│   ├── dummyMeetings.json
│   └── dummyTasks.json
```

## 6. Hedef Metrikler

| Metrik | Hedef |
|---|---|
| E-posta iş yükü azalması | **≥ %70** |
| Toplantı aksiyon kaybı | **→ 0** |
| Görev planlama süresi | **%80 azalma** |

## 7. Demo Akışı

1. **Hook:** "147 okunmamış e-posta, 3 toplantı, 12 bekleyen görev"
2. **Problem:** Manuel yönetimin imkansızlığı
3. **Çözüm:** Asistanim → AI filtrelenmiş inbox → otomatik görevler
4. **Derinlik:** E-posta seç → AI analiz → XAI açıklama
5. **Vizyon:** CEO Dashboard — tüm modüller birlikte
6. **Kapanış:** "%70 yük azalması" metrikleri

---

*Hackathon Sprint · 2026-05-06*
