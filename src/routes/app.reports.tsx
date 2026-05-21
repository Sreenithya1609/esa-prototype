import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart2, Download } from "lucide-react";
import { reports } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <PageHeader title="Reports" subtitle="Auto-generated and shareable" />
      <div className="p-6 space-y-3 max-w-5xl">
        {reports.map((r) => (
          <div key={r.name} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition">
            <div className="size-11 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <FileBarChart2 className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.agent} · {r.date}</div>
            </div>
            <div className="flex gap-2">
              {["PDF", "PPT", "CSV"].map((f) => (
                <button key={f} className="h-9 px-3 rounded-lg border border-border text-xs font-medium hover:bg-muted flex items-center gap-1.5">
                  <Download className="size-3.5" />{f}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
