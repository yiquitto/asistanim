import { useState } from 'react';
import {
  CheckSquare, Circle, CheckCircle2, Clock,
  AlertTriangle, ArrowUp, ArrowDown, Filter, Sparkles, Plus, X, Trash2
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
  const { tasks, toggleStatus, addTask, removeTask } = useTasks();
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', deadline: '' });

  const filtered = filterPriority === 'all'
    ? tasks
    : tasks.filter(t => t.priority === filterPriority);

  const sorted = [...filtered].sort((a, b) => {
    const statusOrder = { 'in-progress': 0, 'pending': 1, 'completed': 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
    const orderA = priorityConfig[a.priority]?.order ?? 2; // fallback to medium
    const orderB = priorityConfig[b.priority]?.order ?? 2; // fallback to medium
    return orderA - orderB;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    critical: tasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length,
    totalMinutes: tasks.filter(t => t.status !== 'completed').reduce((s, t) => s + t.estimatedMinutes, 0),
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    addTask({
      title: newTask.title,
      source: 'Manuel Ekleme',
      priority: newTask.priority,
      deadline: newTask.deadline || 'Belirtilmedi',
      estimatedMinutes: 30,
      status: 'pending',
      assignee: 'Siz',
    });
    setNewTask({ title: '', priority: 'medium', deadline: '' });
    setShowAddForm(false);
  };

  return (
    <div className="p-8 space-y-6 animate-slide-up">
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

        <div className="flex items-center gap-2">
          {/* Görev Ekle Butonu */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-colors"
          >
            {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showAddForm ? 'İptal' : 'Görev Ekle'}
          </button>

          {/* Filtre Butonları */}
          <div className="flex gap-2">
            {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterPriority(f)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-300 border ${
                  filterPriority === f 
                    ? 'bg-primary/15 text-primary border-primary/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
                    : 'bg-surface/30 text-text-muted border-border/40 hover:border-border/80 hover:text-text hover:bg-surface/80'
                }`}
              >
                {f === 'all' ? 'Tümü' : priorityConfig[f]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manuel Görev Ekleme Formu */}
      {showAddForm && (
        <div className="bg-card border border-primary/30 rounded-xl p-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Görev başlığı..."
              className="flex-1 px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              autoFocus
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-text focus:outline-none focus:border-primary/50"
            >
              <option value="critical">Kritik</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
            <input
              type="text"
              value={newTask.deadline}
              onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
              placeholder="Deadline..."
              className="w-32 px-3 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-text placeholder-text-muted focus:outline-none focus:border-primary/50"
            />
            <button onClick={handleAddTask} className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/80 transition-colors">
              Ekle
            </button>
          </div>
        </div>
      )}

      {/* Özet İstatistikler */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Toplam Görev', value: stats.total, color: 'text-text' },
          { label: 'Tamamlandı', value: stats.completed, color: 'text-success' },
          { label: 'Kritik Bekleyen', value: stats.critical, color: 'text-danger' },
          { label: 'Tahmini Süre', value: `${Math.round(stats.totalMinutes / 60 * 10) / 10} saat`, color: 'text-accent' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex justify-between text-xs text-text-secondary mb-2">
          <span>Günlük İlerleme</span>
          <span className="font-semibold text-text">{stats.completed}/{stats.total} görev</span>
        </div>
        <div className="h-2.5 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Görev Listesi */}
      <div className="space-y-3">
        {sorted.map((task) => {
          const pc = priorityConfig[task.priority];
          const sc = statusConfig[task.status];
          const StatusIcon = sc.icon;
          return (
            <div
              key={task.id}
              className={`flex items-start gap-4 p-5 bg-card border border-border rounded-2xl transition-all duration-200 hover:bg-card-hover hover:border-primary/20 group ${
                task.status === 'completed' ? 'opacity-50' : ''
              }`}
            >
              <StatusIcon
                className={`w-5 h-5 mt-0.5 flex-shrink-0 cursor-pointer ${sc.class} hover:scale-110 transition-transform`}
                onClick={() => toggleStatus(task.id)}
              />
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleStatus(task.id)}>
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
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${sc.class} bg-card-hover`}>
                  {sc.label}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeTask(task.id); }}
                  className="p-1 rounded-lg text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/10 transition-all"
                  title="Görevi sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
