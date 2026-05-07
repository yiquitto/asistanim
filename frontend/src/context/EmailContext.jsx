import { createContext, useState, useContext, useEffect } from 'react';

const EmailContext = createContext();

export const useEmails = () => useContext(EmailContext);

// Initial emails from EmailInbox
const initialEmails = [
  {
    id: 1, sender: 'Ahmet Yılmaz (CEO)', email: 'ahmet.yilmaz@sirket.com',
    subject: 'ACİL: Q3 Bütçe Revizyonu — Bugün 17:00\'a Kadar',
    preview: 'Yönetim kurulu toplantısı öncesinde Q3 bütçe tahminlerinin güncellenmesi gerekiyor. Lütfen departman bazlı revizyonları bugün saat 17:00\'a kadar tamamlayıp finans direktörüne iletin.',
    time: '09:15', priority: 'urgent',
    scores: { impact: 9, urgency: 10, risk: 7, total: 8.85 }, category: 'approval',
    explanation: 'CEO\'dan gelen, yönetim kurulu toplantısı öncesi acil bütçe revizyonu talebi. Mali etki yüksek, zaman kısıtı çok dar (bugün 17:00). Gecikmesi halinde stratejik karar sürecini olumsuz etkiler.',
    risks: { phishing: 0, kvkk: 0, social_engineering: 0 },
    suggestedReply: 'Sayın Ahmet Bey,\n\nQ3 bütçe revizyonu üzerinde çalışmaya başladım. Departman bazlı güncellemeleri 16:30\'a kadar tamamlayıp onayınıza sunacağım.\n\nSaygılarımla',
    isRead: false, aiAnalyzed: true,
  },
  {
    id: 2, sender: 'Güvenlik Bildirimi', email: 'security@bankasi-giris.xyz',
    subject: 'Hesabınız askıya alındı — Hemen doğrulayın!',
    preview: 'Sayın müşterimiz, hesabınızda şüpheli bir giriş tespit edilmiştir. Hesabınızın askıya alınmaması için lütfen aşağıdaki bağlantıya tıklayarak kimliğinizi doğrulayın.',
    time: '09:42', priority: 'urgent',
    scores: { impact: 2, urgency: 3, risk: 10, total: 4.75 }, category: 'risk',
    explanation: 'Bu e-posta yüksek olasılıkla bir PHISHING girişimidir. Gönderen domain şüpheli (bankasi-giris.xyz), acil eylem çağrısı içeriyor, kişisel bilgi talep ediyor.',
    risks: { phishing: 9, kvkk: 2, social_engineering: 8 },
    suggestedReply: null, isRead: false, aiAnalyzed: true,
  },
  {
    id: 3, sender: 'Elif Kara (Pazarlama Md.)', email: 'elif.kara@sirket.com',
    subject: 'Yeni Kampanya Materyalleri — Geri Bildirim',
    preview: 'Merhaba, Q4 için hazırlanan dijital kampanya materyallerini ekte bulabilirsiniz. Bu hafta sonuna kadar geri bildirimlerinizi bekliyoruz.',
    time: '10:05', priority: 'normal',
    scores: { impact: 5, urgency: 5, risk: 1, total: 4.0 }, category: 'task',
    explanation: 'Pazarlama müdüründen gelen, bu hafta sonuna kadar geri bildirim gerektiren standart görev e-postası.',
    risks: { phishing: 0, kvkk: 0, social_engineering: 0 },
    suggestedReply: 'Merhaba Elif Hanım,\n\nKampanya materyallerini incelemeye aldım. Cuma gününe kadar detaylı geri bildirimlerimi ileteceğim.\n\nTeşekkürler',
    isRead: true, aiAnalyzed: true,
  },
  {
    id: 4, sender: 'HR Departmanı', email: 'ik@sirket.com',
    subject: 'Haziran Ayı İzin Planlaması',
    preview: 'Değerli çalışanlarımız, Haziran ayı yıllık izin planlaması için başvurularınızı 20 Mayıs\'a kadar İK portalı üzerinden yapmanız gerekmektedir.',
    time: '10:30', priority: 'low',
    scores: { impact: 3, urgency: 2, risk: 0, total: 1.9 }, category: 'info',
    explanation: 'İK departmanından bilgilendirme amaçlı toplu e-posta. Deadline 2 hafta sonra, aciliyet düşük.',
    risks: { phishing: 0, kvkk: 0, social_engineering: 0 },
    suggestedReply: null, isRead: true, aiAnalyzed: true,
  },
  {
    id: 5, sender: 'Mehmet Demir (Müşteri)', email: 'mehmet.demir@mustericorp.com',
    subject: 'SLA İhlali — Acil Çözüm Bekliyoruz',
    preview: 'Son 48 saattir destek talebimize yanıt alamadık. SLA anlaşmamıza göre 24 saat içinde yanıt verilmesi gerekiyordu.',
    time: '11:00', priority: 'high',
    scores: { impact: 8, urgency: 9, risk: 6, total: 8.05 }, category: 'complaint',
    explanation: 'Müşteriden gelen SLA ihlali şikayeti. Müşteri kaybı riski yüksek, yanıt süresi zaten aşılmış durumda.',
    risks: { phishing: 0, kvkk: 0, social_engineering: 0 },
    suggestedReply: 'Sayın Mehmet Bey,\n\nGecikmeden dolayı içtenlikle özür dileriz. Destek talebinizi en yüksek öncelikle ele aldık. 2 saat içinde detaylı geri dönüş yapacağız.\n\nSaygılarımızla',
    isRead: false, aiAnalyzed: true,
  },
  {
    id: 6, sender: 'Sistem Bildirimi', email: 'noreply@sirket.com',
    subject: 'Haftalık Sunucu Performans Raporu',
    preview: 'Bu hafta sunucu uptime oranı %99.7 olarak gerçekleşmiştir. CPU kullanımı ortalama %45, bellek kullanımı %62 seviyesindedir.',
    time: '08:00', priority: 'low',
    scores: { impact: 2, urgency: 1, risk: 1, total: 1.4 }, category: 'info',
    explanation: 'Otomatik sistem raporu. Bilgilendirme amaçlı, acil aksiyon gerektirmiyor.',
    risks: { phishing: 0, kvkk: 0, social_engineering: 0 },
    suggestedReply: null, isRead: true, aiAnalyzed: true,
  },
];

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState(() => {
    try {
      const saved = localStorage.getItem('asistanim_emails');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialEmails;
  });

  useEffect(() => {
    localStorage.setItem('asistanim_emails', JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    const es = new EventSource('http://localhost:3001/api/logs/stream');
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === 'new_email' && data.emailData) {
          setEmails(prev => {
            // Prevent duplicates
            if (prev.find(m => m.id === data.emailData.id)) return prev;
            return [data.emailData, ...prev];
          });
        }
      } catch (err) {}
    };
    return () => es.close();
  }, []);

  const updateEmail = (id, updates) => {
    setEmails(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const addEmail = (newEmail) => {
    setEmails(prev => [newEmail, ...prev]);
  };

  return (
    <EmailContext.Provider value={{ emails, setEmails, updateEmail, addEmail }}>
      {children}
    </EmailContext.Provider>
  );
};
