import { useState } from 'react';
import { Users, Clock, CheckCircle2, MessageSquare, User, Sparkles, UploadCloud, FileAudio, Loader2, X, Download, FileText, ChevronRight } from 'lucide-react';

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

const PIPELINE = [
  { key: 'upload',       label: 'Dosya Yükleniyor',            icon: UploadCloud, color: 'text-secondary',  duration: 4000, detail: 'Ses dosyası güvenli sunucuya aktarılıyor...' },
  { key: 'format',       label: 'Format Algılama',             icon: FileAudio,   color: 'text-primary',    duration: 2000, detail: 'Codec: AAC 128kbps · Stereo · 44.1kHz · 47:12 dakika' },
  { key: 'noise',        label: 'Gürültü Filtreleme',          icon: FileAudio,   color: 'text-warning',    duration: 3500, detail: 'Arka plan gürültüsü temizleniyor (SNR: +18dB → +32dB)' },
  { key: 'stt',          label: 'Speech-to-Text (Whisper v3)', icon: Loader2,     color: 'text-accent',     duration: 6000, detail: 'Konuşma metne dönüştürülüyor... 4 konuşmacı algılandı' },
  { key: 'diarization',  label: 'Konuşmacı Ayrıştırma',       icon: Users,       color: 'text-secondary',  duration: 3000, detail: 'Konuşmacı 1: Yiğit · Konuşmacı 2: Ahmet · Konuşmacı 3: Ayşe · Konuşmacı 4: Can' },
  { key: 'analysis',     label: 'AI Analiz (Skills Agent)',    icon: Sparkles,    color: 'text-primary',    duration: 5000, detail: 'Özet çıkarılıyor, kararlar belirleniyor, aksiyonlar atanıyor...' },
  { key: 'tasks',        label: 'Görev Çıkarımı & Kayıt',     icon: CheckCircle2,color: 'text-accent',     duration: 2500, detail: '2 karar · 2 aksiyon maddesi · Verimlilik skoru hesaplandı' },
];

