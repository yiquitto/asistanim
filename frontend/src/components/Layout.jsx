import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mail,
  CheckSquare,
  Users,
  ShieldAlert,
  Search,
  Brain,
  Zap,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { to: '/email', icon: Mail, label: 'E-Posta Zekâsı', badge: '12' },
  { to: '/tasks', icon: CheckSquare, label: 'Görev Motoru', badge: '8' },
  { to: '/meetings', icon: Users, label: 'Toplantı Zekâsı', badge: null },
  { to: '/risks', icon: ShieldAlert, label: 'Risk Paneli', badge: '2' },
  { to: '/memory', icon: Search, label: 'Kurumsal Hafıza', badge: null },
];

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-surface relative">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 glass-panel flex flex-col relative z-20"
        style={{ borderRight: '0.5px solid rgba(255,255,255,0.06)' }}>
        
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border/50 relative">
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-glow shadow-lg shadow-primary/25">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text tracking-tight leading-tight">Asistanım</h1>
              <p className="text-[9px] text-primary-light font-semibold uppercase tracking-[0.15em]">Enterprise AI</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto relative z-10">
          <p className="px-3 text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1">Modüller</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/15 text-white border border-primary/25 shadow-[0_0_12px_rgba(59,130,246,0.08)]'
                    : 'text-text-secondary bg-white/[0.02] border border-transparent hover:text-white hover:bg-white/[0.05] hover:border-border-light'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'bg-primary/20' : 'bg-white/[0.04] group-hover:bg-white/[0.06]'
                  }`}>
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-primary-light' : 'text-text-muted group-hover:text-text-secondary'}`} />
                  </div>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`font-data text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-primary/25 text-primary-light' : 'bg-white/[0.05] text-text-muted'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Agent Status */}
        <div className="px-3 py-4 border-t border-border/50 relative z-10">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-accent/[0.06] border border-accent/15">
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-accent" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-semibold text-accent tracking-wide block leading-tight">Skills Agent</span>
              <span className="text-[9px] text-text-muted">Aktif · Bağlı</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
