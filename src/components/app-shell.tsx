import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, MessageSquare, Database, FileBarChart2,
  Users, Settings, CreditCard, ScrollText, Sparkles, Moon, Sun,
  User, LogOut, ChevronUp, Bell, Shield,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const nav = [
  { to: "/app/dashboard", label: "Dashboard",   icon: LayoutDashboard },
  { to: "/app/chat",      label: "AI Chat",      icon: MessageSquare },
  { to: "/app/data",      label: "Data Sources", icon: Database },
  { to: "/app/reports",   label: "Reports",      icon: FileBarChart2 },
  { to: "/app/team",      label: "Team",         icon: Users },
  { to: "/app/settings",  label: "Settings",     icon: Settings },
  { to: "/app/billing",   label: "Billing",      icon: CreditCard },
  { to: "/app/audit",     label: "Audit Logs",   icon: ScrollText },
];

// Mock current user — in a real app this comes from auth context
const CURRENT_USER = {
  name: "Aarav Mehta",
  email: "aarav@acme.io",
  company: "Acme",
  role: "Admin",
  initials: "AM",
};

export function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSignOut() {
    setMenuOpen(false);
    navigate({ to: "/login" });
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="px-5 h-16 flex items-center gap-2 border-b border-sidebar-border">
          <div className="size-8 rounded-xl bg-primary text-primary-foreground grid place-items-center">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">ESA</div>
            <div className="text-[11px] text-muted-foreground leading-tight">Enterprise Strategy</div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((n) => {
            const active = path === n.to || path.startsWith(n.to + "/");
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <n.icon className="size-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* ── User profile area ── */}
        <div className="p-3 border-t border-sidebar-border relative" ref={menuRef}>
          {/* Profile dropdown menu */}
          {menuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-popover border border-border rounded-2xl shadow-lg overflow-hidden z-50">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-[var(--agent-search)] grid place-items-center shrink-0">
                    <span className="text-xs font-semibold text-primary-foreground">
                      {CURRENT_USER.initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{CURRENT_USER.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{CURRENT_USER.email}</div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5 space-y-0.5">
                <MenuItem
                  icon={User}
                  label="View profile"
                  onClick={() => { setMenuOpen(false); navigate({ to: "/app/profile" }); }}
                />
                <MenuItem
                  icon={Bell}
                  label="Notifications"
                  onClick={() => { setMenuOpen(false); navigate({ to: "/app/profile" }); }}
                />
                <MenuItem
                  icon={Shield}
                  label="Security"
                  onClick={() => { setMenuOpen(false); navigate({ to: "/app/profile" }); }}
                />
                <MenuItem
                  icon={dark ? Sun : Moon}
                  label={dark ? "Light mode" : "Dark mode"}
                  onClick={() => { setDark(!dark); }}
                />
              </div>

              {/* Sign out */}
              <div className="p-1.5 border-t border-border">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}

          {/* Trigger button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-colors ${
              menuOpen
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/60 text-sidebar-foreground"
            }`}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            {/* Avatar */}
            <div className="size-8 rounded-full bg-gradient-to-br from-primary to-[var(--agent-search)] grid place-items-center shrink-0">
              <span className="text-[11px] font-semibold text-primary-foreground">
                {CURRENT_USER.initials}
              </span>
            </div>
            {/* Name + role */}
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium truncate leading-tight">{CURRENT_USER.name}</div>
              <div className="text-[11px] text-muted-foreground truncate leading-tight">
                {CURRENT_USER.company} · {CURRENT_USER.role}
              </div>
            </div>
            {/* Chevron */}
            <ChevronUp
              className={`size-3.5 text-muted-foreground transition-transform shrink-0 ${
                menuOpen ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

// ── Reusable menu item ────────────────────────────────────────────────────────
function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof User;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-popover-foreground hover:bg-muted transition-colors"
    >
      <Icon className="size-4 text-muted-foreground" />
      {label}
    </button>
  );
}
