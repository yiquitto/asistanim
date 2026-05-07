import { useState, useEffect } from 'react';
import { Mail, Send, AlertTriangle, Clock, User, ChevronRight, Sparkles, Shield, Eye, Plus, Loader2, X, Edit3, CheckCircle, Play, Code, Zap, Link2 } from 'lucide-react';
import { analyzeEmail } from '../services/api';
import { useTasks } from '../context/TaskContext';
import { useEmails } from '../context/EmailContext';

// Canlı demo senaryoları
const DEMO_SCENARIOS = [
  {
    sender: 'cfo@sirket.com',
    subject: 'ACİL: Q3 Dijital Pazarlama Bütçesi Onayı',
    body: 'Merhaba,\nYarın sabahki yönetim kurulu toplantısı öncesinde Q3 dijital pazarlama bütçe revizyonlarını acilen incelemem gerekiyor. Lütfen saat 17:00\'ye kadar tüm departman bütçelerini tek bir Excel\'de toplayıp bana gönder. Sosyal medya bütçesinde %15\'lik kesinti senaryosunu da rapora ekleyin.\nSaygılarımla',
    label: '🔴 Acil Bütçe',
  },
  {
    sender: 'it-support@sirket-guvenlik-portal.xyz',
    subject: 'UYARI: E-posta Kotanız Dolmak Üzere!',
    body: 'Sayın Kullanıcı,\nKurumsal e-posta hesabınızın depolama alanı %98 sınırına ulaşmıştır. Önümüzdeki 2 saat içinde kotanızı yükseltmezseniz gelen e-postalarınız geri dönecektir.\nLütfen hemen aşağıdaki bağlantıya tıklayarak sistem şifrenizle giriş yapın:\nhttp://sirket-guvenlik-portal.xyz/upgrade\n\nBilgi Teknolojileri Departmanı',
    label: '⚠️ Phishing',
  },
  {
    sender: 'ik@sirket.com',
    subject: 'Haziran Eğitim Planı ve Katılımcı Listesi',
    body: 'Merhaba ekip,\nHaziran ayında düzenlenecek Yeni Nesil Liderlik eğitiminin programı netleşmiştir. Eğitim 15 Haziran\'da tam gün olarak konferans salonunda yapılacaktır.\nEkteki dosyada eğitime katılacak 45 personelin TC kimlik numaraları 12345678901, cep telefonları 0532 123 45 67 ve açık ev adreslerinin yer aldığı kayıt tablosunu bulabilirsiniz.\nSevgiler.',
    label: '🔵 KVKK Riski',
  },
];

// Pipeline Aşamaları
const PIPELINE_STAGES = [
  { key: 'received', label: '📨 Alındı', icon: Mail },
  { key: 'pii', label: '🛡️ PII Tarama', icon: Shield },
  { key: 'ai_call', label: '🧠 AI Analiz', icon: Sparkles },
  { key: 'scoring', label: '📊 Skorlama', icon: Zap },
  { key: 'tasks', label: '📋 Görev', icon: CheckCircle },
  { key: 'complete', label: '✅ Tamam', icon: CheckCircle },
];

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

const priorityConfig = {
  urgent: { label: 'ACİL', class: 'bg-danger/20 text-danger border-danger/30', dot: 'bg-danger' },
  high: { label: 'YÜKSEK', class: 'bg-warning/20 text-warning border-warning/30', dot: 'bg-warning' },
  normal: { label: 'NORMAL', class: 'bg-primary/20 text-primary border-primary/30', dot: 'bg-primary' },
  low: { label: 'DÜŞÜK', class: 'bg-success/20 text-success border-success/30', dot: 'bg-success' },
};

