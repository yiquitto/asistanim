import { useState } from 'react';
import { Search, Clock, FileText, Mail, Users, ArrowRight, Brain } from 'lucide-react';
import { useEmails } from '../context/EmailContext';

/**
 * ⚠️ [SIMULATION] — Bu modül hackathon demo amaçlıdır.
 * Gerçek veri kaynağına bağlı değildir, hardcoded/dummy veri kullanır.
 * Production versiyonunda RAG tabanlı vektör arama entegrasyonu yapılacaktır.
 */

const dummyResults = [
  {
    id: 1,
    type: 'email',
    title: 'Müşteri X SLA Problemi — Çözüm Geçmişi',
    content: 'Bu müşteri ile benzer bir SLA sorunu Ocak 2026\'da yaşanmıştı. O zaman destek ekibi 4 saatlik yoğun çalışma ile root cause analizi yaparak sorunu çözmüştü. Çözüm: API rate limiting ayarlarının güncellenmesi.',
    date: '15 Ocak 2026',
    relevance: 94,
    source: 'E-Posta Arşivi',
  },
  {
    id: 2,
    type: 'meeting',
    title: 'Q1 Strateji Toplantısı — Bütçe Kararları',
    content: 'Yönetim kurulu, Q1 toplantısında pazarlama bütçesinin %10 artırılmasına ve yeni dijital kanal yatırımlarına onay vermişti. Bu karar Q3 revizyonunda referans alınabilir.',
    date: '20 Şubat 2026',
    relevance: 87,
    source: 'Toplantı Notu',
  },
  {
    id: 3,
    type: 'document',
    title: 'KVKK Uyum Politikası v2.1',
    content: 'Şirketin güncel KVKK uyum politikası. Toplu e-postalarda BCC kullanımının zorunlu olduğu, kişisel verilerin şifrelenmesi gerektiği belirtilmektedir.',
    date: '1 Mart 2026',
    relevance: 72,
    source: 'İç Doküman',
  },
  {
    id: 4,
    type: 'email',
    title: 'Cloud Migration Fizibilite Raporu',
    content: 'Azure geçiş maliyeti analizi tamamlandı. Yıllık %23 tasarruf öngörülüyor. Kubernetes cluster kurulumu 6-8 hafta sürecek.',
    date: '28 Nisan 2026',
    relevance: 65,
    source: 'E-Posta Arşivi',
  },
];

const typeIcons = { email: Mail, meeting: Users, document: FileText };

const MemorySearch = () => {
  const { emails } = useEmails();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    
    // Basit bir arama algoritması
    const q = query.toLowerCase();
    
    // Gerçek E-postalar içinde arama
    const emailResults = emails
      .filter(e => 
        (e.subject && e.subject.toLowerCase().includes(q)) || 
        (e.body && e.body.toLowerCase().includes(q)) || 
        (e.preview && e.preview.toLowerCase().includes(q)) ||
        (e.sender && e.sender.toLowerCase().includes(q))
      )
      .map(e => ({
        id: `email-${e.id}`,
        type: 'email',
        title: e.subject,
        content: e.body || e.preview,
        date: e.time, // Saat bilgisi var
        relevance: 95, // Gerçek veri olduğu için yüksek skor
        source: e.sender
      }));

    // Dummy veriler içinde arama
    const dummyMatches = dummyResults.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.content.toLowerCase().includes(q)
    );

    setTimeout(() => {
      setResults([...emailResults, ...dummyMatches]);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col animate-slide-up">
      <div className="flex-shrink-0">
        <h2 className="text-xl font-bold text-text flex items-center gap-2">
          <Brain className="w-5 h-5 text-secondary" />
          Kurumsal Hafıza
        </h2>
        <p className="text-sm text-text-secondary mt-1 flex items-center gap-2">
          Tüm e-posta, toplantı ve dokümanlardan bağlamsal arama
        </p>
      </div>

      {/* Arama Kutusu */}
      <div className="relative mt-10 w-full max-w-4xl">
        <div className="relative group">
          {/* Arka plan parlama efekti */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-md opacity-40 group-focus-within:opacity-100 group-focus-within:from-primary/40 group-focus-within:to-accent/40 transition-all duration-500"></div>
          
          <div className="relative flex items-center w-full bg-surface-elevated border border-border/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group-focus-within:border-primary/50">
            <div className="pl-5 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary/70 group-focus-within:text-primary transition-colors" />
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Kurumsal hafızada ara... (örn: 'müşteri SLA sorunu' veya 'fatura')"
              className="flex-1 bg-transparent border-none px-4 py-4 text-sm text-text placeholder-text-muted/70 focus:outline-none focus:ring-0"
            />
            
            <button
              onClick={handleSearch}
              className="h-full px-8 py-4 bg-gradient-to-r from-primary/90 to-accent/90 hover:from-primary hover:to-accent text-white text-sm font-bold tracking-wider uppercase transition-all duration-300 border-l border-primary/20 flex-shrink-0"
            >
              Sorgula
            </button>
          </div>
        </div>

        {/* Önerilen Aramalar */}
        <div className="flex flex-wrap gap-2 mt-5">
          {['SLA çözüm geçmişi', 'Bütçe kararları', 'Acil onay', 'Phishing'].map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); handleSearch(); }}
              className="px-4 py-1.5 rounded-full border border-border/40 bg-surface/30 text-[11px] font-bold tracking-wider uppercase text-text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Arama Sonuçları Container */}
      <div className="flex-1 overflow-y-auto mt-8 pb-6 pr-2">
        {isSearching && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Kurumsal hafıza taranıyor...
          </div>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-text-muted">{results.length} sonuç bulundu</p>
          {results.map((r) => {
            const TypeIcon = typeIcons[r.type];
            return (
              <div key={r.id} className="bg-card border border-border rounded-2xl p-5 hover:bg-card-hover hover:border-primary/20 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-surface-elevated">
                      <TypeIcon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text group-hover:text-primary transition-colors">{r.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {r.date}
                        </span>
                        <span className="text-[10px] text-text-muted">· {r.source}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-bold ${r.relevance >= 80 ? 'text-success' : r.relevance >= 60 ? 'text-warning' : 'text-text-muted'}`}>
                      %{r.relevance}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{r.content}</p>
              </div>
            );
          })}
        </div>
      )}

      {!isSearching && results.length === 0 && query === '' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center mt-10">
            {/* Icon removed as requested */}
            <p className="text-sm font-semibold text-text mb-1.5">Kurumsal hafızada arama yapın</p>
            <p className="text-xs text-text-secondary max-w-[250px] mx-auto leading-relaxed">
              Geçmiş toplantı kararları, proje detayları ve teknik çözümler saniyeler içinde elinizde.
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MemorySearch;
