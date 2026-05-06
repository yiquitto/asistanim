import { Users, Clock, CheckCircle2, MessageSquare, User, Sparkles } from 'lucide-react';

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
];

const MeetingPanel = () => {
  return (
    <div className="p-6 space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            Toplantı Zekâsı
          </h2>
          <p className="text-sm text-text-secondary mt-0.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning/20 text-warning font-bold mr-2">MOCK</span>
            Toplantı kayıtlarından otomatik özet ve aksiyon çıkarımı
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {meetings.map((m) => (
          <div key={m.id} className="bg-card border border-border rounded-2xl p-5 hover:border-secondary/20 transition-colors">
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
