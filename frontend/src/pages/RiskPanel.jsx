import { useState, useMemo } from 'react';
import { ShieldAlert, Shield, AlertTriangle, Eye, Lock, FileWarning, CheckCircle2 } from 'lucide-react';
import { useEmails } from '../context/EmailContext';

/**
 * ⚠️ [SIMULATION] — Bu modül hackathon demo amaçlıdır.
 * Gerçek veri kaynağına bağlı değildir, hardcoded/dummy veri kullanır.
 */

const riskItems = [
  {
    id: 1,
    type: 'phishing',
    severity: 'critical',
    title: 'Phishing E-postası Tespit Edildi',
    description: 'security@bankasi-giris.xyz adresinden gelen e-posta, oltalama girişimi olarak işaretlendi. Şüpheli URL pattern, acil eylem çağrısı ve gönderen-domain uyuşmazlığı tespit edildi.',
    indicators: ['Şüpheli domain (.xyz)', 'Acil eylem çağrısı', 'Kişisel bilgi talebi'],
    time: '09:42',
    status: 'quarantined',
  },
  {
    id: 2,
    type: 'kvkk',
    severity: 'high',
    title: 'KVKK İhlal Riski — Toplu E-posta',
    description: 'İK departmanından gönderilen izin planlaması e-postasında, CC alanında 47 çalışanın e-posta adresi açık şekilde paylaşılmış. KVKK kapsamında kişisel veri ihlali riski.',
    indicators: ['Açık CC listesi (47 kişi)', 'Kişisel e-posta adresleri görünür', 'BCC kullanılmamış'],
    time: '10:30',
    status: 'flagged',
  },
  {
    id: 3,
    type: 'social_engineering',
    severity: 'medium',
    title: 'Olağandışı Ödeme Talimatı',
    description: 'Finans departmanına gelen e-postada, "CEO adına" acil havale talimatı verilmiş. CEO\'nun bilinen e-posta adresiyle uyuşmuyor. CEO Fraud (BEC) şüphesi.',
    indicators: ['CEO taklidi', 'Acil havale talebi', 'Farklı reply-to adresi'],
    time: 'Dün 16:45',
    status: 'investigating',
  },
  {
    id: 4,
    type: 'data_leak',
    severity: 'low',
    title: 'Hassas Doküman Eki Tespiti',
    description: 'Dış müşteriye gönderilmek üzere hazırlanan e-postada, iç maliyet tablosunun ek olarak eklendiği tespit edildi. Gönderim öncesi durduruldu.',
    indicators: ['İç doküman dış alıcıya gidiyor', 'Maliyet bilgisi içeriyor'],
    time: 'Dün 14:20',
    status: 'resolved',
  },
];

const severityConfig = {
  critical: { label: 'KRİTİK', class: 'bg-danger/20 text-danger border-danger/30', dot: 'bg-danger' },
  high: { label: 'YÜKSEK', class: 'bg-warning/20 text-warning border-warning/30', dot: 'bg-warning' },
  medium: { label: 'ORTA', class: 'bg-primary/20 text-primary border-primary/30', dot: 'bg-primary' },
  low: { label: 'DÜŞÜK', class: 'bg-success/20 text-success border-success/30', dot: 'bg-success' },
};

const statusLabels = {
  quarantined: { label: 'Karantinada', class: 'text-danger' },
  flagged: { label: 'İşaretlendi', class: 'text-warning' },
  investigating: { label: 'İnceleniyor', class: 'text-accent' },
  resolved: { label: 'Çözüldü', class: 'text-success' },
};

const typeIcons = {
  phishing: Shield,
  kvkk: Lock,
  social_engineering: Eye,
  data_leak: FileWarning,
};

