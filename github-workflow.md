# 🔀 Asistanim — Git İş Akışı Rehberi

> Hackathon boyunca kodların birbirine girmemesi için bu rehberi takip edin.

---

## 1. Branch Yapısı

```
main ─────────────────────────────────────── (🔒 PUSH YASAK — sadece sunum)
  │
  └── dev ────────────────────────────────── (🏗️ ana geliştirme toplanma alanı)
        │
        ├── feature/issue-1-dashboard-layout   (Ümmühan)
        ├── feature/issue-3-skills-agent       (Yiğit)
        ├── feature/issue-10-meeting-panel     (Ömer)
        └── feature/issue-XX-görev-adı         (kişisel dallar)
```

| Branch | Amaç | Kim Push Edebilir? |
|---|---|---|
| `main` | Sunum versiyonu, final kodu | ❌ Kimse (sadece Yiğit merge eder) |
| `dev` | Ana geliştirme birleştirme alanı | ⚠️ Sadece PR ile (direkt push yasak) |
| `feature/*` | Kişisel geliştirme dalları | ✅ İlgili geliştirici |

---

## 2. Görev Takibi: GitHub Issues

Her görev bir GitHub Issue ile eşleştirilir. Issue numarası branch adında ve commit mesajında yer alır.

```
Issue #3: Skills Agent AI Servisi
  → Branch: feature/issue-3-skills-agent
  → Commit: feat(#3): Skills Agent analiz motoru eklendi. Fixes #3
```

> **Kural:** Issue almadan branch açma. Hangi issue üzerinde çalıştığını her zaman bil.

---

## 3. Geliştirme Adımları (Adım Adım)

### 3.1 Göreve Başlarken

```bash
# 1. Dev branch'ine geç
git checkout dev

# 2. En güncel halini çek
git pull origin dev

# 3. Kendi feature branch'ini aç (issue numarasını kullan)
git checkout -b feature/issue-3-skills-agent
```

### 3.2 Geliştirme Sırasında

```bash
# Sık sık commit at, küçük parçalar halinde
git add .
git commit -m "feat(#3): IUR skorlama fonksiyonu eklendi"

# Uzun süre çalışıyorsan ara ara dev'den güncelle
git pull origin dev
```

### 3.3 Görev Bittiğinde

```bash
# 1. Son commit'ini at — mesaja "Fixes #X" yaz
git add .
git commit -m "feat(#3): Skills Agent tamamlandı. Fixes #3"

# 2. Branch'ini uzak repoya gönder
git push origin feature/issue-3-skills-agent
```

---

## 4. Pull Request (PR) Süreci

### 4.1 PR Açma

1. GitHub'a git
2. **"Compare & pull request"** butonuna tıkla
3. Ayarları kontrol et:
   - **Base:** `dev` ← **Compare:** `feature/issue-3-skills-agent`
4. PR başlığına issue numarasını yaz: `feat(#3): Skills Agent AI Servisi`
5. Açıklama kısmına:
   - Ne yaptığını kısaca yaz
   - Test edip etmediğini belirt
   - Varsa screenshot ekle

### 4.2 PR Onayı

- **Team Lead (Yiğit)** PR'ı review eder
- Sorun yoksa **Approve + Merge** yapar
- Sorun varsa yorum bırakır, geliştirici düzeltir

> ⚠️ **Kendi PR'ını kendin merge etme** (Yiğit hariç, son aşamada).

---

## 5. 🚨 Çakışma (Conflict) Çözümü

Çakışma çıkarsa panik yapma. Şu adımları izle:

```bash
# 1. Dev'in son halini çek
git pull origin dev

# 2. Çakışma mesajı gelecek — dosyayı aç
# VS Code'da şuna benzer kısımlar göreceksin:

<<<<<<< HEAD
  // Senin kodun
  const priority = calculateIUR(email);
=======
  // Dev'deki başkasının kodu
  const priority = getScore(email);
>>>>>>> dev

# 3. Doğru olanı bırak, yanlış olanı sil
# <<<<<<< HEAD, =======, >>>>>>> satırlarını tamamen kaldır

# 4. Kaydet, ekle, commit'le
git add .
git commit -m "merge: dev conflict çözüldü"

# 5. Tekrar push'la
git push origin feature/issue-3-skills-agent
```

> 💡 **İpucu:** Çakışmayı çözemiyorsan Yiğit'i çağır. Birlikte bakarsınız.

---

## 6. Commit Mesajı Formatı

```
<tip>(#issue): <kısa açıklama>
```

| Tip | Ne Zaman? | Örnek |
|---|---|---|
| `feat` | Yeni özellik | `feat(#3): Skills Agent eklendi` |
| `fix` | Hata düzeltme | `fix(#7): EmailCard render hatası` |
| `style` | UI/tasarım | `style(#10): MeetingPanel renkleri` |
| `data` | Veri ekleme | `data(#2): 20 dummy e-posta eklendi` |
| `docs` | Dokümantasyon | `docs: README güncellendi` |
| `chore` | Konfigürasyon | `chore: Tailwind config ayarlandı` |
| `merge` | Birleştirme | `merge: dev conflict çözüldü` |

> **Son commit'e `Fixes #X` yazmayı unutma** — Issue otomatik kapanır.

---

## 7. Acil Durum Komutları

```bash
# Son commit'i geri al (push etmediysen)
git reset --soft HEAD~1

# Değişiklikleri geçici sakla
git stash
git stash pop

# Branch'ını dev ile senkronize et
git checkout feature/issue-X
git merge dev

# Yanlış branch'taysan
git checkout dev
```

---

## 8. Zaman Çizelgesi Özeti

| Saat | Git Aktivitesi |
|---|---|
| 0–1 | Repo kurulum, branch oluşturma, ilk commitler |
| 1–3 | Feature branch'lerde paralel geliştirme |
| 3–4 | PR'lar açılır → Yiğit review + merge → dev birleşir |
| 4–4:30 | `dev → main` final merge |
| 4:30–5 | ❄️ Kod dondurma — sadece sunum hazırlığı |

---

## 9. Altın Kurallar

1. ❌ **Asla `main`'e direkt push yapma**
2. ❌ **Asla `dev`'e direkt push yapma** (PR ile)
3. ✅ **Her zaman kendi feature branch'inde çalış**
4. ✅ **Push'tan önce `git pull origin dev` çek**
5. ✅ **Commit mesajına Issue numarası yaz**
6. ✅ **PR açmadan önce kendi kodunu test et**
7. 🆘 **Takılırsan Yiğit'i çağır — 5 saat kısa**

---

*Asistanim Git Workflow · Hackathon 2026-05-06*
