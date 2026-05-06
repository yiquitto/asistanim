import { useState } from 'react';
import { Users, Clock, CheckCircle2, MessageSquare, User, Sparkles, UploadCloud, FileAudio, Loader2 } from 'lucide-react';

/**
 * ⚠️ [SIMULATION] — Bu modül hackathon demo amaçlıdır.
 * Gerçek veri kaynağına bağlı değildir, hardcoded/dummy veri kullanır.
 * Production versiyonunda gerçek toplantı transkript entegrasyonu yapılacaktır.
 */

const meetings = [
  {
    id: 1,
    title: 'Q3 Pazarlama Strateji Toplantısı',
    date: '6 Mayıs 2026 · 10:00 – 11:30',
    participants: ['Elif Kara', 'Ahmet Yılmaz', 'Zeynep Aydın', 'Murat Öz'],
    summary: 'Q3 dijital pazarlama bütçesi %15 artırılması kararı alındı. Sosyal medya kampanyalarında video içerik ağırlıklı stratejiye geçilmesi önerildi. Rakip analizi raporunun güncellenmesi istendi.',
    decisions: [
      'Dijital pazarlama bütçesi %15 artırılacak',
      'Video içerik prodüksiyonu için ajans araştırılacak',
      'Instagram Reels ve TikTok kampanyalarına öncelik verilecek',
    ],
    actions: [
      { task: 'Ajans tekliflerini topla ve karşılaştır', assignee: 'Elif Kara', deadline: '12 Mayıs' },
      { task: 'Rakip sosyal medya analiz raporunu güncelle', assignee: 'Zeynep Aydın', deadline: '9 Mayıs' },
      { task: 'Video prodüksiyon bütçe taslağı hazırla', assignee: 'Murat Öz', deadline: '14 Mayıs' },
      { task: 'Yönetim kuruluna strateji sunumu hazırla', assignee: 'Elif Kara', deadline: '16 Mayıs' },
    ],
    efficiency: 78,
  },
  {
    id: 2,
    title: 'Teknik Altyapı Değerlendirme',
    date: '5 Mayıs 2026 · 14:00 – 15:00',
    participants: ['Yiğit Aktaş', 'Can Demir', 'Selin Yıldız'],
    summary: 'Mevcut sunucu kapasitesinin Q4 yoğunluğuna yetmeyeceği değerlendirildi. Cloud migration planı oluşturulması kararlaştırıldı.',
    decisions: [
      'AWS\'den Azure\'a geçiş değerlendirilecek',
      'Kubernetes cluster kurulumu planlanacak',
    ],
    actions: [
      { task: 'Azure maliyet analizi hazırla', assignee: 'Can Demir', deadline: '10 Mayıs' },
      { task: 'K8s migration dokümantasyonu oluştur', assignee: 'Yiğit Aktaş', deadline: '15 Mayıs' },
    ],
    efficiency: 85,
  },
  {
    id: 3,
    title: 'Haftalık Satış Değerlendirmesi',
    date: '5 Mayıs 2026 · 09:00 – 09:45',
    participants: ['Burak Şen', 'Ayşe Koç', 'Deniz Tekin'],
    summary: 'Nisan ayı satış hedeflerinin %92 oranında gerçekleştiği raporlandı. Yeni müşteri edinim oranı beklentinin altında kaldı.',
    decisions: [
      'Outbound satış ekibine ek kaynak ayrılacak',
      'Demo süreçleri kısaltılacak',
    ],
    actions: [
      { task: 'Yeni lead generation stratejisi öner', assignee: 'Ayşe Koç', deadline: '8 Mayıs' },
      { task: 'Demo süreç akışını optimize et', assignee: 'Deniz Tekin', deadline: '12 Mayıs' },
    ],
    efficiency: 62,
  },
  {
    id: 4,
    title: 'Müşteri Başarı Ekibi Retrospektifi',
    date: '4 Mayıs 2026 · 15:30 – 16:15',
    participants: ['Selin Yıldız', 'Burak Şen', 'Deniz Tekin'],
    summary: 'Nisan ayında müşteri memnuniyeti %88\'e yükseldi. Churn oranı %2.1 olarak gerçekleşti. Öncelikli şikayet konusu entegrasyon süreçlerinin yavaşlığı olarak belirlendi.',
    decisions: [
      'Entegrasyon süreçleri için self-service portal geliştirilecek',
      'Churn riski yüksek hesaplara özel destek atanılacak',
    ],
    actions: [
      { task: 'Self-service portal wireframe hazırla', assignee: 'Selin Yıldız', deadline: '11 Mayıs' },
      { task: 'Risk skoru yüksek 10 hesabı listele', assignee: 'Deniz Tekin', deadline: '8 Mayıs' },
    ],
    efficiency: 74,
  },
  {
    id: 5,
    title: 'İK Politikaları Gözden Geçirme',
    date: '3 Mayıs 2026 · 11:00 – 12:00',
    participants: ['Ayşe Koç', 'Murat Öz', 'Zeynep Aydın'],
    summary: 'Hibrit çalışma modeli kalıcı hale getirildi. Hafta 3 gün ofis, 2 gün uzaktan çalışma standardı belirlendi. Yıllık izin politikasında güncelleme yapılacak.',
    decisions: [
      'Hibrit model: 3 ofis / 2 uzaktan',
      'Yıllık izin hakkı 22 güne çıkarılacak',
    ],
    actions: [
      { task: 'İK politika dokümanını güncelle', assignee: 'Ayşe Koç', deadline: '10 Mayıs' },
      { task: 'Çalışan memnuniyet anketi hazırla', assignee: 'Zeynep Aydın', deadline: '13 Mayıs' },
    ],
    efficiency: 81,
  },
];

