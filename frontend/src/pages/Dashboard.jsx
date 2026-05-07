import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, CheckSquare, Users, ShieldAlert,
  Clock, ArrowRight, Brain, Activity, Shield,
  Cpu, Eye, Zap, Terminal, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { checkHealth } from '../services/api';
import { useTasks } from '../context/TaskContext';
import { useEmails } from '../context/EmailContext';
import { useLogs } from '../context/LogContext';

/**
 * ══════════════════════════════════════════════
 *  Asistanim — Dashboard v4 (Enterprise Grade)
 *  Clean grid · Sharp edges · Professional density
 * ══════════════════════════════════════════════
 */

/* ── PII Maskeleme Demo ── */
const PII_DEMOS = [
  { label: 'TC Kimlik No', input: 'TC: 12345678901', output: 'TC: [TC_MASKED]', tag: 'text-danger' },
  { label: 'Telefon',      input: 'Tel: 0532 123 45 67', output: 'Tel: [PHONE_MASKED]', tag: 'text-warning' },
  { label: 'IBAN',         input: 'IBAN: TR33 0006 1005 1978 6457 8413 26', output: 'IBAN: [IBAN_MASKED]', tag: 'text-primary' },
  { label: 'E-posta',      input: 'info@sirket.com', output: '[EMAIL_MASKED]', tag: 'text-accent' },
  { label: 'Kredi Kartı',  input: 'Kart: 4532 **** **** 9012', output: 'Kart: [CC_MASKED]', tag: 'text-secondary' },
];

