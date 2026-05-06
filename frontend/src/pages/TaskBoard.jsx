import { useState } from 'react';
import {
  CheckSquare, Circle, CheckCircle2, Clock,
  AlertTriangle, ArrowUp, ArrowDown, Filter, Sparkles
} from 'lucide-react';

import { useTasks } from '../context/TaskContext';

/**
 * ══════════════════════════════════════════════
 *  Bu katman Skills Agent tarafından optimize
 *  edilmiştir.
 *  Fonksiyon: Görev Motoru — E-postadan otomatik görev çıkarma [MVP]
 * ══════════════════════════════════════════════
 */


const priorityConfig = {
  critical: { label: 'KRİTİK', class: 'bg-danger/20 text-danger', icon: AlertTriangle, order: 0 },
  high: { label: 'YÜKSEK', class: 'bg-warning/20 text-warning', icon: ArrowUp, order: 1 },
  medium: { label: 'ORTA', class: 'bg-primary/20 text-primary', icon: Filter, order: 2 },
  low: { label: 'DÜŞÜK', class: 'bg-success/20 text-success', icon: ArrowDown, order: 3 },
};

const statusConfig = {
  'pending': { label: 'Bekliyor', icon: Circle, class: 'text-text-muted' },
  'in-progress': { label: 'Devam Ediyor', icon: Clock, class: 'text-accent' },
  'completed': { label: 'Tamamlandı', icon: CheckCircle2, class: 'text-success' },
};

const TaskBoard = () => {
  const { tasks, toggleStatus } = useTasks();
  const [filterPriority, setFilterPriority] = useState('all');

  const filtered = filterPriority === 'all'
    ? tasks
    : tasks.filter(t => t.priority === filterPriority);

  const sorted = [...filtered].sort((a, b) => {
    const statusOrder = { 'in-progress': 0, 'pending': 1, 'completed': 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
    return priorityConfig[a.priority].order - priorityConfig[b.priority].order;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    critical: tasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length,
    totalMinutes: tasks.filter(t => t.status !== 'completed').reduce((s, t) => s + t.estimatedMinutes, 0),
  };

  return (
    <div className="p-6 space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-accent" />
            Görev Motoru
          </h2>
          <p className="text-sm text-text-secondary mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            E-postalardan otomatik oluşturuldu
          </p>
        </div>

        {/* Filtre Butonları */}
        <div className="flex gap-1.5">
          {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterPriority(f)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                filterPriority === f ? 'bg-primary text-white' : 'bg-card text-text-secondary hover:text-text'
              }`}
            >
              {f === 'all' ? 'Tümü' : priorityConfig[f]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Özet İstatistikler */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Toplam Görev', value: stats.total, color: 'text-text' },
          { label: 'Tamamlandı', value: stats.completed, color: 'text-success' },
          { label: 'Kritik Bekleyen', value: stats.critical, color: 'text-danger' },
          { label: 'Tahmini Süre', value: `${Math.round(stats.totalMinutes / 60 * 10) / 10} saat`, color: 'text-accent' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex justify-between text-xs text-text-secondary mb-2">
          <span>Günlük İlerleme</span>
          <span className="font-semibold text-text">{stats.completed}/{stats.total} görev</span>
        </div>
        <div className="h-2.5 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${(stats.completed / stats.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Görev Listesi */}
      <div className="space-y-2">
        {sorted.map((task) => {
          const pc = priorityConfig[task.priority];
          const sc = statusConfig[task.status];
          const StatusIcon = sc.icon;
          return (
            <div
              key={task.id}
              onClick={() => toggleStatus(task.id)}
              className={`flex items-start gap-4 p-4 bg-card border border-border rounded-xl cursor-pointer transition-all duration-200 hover:bg-card-hover hover:border-primary/20 ${
                task.status === 'completed' ? 'opacity-50' : ''
              }`}
            >
              <StatusIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${sc.class}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-text-muted' : 'text-text'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${pc.class}`}>
                    {pc.label}
                  </span>
                  <span className="text-[11px] text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.deadline}
                  </span>
                  <span className="text-[11px] text-text-muted">~{task.estimatedMinutes} dk</span>
                  <span className="text-[11px] text-accent">@{task.assignee}</span>
                </div>
                <p className="text-[11px] text-text-muted mt-1">Kaynak: {task.source}</p>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${sc.class} bg-card-hover`}>
                {sc.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
