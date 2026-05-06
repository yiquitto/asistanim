/**
 * ══════════════════════════════════════════════
 *  Bu katman Skills Agent tarafından optimize edilmiştir.
 *  Fonksiyon: Frontend API Servis Katmanı
 *  Amaç: Backend ile iletişim için merkezi API çağrı fonksiyonları
 * ══════════════════════════════════════════════
 */

const API_BASE = 'http://localhost:3001/api';

/**
 * Genel API çağrı fonksiyonu — hata yönetimi dahil
 */
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || `API hatası: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API] ${endpoint} hatası:`, error.message);
    throw error;
  }
};

/**
 * E-posta analiz API — Skills Agent'a gönderir
 * @param {Object} emailData - { sender, subject, body, date }
 * @returns {Object} AI analiz sonucu (IUR skorları, XAI, görevler)
 */
export const analyzeEmail = async (emailData) => {
  const result = await apiCall('/email/analyze', {
    method: 'POST',
    body: JSON.stringify(emailData),
  });
  return result.data;
};

/**
 * Toplu e-posta analizi ile görev listesi üret
 * @param {Object[]} emails - E-posta dizisi
 * @returns {Object} Günlük plan ve görev listesi
 */
export const generateTasks = async (emails) => {
  const result = await apiCall('/tasks/generate', {
    method: 'POST',
    body: JSON.stringify({ emails }),
  });
  return result.data;
};

/**
 * Backend sağlık kontrolü
 */
export const checkHealth = async () => {
  const result = await apiCall('/health');
  return result.data;
};

export default { analyzeEmail, generateTasks, checkHealth };
