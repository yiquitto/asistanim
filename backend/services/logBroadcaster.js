/**
 * ══════════════════════════════════════════════
 *  Canlı Log Yayın Servisi (SSE)
 *  Frontend'e gerçek zamanlı backend loglarını akıtır.
 * ══════════════════════════════════════════════
 */

const clients = new Set();

/**
 * SSE client'ı kaydet
 */
export const addClient = (res) => {
  clients.add(res);
  res.on('close', () => clients.delete(res));
};

/**
 * Tüm bağlı client'lara log gönder
 * @param {string} emoji - Log ikonu
 * @param {string} message - Log mesajı
 * @param {string} type - Log tipi: info | success | warning | error | stage
 * @param {Object} meta - Ek veri (opsiyonel)
 */
export const broadcast = (emoji, message, type = 'info', meta = {}) => {
  const event = {
    id: Date.now(),
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    emoji,
    message,
    type,
    ...meta,
  };

  const data = `data: ${JSON.stringify(event)}\n\n`;
  clients.forEach((client) => {
    try { client.write(data); } catch (_) { clients.delete(client); }
  });
};

export const getClientCount = () => clients.size;

export default { addClient, broadcast, getClientCount };
