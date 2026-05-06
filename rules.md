# 📏 Asistanim — Kodlama Standartları ve Şeffaflık Kuralları

> Bu dosya hackathon boyunca tüm takım üyelerinin uyması gereken kuralları tanımlar.

---

## 1. Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|---|---|---|
| **Frontend** | React + Vite | React 18+ |
| **Styling** | Tailwind CSS | v3.x |
| **Backend** | Node.js + Express | Node 18+ |
| **AI Servisi** | OpenAI API veya Google Gemini API | En güncel |
| **Dil** | JavaScript (ES6+) | — |
| **Paket Yöneticisi** | npm | — |

---

## 2. Proje Yapısı Kuralları

```
asistanim/
├── frontend/              ← React uygulaması
│   ├── src/
│   │   ├── pages/         ← Sayfa komponentleri (Dashboard, EmailInbox, vb.)
│   │   ├── components/    ← Tekrar kullanılabilir UI komponentleri
│   │   ├── hooks/         ← Custom React hooks
│   │   ├── services/      ← API çağrı fonksiyonları
│   │   ├── data/          ← Dummy/mock veri dosyaları
│   │   └── utils/         ← Yardımcı fonksiyonlar
│   └── tailwind.config.js
│
├── backend/               ← Express API sunucusu
│   ├── routes/            ← API route tanımları
│   ├── services/          ← İş mantığı servisleri
│   ├── middleware/        ← Auth, logging, masking middleware
│   └── data/              ← JSON veri dosyaları
│
└── docs/                  ← Mimari dokümanlar (bu dosyalar)
```

---

## 3. Kodlama Standartları

### 3.1 Genel Kurallar

- **Dil:** Kod İngilizce yazılır, yorumlar Türkçe olabilir
- **Dosya isimlendirme:** PascalCase (komponentler: `EmailCard.jsx`), camelCase (servisler: `skillsAgent.js`)
- **Fonksiyon isimlendirme:** camelCase — `analyzeEmail()`, `generateTasks()`
- **Sabit değerler:** UPPER_SNAKE_CASE — `MAX_PRIORITY_SCORE`, `API_BASE_URL`
- **Girintileme:** 2 space (tab değil)
- **Satır uzunluğu:** Maksimum 100 karakter
- **Noktalı virgül:** Kullanılacak (`;`)

### 3.2 React / Frontend Kuralları

```jsx
// ✅ DOĞRU — Fonksiyonel komponent, açıklayıcı isim
const EmailCard = ({ email, onAnalyze }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      {/* E-posta kartı içeriği */}
    </div>
  );
};

// ❌ YANLIŞ — Class component, belirsiz isim
class Card extends React.Component { ... }
```

- **Sadece fonksiyonel komponent** kullanılacak (class component yasak)
- **Props destructuring** kullanılacak
- **Tailwind class sırası:** Layout → Spacing → Sizing → Typography → Colors → Effects
- **Komponent dosyası:** Tek komponent = tek dosya

### 3.3 Backend Kuralları

```javascript
// ✅ DOĞRU — async/await, hata yönetimi, açık response
const analyzeEmail = async (req, res) => {
  try {
    const { emailContent } = req.body;
    const result = await skillsAgent.analyze(emailContent);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

- **async/await** kullanılacak (callback chain yasak)
- **try/catch** ile hata yönetimi zorunlu
- **Response formatı:** `{ success: boolean, data: any, error?: string }`
- **HTTP status kodları:** Doğru kullanılacak (200, 400, 404, 500)

---

## 4. 🤖 AI Şeffaflık Kuralları (Kritik)

### 4.1 Skills Agent İşareti

AI tarafından üretilen veya optimize edilen **her kritik algoritma bölümünün** başına aşağıdaki yorum bloğu **mutlak suretle** eklenecektir:

```javascript
/**
 * ══════════════════════════════════════════════
 *  Bu katman Skills Agent tarafından optimize
 *  edilmiştir.
 * ══════════════════════════════════════════════
 *  Fonksiyon: [fonksiyonun ne yaptığı]
 *  AI Modeli: [kullanılan model adı]
 *  Prompt Stratejisi: [kısa açıklama]
 * ══════════════════════════════════════════════
 */
