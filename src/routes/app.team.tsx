import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { team } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/team")({
  component: TeamPage,
});

const ROLES = ["Admin", "Analyst", "Researcher", "Viewer"];

function TeamPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Analyst");

  return (
    <div className="h-full overflow-y-auto">
      <PageHeader title="Team" subtitle="Invite teammates and manage roles (RBAC)" />
      <div className="p-6 max-w-5xl space-y-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><UserPlus className="size-4 text-primary" /> Invite a teammate</h3>
          <div className="grid md:grid-cols-[1fr_auto_auto] gap-3">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com"
              className="h-10 px-3 rounded-xl bg-background border border-input text-sm" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="h-10 px-3 rounded-xl bg-background border border-input text-sm">
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
            <button className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Send invite</button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            <b>Viewer</b> · read-only · <b>Analyst</b> · query + upload · <b>Admin</b> · full access
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase">User</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase">Role</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {team.map((u) => (
                <tr key={u.email} className="border-t border-border hover:bg-muted/40 transition">
                  <td className="px-5 py-3">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="px-5 py-3">
                    <select defaultValue={u.role} className="h-8 px-2 rounded-lg bg-background border border-input text-xs">
                      {ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.status === "Active" ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"}`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
