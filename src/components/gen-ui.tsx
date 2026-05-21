/**
 * Generative UI System
 * All response-driven components live here.
 * ResponseRenderer is the single entry point — it maps section.type → component.
 */
import { useState } from "react";
import {
  TrendingUp, BarChart3, FileText, Search, Lightbulb,
  ChevronDown, ChevronUp, ExternalLink, CheckCircle2,
  AlertCircle, ArrowRight, Zap,
} from "lucide-react";

// ── Schema types ──────────────────────────────────────────────────────────────
export type AgentKey = "data" | "strategy" | "search" | "research";

export interface InsightSection {
  type: "insight";
  title: string;
  content: string;
  severity?: "info" | "warning" | "success";
}
export interface StrategySection {
  type: "strategy";
  title: string;
  content: string;
  steps?: string[];
}
export interface ChartSection {
  type: "chart";
  title?: string;
  data: { label: string; value: number; color?: string }[];
}
export interface DocumentsSection {
  type: "documents";
  title?: string;
  items: { name: string; relevance: number; type: string }[];
}
export interface MetricsSection {
  type: "metrics";
  title?: string;
  items: { label: string; value: string; change?: number }[];
}
export interface SummarySection {
  type: "summary";
  title?: string;
  content: string;
}

export type Section =
  | InsightSection
  | StrategySection
  | ChartSection
  | DocumentsSection
  | MetricsSection
  | SummarySection;

export interface AIResponse {
  agents: AgentKey[];
  executionTime: string;
  steps: string[];
  sections: Section[];
}

// ── Agent meta ────────────────────────────────────────────────────────────────
export const AGENT_META: Record<AgentKey, { label: string; color: string; bg: string }> = {
  data:     { label: "Data Analyst", color: "var(--agent-data)",     bg: "bg-[var(--agent-data)]/10 text-[var(--agent-data)] border-[var(--agent-data)]/25" },
  strategy: { label: "Strategy",     color: "var(--agent-strategy)", bg: "bg-[var(--agent-strategy)]/10 text-[var(--agent-strategy)] border-[var(--agent-strategy)]/25" },
  search:   { label: "Search",       color: "var(--agent-search)",   bg: "bg-[var(--agent-search)]/10 text-[var(--agent-search)] border-[var(--agent-search)]/25" },
  research: { label: "Research",     color: "var(--agent-research)", bg: "bg-[var(--agent-research)]/10 text-[var(--agent-research)] border-[var(--agent-research)]/25" },
};

