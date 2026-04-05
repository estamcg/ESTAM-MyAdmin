import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Users, GraduationCap, Briefcase, BookOpen,
  Wallet, Bell, Settings, Menu, X, ChevronLeft, Search, LogOut
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Tableau de Bord" },
  { to: "/etudiants", icon: Users, label: "Étudiants" },
  { to: "/academique", icon: GraduationCap, label: "Académique" },
  { to: "/personnel", icon: Briefcase, label: "Personnel" },
  { to: "/bibliotheque", icon: BookOpen, label: "Bibliothèque" },
  { to: "/finances", icon: Wallet, label: "Finances" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/parametres", icon: Settings, label: "Paramètres" },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const currentLabel = navItems.find(
    (n) => n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to)
  )?.label ?? "ESTAM MyAdmin";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 h-full flex flex-col bg-estam-navy text-white transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "w-[68px]" : "w-60"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
          <img src="/Assets/img/favicon.png" alt="ESTAM" className="w-9 h-9 rounded" />
          {!collapsed && <span className="font-bold text-lg tracking-tight">ESTAM MyAdmin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm transition-colors
                ${isActive ? "bg-estam-red text-white font-semibold" : "text-white/70 hover:text-white hover:bg-white/5"}
                ${collapsed ? "justify-center px-3" : ""}`
              }
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center gap-2 px-5 py-4 text-white/50 hover:text-white border-t border-white/10 text-sm"
        >
          <ChevronLeft size={18} className={collapsed ? "rotate-180" : ""} />
          {!collapsed && <span>Réduire</span>}
        </button>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-semibold">{currentLabel}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 text-sm border rounded-lg bg-background w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                AE
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium leading-tight">Admin ESTAM</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
