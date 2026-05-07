import { analyzeEmail } from './skillsAgent.js';
import { broadcast } from './logBroadcaster.js';

const RANDOM_EMAILS = [
  {
    sender: 'finans@sirket.com',
    subject: 'Q3 Bütçe Revizyonu ve Acil Onay',
    body: 'Merhaba Yiğit, Yönetim kurulu kararı ile Q3 dijital pazarlama bütçesi %15 artırıldı. Yeni bütçe tablosu ektedir. Lütfen bu hafta onaylayınız. İyi çalışmalar.',
  },
  {
    sender: 'ik@sirket.com',
    subject: 'Gizli: Yeni İşe Alım Politikası (KVKK)',
    body: 'Değerli çalışanlarımız, yeni KVKK regülasyonlarına göre çalışan verilerinin saklanma süresi değiştirilmiştir. Adayların TC Kimlik ve iletişim bilgileri (örneğin telefon ve ev adresleri) işe alımdan 6 ay sonra silinmelidir. Lütfen ekteki gizlilik taahhütnamesini imzalayın.',
  },
  {
    sender: 'noreply@security-alert-it.com',
    subject: 'URGENT: Microsoft 365 Password Expiration Notice',
    body: 'Dear user, your Office 365 password will expire in 2 hours. Please click this link http://login-microsoft-auth-update.xyz to update your credentials immediately to avoid account suspension. Thank you, IT Security Team.',
  },
  {
    sender: 'ahmet.yilmaz@musteri.com',
    subject: 'Sözleşme Yenileme Toplantısı',
    body: 'Merhaba, yıllık hizmet sözleşmemizin yenilenmesi hakkında önümüzdeki salı günü saat 14:00\'te bir online toplantı planlamak istiyoruz. Katılım durumunuzu bildirirseniz sevinirim.',
  },
  {
    sender: 'ceo@sirket.com',
    subject: 'Acil: Müşteri Veri İhlali Şüphesi',
    body: 'Yiğit acil durum, CRM sistemimize yurt dışından yetkisiz erişim yapılmış olabilir. Veri tabanındaki şifreli müşteri bilgileri sızmış olabilir. Derhal IT loglarını kontrol edip bana rapor ver!',
  },
  {
    sender: 'destek@sistemsaglayici.com',
    subject: 'Bakım Kesintisi Bildirimi',
    body: 'Değerli müşterimiz, sunucularımızda 15 Mayıs Cuma gecesi 02:00 - 04:00 saatleri arasında planlı bakım çalışması yapılacaktır. Bu süreçte hizmetlerimizde kısa süreli kesintiler yaşanabilir.',
  },
  {
    sender: 'pazarlama@sirket.com',
    subject: 'Yeni Reklam Kampanyası Görselleri Onayı',
    body: 'Selamlar, Önümüzdeki hafta başlayacak olan sosyal medya kampanyası için ajansın hazırladığı görseller ektedir. Tasarımları inceleyip bugün mesai bitimine kadar onay verir misin?',
  },
  {
    sender: 'avukat@hukukburosu.com',
    subject: 'Dava Dosyası: İşçi Çıkış Bildirgesi İhtarı',
    body: 'Müvekkilimiz adına gönderdiğimiz ihtarname ektedir. Eski çalışanınızın açtığı dava ile ilgili savunma dilekçesini hazırlayabilmemiz için bordro kayıtlarını acil olarak bize ulaştırınız.',
  },
  {
    sender: 'info@kripto-borsasi-guvenlik.net',
    subject: 'Cüzdanınıza Yeni Cihazdan Giriş Yapıldı',
    body: 'Hesabınıza Rusya konumlu yeni bir cihazdan giriş yapılmıştır. Eğer bu işlemi siz yapmadıysanız, paranızın çalınmaması için hemen tıklayıp şifrenizi sıfırlayın: http://kripto-borsasi-guvenlik.net/reset',
  },
  {
    sender: 'insankaynaklari@sirket.com',
    subject: 'Yıllık Sağlık Taraması Randevuları',
    body: 'Değerli ekip arkadaşlarımız, şirketimizin her yıl düzenlediği rutin sağlık taraması bu ay yapılacaktır. Hemşire hanım 2. katta olacaktır. Randevu almak için lütfen bu maili yanıtlayın.',
  },
  {
    sender: 'satis@sirket.com',
    subject: 'Büyük Satış! Yeni Müşteri Kazanımı',
    body: 'Ekip harika bir haberim var! Aylardır peşinde koştuğumuz holding ihalesini sonunda kazandık. Yıllık sözleşme bedeli beklentilerimizin bile üstünde. Kutlama için cuma akşamı buluşalım!',
  },
  {
    sender: 'vendor-portal@tedarikci.com',
    subject: 'Fatura Ödemesi Gecikti',
    body: 'Sayın Yetkili, 45293 numaralı faturanızın son ödeme tarihi dün geçmiştir. Muhasebe sistemimiz gecikme faizi işletmeden önce lütfen gün içinde ödemeyi gerçekleştiriniz. Fatura kopyası ektedir.',
  },
  {
    sender: 'compliance@sirket.com',
    subject: 'Gizli Veri Paylaşımı İhlali Tespiti',
    body: 'Sistem loglarımızda, müşteri kredi kartı bilgilerini içeren bir Excel dosyasının kurum dışı bir e-posta adresine iletildiği tespit edilmiştir. Bu açık bir KVKK ihlalidir, acil olarak konuyu inceleyiniz.',
  },
  {
    sender: 'etkinlik@organizasyon.com',
    subject: 'Yıl Sonu Galası Davetiyesi',
    body: 'Şirketinizin başarılarını kutlayacağımız geleneksel yıl sonu balosu davetiyeniz ektedir. Masanız rezerve edilmiştir, lütfen menü tercihlerinizi yarına kadar bize iletin.',
  },
  {
    sender: 'admin@bulut-depolama.org',
    subject: 'Hesap Doğrulama Gerekli',
    body: 'Sistem güncellemesi sebebiyle bulut deponuz geçici olarak donduruldu. Dosyalarınızı kaybetmemek için kimlik bilgilerinizi güncelleyin: http://bulut-depolama-login.org/auth',
  },
  {
    sender: 'proje.yonetimi@sirket.com',
    subject: 'Sprint 14 Planlama Toplantısı Notları',
    body: 'Arkadaşlar, bugünkü sprint planlama toplantısında alınan kararlar Jira\'ya girilmiştir. Backend ekibi ödeme entegrasyonuna öncelik verecek. Gecikme istemiyoruz.',
  },
  {
    sender: 'muhasebe@sirket.com',
    subject: 'Personel Maaş Avans Talepleri',
    body: 'Bu ay için maaş avansı talep eden personellerin listesi ve IBAN numaraları ekli Excel dosyasındadır. İşlem yapmadan önce yöneticilerin onayını almayı unutmayın.',
  },
  {
    sender: 'musteri.hizmetleri@sirket.com',
    subject: 'Önemli: Şikayet Var Krizi',
    body: 'Şikayetvar portalında şirketimiz hakkında son 2 saatte 50\'den fazla olumsuz yorum yapıldı. Görünüşe göre sistemsel bir hata müşterilerden çift para çekmiş. Kriz yönetimi acil toplansın!',
  },
  {
    sender: 'ofis-yonetimi@sirket.com',
    subject: 'Otopark Kullanımı Hakkında',
    body: 'Değerli çalışanlar, ofisimizin misafir otoparkına şirket araçlarının park edildiği gözlemlenmiştir. Lütfen araçlarınızı sadece personel otoparkına bırakınız, aksi halde güvenlik işlem yapacaktır.',
  },
  {
    sender: 'noreply@kargo-sirketi-takip.net',
    subject: 'Kargonuz Teslim Edilemedi',
    body: 'Adresinizde bulunamadığınız için kargonuz şubemize geri dönmüştür. Tekrar dağıtıma çıkması için lütfen 15 TL işlem ücretini ödeyiniz: http://kargo-sirketi-takip.net/odeme',
  }
];

