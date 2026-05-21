import { createFileRoute } from "@tanstack/react-router";
import { Upload, Database, Cloud, HardDrive } from "lucide-react";
import { dataSources } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/data")({
  component: DataPage,
});

function DataPage() {
  return (
    <div className="h-full overflow-y-auto">
      <PageHeader title="Data Sources" subtitle="Connect files, drives, and databases" />
      <div className="p-6 space-y-6 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-4">
          <ConnectCard icon={Upload} title="Upload files" desc="CSV, PDF, Excel — up to 200MB" accent="var(--agent-strategy)" />
          <ConnectCard icon={Cloud} title="Google Drive" desc="Sync folders automatically" accent="var(--agent-data)" />
          <ConnectCard icon={HardDrive} title="Amazon S3" desc="Connect with IAM role" accent="var(--agent-research)" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-primary" />
            <h3 className="font-semibold">Connect a Database</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-3">
            <select className="h-10 px-3 rounded-xl bg-background border border-input text-sm">
              <option>Postgres</option><option>MySQL</option><option>Snowflake</option><option>BigQuery</option>
            </select>
            <input placeholder="Host" className="h-10 px-3 rounded-xl bg-background border border-input text-sm" />
            <input placeholder="Database name" className="h-10 px-3 rounded-xl bg-background border border-input text-sm" />
            <button className="h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Connect</button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold">Connected sources</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr><Th>Name</Th><Th>Type</Th><Th>Status</Th><Th>Updated</Th></tr>
            </thead>
            <tbody>
              {dataSources.map((d) => (
                <tr key={d.name} className="border-t border-border hover:bg-muted/40 transition">
                  <td className="px-5 py-3 font-medium">{d.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.type}</td>
                  <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{d.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider">{children}</th>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-green-500/15 text-green-600 dark:text-green-400",
    Syncing: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    Error: "bg-red-500/15 text-red-600 dark:text-red-400",
  };
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${map[status] ?? "bg-muted"}`}>{status}</span>;
}

function ConnectCard({ icon: Icon, title, desc, accent }: { icon: typeof Upload; title: string; desc: string; accent: string }) {
  return (
    <button className="text-left p-5 rounded-2xl border border-border bg-card hover:shadow-sm hover:border-primary/40 transition group">
      <div className="size-10 rounded-xl grid place-items-center mb-3" style={{ background: `color-mix(in oklab, ${accent} 12%, transparent)`, color: accent }}>
        <Icon className="size-5" />
      </div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    </button>
  );
}