const RiskPanel = () => {
  const { emails } = useEmails();

  // E-postalardan gelen canlı riskleri hesapla
  const dynamicRisks = useMemo(() => {
    return emails
      .filter(e => e.risks && (e.risks.phishing >= 6 || e.risks.kvkk >= 6 || e.risks.kvkk_violation >= 6 || e.risks.social_engineering >= 6))
      .map(e => {
        let maxScore = 0;
        let type = 'phishing';
        if (e.risks.phishing > maxScore) { maxScore = e.risks.phishing; type = 'phishing'; }
        if (e.risks.kvkk > maxScore) { maxScore = e.risks.kvkk; type = 'kvkk'; }
        if (e.risks.kvkk_violation > maxScore) { maxScore = e.risks.kvkk_violation; type = 'kvkk'; }
        if (e.risks.social_engineering > maxScore) { maxScore = e.risks.social_engineering; type = 'social_engineering'; }
        
        return {
          id: `dyn-${e.id}`,
          type,
          severity: maxScore >= 8 ? 'critical' : 'high',
          title: `CANLI RİSK: ${type === 'kvkk' ? 'KVKK' : type === 'phishing' ? 'Phishing' : 'Sosyal Mühendislik'}`,
          description: `[${e.sender}] kaynaklı e-postada AI tarafından risk tespit edildi. ${e.summary ? `Özet: ${e.summary}` : ''}`,
          indicators: [`AI Risk Skoru: ${maxScore}/10`, 'Otomatik Karantina'],
          time: e.time,
          status: 'quarantined',
          isNew: e.isNew,
        };
      });
  }, [emails]);

  // Demo verileri ile gerçek verileri birleştir
  const allRisks = useMemo(() => [...dynamicRisks, ...riskItems], [dynamicRisks]);

  const criticalCount = allRisks.filter(r => r.severity === 'critical' || r.severity === 'high').length;

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8 animate-slide-up max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-danger" />
            Risk & Uyum Paneli
          </h2>
          <p className="text-sm text-text-secondary mt-0.5">
            KVKK · Phishing · Sosyal Mühendislik · Veri Sızıntısı
          </p>
        </div>
      </div>

      {/* Özet Kutucukları */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Toplam Uyarı', value: allRisks.length, color: 'text-text' },
          { label: 'Kritik / Yüksek', value: criticalCount, color: 'text-danger' },
          { label: 'İnceleniyor', value: allRisks.filter(r => r.status === 'investigating').length, color: 'text-accent' },
          { label: 'Çözülen', value: allRisks.filter(r => r.status === 'resolved').length, color: 'text-success' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Risk Kartları */}
      <div className="space-y-5">
        {allRisks.map((risk) => {
          const sc = severityConfig[risk.severity];
          const st = statusLabels[risk.status];
          const TypeIcon = typeIcons[risk.type];
          return (
            <div key={risk.id} className={`bg-card border rounded-2xl p-6 transition-all duration-500 hover:bg-card-hover relative overflow-hidden ${
              risk.severity === 'critical' ? 'border-danger/30' : 'border-border'
            } ${risk.isNew ? 'shadow-[0_0_15px_rgba(var(--color-danger),0.2)] animate-in fade-in slide-in-from-top-4' : ''}`}>
              
              {risk.isNew && (
                <div className="absolute top-0 right-0 bg-danger text-background text-[10px] font-bold px-3 py-1 rounded-bl-lg animate-pulse">
                  YENİ RİSK
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${sc.class}`}>
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                      {risk.title}
                      {risk.severity === 'critical' && risk.status !== 'resolved' && (
                        <AlertTriangle className="w-4 h-4 text-danger animate-pulse-soft" />
                      )}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${sc.class}`}>
                        {sc.label}
                      </span>
                      <span className={`text-[11px] font-medium ${st.class}`}>● {st.label}</span>
                      <span className="text-[10px] text-text-muted">{risk.time}</span>
                    </div>
                  </div>
                </div>
                {risk.status === 'resolved' && <CheckCircle2 className="w-5 h-5 text-success" />}
              </div>

              <p className="text-xs text-text-secondary mb-3">{risk.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {risk.indicators.map((ind, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-surface-elevated text-[10px] text-text-muted">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskPanel;
