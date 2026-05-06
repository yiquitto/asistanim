# 🗺️ Asistanim — 5 Saatlik Hackathon Yol Haritası

> **Strateji:** Dikey Dilim (Vertical Slice) — Dar ama derin, çalışan bir MVP + etkileyici vizyon UI.

---

## ⏱️ Zaman Çizelgesi

```
[████░░░░░░░░░░░░░░░░░░░░░] Saat 0-1  → KURULUM & İSKELET
[░░░░████████████░░░░░░░░░] Saat 1-3  → PARALEL GELİŞTİRME
[░░░░░░░░░░░░░░░████░░░░░] Saat 3-4  → MERGE & ENTEGRASYON
[░░░░░░░░░░░░░░░░░░░█████] Saat 4-5  → FİNAL & SUNUM HAZIRLIK
```

---

## 🕐 SAAT 0–1: Kurulum & İskelet (Herkes Birlikte)

### Yiğit (Lead Developer)
- [x] GitHub repo oluştur, `main` ve `dev` branch aç
- [x] Branch koruma kurallarını ayarla (`main` → push yasak)
- [x] React + Tailwind projesi oluştur (`npx create-vite`)
- [x] Backend iskeletini kur (Node.js + Express)
- [x] `.env.example` dosyası hazırla (API key placeholder)
- [x] GitHub Issues oluştur (aşağıdaki listeden)
- [x] Takıma branch stratejisini anlat

### Ümmühan (Feature Developer)
- [x] Repo'yu klonla, `dev` branch'ine geç
- [x] `feature/issue-1-dashboard-layout` branch'i oluştur
- [x] Tailwind config ve renk paletini ayarla
- [x] Temel layout komponentlerini hazırla (Sidebar, Header, MainContent)

### Ömer (Feature Developer)
- [x] Repo'yu klonla, `dev` branch'ine geç
- [x] `feature/issue-2-dummy-data` branch'i oluştur
- [x] `dummyEmails.json` — 15-20 örnek kurumsal e-posta hazırla
- [x] `dummyMeetings.json` — 3-5 örnek toplantı özeti hazırla
- [x] `dummyTasks.json` — 10-15 örnek görev hazırla

---

## 🕑 SAAT 1–3: Paralel Geliştirme (Herkes Kendi Branch'inde)

### Yiğit — Backend Çekirdeği (MVP)

| Issue | Branch | Görev |
|---|---|---|
| `#3` | `feature/issue-3-skills-agent` | Skills Agent AI servisi: prompt tasarımı, API çağrısı, Impact/Urgency/Risk skorlama |
| `#4` | `feature/issue-4-email-api` | E-posta analiz API endpoint: `/api/email/analyze` |
| `#5` | `feature/issue-5-task-engine` | Görev motoru API: e-postadan görev çıkarma, `/api/tasks/generate` |
| `#6` | `feature/issue-6-data-masking` | PII maskeleme servisi (TC No, telefon, e-posta regex) |

**Saat 1–2:** Issue #3 + #4 (Skills Agent + E-Posta API)  
**Saat 2–3:** Issue #5 + #6 (Görev Motoru + Maskeleme)

### Ümmühan — Frontend MVP Ekranları

| Issue | Branch | Görev |
|---|---|---|
| `#7` | `feature/issue-7-email-inbox` | EmailInbox.jsx — AI filtrelenmiş e-posta listesi, PriorityBadge, EmailCard |
| `#8` | `feature/issue-8-task-board` | TaskBoard.jsx — Görev listesi, öncelik sıralaması, durum toggle |
| `#9` | `feature/issue-9-xai-component` | XAIExplanation.jsx — "Bu karar neden verildi?" açıklama kutusu |

**Saat 1–2:** Issue #7 (E-Posta Inbox UI)  
**Saat 2–3:** Issue #8 + #9 (Görev Board + XAI)

### Ömer — Mock/Vizyon Ekranları

| Issue | Branch | Görev |
|---|---|---|
| `#10` | `feature/issue-10-meeting-panel` | MeetingPanel.jsx — Toplantı özeti + aksiyon maddeleri (dummy) |
| `#11` | `feature/issue-11-risk-panel` | RiskPanel.jsx — KVKK uyarıları, phishing tespiti (dummy) |
| `#12` | `feature/issue-12-memory-search` | MemorySearch.jsx — Kurumsal hafıza arama (dummy sonuçlar) |

**Saat 1–2:** Issue #10 (Toplantı Paneli)  
**Saat 2–3:** Issue #11 + #12 (Risk + Hafıza)

---

## 🕒 SAAT 3–4: Merge & Entegrasyon (Yiğit Lider)

