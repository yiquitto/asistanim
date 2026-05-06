<div align="center">
  
# 🧠 Asistanim — Kurumsal AI İş Akış Sistemi
  
**"Bilgi tüketen değil, karar üreten kurumsal zekâ."**

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![AI](https://img.shields.io/badge/AI%20Core-Skills%20Agent-06B6D4?style=for-the-badge&logo=openai)](https://openai.com/)
[![Status](https://img.shields.io/badge/Status-Hackathon%20MVP-success?style=for-the-badge)](https://github.com/)

[🚀 Demo Videosu/Linki](#) · [📖 Mimari Dokümanlar](./docs) · [⚙️ Kurulum](#-kurulum)

</div>

---

## 🎯 Vizyonumuz: Neyi Çözüyoruz?

Modern kurumsal dünyada çalışanlar günde ortalama **120+ e-posta**, **3-5 toplantı** ve sayısız mesajlaşma ile boğuşuyor. Bu durumun kurumlara faturası ağır:
- ⏳ **Zaman Kaybı:** E-posta yönetimi, günlük iş süresinin ~%28'ini israf eder.
- 🧠 **Karar Yorgunluğu (Decision Fatigue):** Kritik kararlar gürültünün içinde kaybolur.
- ⚠️ **Aksiyon Kaybı:** Uzun toplantılardan sonra "kim, neyi, ne zaman yapacak?" soruları havada kalır.

**Çözümümüz:** Asistanim, tüm kurumsal iletişim kanallarını tek bir yapay zekâ katmanında birleştiren bir **"Bilişsel Çalışma İşletim Sistemi"**dir. Çalışanların asistanı değil, **yönetici ortağıdır.**

---

## 💎 Neden Asistanim? (Jüri İçin Değer Önerisi)

Sıradan bir "mail özetleyici" veya "RAG tabanlı chatbot" yapmadık. Biz, iletişimi aksiyona dönüştüren bir karar motoru geliştirdik.

1. **E-posta yükünü %70 azaltır:** E-postaları sadece okumaz; onları *skorlar, kategorize eder ve görev haline getirir*.
2. **Güvenlik DNA'sı (Security-by-Design):** Dahili *PII Veri Maskeleme* ve *Phishing Tespit* katmanları ile şirketin verisini korur.
3. **XAI (Açıklanabilir AI):** Kara kutu değildir. Her kararın altına *neden* o kararı verdiğini (örn: Neden acil?) şeffafça yazar.

---

## 🏗️ Hackathon Teslimatı: "Vertical Slice" Yaklaşımı

5 saatlik hackathon süresince, "her şeyi yarım yapmak" yerine dar ama uçtan uca çalışan bir mimari kurduk:

### 🟢 Gerçekleşen MVP (Canlı / Fonksiyonel)
- **🧠 Skills Agent (AI Çekirdeği):** Prompt engineering ve ağırlıklı IUR (Impact-Urgency-Risk) algoritması ile e-postaları değerlendiren çekirdek servis.
- **✉️ E-Posta Zekâ Katmanı:** Gerçek AI destekli analiz, canlı veri girişi ile IUR skorlaması, XAI açıklaması ve otomatik cevap üretimi.
- **✅ Görev Motoru (Task Orchestration):** Gelen e-postaların karmaşasını saniyeler içinde planlı bir To-Do listesine çeviren algoritma.

### 🟡 Vizyon & Potansiyel (Mock UI)
CEO'nun tüm şirketi nasıl yöneteceğini göstermek için "Wizard of Oz" stratejisiyle tasarlanan ekranlar:
- **Toplantı Zekâsı:** Ses transkriptlerini aksiyona çeviren panel vizyonu.
- **Risk & Uyum Dashboard:** Şirket içi siber tehditleri tespit paneli vizyonu.
- **Kurumsal Hafıza:** Vektörel (RAG) arama altyapısı vizyonu.

---

## ⚙️ Teknik Mimari & Teknolojiler

Asistanim, anlık veri işleme ve AI API'leriyle tam senkronizasyon için özel olarak tasarlanmıştır.

*   **Frontend (React 18 + Vite):** 
    *   Cam efektleri (Glassmorphism), *Midnight Forest* karanlık tema konsepti, pürüzsüz mikro-animasyonlar.
    *   Tailwind CSS v4 entegrasyonu.
*   **Backend (Node.js + Express):**
    *   Asekron AI kuyruğu yönetimi.
    *   **Data Masking Service:** Regex tabanlı kişisel veri (TC, Kredi Kartı, Telefon) filtresi.
*   **AI Çekirdeği (Skills Agent):**
    *   OpenAI / Gemini API entegrasyonu. API'nin çökmesi durumunda devreye giren ağırlıklandırılmış **Keyword-Based Fallback Algoritması**.

---

## 🚀 Kurulum & Çalıştırma (Jüri / Test İçin)

Proje lokalinizde saniyeler içinde çalışmaya hazırdır.

### Gereksinimler
- Node.js (v18+) & npm

### 1. Backend'i Başlatın
```bash
cd backend
npm install
# (Opsiyonel) .env dosyasına GEMINI_API_KEY veya OPENAI_API_KEY ekleyin
# Key olmasa bile 'Fallback Algorithm' ile çalışmaya devam edecektir.
npm run dev
```
> *API http://localhost:3001 adresinde ayağa kalkacaktır.*

### 2. Frontend'i Başlatın
```bash
cd frontend
npm install
npm run dev
```
> *Uygulama http://localhost:5173 adresinde açılacaktır.*

---

## 🛡️ Güvenlik ve Uyumluluk

Kurumsal firmaların en büyük çekincesi veri güvenliğidir. Asistanim'da şu güvenlik adımları atılmıştır:
- Sistem, **AI API'sine istek atmadan hemen önce** e-postadaki kişisel verileri (PII) anonimleştirir (Örn: `[TC_MASKED]`).
- Phishing veya Sosyal Mühendislik içeren ("CEO Fraud") mailler otomatik olarak "Kritik Risk" skorlaması ile karantinaya alınır.

---

## 👨‍💻 Geliştirici Ekibi

Bu proje, bir "AI-Augmented Development" süreciyle 5 saatlik kısıtlı bir Hackathon sprint'inde uçtan uca tasarlanmış ve kodlanmıştır.

| Üye | Hackathon Rolü | Katkı |
| :--- | :--- | :--- |
| **Yiğit** | Lead AI Architect | Backend çekirdeği, Skills Agent Prompt Mimarisi, API Entegrasyonları, Proje Liderliği |
| **Ümmühan** | Frontend Developer | React Mimari, MVP Ekranları (E-Posta & Görev Motoru), XAI UI Entegrasyonu |
| **Ömer** | UI/UX Developer | Mock Ekranlar (Toplantı & Risk Panelleri), Kurumsal Simülasyon Verileri, Sunum |

---
<div align="center">
  <i>"Asistanim: Çalışanlarınızın zamanını kurtarır, zihnini özgürleştirir."</i>
</div>
