import { createContext, useState, useContext } from 'react';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

const initialTasks = [
  {
    id: 1,
    title: 'Q3 Bütçe revizyonunu tamamla ve CEO\'ya gönder',
    source: 'CEO E-postası — Q3 Bütçe Revizyonu',
    priority: 'critical',
    deadline: 'Bugün 17:00',
    estimatedMinutes: 120,
    status: 'in-progress',
    assignee: 'Siz',
  },
  {
    id: 2,
    title: 'SLA ihlali için müşteriye acil yanıt gönder',
    source: 'Müşteri Şikayeti — SLA İhlali',
    priority: 'critical',
    deadline: 'Bugün 13:00',
    estimatedMinutes: 30,
    status: 'pending',
    assignee: 'Siz',
  },
  {
    id: 3,
    title: 'Destek ekibiyle SLA durumu hakkında toplantı yap',
    source: 'Müşteri Şikayeti — SLA İhlali',
    priority: 'high',
    deadline: 'Bugün 14:00',
    estimatedMinutes: 45,
    status: 'pending',
    assignee: 'Siz',
  },
  {
    id: 4,
    title: 'Dijital kampanya materyallerini incele ve geri bildirim hazırla',
    source: 'Pazarlama — Kampanya Materyalleri',
    priority: 'medium',
    deadline: 'Cuma',
    estimatedMinutes: 60,
    status: 'pending',
    assignee: 'Siz',
  },
  {
    id: 5,
    title: 'Pazarlama toplantısı aksiyon maddelerini takip et',
    source: 'Toplantı Özeti — Pazarlama Strateji',
    priority: 'medium',
    deadline: 'Çarşamba',
    estimatedMinutes: 30,
    status: 'completed',
    assignee: 'Siz',
  },
  {
    id: 6,
    title: 'Haziran izin planını İK portalına gir',
    source: 'İK — İzin Planlaması',
    priority: 'low',
    deadline: '20 Mayıs',
    estimatedMinutes: 10,
    status: 'pending',
    assignee: 'Siz',
  },
  {
    id: 7,
    title: 'Sunucu performans raporunu arşivle',
    source: 'Sistem — Haftalık Rapor',
    priority: 'low',
    deadline: 'Bu hafta',
    estimatedMinutes: 5,
    status: 'completed',
    assignee: 'Siz',
  },
  {
    id: 8,
    title: 'Phishing e-postasını güvenlik ekibine bildir',
    source: 'Güvenlik Tespiti — Phishing Uyarısı',
    priority: 'high',
    deadline: 'Bugün',
    estimatedMinutes: 15,
    status: 'pending',
    assignee: 'Siz',
  },
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = (task) => {
    setTasks(prev => [{ ...task, id: Date.now() + Math.random() }, ...prev]);
  };

  const toggleStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nextStatus = { 'pending': 'in-progress', 'in-progress': 'completed', 'completed': 'pending' };
      return { ...t, status: nextStatus[t.status] };
    }));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleStatus }}>
      {children}
    </TaskContext.Provider>
  );
};