const MeetingPanel = () => {
  const [localMeetings, setLocalMeetings] = useState(meetings);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStage('uploading');
    setProgress(0);

    // Fake upload progress
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setUploadStage('transcribing');
        
        // Transcribing phase
        setTimeout(() => {
          setUploadStage('analyzing');
          
          // Analyzing phase
          setTimeout(() => {
            setUploadStage('done');
            
            // Add new mock meeting
            const newMeeting = {
              id: Date.now(),
              isNew: true,
              title: 'Yeni Ürün Lansmanı Ön Toplantısı',
              date: '6 Mayıs 2026 · 14:00 – 14:45',
              participants: ['Yiğit Aktaş', 'Ahmet Yılmaz', 'Ayşe Demir'],
              summary: 'Lansman tarihi 20 Mayıs olarak netleştirildi. Sosyal medya bütçesi için ek onay bekleniyor. Geliştirme ekibi testleri yarına kadar tamamlayacak.',
              decisions: [
                'Lansman tarihi: 20 Mayıs 2026',
                'Beta testleri bugün bitecek'
              ],
              actions: [
                { task: 'Beta test raporunu yayınla', assignee: 'Yiğit Aktaş', deadline: '7 Mayıs' },
                { task: 'Bütçe onay formunu gönder', assignee: 'Ahmet Yılmaz', deadline: '7 Mayıs' }
              ],
              efficiency: 92,
            };
            
            setLocalMeetings([newMeeting, ...localMeetings]);
            
            // Finish
            setTimeout(() => {
              setIsUploading(false);
              setUploadStage('');
            }, 2500);
            
          }, 3000);
        }, 3000);
      }
    }, 400);
  };

  return (
    <div className="p-6 space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            Toplantı Zekâsı
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Toplantı kayıtlarından otomatik özet ve aksiyon çıkarımı
          </p>
        </div>
      </div>

      {/* Ses Yükleme Alanı (Wizard of Oz) */}
      <div className={`bg-surface border-2 border-dashed border-border rounded-xl p-8 text-center transition-all duration-300 relative overflow-hidden ${!isUploading ? 'hover:bg-surface-elevated hover:border-secondary/50 group cursor-pointer' : ''} mb-6`}>
        {!isUploading && (
          <input type="file" accept="audio/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileUpload} />
        )}
        
        {!isUploading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-text font-semibold text-lg">Toplantı Ses Kaydını Yükle</p>
            <p className="text-sm text-text-muted mt-1.5">Sürükleyip bırakın veya tıklayarak seçin (MP3, WAV)</p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {uploadStage === 'uploading' && (
              <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300">
                 <FileAudio className="w-10 h-10 text-secondary animate-pulse" />
                 <p className="text-base font-medium text-text">Ses dosyası güvenli sunucuya yükleniyor...</p>
                 <div className="w-64 h-2.5 bg-background rounded-full overflow-hidden mt-2 border border-border">
                   <div className="h-full bg-secondary transition-all duration-300" style={{width: `${progress}%`}}></div>
                 </div>
              </div>
            )}
            {uploadStage === 'transcribing' && (
              <div className="flex flex-col items-center gap-3 text-accent animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <Loader2 className="w-10 h-10 animate-spin" />
                 <p className="text-base font-medium">Speech-to-Text motoru devrede (Transkripsiyon)...</p>
              </div>
            )}
            {uploadStage === 'analyzing' && (
              <div className="flex flex-col items-center gap-3 text-primary animate-in fade-in zoom-in-95 duration-500">
                 <Sparkles className="w-10 h-10 animate-pulse" />
                 <p className="text-base font-medium">Skills Agent metni analiz ediyor ve görevleri çıkarıyor...</p>
              </div>
            )}
            {uploadStage === 'done' && (
              <div className="flex flex-col items-center gap-3 text-success animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <CheckCircle2 className="w-10 h-10" />
                 <p className="text-base font-medium">Analiz başarıyla tamamlandı! Sonuçlar ekleniyor...</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {localMeetings.map((m) => (
          <div key={m.id} className={`bg-card border ${m.isNew ? 'border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.2)] animate-in fade-in slide-in-from-top-4 duration-700' : 'border-border hover:border-secondary/20'} rounded-2xl p-5 transition-all relative overflow-hidden`}>
            
            {m.isNew && (
              <div className="absolute top-0 right-0 bg-primary text-background text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                YENİ ANALİZ
              </div>
            )}
            {/* Toplantı Başlık */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-text">{m.title}</h3>
                <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" /> {m.date}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-text-muted">Verimlilik</p>
                <p className={`text-lg font-bold ${m.efficiency >= 75 ? 'text-success' : m.efficiency >= 60 ? 'text-warning' : 'text-danger'}`}>
                  %{m.efficiency}
                </p>
              </div>
            </div>

            {/* Katılımcılar */}
            <div className="flex items-center gap-1 mb-3">
              {m.participants.map((p, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-elevated text-[10px] text-text-secondary">
                  <User className="w-2.5 h-2.5" /> {p}
                </span>
              ))}
            </div>

            {/* Özet */}
            <div className="p-3 rounded-xl bg-surface-elevated/50 mb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] font-semibold text-accent">AI Özeti</span>
              </div>
              <p className="text-sm text-text-secondary">{m.summary}</p>
            </div>

            {/* Kararlar */}
            <div className="mb-3">
              <p className="text-[11px] font-semibold text-text-muted uppercase mb-1.5">Kararlar</p>
              {m.decisions.map((d, i) => (
                <div key={i} className="flex items-start gap-2 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-text-secondary">{d}</span>
                </div>
              ))}
            </div>

            {/* Aksiyonlar */}
            <div>
              <p className="text-[11px] font-semibold text-text-muted uppercase mb-1.5">Aksiyon Maddeleri</p>
              <div className="space-y-1.5">
                {m.actions.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-surface-elevated/30 text-xs">
                    <MessageSquare className="w-3 h-3 text-primary flex-shrink-0" />
                    <span className="flex-1 text-text-secondary">{a.task}</span>
                    <span className="text-accent">@{a.assignee.split(' ')[0]}</span>
                    <span className="text-text-muted">{a.deadline}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingPanel;
