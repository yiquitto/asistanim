/**
 * ══════════════════════════════════════════════
 *  Bu katman Skills Agent tarafından optimize edilmiştir.
 *  Fonksiyon: PII (Kişisel Veri) Maskeleme Servisi
 *  Amaç: AI API'lerine gönderilmeden önce hassas verileri maskeler
 * ══════════════════════════════════════════════
 */

const PII_PATTERNS = [
  { name: 'TC Kimlik No', pattern: /\b[1-9]\d{10}\b/g, mask: '[TC_MASKED]' },
  { name: 'Telefon', pattern: /\b0?5\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}\b/g, mask: '[PHONE_MASKED]' },
  { name: 'E-posta', pattern: /[\w.-]+@[\w.-]+\.\w{2,}/g, mask: '[EMAIL_MASKED]' },
  { name: 'IBAN', pattern: /\bTR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}\b/g, mask: '[IBAN_MASKED]' },
  { name: 'Kredi Kartı', pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, mask: '[CC_MASKED]' },
];

/**
 * Verilen metindeki tüm PII verilerini maskeler
 * @param {string} text - Maskelenecek metin
 * @returns {string} Maskelenmiş metin
 */
export const maskPII = (text) => {
  if (!text || typeof text !== 'string') return text;

  let masked = text;
  const detectedTypes = [];

  PII_PATTERNS.forEach(({ name, pattern, mask }) => {
    const matches = masked.match(pattern);
    if (matches && matches.length > 0) {
      detectedTypes.push({ type: name, count: matches.length });
      masked = masked.replace(pattern, mask);
    }
  });

  if (detectedTypes.length > 0) {
    console.log('[PII Maskeleme] Tespit edilen hassas veri:', detectedTypes);
  }

  return masked;
};

/**
 * Metinde PII olup olmadığını kontrol eder (maskelemeden)
 * @param {string} text
 * @returns {Object[]} Tespit edilen PII tipleri ve sayıları
 */
export const detectPII = (text) => {
  if (!text) return [];

  return PII_PATTERNS.reduce((detected, { name, pattern }) => {
    const matches = text.match(pattern);
    if (matches) detected.push({ type: name, count: matches.length });
    return detected;
  }, []);
};

export default { maskPII, detectPII };