const EmailInbox = () => {
  const { addTask } = useTasks();
  const { emails, setEmails, updateEmail, addEmail } = useEmails();
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showXAI, setShowXAI] = useState(false);
  const [showRawJSON, setShowRawJSON] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [composeData, setComposeData] = useState({ sender: '', subject: '', body: '' });
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [pipelineStage, setPipelineStage] = useState(null); // currently active pipeline stage
  const [rawAnalysis, setRawAnalysis] = useState(null); // raw JSON from backend

  // Taslak düzenleme state'leri
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [sendStatus, setSendStatus] = useState(null); // null | 'sending' | 'sent'

  const filteredEmails = filter === 'all' ? emails : emails.filter((e) => e.priority === filter);
  const selected = emails.find((e) => e.id === selectedEmail);

  // Seçili e-posta değişince draft'ı sıfırla
  const handleSelectEmail = (id) => {
    setSelectedEmail(id);
    setShowXAI(false);
    setIsEditingDraft(false);
    setSendStatus(null);
    const email = emails.find(e => e.id === id);
    if (email?.suggestedReply) {
      setDraftText(email.suggestedReply);
    } else {
      setDraftText('');
    }
  };

  // Düzenle butonuna tıklayınca
  const handleEditDraft = () => {
    if (selected?.suggestedReply && !draftText) {
      setDraftText(selected.suggestedReply);
    }
    setIsEditingDraft(true);
    setSendStatus(null);
  };

  // Gönder butonuna tıklayınca (simülasyon)
  const handleSendReply = () => {
    setSendStatus('sending');
    setTimeout(() => {
      setSendStatus('sent');
      setIsEditingDraft(false);
      updateEmail(selected.id, { isRead: true, replied: true });
    }, 1500);
  };

  // Sonuçtan e-posta oluştur ve listeye ekle
  const processAnalysisResult = (result, emailData) => {
    setRawAnalysis(result);
    const newEmail = {
      id: Date.now(),
      sender: emailData.sender || 'Manuel Giriş',
      email: emailData.sender,
      subject: emailData.subject || '(Konusuz)',
      preview: emailData.body.substring(0, 200),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      priority: result.priority || 'normal',
      scores: result.scores || { impact: 5, urgency: 5, risk: 1, total: 4.0 },
      category: result.category || 'info',
      explanation: result.explanation || 'AI analizi tamamlandı.',
      risks: result.risks || { phishing: 0, kvkk_violation: 0, social_engineering: 0 },
      suggestedReply: result.suggestedReply || null,
      isRead: false,
      aiAnalyzed: true,
      liveAnalysis: true,
      _meta: result._meta || null,
    };
    if (result.suggestedTasks && result.suggestedTasks.length > 0) {
      result.suggestedTasks.forEach(t => {
        addTask({
          title: t.title,
          source: `E-Posta: ${emailData.subject || 'Konusuz'}`,
          priority: t.priority || 'medium',
          deadline: t.deadline || 'Belirtilmedi',
          estimatedMinutes: t.estimatedMinutes || 30,
          status: 'pending',
          assignee: t.assignee || 'Siz',
        });
      });
    }
    addEmail(newEmail);
    setSelectedEmail(newEmail.id);
    setDraftText(newEmail.suggestedReply || '');
    return newEmail;
  };

  // Canlı AI Analiz — backend'e gönder
  const handleAnalyze = async () => {
    if (!composeData.body && !composeData.subject) return;
    setIsAnalyzing(true);
    setAnalyzeError(null);
    setPipelineStage('received');
    try {
      setPipelineStage('pii');
      await new Promise(r => setTimeout(r, 300));
      setPipelineStage('ai_call');
      const result = await analyzeEmail({
        sender: composeData.sender || 'bilinmiyor@test.com',
        subject: composeData.subject,
        body: composeData.body,
        date: new Date().toISOString(),
      });
      setPipelineStage('scoring');
      await new Promise(r => setTimeout(r, 400));
      setPipelineStage('tasks');
      await new Promise(r => setTimeout(r, 300));
      setPipelineStage('complete');

      processAnalysisResult(result, composeData);
      setShowCompose(false);
      setComposeData({ sender: '', subject: '', body: '' });
    } catch (err) {
      setAnalyzeError(err.message || 'AI analiz başarısız oldu');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setPipelineStage(null), 2000);
    }
  };

  // Canlı Demo — sıralı senaryo
  const handleLiveDemo = async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setShowCompose(false);

    for (const scenario of DEMO_SCENARIOS) {
      setPipelineStage('received');
      await new Promise(r => setTimeout(r, 1000));

      try {
        setPipelineStage('pii');
        await new Promise(r => setTimeout(r, 600));
        setPipelineStage('ai_call');

        const result = await analyzeEmail({
          sender: scenario.sender,
          subject: scenario.subject,
          body: scenario.body,
          date: new Date().toISOString(),
        });

        setPipelineStage('scoring');
        await new Promise(r => setTimeout(r, 500));
        setPipelineStage('tasks');
        await new Promise(r => setTimeout(r, 400));
        setPipelineStage('complete');

        processAnalysisResult(result, scenario);
        await new Promise(r => setTimeout(r, 2000));
      } catch {
        // Hata olsa bile devam
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    setPipelineStage(null);
    setIsDemoRunning(false);
  };

  return (
    <div className="flex h-full animate-slide-up">
      {/* Sol: E-Posta Listesi */}
      <div className="w-[420px] flex-shrink-0 border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> E-Posta Zekâsı
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLiveDemo}
                disabled={isDemoRunning}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isDemoRunning ? 'bg-accent/20 text-accent animate-pulse' : 'bg-accent text-white hover:bg-accent/80'}`}
              >
                <Play className="w-3.5 h-3.5" />
                {isDemoRunning ? 'Demo Çalışıyor...' : 'Canlı Demo'}
              </button>
              <button
                onClick={() => setShowCompose(!showCompose)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Analiz Et
              </button>
            </div>
          </div>

          {/* Pipeline Animasyonu */}
          {pipelineStage && (
            <div className="flex items-center gap-1 px-2 py-2 mb-3 bg-surface rounded-lg overflow-x-auto">
              {PIPELINE_STAGES.map((s, i) => {
                const stageIdx = PIPELINE_STAGES.findIndex(x => x.key === pipelineStage);
                const thisIdx = i;
                const isDone = thisIdx < stageIdx;
                const isActive = thisIdx === stageIdx;
                return (
                  <div key={s.key} className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-semibold transition-all duration-300 flex-shrink-0 ${
                    isDone ? 'bg-accent/20 text-accent' : isActive ? 'bg-primary/20 text-primary animate-pulse' : 'text-text-muted'
                  }`}>
                    {s.label}
                    {i < PIPELINE_STAGES.length - 1 && <span className="text-text-muted/30 ml-1">→</span>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Gmail/Outlook Bağlantı Vizyonu */}
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="text-[10px] text-text-muted flex items-center gap-1"><Link2 className="w-3 h-3" /> Kaynak: Manuel</span>
            <span className="text-[10px] text-primary/50 cursor-default" title="Production sürümünde OAuth 2.0 ile Gmail/Outlook bağlanabilir">Gmail Bağla</span>
            <span className="text-[10px] text-secondary/50 cursor-default">Outlook Bağla</span>
          </div>
          <div className="flex gap-2">
            {['all', 'urgent', 'high', 'normal', 'low'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-300 border ${
                  filter === f 
                    ? 'bg-primary/15 text-primary border-primary/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
                    : 'bg-surface/30 text-text-muted border-border/40 hover:border-border/80 hover:text-text hover:bg-surface/80'
                }`}
              >
                {f === 'all' ? 'Tümü' : priorityConfig[f]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Canlı Analiz Paneli */}
        {showCompose && (
          <div className="p-5 border-b border-border bg-card animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-accent flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Canlı AI E-Posta Analizi
              </span>
              <button onClick={() => setShowCompose(false)} className="text-text-muted hover:text-text"><X className="w-4 h-4" /></button>
            </div>
            <input value={composeData.sender} onChange={(e) => setComposeData(p => ({...p, sender: e.target.value}))}
              placeholder="Gönderen (örn: ceo@sirket.com)" className="w-full mb-2.5 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg text-xs text-text placeholder-text-muted focus:outline-none focus:border-primary/50" />
            <input value={composeData.subject} onChange={(e) => setComposeData(p => ({...p, subject: e.target.value}))}
              placeholder="Konu" className="w-full mb-2.5 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg text-xs text-text placeholder-text-muted focus:outline-none focus:border-primary/50" />
            <textarea value={composeData.body} onChange={(e) => setComposeData(p => ({...p, body: e.target.value}))}
              placeholder="E-posta içeriğini yapıştırın..." rows={4}
              className="w-full mb-3 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg text-xs text-text placeholder-text-muted focus:outline-none focus:border-primary/50 resize-none" />
            {analyzeError && <p className="text-[11px] text-danger mb-2">⚠️ {analyzeError}</p>}
            <button onClick={handleAnalyze} disabled={isAnalyzing || (!composeData.body && !composeData.subject)}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {isAnalyzing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Skills Agent Analiz Ediyor...</> : <><Sparkles className="w-3.5 h-3.5" /> AI ile Analiz Et</>}
            </button>
          </div>
        )}

        {/* E-Posta Kartları */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.map((email) => {
            const pc = priorityConfig[email.priority];
            return (
              <div key={email.id} onClick={() => handleSelectEmail(email.id)}
                className={`px-6 py-5 border-b border-border cursor-pointer transition-all duration-200 ${selectedEmail === email.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-card border-l-2 border-l-transparent'} ${!email.isRead ? 'bg-surface-elevated/30' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${pc.dot} ${email.priority === 'urgent' ? 'animate-pulse-soft' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[13px] font-semibold ${!email.isRead ? 'text-text' : 'text-text-secondary'}`}>{email.sender}</span>
                      <div className="flex items-center gap-1.5">
                        {email.replied && <span className="text-[9px] px-1 py-0.5 rounded bg-success/20 text-success font-bold">YANITLANDI</span>}
                        {email.liveAnalysis && <span className="text-[9px] px-1 py-0.5 rounded bg-accent/20 text-accent font-bold">CANLI</span>}
                        <span className="text-[10px] text-text-muted">{email.time}</span>
                      </div>
                    </div>
                    <p className={`text-sm mb-1.5 truncate ${!email.isRead ? 'font-semibold text-text' : 'text-text-secondary'}`}>{email.subject}</p>
                    <div className="flex items-center gap-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${pc.class}`}>{pc.label}</span>
                      <span className="text-[10px] text-text-muted">Skor: {email.scores.total.toFixed(1)}</span>
                      {(email.risks?.phishing > 5 || email.risks?.phishing_score > 5) && (
                        <span className="flex items-center gap-0.5 text-[10px] text-danger"><Shield className="w-3 h-3" /> Phishing</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sağ: E-Posta Detay */}
      <div className="flex-1 flex flex-col">
        {selected ? (
          <>
            <div className="p-7 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-text leading-snug">{selected.subject}</h3>
                  <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{selected.sender}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{selected.time}</span>
                    {selected.liveAnalysis && <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold">🔴 CANLI AI ANALİZ</span>}
                    {selected.replied && <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold">✓ YANITLANDI</span>}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${priorityConfig[selected.priority].class}`}>{priorityConfig[selected.priority].label}</span>
              </div>
            </div>

            <div className="px-7 py-5 bg-surface-elevated/30 border-b border-border">
              <div className="flex items-center gap-6">
                {[
                  { label: 'Impact', value: selected.scores.impact, color: 'bg-primary' },
                  { label: 'Urgency', value: selected.scores.urgency, color: 'bg-warning' },
                  { label: 'Risk', value: selected.scores.risk, color: 'bg-danger' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 flex-1">
                    <span className="text-[11px] text-text-muted w-14">{s.label}</span>
                    <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color} transition-all duration-700`} style={{ width: `${s.value * 10}%` }} />
                    </div>
                    <span className="text-xs font-bold text-text">{s.value}</span>
                  </div>
                ))}
                <div className="pl-4 border-l border-border">
                  <span className="text-[11px] text-text-muted">Toplam</span>
                  <p className="text-lg font-bold text-text">{selected.scores.total.toFixed(1)}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-7 space-y-5">
              {/* E-posta İçeriği */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{selected.body || selected.preview}</p>
              </div>

              {/* Phishing Uyarısı */}
              {(selected.risks?.phishing > 5 || selected.risks?.phishing_score > 5) && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-danger" />
                    <span className="text-sm font-bold text-danger">⚠️ Güvenlik Uyarısı — Phishing Tespit Edildi</span>
                  </div>
                  <p className="text-xs text-text-secondary">Bu e-posta yüksek olasılıkla bir oltalama girişimidir.</p>
                </div>
              )}

              {/* XAI Açıklama */}
              <button onClick={() => setShowXAI(!showXAI)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-sm text-accent hover:text-white transition-colors w-full">
                <Eye className="w-4 h-4" />
                <span className="font-medium">Bu karar neden verildi? (XAI Açıklama)</span>
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${showXAI ? 'rotate-90' : ''}`} />
              </button>

              {showXAI && (
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 animate-slide-up">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-accent">Skills Agent Analiz Raporu</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{selected.explanation}</p>
                </div>
              )}

              {/* Performans Rozeti */}
              {selected._meta && (
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface border border-border text-[10px] font-data text-text-muted">
                  <span className="text-accent">⚡ {selected._meta.model}</span>
                  <span>·</span>
                  <span>{selected._meta.responseTimeMs}ms</span>
                  <span>·</span>
                  <span>{selected._meta.piiMaskedCount > 0 ? `🔒 ${selected._meta.piiMaskedCount} PII maskelendi` : '✅ PII temiz'}</span>
                </div>
              )}

              {/* Raw JSON Inspector */}
              <button onClick={() => setShowRawJSON(!showRawJSON)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-sm text-primary hover:text-white transition-colors w-full">
                <Code className="w-4 h-4" />
                <span className="font-medium">Ham AI Yanıtını Görüntüle (JSON)</span>
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${showRawJSON ? 'rotate-90' : ''}`} />
              </button>

              {showRawJSON && rawAnalysis && (
                <div className="p-4 rounded-xl bg-[#0a0e14] border border-border animate-slide-up overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Raw AI Response</span>
                  </div>
                  <pre className="text-[11px] font-mono text-text-secondary leading-relaxed overflow-x-auto max-h-64 overflow-y-auto scrollbar-thin">
                    {JSON.stringify(rawAnalysis, null, 2)}
                  </pre>
                </div>
              )}

              {/* AI Yanıt Taslağı — Düzenlenebilir */}
              {selected.suggestedReply && (
                <div className="rounded-xl border border-border overflow-hidden">
                  {/* Başlık */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-primary/[0.06] border-b border-border">
                    <Send className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-text flex-1">AI Yanıt Taslağı</span>
                    <span className="text-[10px] text-text-muted font-data">Kime: {selected.email}</span>
                  </div>

                  {/* Gönderildi Bildirimi */}
                  {sendStatus === 'sent' ? (
                    <div className="p-6 text-center animate-slide-up">
                      <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-6 h-6 text-success" />
                      </div>
                      <p className="text-sm font-semibold text-success">Yanıt Başarıyla Gönderildi!</p>
                      <p className="text-xs text-text-muted mt-1">E-posta {selected.email} adresine iletildi.</p>
                    </div>
                  ) : (
                    <>
                      {/* Taslak İçeriği */}
                      <div className="p-4">
                        {isEditingDraft ? (
                          <textarea
                            value={draftText}
                            onChange={(e) => setDraftText(e.target.value)}
                            rows={6}
                            className="w-full px-3 py-3 bg-surface-elevated border border-primary/30 rounded-lg text-sm text-text leading-relaxed focus:outline-none focus:border-primary resize-none"
                            placeholder="Yanıtınızı yazın..."
                            autoFocus
                          />
                        ) : (
                          <div
                            className="p-3 rounded-lg bg-surface-elevated/50 text-sm text-text-secondary whitespace-pre-line leading-relaxed cursor-pointer hover:bg-surface-elevated transition-colors"
                            onClick={handleEditDraft}
                            title="Düzenlemek için tıklayın"
                          >
                            {draftText || selected.suggestedReply}
                          </div>
                        )}
                      </div>

                      {/* Aksiyon Butonları */}
                      <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-white/[0.01]">
                        {isEditingDraft ? (
                          <>
                            <button
                              onClick={handleSendReply}
                              disabled={!draftText.trim() || sendStatus === 'sending'}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-colors disabled:opacity-40"
                            >
                              {sendStatus === 'sending' ? (
                                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Gönderiliyor...</>
                              ) : (
                                <><Send className="w-3.5 h-3.5" /> Gönder</>
                              )}
                            </button>
                            <button
                              onClick={() => { setIsEditingDraft(false); }}
                              className="px-4 py-2 rounded-lg bg-surface-elevated text-text-secondary text-xs font-semibold hover:text-text transition-colors"
                            >
                              İptal
                            </button>
                            <button
                              onClick={() => { setDraftText(selected.suggestedReply); }}
                              className="px-3 py-2 rounded-lg text-text-muted text-xs hover:text-accent transition-colors ml-auto"
                            >
                              ↻ AI Taslağına Sıfırla
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={handleSendReply}
                              disabled={sendStatus === 'sending'}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-colors disabled:opacity-40"
                            >
                              {sendStatus === 'sending' ? (
                                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Gönderiliyor...</>
                              ) : (
                                <><Send className="w-3.5 h-3.5" /> Taslağı Gönder</>
                              )}
                            </button>
                            <button
                              onClick={handleEditDraft}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-elevated text-text-secondary text-xs font-semibold hover:text-text transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Düzenle
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-30" />
              <p className="text-sm text-text-muted">Detayları görmek için bir e-posta seçin</p>
              <p className="text-xs text-text-muted mt-1">veya <button onClick={() => setShowCompose(true)} className="text-accent hover:underline">yeni e-posta analiz edin</button></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailInbox;