let simulatorInterval = null;
let unusedEmails = [];

const generateRandomEmail = async () => {
  if (unusedEmails.length === 0) {
    unusedEmails = [...RANDOM_EMAILS].sort(() => Math.random() - 0.5);
  }
  
  const baseEmail = unusedEmails.pop();
  const uniqueId = Math.floor(Math.random() * 90000) + 10000;
  
  const emailData = {
    sender: baseEmail.sender,
    subject: `[ID:${uniqueId}] ${baseEmail.subject}`,
    body: baseEmail.body,
    date: new Date().toISOString()
  };

  broadcast('📨', `Yeni e-posta bağlantısı kuruldu — Gönderen: ${emailData.sender}`, 'info');
  
  try {
    const analysis = await analyzeEmail(emailData);
    
    if (analysis.suggestedReply) {
      broadcast('📝', `AI Taslak Yanıt Oluşturdu: "${analysis.suggestedReply.substring(0, 60)}..."`, 'success');
    }

    // E-posta kutusuna düşürmek için event
    broadcast('📥', 'E-posta analizi tamamlandı ve sisteme aktarıldı.', 'info', {
      event: 'new_email',
      emailData: { 
        id: Date.now(),
        sender: emailData.sender,
        email: emailData.sender,
        subject: emailData.subject,
        preview: emailData.body.substring(0, 150),
        body: emailData.body,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        category: analysis.category || 'info',
        priority: analysis.priority || 'normal',
        scores: analysis.scores || { impact: 5, urgency: 5, risk: 1, total: 4.0 },
        explanation: analysis.explanation || 'Arka plan analizi tamamlandı.',
        risks: analysis.risks || { phishing: 0, kvkk: 0, social_engineering: 0 },
        summary: analysis.summary,
        suggestedReply: analysis.suggestedReply,
        suggestedTasks: analysis.suggestedTasks,
        isNew: true,
        isRead: false,
        aiAnalyzed: true
      }
    });

    if (analysis.risks && analysis.risks.phishing >= 7) {
      broadcast('🚨', `KRİTİK RİSK: Yüksek phishing ihtimali tespit edildi! (${analysis.scores.total} puan)`, 'error', { 
        event: 'new_risk', 
        riskData: { ...analysis, emailData } 
      });
    } else if (analysis.risks && analysis.risks.kvkk_violation >= 6) {
      broadcast('⚠️', `RİSK: Potansiyel KVKK ihlali tespit edildi! (${analysis.scores.total} puan)`, 'warning', { 
        event: 'new_risk', 
        riskData: { ...analysis, emailData } 
      });
    }

  } catch (error) {
    broadcast('❌', `Bağlantı hatası: ${error.message}`, 'error');
  }
};

export const startMailSimulator = () => {
  if (simulatorInterval) return;
  
  broadcast('🤖', 'E-Posta Analiz Motoru arka planda dinleniyor. (Aktif - 30s-40s periyot)', 'success');
  
  const scheduleNext = () => {
    // 40-55 saniye aralığında rastgele bekleme süresi
    const delay = Math.floor(Math.random() * (55000 - 40000 + 1)) + 40000;
    
    simulatorInterval = setTimeout(async () => {
      await generateRandomEmail();
      scheduleNext(); // Döngüyü devam ettir
    }, delay);
  };

  scheduleNext();
};

export const stopMailSimulator = () => {
  if (simulatorInterval) {
    clearTimeout(simulatorInterval);
    simulatorInterval = null;
    broadcast('🛑', 'E-Posta Analiz Motoru durduruldu.', 'info');
  }
};