const MeetingPanel = () => {
  const [localMeetings, setLocalMeetings] = useState(meetings);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(-1);
  const [stageProgress, setStageProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setIsDone(false);
    setElapsedSeconds(0);
    setCurrentStageIdx(0);
    setStageProgress(0);

    // Elapsed time counter
    const elapsed = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    // Run pipeline stages sequentially
    const runPipeline = async () => {
      for (let i = 0; i < PIPELINE.length; i++) {
        setCurrentStageIdx(i);
        setStageProgress(0);

        const stage = PIPELINE[i];
        const steps = 20;
        const stepDuration = stage.duration / steps;

        // Animate progress for this stage
        for (let s = 1; s <= steps; s++) {
          await new Promise(r => setTimeout(r, stepDuration));
          // Add slight randomness to feel realistic
          const jitter = Math.random() * 8 - 4;
          setStageProgress(Math.min(100, Math.round((s / steps) * 100 + jitter)));
        }
        setStageProgress(100);
        await new Promise(r => setTimeout(r, 400)); // brief pause between stages
      }

      // Done — add new meeting
      clearInterval(elapsed);
      setIsDone(true);

      const newMeeting = {
        id: Date.now(),
        isNew: true,
        title: 'Yeni Ürün Lansmanı Ön Toplantısı',
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' · 14:00 – 14:45',
        participants: ['Yiğit Aktaş', 'Ahmet Yılmaz', 'Ayşe Demir', 'Can Özkan'],
        summary: 'Lansman tarihi 20 Mayıs olarak netleştirildi. Sosyal medya bütçesi için ek onay bekleniyor. Geliştirme ekibi testleri yarına kadar tamamlayacak. Can Özkan prodüksiyon sürecini koordine edecek.',
        decisions: [
          'Lansman tarihi: 20 Mayıs 2026',
          'Beta testleri bugün bitirilecek',
        ],
        actions: [
          { task: 'Beta test raporunu yayınla', assignee: 'Yiğit Aktaş', deadline: '7 Mayıs' },
          { task: 'Bütçe onay formunu gönder', assignee: 'Ahmet Yılmaz', deadline: '7 Mayıs' },
        ],
        efficiency: 92,
      };

      setLocalMeetings(prev => [newMeeting, ...prev]);

      setTimeout(() => {
        setIsUploading(false);
        setCurrentStageIdx(-1);
        setIsDone(false);
      }, 3000);
    };

    runPipeline();
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8 animate-slide-up max-w-[1400px]">
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

      {/* Ses Yükleme & İşleme Alanı */}
      <div className={`bg-surface border-2 ${isUploading ? 'border-border' : 'border-dashed border-border hover:border-secondary/50'} rounded-2xl transition-all duration-300 relative overflow-hidden ${!isUploading ? 'group cursor-pointer' : ''}`}>
        {!isUploading && (
          <input type="file" accept="audio/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileUpload} />
        )}
        
        {!isUploading ? (
          <div className="flex flex-col items-center justify-center py-10 px-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-text font-semibold text-lg">Toplantı Ses Kaydını Yükle</p>
            <p className="text-sm text-text-muted mt-1.5">Sürükleyip bırakın veya tıklayarak seçin (MP3, WAV, M4A)</p>
            <p className="text-[10px] text-text-muted/60 mt-3">Whisper v3 · Konuşmacı Ayrıştırma · Skills Agent Analiz</p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Üst Bilgi Çubuğu */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <FileAudio className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{fileName}</p>
                  <p className="text-[10px] text-text-muted">AAC · 128kbps · 47:12</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-text-muted" />
                <span className="font-data text-sm text-text-secondary">{formatTime(elapsedSeconds)}</span>
              </div>
            </div>

            {/* Pipeline Adımları */}
            <div className="space-y-2">
              {PIPELINE.map((stage, i) => {
                const StageIcon = stage.icon;
                const isActive = i === currentStageIdx;
                const isCompleted = i < currentStageIdx || isDone;
                const isPending = i > currentStageIdx && !isDone;

                return (
                  <div key={stage.key} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-card border border-border' : isCompleted ? 'bg-accent/[0.04]' : 'opacity-40'
                  }`}>
                    {/* İkon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-accent/15' : isActive ? `bg-white/[0.06]` : 'bg-white/[0.03]'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      ) : isActive && stage.key === 'stt' ? (
                        <Loader2 className={`w-4 h-4 ${stage.color} animate-spin`} />
                      ) : (
                        <StageIcon className={`w-4 h-4 ${isActive ? stage.color : 'text-text-muted'} ${isActive ? 'animate-pulse' : ''}`} />
                      )}
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-xs font-semibold ${isCompleted ? 'text-accent' : isActive ? 'text-text' : 'text-text-muted'}`}>
                          {stage.label}
                        </span>
                        {isActive && (
                          <span className="font-data text-[10px] text-text-muted">{stageProgress}%</span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] text-accent">✓</span>
                        )}
                      </div>

                      {/* İlerleme Çubuğu (sadece aktif aşama) */}
                      {isActive && (
                        <div className="mt-1.5 space-y-1.5">
                          <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                stage.color.includes('accent') ? 'bg-accent' :
                                stage.color.includes('primary') ? 'bg-primary' :
                                stage.color.includes('warning') ? 'bg-warning' : 'bg-secondary'
                              }`}
                              style={{ width: `${stageProgress}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-text-muted">{stage.detail}</p>
                        </div>
                      )}

                      {/* Tamamlanan aşama detayı */}
                      {isCompleted && (
                        <p className="text-[10px] text-text-muted/60">{stage.detail}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tamamlandı Mesajı */}
            {isDone && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 animate-slide-up">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-accent">Analiz Tamamlandı!</p>
                  <p className="text-[10px] text-text-secondary">Toplantı özeti ve aksiyon maddeleri başarıyla çıkarıldı. {formatTime(elapsedSeconds)} sürdü.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {localMeetings.map((m) => (
          <div 
            key={m.id} 
            onClick={() => setSelectedMeeting(m)}
            className={`cursor-pointer group bg-card border ${m.isNew ? 'border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.2)] animate-in fade-in slide-in-from-top-4 duration-700' : 'border-border hover:border-secondary/30'} rounded-lg p-6 transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden flex flex-col`}
          >
            
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

            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Detayları İncele</span>
              <ChevronRight className="w-4 h-4 text-accent" />
            </div>
          </div>
        ))}
      </div>

      {/* --- DETAY MODALI --- */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#030509]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-text">{selectedMeeting.title}</h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedMeeting.efficiency >= 75 ? 'bg-success/10 text-success' : selectedMeeting.efficiency >= 60 ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                    % {selectedMeeting.efficiency} Verimlilik
                  </span>
                </div>
                <p className="text-sm text-text-muted flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {selectedMeeting.date}
                </p>
              </div>
              <button 
                onClick={() => setSelectedMeeting(null)}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-text-muted hover:text-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
              
              {/* Top Row: Info & Participants */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h3 className="text-sm font-bold text-text uppercase tracking-wide">Genişletilmiş AI Özeti</h3>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-elevated/40 border border-white/[0.04]">
                    <p className="text-sm text-text-secondary leading-relaxed">{selectedMeeting.summary}</p>
                    <p className="text-sm text-text-secondary leading-relaxed mt-2 text-text-muted/80 italic">Toplantı kayıtlarına göre iletişim tonu yapıcı ve sonuç odaklıydı. Ana itiraz noktaları teknik kısıtlamalar üzerinde yoğunlaştı ancak uzlaşma sağlandı.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-secondary" />
                    <h3 className="text-sm font-bold text-text uppercase tracking-wide">Katılımcılar</h3>
                  </div>
                  <div className="p-4 rounded-lg bg-surface border border-white/[0.04] space-y-2">
                    {selectedMeeting.participants.map((p, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
                          <User className="w-3 h-3 text-secondary" />
                        </div>
                        <span className="text-xs text-text-secondary">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Decisions & Tasks */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <h3 className="text-sm font-bold text-text uppercase tracking-wide">Alınan Kararlar</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedMeeting.decisions.map((d, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded bg-success/[0.03] border border-success/10">
                        <span className="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                        <span className="text-xs text-text-secondary leading-relaxed pt-0.5">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-bold text-text uppercase tracking-wide">Aksiyon Maddeleri (Görevler)</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedMeeting.actions.map((a, i) => (
                      <div key={i} className="flex flex-col gap-2 p-3 rounded bg-primary/[0.03] border border-primary/10">
                        <span className="text-xs font-semibold text-text-secondary">{a.task}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">@{a.assignee}</span>
                          <span className="text-[10px] text-text-muted">📅 {a.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.06] flex items-center justify-between bg-surface/50 rounded-b-xl">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-text-muted">ID: MTG-{selectedMeeting.id}</span>
                <span className="text-[10px] text-text-muted border-l border-white/10 pl-3">Transkript: Kaydedildi</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-white/10 text-text hover:bg-white/5 transition-colors text-xs font-bold">
                  <FileText className="w-4 h-4" /> Transkript
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors text-xs font-bold">
                  <Download className="w-4 h-4" /> Dışa Aktar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingPanel;
