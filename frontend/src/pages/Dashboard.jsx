import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, CheckSquare, Users, ShieldAlert,
  TrendingUp, TrendingDown, Clock, AlertTriangle,
  ArrowRight, Zap, Brain, Activity, DollarSign, Search
} from 'lucide-react';
import { checkHealth } from '../services/api';

/**
 * ══════════════════════════════════════════════
 *  Asistanim — Kişisel AI Çalışma Alanı
 *  Skills Agent tarafından optimize edilmiştir.
 * ══════════════════════════════════════════════
 */

/* ── Sparkline SVG ── */
const Sparkline = ({ data, color = '#3b82f6', height = 32, width = 80 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="opacity-40">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
      <polygon
        fill={`url(#sg-${color.replace('#','')})`}
        points={`0,${height} ${points} ${width},${height}`}
      />
    </svg>
  );
};

/* ── Ring Progress ── */
const RingProgress = ({ value, max = 100, size = 56, stroke = 4, color = 'text-primary', label, sublabel }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((max - Math.min(value, max)) / max) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" strokeWidth={stroke} className="ring-track" />
          <circle
            cx={size/2} cy={size/2} r={radius} fill="none" strokeWidth={stroke}
            className={`ring-progress ${color}`}
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-data text-xs font-bold text-text">{value}</span>
        </div>
      </div>
      <div>
        <p className="text-xs text-text-secondary leading-tight">{label}</p>
        {sublabel && <p className="text-[10px] text-text-muted mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
};

/* ── Simulated Network Activity ── */
const NetworkGraph = () => {
  const [points, setPoints] = useState(() =>
    Array.from({ length: 40 }, () => Math.random() * 60 + 10)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        const lastPoint = prev[prev.length - 1];
        // Random walk: previous point +/- 15, capped between 10 and 80
        const variation = (Math.random() * 30) - 15;
        const nextValue = Math.max(10, Math.min(80, lastPoint + variation));
        return [...prev.slice(1), nextValue];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const pathData = useMemo(() => {
    const w = 100;
    const h = 60;
    return points.map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      // Use bezier curves or just simple lines for SVG path
      const y = h - (v / 80) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  }, [points]);

  const areaPath = useMemo(() => {
    return pathData + ` L 100 60 L 0 60 Z`;
  }, [pathData]);

  return (
    <div className="glass-card rounded-xl p-4 relative overflow-hidden scanline-overlay">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-text-secondary">Ağ Aktivitesi — Canlı</span>
        </div>
        <span className="font-data text-[10px] text-accent animate-pulse-soft">● LIVE</span>
      </div>
      <svg viewBox="0 0 100 60" className="w-full h-24" preserveAspectRatio="none">
        <defs>
          <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#netGrad)" />
        <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="0.6" opacity="0.8" />
      </svg>
      <div className="flex justify-between mt-2 text-[10px] text-text-muted font-data">
        <span>E-posta Akışı</span>
        <span>AI Filtreleme</span>
        <span>{Math.round(points[points.length - 1])} req/dk</span>
      </div>
    </div>
  );
};

/* ── Data ── */
const metrics = [
  {
    label: 'Gelen Kutusu', value: 12, change: -68,
    icon: Mail, color: 'text-primary', bg: 'bg-primary/10', link: '/email',
    sparkData: [45, 38, 32, 28, 22, 18, 14, 12],
    sparkColor: '#3b82f6',
  },
  {
    label: 'Görevlerim', value: 8, change: -42,
    icon: CheckSquare, color: 'text-accent', bg: 'bg-accent/10', link: '/tasks',
    sparkData: [20, 18, 15, 12, 10, 9, 8, 8],
    sparkColor: '#10b981',
  },
  {
    label: 'Bugünkü Toplantılar', value: 3, change: 0,
    icon: Users, color: 'text-secondary', bg: 'bg-secondary/10', link: '/meetings',
    sparkData: [2, 3, 1, 4, 2, 3, 3, 3],
    sparkColor: '#0ea5e9',
  },
  {
    label: 'Risk Uyarıları', value: 2, change: -1,
    icon: ShieldAlert, color: 'text-neon-red', bg: 'bg-neon-red/10', link: '/risks',
    sparkData: [5, 4, 6, 3, 4, 3, 2, 2],
    sparkColor: '#ff3b5c',
  },
];

const recentActivities = [
  { id: 1, type: 'security', tag: 'GÜVENLİK', text: "Şüpheli phishing e-postası tespit edildi ve karantinaya alındı", time: '13:45:02', priority: 'urgent' },
  { id: 2, type: 'mail', tag: 'E-POSTA', text: "CEO'dan gelen bütçe revizyonu e-postası ACİL olarak önceliklendirildi", time: '13:43:18', priority: 'urgent' },
  { id: 3, type: 'task', tag: 'GÖREV', text: 'Q3 raporlama görevi otomatik oluşturuldu ve Elif Kara\'ya atandı', time: '13:38:44', priority: 'high' },
  { id: 4, type: 'meeting', tag: 'TOPLANTI', text: 'Pazarlama toplantısı özeti çıkarıldı → 4 aksiyon maddesi oluşturuldu', time: '12:15:30', priority: 'normal' },
  { id: 5, type: 'mail', tag: 'E-POSTA', text: 'Müşteri şikayetine otomatik yanıt taslağı hazırlandı ve onaya sunuldu', time: '11:52:07', priority: 'high' },
  { id: 6, type: 'security', tag: 'GÜVENLİK', text: 'KVKK uyumlu olmayan veri paylaşımı algılandı, bildirim gönderildi', time: '11:30:22', priority: 'urgent' },
];

const tagStyles = {
  security: 'tag-security',
  task: 'tag-task',
  mail: 'tag-mail',
  meeting: 'tag-meeting',
};

const efficiencyStats = [
  { label: 'E-Posta Yükü Azalması', value: 72, target: 70, unit: '%', color: 'text-primary' },
  { label: 'Görev Otomasyon Oranı', value: 85, target: 80, unit: '%', color: 'text-accent' },
  { label: 'Ort. Yanıt Süresi', value: 3.2, target: 5, unit: 'dk', color: 'text-secondary' },
  { label: 'Risk Tespit Doğruluğu', value: 94, target: 90, unit: '%', color: 'text-neon-red' },
];

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [backendStatus, setBackendStatus] = useState('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Saate göre selamlama
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { text: 'Günaydın', emoji: '☀️' };
    if (hour >= 12 && hour < 17) return { text: 'İyi Öğlenler', emoji: '🌤️' };
    if (hour >= 17 && hour < 21) return { text: 'İyi Akşamlar', emoji: '🌆' };
    return { text: 'İyi Geceler', emoji: '🌙' };
  };

  const greeting = getGreeting();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const health = await checkHealth();
        setBackendStatus(health.status === 'active' ? 'online' : 'offline');
      } catch { setBackendStatus('offline'); }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-6 animate-slide-up">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-text tracking-tight">
            {greeting.text} {greeting.emoji}
          </h1>
          <p className="text-sm text-text-secondary mt-1">İş akışınızın güncel özeti</p>
          <p className="text-[11px] text-text-muted font-data flex items-center gap-1.5 mt-2">
            <Clock className="w-3 h-3" />
            {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
            <span className="text-text-secondary">{currentTime.toLocaleTimeString('tr-TR')}</span>
          </p>
        </div>

        {/* Arama + Agent Status */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          {/* Arama Çubuğu */}
          <div className={`relative flex items-center flex-1 max-w-md transition-all duration-300 ${searchFocused ? 'max-w-lg' : ''}`}>
            <Search className={`absolute left-5 w-4 h-4 transition-colors duration-200 ${searchFocused ? 'text-primary' : 'text-text-muted'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="E-posta, görev veya kişi ara..."
              className={`w-full pl-14 pr-16 py-2.5 rounded-xl text-sm text-text placeholder-text-muted bg-white/[0.03] border transition-all duration-300 focus:outline-none ${
                searchFocused
                  ? 'border-primary/40 bg-white/[0.05] shadow-[0_0_20px_rgba(59,130,246,0.08)]'
                  : 'border-border hover:border-border-light'
              }`}
            />
            <span className="absolute right-3 text-[10px] text-text-muted font-data bg-white/[0.04] border border-border px-1.5 py-0.5 rounded">⌘K</span>
          </div>

          {/* Agent Status */}
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl glass-card text-xs flex-shrink-0 ${
            backendStatus === 'online' ? 'text-primary' : 'text-danger'
          }`}>
            {backendStatus === 'online' ? <Brain className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span className="font-medium font-data text-[11px]">
              {backendStatus === 'loading' ? 'CONNECTING...' : backendStatus === 'online' ? 'SKILLS AGENT' : 'OFFLINE'}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${
              backendStatus === 'online' ? 'bg-primary animate-pulse-soft shadow-[0_0_6px_rgba(59,130,246,0.6)]' :
              backendStatus === 'loading' ? 'bg-warning animate-pulse' : 'bg-danger'
            }`} />
          </div>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Link
            key={m.label}
            to={m.link}
            className="group glass-card rounded-xl p-5 relative overflow-hidden"
          >
            {/* Sparkline background */}
            <div className="absolute bottom-0 right-0">
              <Sparkline data={m.sparkData} color={m.sparkColor} height={40} width={100} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${m.bg}`}>
                  <m.icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <ArrowRight className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5" />
              </div>
              <p className="font-data text-3xl font-bold text-text">{m.value}</p>
              <p className="text-xs text-text-muted mt-1">{m.label}</p>
              {m.change !== 0 && (
                <div className={`flex items-center gap-1 mt-1.5 text-[10px] font-data ${m.change < 0 ? 'text-accent' : 'text-danger'}`}>
                  {m.change < 0 ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />}
                  <span>{Math.abs(m.change)}% AI azaltma</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-12 gap-5">

        {/* Son AI Aktiviteleri */}
        <div className="col-span-5 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <h2 className="text-sm font-semibold text-text">AI Olay Günlüğü</h2>
            </div>
            <span className="font-data text-[10px] text-text-muted">{recentActivities.length} olay</span>
          </div>
          <div className="space-y-2">
            {recentActivities.map((a) => (
              <div key={a.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
              >
                <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold font-data tracking-wider ${tagStyles[a.type]}`}>
                  {a.tag}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-text-secondary leading-relaxed group-hover:text-text transition-colors">{a.text}</p>
                </div>
                <span className="font-data text-[10px] text-text-muted whitespace-nowrap mt-0.5">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Network Graph */}
        <div className="col-span-4">
          <NetworkGraph />
          
          {/* Predicted Savings */}
          <div className="glass-card rounded-xl p-5 mt-5">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-3.5 h-3.5 text-accent" />
              <h2 className="text-sm font-semibold text-text">Kazandığın Zaman</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-accent/[0.06] border border-accent/10">
                <p className="font-data text-xl font-bold text-accent">3.2 sa</p>
                <p className="text-[11px] text-text-muted mt-1">Bu Hafta</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/[0.06] border border-primary/10">
                <p className="font-data text-xl font-bold text-primary">47</p>
                <p className="text-[11px] text-text-muted mt-1">Otomatik İşlem</p>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency Rings */}
        <div className="col-span-3 glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text mb-5">Verimlilik</h2>
          <div className="space-y-4">
            {efficiencyStats.map((s) => {
              const isPercentage = s.unit === '%';
              const displayValue = isPercentage ? s.value : Math.round((s.target / s.value) * 100);
              const isAboveTarget = isPercentage ? s.value >= s.target : s.value <= s.target;
              return (
                <RingProgress
                  key={s.label}
                  value={displayValue}
                  size={44}
                  stroke={3.5}
                  color={s.color}
                  label={s.label}
                  sublabel={`Hedef: ${s.target}${s.unit}`}
                />
              );
            })}
          </div>

          {/* Success Badge */}
          <div className="mt-5 p-3 rounded-lg bg-accent/[0.06] border border-accent/10">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3 h-3 text-accent" />
              <span className="text-[11px] font-semibold text-accent">Hedef Aşıldı!</span>
            </div>
            <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">
              E-posta iş yükü <span className="font-data text-accent">%72</span> oranında azaltıldı.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