// ── AgentChips ────────────────────────────────────────────────────────────────
export function AgentChips({ agentKeys, executionTime }: { agentKeys: AgentKey[]; executionTime: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {agentKeys.map((k) => {
        const m = AGENT_META[k];
        return (
          <span key={k} className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1.5 ${m.bg}`}>
            <span className="size-1.5 rounded-full animate-none" style={{ background: m.color }} />
            {m.label}
          </span>
        );
      })}
      <span className="text-[11px] text-muted-foreground flex items-center gap-1 ml-auto">
        <Zap className="size-3" /> {executionTime}
      </span>
    </div>
  );
}

// ── InsightCard ───────────────────────────────────────────────────────────────
export function InsightCard({ section }: { section: InsightSection }) {
  const sev = section.severity ?? "info";
  const map = {
    info:    { icon: Lightbulb,     color: "var(--agent-research)", ring: "border-[var(--agent-research)]/20" },
    warning: { icon: AlertCircle,   color: "#f59e0b",               ring: "border-amber-400/30" },
    success: { icon: CheckCircle2,  color: "#22c55e",               ring: "border-green-500/30" },
  };
  const { icon: Icon, color, ring } = map[sev];
  return (
    <div className={`bg-card border ${ring} rounded-2xl p-4 space-y-2.5 shadow-sm`}>
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg grid place-items-center shrink-0"
          style={{ background: `color-mix(in oklab, ${color} 14%, transparent)`, color }}>
          <Icon className="size-4" />
        </div>
        <h4 className="text-sm font-semibold">{section.title}</h4>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{section.content}</p>
    </div>
  );
}

// ── StrategyCard ──────────────────────────────────────────────────────────────
export function StrategyCard({ section }: { section: StrategySection }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-card border border-[var(--agent-strategy)]/20 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted/30 transition"
      >
        <div className="size-7 rounded-lg grid place-items-center shrink-0"
          style={{ background: "color-mix(in oklab, var(--agent-strategy) 14%, transparent)", color: "var(--agent-strategy)" }}>
          <TrendingUp className="size-4" />
        </div>
        <h4 className="text-sm font-semibold flex-1 text-left">{section.title}</h4>
        {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border">
          <p className="text-sm text-foreground/80 leading-relaxed pt-3">{section.content}</p>
          {section.steps && section.steps.length > 0 && (
            <ol className="space-y-2">
              {section.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="size-5 rounded-full grid place-items-center shrink-0 text-[10px] font-bold mt-0.5"
                    style={{ background: "color-mix(in oklab, var(--agent-strategy) 14%, transparent)", color: "var(--agent-strategy)" }}>
                    {i + 1}
                  </span>
                  <span className="text-foreground/80">{s}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

// ── ChartCard ─────────────────────────────────────────────────────────────────
export function ChartCard({ section }: { section: ChartSection }) {
  const max = Math.max(...section.data.map((d) => d.value), 1);
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg grid place-items-center shrink-0"
          style={{ background: "color-mix(in oklab, var(--agent-data) 14%, transparent)", color: "var(--agent-data)" }}>
          <BarChart3 className="size-4" />
        </div>
        <h4 className="text-sm font-semibold">{section.title ?? "Chart"}</h4>
      </div>
      {section.data.length === 0 ? (
        <p className="text-xs text-muted-foreground py-4 text-center">No chart data available.</p>
      ) : (
        <div className="flex items-end gap-2 h-28 pt-2">
          {section.data.map((d, i) => {
            const h = (d.value / max) * 100;
            const color = d.color ?? "var(--agent-data)";
            const isHov = hovered === i;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative"
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                {isHov && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-xl px-2.5 py-1.5 text-xs shadow-lg z-10 whitespace-nowrap pointer-events-none">
                    <span className="font-semibold">{d.label}</span>: {d.value}
                  </div>
                )}
                <div className="w-full rounded-t-md transition-all duration-500"
                  style={{ height: `${h}%`, background: isHov ? color : `color-mix(in oklab, ${color} 75%, transparent)` }} />
                <span className="text-[9px] text-muted-foreground truncate w-full text-center">{d.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── DocumentsList ─────────────────────────────────────────────────────────────
export function DocumentsList({ section }: { section: DocumentsSection }) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="size-7 rounded-lg grid place-items-center shrink-0"
          style={{ background: "color-mix(in oklab, var(--agent-search) 14%, transparent)", color: "var(--agent-search)" }}>
          <FileText className="size-4" />
        </div>
        <h4 className="text-sm font-semibold">{section.title ?? "Documents Found"}</h4>
        <span className="ml-auto text-[11px] text-muted-foreground">{section.items.length} files</span>
      </div>
      {section.items.length === 0 ? (
        <p className="text-xs text-muted-foreground px-4 py-4">No documents found.</p>
      ) : (
        <div className="divide-y divide-border">
          {section.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition group">
              <div className="size-8 rounded-lg grid place-items-center shrink-0 bg-muted">
                <FileText className="size-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.name}</div>
                <div className="text-[11px] text-muted-foreground">{item.type}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.relevance}%`, background: "var(--agent-search)" }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums">{item.relevance}%</span>
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MetricsCard ───────────────────────────────────────────────────────────────
export function MetricsCard({ section }: { section: MetricsSection }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm">
      {section.title && (
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg grid place-items-center shrink-0"
            style={{ background: "color-mix(in oklab, var(--agent-data) 14%, transparent)", color: "var(--agent-data)" }}>
            <BarChart3 className="size-4" />
          </div>
          <h4 className="text-sm font-semibold">{section.title}</h4>
        </div>
      )}
      <div className={`grid gap-3 ${section.items.length >= 3 ? "grid-cols-3" : section.items.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {section.items.map((item, i) => (
          <div key={i} className="bg-muted/40 rounded-xl p-3 space-y-1">
            <div className="text-xs text-muted-foreground">{item.label}</div>
            <div className="text-lg font-semibold tracking-tight">{item.value}</div>
            {item.change !== undefined && (
              <div className={`text-[11px] font-medium flex items-center gap-1 ${item.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                {item.change >= 0 ? <TrendingUp className="size-3" /> : <Search className="size-3 rotate-180" />}
                {item.change >= 0 ? "+" : ""}{item.change}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SummaryCard ───────────────────────────────────────────────────────────────
export function SummaryCard({ section }: { section: SummarySection }) {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/15 rounded-2xl p-4 space-y-2">
      {section.title && <h4 className="text-sm font-semibold">{section.title}</h4>}
      <p className="text-sm text-foreground/80 leading-relaxed">{section.content}</p>
    </div>
  );
}

// ── Component registry (type → component) ────────────────────────────────────
// Add new section types here — no if-else chains anywhere.
const SECTION_REGISTRY: Record<string, React.ComponentType<{ section: any }>> = {
  insight:   ({ section }) => <InsightCard   section={section as InsightSection} />,
  strategy:  ({ section }) => <StrategyCard  section={section as StrategySection} />,
  chart:     ({ section }) => <ChartCard     section={section as ChartSection} />,
  documents: ({ section }) => <DocumentsList section={section as DocumentsSection} />,
  metrics:   ({ section }) => <MetricsCard   section={section as MetricsSection} />,
  summary:   ({ section }) => <SummaryCard   section={section as SummarySection} />,
};

// ── Adaptive layout helper ────────────────────────────────────────────────────
function getLayoutClass(count: number): string {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 md:grid-cols-2";   // 3+ → responsive 2-col, items span as needed
}

// ── ResponseRenderer ──────────────────────────────────────────────────────────
export function ResponseRenderer({
  response,
  visibleCount,
}: {
  response: AIResponse;
  visibleCount: number;   // how many sections to show (for progressive reveal)
}) {
  const visible = response.sections.slice(0, visibleCount);

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
        <Search className="size-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No results to display.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Agent chips + execution time */}
      <AgentChips agentKeys={response.agents} executionTime={response.executionTime} />

      {/* Adaptive section grid */}
      <div className={`grid gap-3 ${getLayoutClass(visible.length)}`}>
        {visible.map((section, i) => {
          const Comp = SECTION_REGISTRY[section.type];
          if (!Comp) return null;
          return (
            <div
              key={i}
              className="transition-all duration-500"
              style={{
                opacity: 1,
                transform: "translateY(0)",
                // Full-width for single section or odd last item in 2-col
                gridColumn: visible.length === 1 || (visible.length >= 3 && i === visible.length - 1 && visible.length % 2 !== 0)
                  ? "1 / -1"
                  : undefined,
              }}
            >
              <Comp section={section} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── ExecutionTimeline (loading state) ─────────────────────────────────────────
export function ExecutionTimeline({
  steps,
  currentStep,
  agentKeys,
}: {
  steps: string[];
  currentStep: number;
  agentKeys: AgentKey[];
}) {
  return (
    <div className="space-y-3">
      {/* Agent chips in loading state */}
      <div className="flex flex-wrap gap-1.5">
        {agentKeys.map((k) => {
          const m = AGENT_META[k];
          return (
            <span key={k} className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1.5 ${m.bg}`}>
              <span className="size-1.5 rounded-full animate-pulse" style={{ background: m.color }} />
              {m.label}
            </span>
          );
        })}
      </div>

      {/* Step list */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-2.5">
        {steps.map((step, i) => {
          const done    = i < currentStep;
          const active  = i === currentStep;
          const pending = i > currentStep;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                pending ? "opacity-30" : "opacity-100"
              }`}
            >
              {/* Status icon */}
              <div className="shrink-0 size-5 grid place-items-center">
                {done && <CheckCircle2 className="size-4 text-green-500" />}
                {active && (
                  <span className="relative flex size-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full size-3 bg-primary" />
                  </span>
                )}
                {pending && <span className="size-2 rounded-full bg-muted-foreground/30" />}
              </div>
              <span className={active ? "text-foreground font-medium" : done ? "text-muted-foreground line-through" : "text-muted-foreground"}>
                {step}
              </span>
              {active && (
                <ArrowRight className="size-3.5 text-primary ml-auto animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
