import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, MessageSquare, Database, FileBarChart2,
  Users, Settings, CreditCard, ScrollText, Sparkles, Moon, Sun,
} from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/app/data", label: "Data Sources", icon: Database },
  { to: "/app/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/app/team", label: "Team", icon: Users },
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/billing", label: "Billing", icon: CreditCard },
  { to: "/app/audit", label: "Audit Logs", icon: ScrollText },
];

export function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <aside className="w-60 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="px-5 h-16 flex items-center gap-2 border-b border-sidebar-border">
          <div className="size-8 rounded-xl bg-primary text-primary-foreground grid place-items-center">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">ESA</div>
            <div className="text-[11px] text-muted-foreground leading-tight">Enterprise Strategy</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((n) => {
            const active = n.exact ? path === n.to : path === n.to || path.startsWith(n.to + "/");
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
        <div className="p-3 border-t border-sidebar-border flex items-center gap-3">
          <div className="size-8 rounded-full bg-gradient-to-br from-primary to-[var(--agent-search)]" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Aarav Mehta</div>
            <div className="text-xs text-muted-foreground truncate">Acme · Admin</div>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="size-8 grid place-items-center rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