const PIIDemo = () => {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('input'); // input → masking → output
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const cycle = setInterval(() => {
      setPhase('input');
      setTimeout(() => setPhase('masking'), 1200);
      setTimeout(() => setPhase('output'), 2200);
      setTimeout(() => {
        setIdx(p => (p + 1) % PII_DEMOS.length);
        setPhase('input');
      }, 4000);
    }, 4500);
    return () => clearInterval(cycle);
  }, []);

  const d = PII_DEMOS[idx];
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-text uppercase tracking-wide">PII Koruma Motoru</span>
        </div>
        <button onClick={() => setShowInfo(!showInfo)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 text-text-muted hover:text-accent transition-colors">
          <Info className="w-3 h-3" />
        </button>
      </div>

      {showInfo && (
        <div className="mb-3 p-3 rounded bg-accent/[0.06] border border-accent/20 text-[11px] text-text-secondary leading-relaxed animate-slide-up">
          <p className="font-bold text-accent mb-1">Nasıl çalışır?</p>
          AI API'ye gönderilmeden <strong>ÖNCE</strong> tüm kişisel veriler regex ile maskelenir. KVKK uyumlu.
        </div>
      )}

      {/* Terminal */}
      <div className="flex-1 bg-[#080c14] rounded border border-white/[0.04] p-3.5 font-mono text-xs space-y-2 min-h-[64px]">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-text-muted uppercase w-10 shrink-0">giriş</span>
          <span className={`transition-all duration-300 ${phase === 'output' ? 'text-text-muted/30 line-through' : 'text-text-secondary'}`}>{d.input}</span>
        </div>
        {phase === 'masking' && (
          <div className="flex items-center gap-2 text-warning animate-pulse">
            <span className="w-10 shrink-0" />
            <Activity className="w-3 h-3" />
            <span className="text-[10px]">Regex motoru çalışıyor...</span>
          </div>
        )}
        {phase === 'output' && (
          <div className="flex items-center gap-2 animate-slide-up">
            <span className="text-[9px] text-text-muted uppercase w-10 shrink-0">çıkış</span>
            <span className={`font-bold ${d.tag}`}>{d.output}</span>
            <span className="text-accent text-[10px] ml-1">✓</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex gap-1 mt-3">
        {PII_DEMOS.map((p, i) => (
          <span key={i} className={`px-1.5 py-0.5 rounded text-[8px] font-bold transition-colors ${i === idx ? 'bg-accent/20 text-accent' : 'bg-white/[0.03] text-text-muted'}`}>
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Sistem Mimarisi Kartları ── */
const ARCH = [
  { icon: Cpu,    title: 'IUR Skorlama',   color: 'text-primary',   detail: 'Impact × 0.4 + Urgency × 0.35 + Risk × 0.25\nACİL: 8-10 · YÜKSEK: 6-8 · NORMAL: 4-6' },
  { icon: Shield, title: 'PII Maskeleme',   color: 'text-accent',    detail: 'TC · Telefon · IBAN · E-posta · Kredi Kartı\nAI\'ya gönderilmeden önce maskelenir. KVKK uyumlu.' },
  { icon: Eye,    title: 'XAI Katmanı',     color: 'text-warning',   detail: 'Her AI kararı için "Neden?" açıklaması üretilir.\nŞeffaf, denetlenebilir ve açıklanabilir AI.' },
  { icon: Zap,    title: 'Multi-AI Motor',  color: 'text-secondary', detail: 'Groq (~1s) → Gemini (~3s) → OpenAI (~4s)\nOtomatik failover. Her zaman çalışır.' },
];

const ArchCard = ({ card }) => {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className={`w-full text-left p-3 rounded border transition-all duration-150 ${open ? 'bg-white/[0.03] border-white/10' : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/[0.06]'}`}>
      <div className="flex items-center gap-2">
        <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
        <span className="text-[11px] font-semibold text-text flex-1">{card.title}</span>
        <ChevronDown className={`w-3 h-3 text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && (
        <p className="mt-2 text-[10px] text-text-muted whitespace-pre-line leading-relaxed pl-5.5 animate-slide-up">{card.detail}</p>
      )}
    </button>
  );
};

/* ── Canlı Terminal ── */
const LiveTerminal = () => {
  const { logs } = useLogs();
  const [open, setOpen] = useState(true);
  const ref = useRef(null);

  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [logs]);

  const tc = { info: 'text-text-secondary', success: 'text-accent', warning: 'text-warning', error: 'text-danger', stage: 'text-primary' };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-[#060a12]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-border cursor-pointer select-none" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-accent" />
          <span className="text-[11px] font-bold text-text uppercase tracking-wide">AI Terminal</span>
          <span className="text-[9px] text-accent font-data ml-1">CANLI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-text-muted font-data">{logs.length} log</span>
          {open ? <ChevronUp className="w-3 h-3 text-text-muted" /> : <ChevronDown className="w-3 h-3 text-text-muted" />}
        </div>
      </div>
      {open && (
        <div ref={ref} className="p-3 max-h-32 overflow-y-auto font-mono text-[10px] leading-relaxed space-y-px scrollbar-thin">
          {logs.length === 0 ? (
            <p className="text-text-muted animate-pulse">⏳ Backend bağlantısı bekleniyor...</p>
          ) : logs.map(l => (
            <div key={l.id} className={`flex gap-1.5 ${tc[l.type] || 'text-text-muted'}`}>
              <span className="text-text-muted/40 shrink-0">[{l.time}]</span>
              <span className="shrink-0">{l.emoji}</span>
              <span>{l.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════ DASHBOARD ═══════════════ */
const Dashboard = () => {
  const { tasks } = useTasks();
  const { emails } = useEmails();
  const [now, setNow] = useState(new Date());
  const [backend, setBackend] = useState('loading');

  const hour = now.getHours();
  const greeting = hour >= 5 && hour < 12 ? { t: 'Günaydın', e: '☀️' }
    : hour >= 12 && hour < 17 ? { t: 'İyi Öğlenler', e: '🌤️' }
    : hour >= 17 && hour < 21 ? { t: 'İyi Akşamlar', e: '🌆' }
    : { t: 'İyi Geceler', e: '🌙' };

  const pending = tasks.filter(t => t.status !== 'completed').length;
  const critical = tasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const f = async () => { try { const h = await checkHealth(); setBackend(h.status === 'active' ? 'on' : 'off'); } catch { setBackend('off'); } };
    f(); const i = setInterval(f, 15000); return () => clearInterval(i);
  }, []);

  const urgentEmails = emails.filter(e => e.priority === 'urgent').length;
  const unreadEmails = emails.filter(e => !e.isRead).length;

  const metrics = [
    { label: 'Gelen Kutusu', icon: Mail,        value: unreadEmails, sub: `${urgentEmails} ACİL bekliyor`, color: 'text-primary',   bg: 'bg-primary/10', link: '/email' },
    { label: 'Görevlerim',   icon: CheckSquare,  value: pending, sub: `${critical} kritik · ${inProgress} devam`, color: 'text-accent',    bg: 'bg-accent/10',  link: '/tasks' },
    { label: 'Toplantılar',  icon: Users,        value: 3,       sub: '1 AI özeti hazır',                     color: 'text-secondary', bg: 'bg-secondary/10', link: '/meetings' },
    { label: 'Risk Uyarıları', icon: ShieldAlert, value: 2,      sub: '1 kritik phishing',                    color: 'text-danger',    bg: 'bg-danger/10',  link: '/risks' },
  ];

  const integrations = [
    { title: 'E-Posta Kaynakları', emoji: '📧', desc: 'Gmail, Outlook, IMAP/SMTP — OAuth 2.0 ile gelen kutusu otomatik taranır.', tags: [{ t: 'REST API', c: 'text-accent bg-accent/10' }, { t: 'Webhook', c: 'text-primary bg-primary/10' }] },
    { title: 'Platform Bağlantıları', emoji: '🔗', desc: 'Slack, Teams, Zapier, Power Automate ile entegre edilebilir.', tags: [{ t: 'Zapier', c: 'text-warning bg-warning/10' }, { t: 'Teams', c: 'text-secondary bg-secondary/10' }] },
    { title: 'Gerçek Zamanlı İletişim', emoji: '📡', desc: 'SSE log stream ile tüm AI işlemleri anlık izlenebilir.', tags: [{ t: 'SSE', c: 'text-accent bg-accent/10' }, { t: 'Real-time', c: 'text-danger bg-danger/10' }] },
  ];

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8 animate-slide-up max-w-[1400px]">

      {/* ─── HEADER ─── */}
      <div className="flex items-end justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-text tracking-tight">
            {greeting.e} {greeting.t}, Yiğit!
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            {pending > 0
              ? <>{pending} bekleyen görev{critical > 0 && <>, <span className="text-danger font-semibold">{critical} kritik</span></>}. Skills Agent hazır.</>
              : <>Tüm görevler tamamlandı! 🎉</>
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-data text-[11px] text-text-muted">
            {now.toLocaleTimeString('tr-TR')}
          </span>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold ${backend === 'on' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${backend === 'on' ? 'bg-accent animate-pulse-soft' : 'bg-danger'}`} />
            {backend === 'on' ? 'Aktif' : 'Off'}
          </div>
        </div>
      </div>

      {/* ─── METRIC CARDS ─── */}
      <div className="grid grid-cols-4 gap-5">
        {metrics.map(m => (
          <Link key={m.label} to={m.link} className="group border border-border rounded-lg p-6 bg-card hover:bg-card-hover hover:border-white/10 transition-all duration-150 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                <m.icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="font-data text-2xl font-bold text-text leading-none">{m.value}</p>
            <p className="text-[11px] text-text-muted mt-1.5">{m.label}</p>
            <p className="text-[9px] text-text-muted/60 mt-1">{m.sub}</p>
          </Link>
        ))}
      </div>

      {/* ─── MAIN GRID: PII + SİSTEM MİMARİSİ ─── */}
      <div className="grid grid-cols-5 gap-5">
        {/* PII Demo — 3 kolon */}
        <div className="col-span-3 border border-border rounded-lg p-6 bg-card shadow-sm">
          <PIIDemo />
        </div>

        {/* Sistem Mimarisi — 2 kolon */}
        <div className="col-span-2 border border-border rounded-lg p-6 bg-card shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-text uppercase tracking-wide">Sistem Mimarisi</span>
          </div>
          <div className="space-y-0.5">
            {ARCH.map(c => <ArchCard key={c.title} card={c} />)}
          </div>
        </div>
      </div>

      {/* ─── ENTEGRASYON ─── */}
      <div className="border border-border rounded-lg p-6 bg-card shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-secondary" />
          <span className="text-xs font-bold text-text uppercase tracking-wide">Entegrasyon Altyapısı</span>
          <span className="text-[9px] text-text-muted ml-1">Production-ready bağlantı noktaları</span>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {integrations.map(ig => (
            <div key={ig.title} className="p-5 rounded border border-white/[0.04] bg-surface hover:bg-surface-elevated transition-colors shadow-sm">
              <p className="text-[11px] font-bold text-text mb-1.5">{ig.emoji} {ig.title}</p>
              <p className="text-[10px] text-text-muted leading-relaxed mb-2.5">{ig.desc}</p>
              <div className="flex gap-1.5">
                {ig.tags.map(tg => (
                  <span key={tg.t} className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${tg.c}`}>{tg.t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TERMINAL ─── */}
      <LiveTerminal />
    </div>
  );
};

export default Dashboard;
