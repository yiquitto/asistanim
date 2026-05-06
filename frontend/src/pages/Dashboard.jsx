import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, CheckSquare, Users, ShieldAlert,
  TrendingUp, TrendingDown, Clock, AlertTriangle,
  ArrowRight, Zap, Brain
} from 'lucide-react';
import { checkHealth } from '../services/api';

/**
 * ══════════════════════════════════════════════
 *  Bu katman Skills Agent tarafından optimize
 *  edilmiştir.
 *  Fonksiyon: CEO Dashboard — Tüm modüllerin özet görünümü
 * ══════════════════════════════════════════════
 */

// Dashboard özet kartları için metrikler
const metrics = [
  {
    label: 'İşlenmemiş E-Posta',
    value: 12,
    change: -68,
    icon: Mail,
    color: 'text-primary',
    bg: 'bg-primary/10',
    link: '/email',
  },
  {
    label: 'Aktif Görevler',
    value: 8,
    change: -42,
    icon: CheckSquare,
    color: 'text-accent',
    bg: 'bg-accent/10',
    link: '/tasks',
  },
  {
    label: 'Bugünkü Toplantılar',
    value: 3,
    change: 0,
    icon: Users,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    link: '/meetings',
  },
  {
    label: 'Risk Uyarıları',
    value: 2,
    change: -1,
    icon: ShieldAlert,
    color: 'text-danger',
    bg: 'bg-danger/10',
    link: '/risks',
  },
];

// Son AI aktiviteleri (dummy)
const recentActivities = [
  {
    id: 1,
    type: 'email',
    text: 'CEO\'dan gelen bütçe revizyonu e-postası ACİL olarak önceliklendirildi',
    time: '2 dk önce',
    priority: 'urgent',
  },
  {
    id: 2,
    type: 'task',
    text: 'Q3 raporlama görevi otomatik oluşturuldu ve atandı',
    time: '5 dk önce',
    priority: 'high',
  },
  {
    id: 3,
    type: 'risk',
    text: 'Şüpheli phishing e-postası tespit edildi ve karantinaya alındı',
    time: '12 dk önce',
    priority: 'urgent',
  },
  {
    id: 4,
    type: 'meeting',
    text: 'Pazarlama toplantısı özeti ve 4 aksiyon maddesi çıkarıldı',
    time: '1 saat önce',
    priority: 'normal',
  },
  {
    id: 5,
    type: 'email',
    text: 'Müşteri şikayetine otomatik yanıt taslağı hazırlandı',
    time: '1.5 saat önce',
    priority: 'high',
  },
];

// Verimlilik metrikleri
const efficiencyStats = [
  { label: 'E-Posta Yükü Azalması', value: 72, target: 70, unit: '%' },
  { label: 'Görev Otomasyon Oranı', value: 85, target: 80, unit: '%' },
  { label: 'Ortalama Yanıt Süresi', value: 3.2, target: 5, unit: 'dk' },
  { label: 'Risk Tespit Doğruluğu', value: 94, target: 90, unit: '%' },
];

const priorityColors = {
  urgent: 'bg-danger/20 text-danger',
  high: 'bg-warning/20 text-warning',
  normal: 'bg-primary/20 text-primary',
  low: 'bg-success/20 text-success',
};

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [backendStatus, setBackendStatus] = useState('loading');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const health = await checkHealth();
        if (health.status === 'active') {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        setBackendStatus('offline');
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">CEO Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            <Clock className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
            {currentTime.toLocaleDateString('tr-TR', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
            {' · '}
            {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs ${backendStatus === 'online' ? 'text-accent' : 'text-danger'}`}>
          {backendStatus === 'online' ? <Brain className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span className="font-medium">
            {backendStatus === 'loading' ? 'Bağlanıyor...' : backendStatus === 'online' ? 'Skills Agent Çalışıyor' : 'Skills Agent Çevrimdışı'}
          </span>
          <span className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-success animate-pulse-soft' : backendStatus === 'loading' ? 'bg-warning animate-pulse' : 'bg-danger'}`} />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Link
            key={m.label}
            to={m.link}
            className="group bg-card hover:bg-card-hover border border-border rounded-2xl p-5 transition-all duration-300 hover:border-primary/30 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${m.bg}`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-bold text-text">{m.value}</p>
            <p className="text-xs text-text-muted mt-1">{m.label}</p>
            {m.change !== 0 && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${m.change < 0 ? 'text-success' : 'text-danger'}`}>
                {m.change < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                <span>{Math.abs(m.change)}% AI ile azaltıldı</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Son AI Aktiviteleri */}
        <div className="col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text">Son AI Aktiviteleri</h2>
            <Zap className="w-4 h-4 text-accent" />
          </div>
          <div className="space-y-3">
            {recentActivities.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated/50 hover:bg-surface-elevated transition-colors"
              >
                <span className={`mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${priorityColors[a.priority]}`}>
                  {a.priority === 'urgent' ? 'acil' : a.priority === 'high' ? 'yüksek' : 'normal'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text">{a.text}</p>
                  <p className="text-xs text-text-muted mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verimlilik Metrikleri */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-base font-semibold text-text mb-4">Verimlilik Paneli</h2>
          <div className="space-y-4">
            {efficiencyStats.map((s) => {
              const isPercentage = s.unit === '%';
              const progressWidth = isPercentage ? s.value : Math.min((s.target / s.value) * 100, 100);
              const isAboveTarget = isPercentage ? s.value >= s.target : s.value <= s.target;
              return (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-text-secondary">{s.label}</span>
                    <span className={`font-bold ${isAboveTarget ? 'text-success' : 'text-warning'}`}>
                      {s.value}{s.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${isAboveTarget ? 'bg-gradient-to-r from-success to-accent' : 'bg-gradient-to-r from-warning to-danger'}`}
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">Hedef: {s.target}{s.unit}</p>
                </div>
              );
            })}
          </div>

          {/* Başarı İndikatörü */}
          <div className="mt-5 p-3 rounded-xl bg-success/10 border border-success/20">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-success" />
              <span className="text-xs font-semibold text-success">%70 hedefi aşıldı!</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-1">
              E-posta iş yükü %72 oranında azaltıldı.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