### Yiğit — Merge Sorumlusu
- [ ] Tüm feature branch'leri `dev`'e merge et (PR Review)
- [ ] Conflict'leri çöz
- [ ] Frontend ↔ Backend bağlantısını kur (API call entegrasyonu)
- [ ] EmailInbox → `/api/email/analyze` bağlantısı
- [ ] TaskBoard → `/api/tasks/generate` bağlantısı
- [ ] CEO Dashboard.jsx — tüm modülleri birleştir

### Ümmühan — Entegrasyon Desteği
- [ ] Frontend API çağrılarını test et
- [ ] Loading state'leri ve error handling ekle
- [ ] Responsive kontrol

### Ömer — Entegrasyon Desteği
- [ ] Mock panellerin Dashboard'a entegrasyonu
- [ ] Navigation/Routing kontrolü
- [ ] Son dummy data düzeltmeleri

---

## 🕓 SAAT 4–5: Final Refactoring & Sunum Hazırlık

### Yiğit
- [ ] `dev` → `main` final merge
- [ ] Son smoke test
- [ ] README.md güncelle (kurulum talimatları)
- [ ] Demo senaryosu son prova

### Ümmühan
- [ ] UI son rötuşlar (animasyon, hover efektleri)
- [ ] Screenshot'lar al (sunum için)
- [ ] Dark mode kontrol

### Ömer
- [ ] Sunum slaytları hazırla / son kontrol
- [ ] Demo verilerini gözden geçir (tutarlılık)
- [ ] Jüri soruları için hazırlık notları

---

## 📋 GitHub Issues Listesi

| # | Başlık | Atanan | Etiket | Öncelik |
|---|---|---|---|---|
| #1 | Dashboard Layout & Tasarım Sistemi Kurulumu | Ümmühan | `frontend` `setup` | 🔴 Yüksek |
| #2 | Demo Dummy Data Hazırlama (Email/Meeting/Task) | Ömer | `data` `setup` | 🔴 Yüksek |
| #3 | Skills Agent AI Servisi (Prompt + Skorlama) | Yiğit | `backend` `ai` `mvp` | 🔴 Kritik |
| #4 | E-Posta Analiz API Endpoint | Yiğit | `backend` `api` `mvp` | 🔴 Kritik |
| #5 | Görev Motoru API (Task Generation) | Yiğit | `backend` `api` `mvp` | 🔴 Kritik |
| #6 | PII Veri Maskeleme Servisi | Yiğit | `backend` `security` | 🟡 Orta |
| #7 | EmailInbox UI (AI Filtrelenmiş Liste) | Ümmühan | `frontend` `mvp` | 🔴 Yüksek |
| #8 | TaskBoard UI (Görev Listesi) | Ümmühan | `frontend` `mvp` | 🔴 Yüksek |
| #9 | XAI Açıklama Komponenti | Ümmühan | `frontend` `ai` | 🟡 Orta |
| #10 | Toplantı Zekâsı Paneli [MOCK] | Ömer | `frontend` `mock` | 🟡 Orta |
| #11 | Risk & Uyum Dashboard [MOCK] | Ömer | `frontend` `mock` | 🟡 Orta |
| #12 | Kurumsal Hafıza Arama [MOCK] | Ömer | `frontend` `mock` | 🟢 Düşük |
| #13 | CEO Dashboard Birleştirme | Yiğit | `frontend` `integration` | 🔴 Yüksek |
| #14 | Frontend ↔ Backend API Entegrasyonu | Yiğit | `integration` `mvp` | 🔴 Kritik |
| #15 | Final Merge & Sunum Hazırlık | Yiğit | `release` | 🔴 Kritik |

---

## ⚠️ Kritik Kurallar

1. **Asla `main`'e direkt push yapma** — Sadece `dev → main` merge ile (Saat 4-5)
2. **Her commit mesajına Issue numarası yaz** — `Fixes #3` veya `Refs #3`
3. **Saat 3'te ne olursa olsun MERGE başlar** — Eksik feature'lar mock data ile kapatılır
4. **Saat 4:30'da kod dondurulur** — Son 30 dakika sadece sunum hazırlığı

---

## 🎯 Başarı Kriterleri

- [ ] E-posta analizi gerçek AI ile çalışıyor mu? ✅
- [ ] Görev motoru e-postadan To-Do üretebiliyor mu? ✅
- [ ] XAI açıklaması ("Neden acil?") gösteriliyor mu? ✅
- [ ] CEO Dashboard tüm modülleri gösteriyor mu? ✅
- [ ] Demo akışı 5 dakikada tamamlanabiliyor mu? ✅
- [ ] Jüri soruları için hazır mıyız? ✅

---

*Hackathon Sprint Roadmap · 2026-05-06*
