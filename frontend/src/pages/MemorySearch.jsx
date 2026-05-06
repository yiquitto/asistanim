import { useState } from 'react';
import { Search, Clock, FileText, Mail, Users, ArrowRight, Brain } from 'lucide-react';

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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    // Simüle edilmiş arama gecikmesi
    setTimeout(() => {
      setResults(dummyResults);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col animate-slide-up">
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
      <div className="relative mt-6 flex-shrink-0">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Kurumsal hafızada ara... (örn: 'müşteri SLA sorunu çözümü')"
              className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3.5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity flex-shrink-0"
          >
            Ara
          </button>
        </div>

        {/* Önerilen Aramalar */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['SLA çözüm geçmişi', 'bütçe kararları', 'KVKK politikası'].map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); handleSearch(); }}
              className="px-2.5 py-1 rounded-lg bg-surface-elevated text-[11px] text-text-muted hover:text-text transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Arama Sonuçları Container */}
      <div className="flex-1 overflow-y-auto mt-6 pb-6 pr-2">
        {isSearching && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Kurumsal hafıza taranıyor...
          </div>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-text-muted">{results.length} sonuç bulundu</p>
          {results.map((r) => {
            const TypeIcon = typeIcons[r.type];
            return (
              <div key={r.id} className="bg-card border border-border rounded-xl p-4 hover:bg-card-hover hover:border-primary/20 transition-all cursor-pointer group">
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
          <div className="text-center -mt-12">
            <div className="w-20 h-20 rounded-full bg-surface-elevated/50 flex items-center justify-center mx-auto mb-5 border border-border">
              <Brain className="w-10 h-10 text-primary opacity-50" />
            </div>
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
