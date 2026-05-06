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

// Sidebar navigasyon öğeleri
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
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-surface-elevated border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text tracking-tight">Asistanim</h1>
              <p className="text-[11px] text-text-muted font-medium">AI İş Akış Sistemi</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-text-secondary hover:text-text hover:bg-card'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-danger/20 text-danger">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span>Skills Agent Aktif</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-success animate-pulse-soft" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
