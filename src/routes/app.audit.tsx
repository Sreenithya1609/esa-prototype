import { createFileRoute } from "@tanstack/react-router";
import { auditLogs } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/audit")({
  component: AuditPage,
});

function AuditPage() {
  return (
    <div className="h-full overflow-y-auto">
      <PageHeader title="Audit Logs" subtitle="Track every action across your workspace" />
      <div className="p-6 max-w-6xl">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase">Timestamp</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase">User</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase">Action</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((l, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/40 transition">
                  <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{l.ts}</td>
                  <td className="px-5 py-3">{l.user}</td>
                  <td className="px-5 py-3">{l.action}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${l.status === "Success" ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-red-500/15 text-red-600 dark:text-red-400"}`}>{l.status}</span>
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
