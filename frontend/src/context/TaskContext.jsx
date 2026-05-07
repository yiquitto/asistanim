import { createContext, useState, useContext, useEffect } from 'react';

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

// localStorage'dan yükle veya varsayılanları kullan
const loadTasks = () => {
  try {
    const saved = localStorage.getItem('asistanim_tasks');
    if (saved) return JSON.parse(saved);
  } catch {}
  return initialTasks;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(loadTasks);

  // localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('asistanim_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Yeni e-postalar geldiğinde AI tarafından çıkarılan görevleri yakala
  useEffect(() => {
    const es = new EventSource('http://localhost:3001/api/logs/stream');
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === 'new_email') {
          console.log("TaskContext new_email received:", data.emailData);
        }
        if (data.event === 'new_email' && data.emailData && data.emailData.suggestedTasks) {
          const email = data.emailData;
          const newTasks = email.suggestedTasks.map(t => ({
            id: Date.now() + Math.random(),
            title: t.title || t, // Bazı LLM'ler düz string dönebilir
            source: email.subject,
            priority: t.priority === 'urgent' ? 'critical' : (t.priority === 'normal' ? 'medium' : (t.priority || 'medium')),
            deadline: t.deadline || 'Belirtilmemiş',
            estimatedMinutes: 30,
            status: 'pending',
            assignee: t.assignee || 'Siz',
          }));
          
          if (newTasks.length > 0) {
            setTasks(prev => {
              // Aynı source ve title'a sahip görev varsa ekleme (önlem)
              const filtered = newTasks.filter(nt => !prev.some(pt => pt.title === nt.title && pt.source === nt.source));
              return [...filtered, ...prev];
            });
          }
        }
      } catch (err) {}
    };
    return () => es.close();
  }, []);

  const addTask = (task) => {
    setTasks(prev => [{ ...task, id: Date.now() + Math.random() }, ...prev]);
  };

  const removeTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nextStatus = { 'pending': 'in-progress', 'in-progress': 'completed', 'completed': 'pending' };
      return { ...t, status: nextStatus[t.status] };
    }));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, removeTask, toggleStatus }}>
      {children}
    </TaskContext.Provider>
  );
};