```

### 4.2 XAI (Açıklanabilir AI) Zorunluluğu

Skills Agent her karar verdiğinde, kararın **neden** verildiğini açıklayan bir `explanation` alanı döndürmelidir:

```json
{
  "priority": "urgent",
  "score": { "impact": 9, "urgency": 8, "risk": 7 },
  "explanation": "Bu e-posta CEO'dan gelen acil bir deadline içeriyor. Mali etki yüksek, yanıt süresi 2 saat ile sınırlı.",
  "risks": ["deadline_miss", "financial_impact"]
}
```

### 4.3 Mock / Simulation İşareti

Hackathon kapsamında gerçek olmayan (dummy data ile çalışan) her modülün başına:

```javascript
/**
 * ⚠️ [SIMULATION] — Bu modül hackathon demo amaçlıdır.
 * Gerçek veri kaynağına bağlı değildir, hardcoded/dummy veri kullanır.
 * Production versiyonunda gerçek entegrasyon yapılacaktır.
 */
```

---

## 5. Git Commit Mesaj Formatı

```
<tip>(#issue): <kısa açıklama>

[opsiyonel detaylı açıklama]

Fixes #<issue-no>
```

### Tip Etiketleri

| Tip | Kullanım |
|---|---|
| `feat` | Yeni özellik |
| `fix` | Hata düzeltme |
| `style` | UI/CSS değişikliği |
| `refactor` | Kod iyileştirme |
| `docs` | Dokümantasyon |
| `data` | Dummy data ekleme/güncelleme |
| `chore` | Konfigürasyon, setup |

### Örnekler

```bash
feat(#3): Skills Agent AI analiz servisi eklendi
fix(#7): EmailCard hover efekti düzeltildi
style(#10): MeetingPanel responsive layout
data(#2): 20 dummy e-posta eklendi
docs(#15): README kurulum talimatları güncellendi
```

---

## 6. Yorum Yazma Kuralları

### Yiğit (Backend)
```javascript
// Performans odaklı, kısa ve teknik yorumlar
// O(n) complexity — single pass scoring
const calculatePriority = (factors) => { ... };
```

### Ümmühan & Ömer (Frontend)
```jsx
// Okunabilirlik yüksek, açıklayıcı yorumlar
// Bu komponent gelen e-postaları öncelik sırasına göre
// renkli kartlar halinde listeler. Acil olanlar kırmızı
// kenarlıkla vurgulanır.
const EmailList = ({ emails }) => { ... };
```

---

## 7. Tailwind Tasarım Tokenleri

```javascript
// tailwind.config.js içinde kullanılacak renk paleti
colors: {
  primary:    '#6366F1',  // Indigo — ana marka rengi
  secondary:  '#8B5CF6',  // Violet — ikincil
  accent:     '#06B6D4',  // Cyan — vurgu
  success:    '#10B981',  // Emerald — başarı
  warning:    '#F59E0B',  // Amber — uyarı
  danger:     '#EF4444',  // Red — tehlike/acil
  surface:    '#1E1B2E',  // Koyu arka plan
  card:       '#2A2740',  // Kart arka planı
  text:       '#E2E8F0',  // Ana metin
  muted:      '#94A3B8',  // İkincil metin
}
```

### Öncelik Renk Kodları

| Öncelik | Renk | Tailwind Class |
|---|---|---|
| 🔴 Acil | Kırmızı | `bg-red-500/20 border-red-500` |
| 🟠 Yüksek | Turuncu | `bg-orange-500/20 border-orange-500` |
| 🟡 Normal | Sarı | `bg-yellow-500/20 border-yellow-500` |
| 🟢 Düşük | Yeşil | `bg-green-500/20 border-green-500` |

---

## 8. Dosya Boyutu Limitleri

| Dosya Tipi | Maksimum Satır |
|---|---|
| Komponent dosyası | 200 satır |
| Servis dosyası | 300 satır |
| Route dosyası | 100 satır |
| JSON veri dosyası | 500 satır |

> Limit aşılırsa dosyayı parçala.

---

*Bu kurallar hackathon süresince geçerlidir. İhlal eden commit reddedilir.*
