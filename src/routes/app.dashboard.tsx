import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  TrendingUp, TrendingDown, Sparkles, ArrowRight, BarChart3,
  Search, Lightbulb, RefreshCw, ChevronRight, Activity, Zap,
  AlertCircle, CheckCircle2, Clock, Send, History, X,
  Database, Bot, Cpu, Globe,
} from "lucide-react";
import {
  kpis, revenueTrend, agentUsage, recentInsights, agents,
  type AgentKey,
} from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

// ── Types ────────────────────────────────────────────────────────────────────
type GenPhase = "idle" | "thinking" | "streaming" | "rendering" | "done";

interface StreamStep {
  agent: AgentKey | "system";
  label: string;
  detail: string;
  durationMs: number;
}

interface PromptHistory {
  text: string;
  ts: string;
}

// ── Prompt → stream steps mapping ────────────────────────────────────────────
function getStepsForPrompt(prompt: string): StreamStep[] {
  const p = prompt.toLowerCase();
  const steps: StreamStep[] = [
    { agent: "system", label: "Parsing intent",        detail: `Understanding: "${prompt.slice(0, 40)}${prompt.length > 40 ? "…" : ""}"`, durationMs: 600 },
    { agent: "system", label: "Connecting data sources", detail: "Sales DB · Q3-Financials.xlsx · Market-Report.pdf", durationMs: 500 },
  ];
  if (/revenue|q3|q4|financ|metric|kpi|data|analy/.test(p)) {
    steps.push({ agent: "data", label: "Data Analyst running", detail: "Querying revenue, churn, and segment metrics…", durationMs: 700 });
  }
  if (/strateg|plan|roadmap|grow|expand/.test(p)) {
    steps.push({ agent: "strategy", label: "Strategy Agent running", detail: "Synthesising recommendations and roadmap…", durationMs: 650 });
  }
  if (/market|competitor|trend|industry|apac/.test(p)) {
    steps.push({ agent: "research", label: "Research Agent running", detail: "Scanning live market signals and competitor data…", durationMs: 720 });
  }
  if (/find|search|document|churn|survey/.test(p)) {
    steps.push({ agent: "search", label: "Search Agent running", detail: "Semantic search across connected documents…", durationMs: 580 });
  }
  if (steps.length === 2) {
    steps.push({ agent: "data",     label: "Data Analyst running",  detail: "Fetching KPIs and usage metrics…",          durationMs: 700 });
    steps.push({ agent: "strategy", label: "Strategy Agent running", detail: "Generating business overview…",             durationMs: 650 });
  }
  steps.push({ agent: "system", label: "Composing dashboard", detail: "Laying out widgets and charts…", durationMs: 400 });
  return steps;
}

// ── Agent colour / icon helpers ───────────────────────────────────────────────
const AGENT_COLORS: Record<AgentKey | "system", string> = {
  data:     "var(--agent-data)",
  strategy: "var(--agent-strategy)",
  search:   "var(--agent-search)",
  research: "var(--agent-research)",
  system:   "var(--primary)",
};
const AGENT_ICONS: Record<AgentKey | "system", React.ElementType> = {
  data:     BarChart3,
  strategy: TrendingUp,
  search:   Search,
  research: Lightbulb,
  system:   Cpu,
};

const QUICK_PROMPTS = [
  { label: "Today's business overview",       icon: Globe,    color: "var(--primary)" },
  { label: "Q3 revenue deep-dive",            icon: BarChart3, color: "var(--agent-data)" },
  { label: "Build Q4 growth strategy",        icon: TrendingUp, color: "var(--agent-strategy)" },
  { label: "Find churn signals in data",      icon: Search,   color: "var(--agent-search)" },
  { label: "APAC competitor landscape",       icon: Lightbulb, color: "var(--agent-research)" },
  { label: "Data source health check",        icon: Database, color: "var(--agent-data)" },
];

// ── Main page ─────────────────────────────────────────────────────────────────
function DashboardPage() {
  const [phase, setPhase]           = useState<GenPhase>("idle");
  const [steps, setSteps]           = useState<StreamStep[]>([]);
  const [stepIdx, setStepIdx]       = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [blocksVisible, setBlocksVisible]   = useState(false);
  const [chartAnimated, setChartAnimated]   = useState(false);
  const [currentPrompt, setCurrentPrompt]   = useState("");
  const [history, setHistory]       = useState<PromptHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const startGeneration = useCallback((prompt: string) => {
    clearTimers();
    const newSteps = getStepsForPrompt(prompt);
    setPhase("thinking");
    setCurrentPrompt(prompt);
    setSteps(newSteps);
    setStepIdx(-1);
    setCompletedSteps([]);
    setBlocksVisible(false);
    setChartAnimated(false);
    setShowHistory(false);

    // Add to history
    setHistory((h) => [
      { text: prompt, ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ...h.slice(0, 7),
    ]);

    // Thinking pause → start streaming steps
    timerRef.current = setTimeout(() => {
      setPhase("streaming");
      runStep(0, newSteps);
    }, 700);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimers]);

  function runStep(idx: number, allSteps: StreamStep[]) {
    if (idx >= allSteps.length) {
      setPhase("rendering");
      timerRef.current = setTimeout(() => {
        setPhase("done");
        setBlocksVisible(true);
        setTimeout(() => setChartAnimated(true), 200);
      }, 300);
      return;
    }
    setStepIdx(idx);
    timerRef.current = setTimeout(() => {
      setCompletedSteps((c) => [...c, idx]);
      runStep(idx + 1, allSteps);
    }, allSteps[idx].durationMs);
  }

  // Auto-generate on mount
  useEffect(() => {
    startGeneration("Today's business overview");
    return clearTimers;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isGenerating = phase === "thinking" || phase === "streaming" || phase === "rendering";

  return (
    <div className="h-full overflow-y-auto bg-background">
      <PageHeader
        title="Dashboard"
        subtitle={phase === "done" ? `Generated for "${currentPrompt}"` : "AI-generating your view…"}
        action={
          <button
            onClick={() => startGeneration(currentPrompt)}
            disabled={isGenerating}
            className="flex items-center gap-2 h-9 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted disabled:opacity-40 transition"
          >
            <RefreshCw className={`size-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            Regenerate
          </button>
        }
      />

      <div className="p-6 max-w-7xl space-y-5">
        {/* ── Generative prompt bar ── */}
        <GenPromptBar
          phase={phase}
          steps={steps}
          stepIdx={stepIdx}
          completedSteps={completedSteps}
          currentPrompt={currentPrompt}
          history={history}
          showHistory={showHistory}
          onToggleHistory={() => setShowHistory((s) => !s)}
          onSubmit={startGeneration}
          onHistorySelect={(p) => { setShowHistory(false); startGeneration(p); }}
        />

        {/* ── Skeleton or real content ── */}
        {!blocksVisible ? (
          <SkeletonDashboard phase={phase} steps={steps} stepIdx={stepIdx} completedSteps={completedSteps} />
        ) : (
          <LiveDashboard chartAnimated={chartAnimated} onAsk={startGeneration} />
        )}
      </div>
    </div>
  );
}

// ── Generative Prompt Bar ─────────────────────────────────────────────────────
function GenPromptBar({
  phase, steps, stepIdx, completedSteps, currentPrompt,
  history, showHistory, onToggleHistory, onSubmit, onHistorySelect,
}: {
  phase: GenPhase;
  steps: StreamStep[];
  stepIdx: number;
  completedSteps: number[];
  currentPrompt: string;
  history: PromptHistory[];
  showHistory: boolean;
  onToggleHistory: () => void;
  onSubmit: (p: string) => void;
  onHistorySelect: (p: string) => void;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isGenerating = phase === "thinking" || phase === "streaming" || phase === "rendering";

  function submit() {
    const p = input.trim();
    if (!p || isGenerating) return;
    onSubmit(p);
    setInput("");
  }

  const activeStep = steps[stepIdx];
  const agentColor = activeStep ? AGENT_COLORS[activeStep.agent] : "var(--primary)";
  const AgentIcon  = activeStep ? AGENT_ICONS[activeStep.agent] : Sparkles;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* ── Top: status / stream log ── */}
      <div className="px-4 pt-4 pb-3 space-y-3">
        {/* Header row */}
        <div className="flex items-center gap-3">
          <div
            className="size-9 rounded-xl grid place-items-center shrink-0 transition-all duration-300"
            style={{ background: `color-mix(in oklab, ${agentColor} 14%, transparent)`, color: agentColor }}
          >
            {isGenerating
              ? <AgentIcon className="size-4 animate-pulse" />
              : phase === "done"
              ? <CheckCircle2 className="size-4 text-green-500" />
              : <Sparkles className="size-4" />
            }
          </div>
          <div className="flex-1 min-w-0">
            {phase === "idle" && (
              <p className="text-sm text-muted-foreground">Describe what you want to see on your dashboard.</p>
            )}
            {phase === "thinking" && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Thinking</span>
                <span className="flex gap-1">
                  {[0,1,2].map(i => (
                    <span key={i} className="size-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </span>
              </div>
            )}
            {(phase === "streaming" || phase === "rendering") && activeStep && (
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: agentColor }}>{activeStep.label}</span>
                  <span className="size-1.5 rounded-full animate-pulse" style={{ background: agentColor }} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{activeStep.detail}</p>
              </div>
            )}
            {phase === "done" && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
                <span className="text-muted-foreground">Dashboard ready · </span>
                <span className="font-medium text-foreground truncate">&ldquo;{currentPrompt}&rdquo;</span>
              </div>
            )}
          </div>
          {history.length > 0 && (
            <button
              onClick={onToggleHistory}
              className={`size-8 grid place-items-center rounded-lg transition ${showHistory ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
              title="Prompt history"
            >
              <History className="size-4" />
            </button>
          )}
        </div>

        {/* Step progress pills */}
        {steps.length > 0 && (phase === "streaming" || phase === "rendering" || phase === "done") && (
          <div className="flex flex-wrap gap-1.5">
            {steps.map((s, i) => {
              const done = completedSteps.includes(i);
              const active = i === stepIdx && !done;
              const color = AGENT_COLORS[s.agent];
              return (
                <span
                  key={i}
                  className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium transition-all duration-300"
                  style={done || active ? {
                    borderColor: `color-mix(in oklab, ${color} 35%, transparent)`,
                    background:  `color-mix(in oklab, ${color} 12%, transparent)`,
                    color,
                  } : {
                    borderColor: "var(--border)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {done
                    ? <CheckCircle2 className="size-2.5" />
                    : active
                    ? <span className="size-1.5 rounded-full animate-pulse" style={{ background: color }} />
                    : <span className="size-1.5 rounded-full bg-muted-foreground/30 rounded-full" />
                  }
                  {s.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ── History dropdown ── */}
      {showHistory && history.length > 0 && (
        <div className="border-t border-border bg-muted/30 px-4 py-2 space-y-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Recent prompts</span>
            <button onClick={onToggleHistory} className="text-muted-foreground hover:text-foreground">
              <X className="size-3.5" />
            </button>
          </div>
          {history.map((h, i) => (
            <button
              key={i}
              onClick={() => onHistorySelect(h.text)}
              className="w-full text-left flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-muted transition text-sm group"
            >
              <span className="truncate">{h.text}</span>
              <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                <Clock className="size-2.5" />{h.ts}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Input row ── */}
      <div className="border-t border-border px-3 py-3 flex items-center gap-2 bg-background/50">
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-ring/40 transition">
          <Bot className="size-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="e.g. Show Q3 churn analysis with APAC breakdown…"
            className="flex-1 bg-transparent outline-none text-sm"
            disabled={isGenerating}
          />
          {input && (
            <button onClick={() => setInput("")} className="text-muted-foreground hover:text-foreground">
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={submit}
          disabled={!input.trim() || isGenerating}
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 transition flex items-center gap-1.5 shrink-0"
        >
          {isGenerating ? <Activity className="size-3.5 animate-pulse" /> : <Send className="size-3.5" />}
          {isGenerating ? "Generating…" : "Generate"}
        </button>
      </div>

      {/* ── Quick prompt chips ── */}
      <div className="border-t border-border px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-none">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q.label}
            onClick={() => { if (!isGenerating) onSubmit(q.label); }}
            disabled={isGenerating}
            className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border border-border bg-background hover:border-primary/40 hover:bg-muted/60 whitespace-nowrap transition disabled:opacity-40 shrink-0"
          >
            <q.icon className="size-3 shrink-0" style={{ color: q.color }} />
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Skeleton Dashboard ────────────────────────────────────────────────────────
function SkeletonDashboard({ phase, steps, stepIdx, completedSteps }: {
  phase: GenPhase;
  steps: StreamStep[];
  stepIdx: number;
  completedSteps: number[];
}) {
  const show = phase !== "idle";
  if (!show) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
      <div className="size-16 rounded-2xl bg-primary/10 grid place-items-center">
        <Sparkles className="size-7 text-primary" />
      </div>
      <div>
        <p className="font-semibold">Your AI dashboard is ready to generate</p>
        <p className="text-sm text-muted-foreground mt-1">Type a prompt above or pick a quick option to get started.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 animate-pulse">
      {/* KPI row skeletons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map((i) => {
          const done = completedSteps.length > i;
          return (
            <div key={i} className={`bg-card border border-border rounded-2xl p-5 space-y-3 transition-all duration-500 ${done ? "opacity-60" : "opacity-30"}`}>
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-muted rounded-full" />
                <div className="size-7 rounded-lg bg-muted" />
              </div>
              <div className="h-7 w-24 bg-muted rounded-lg" />
              <div className="h-3 w-16 bg-muted rounded-full" />
            </div>
          );
        })}
      </div>
      {/* Chart + breakdown skeletons */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 opacity-40">
          <div className="h-4 w-32 bg-muted rounded-full" />
          <div className="flex items-end gap-2 h-36">
            {[60,75,55,80,65,90,100].map((h, i) => (
              <div key={i} className="flex-1 flex items-end gap-0.5 h-full">
                <div className="flex-1 rounded-t-lg bg-muted" style={{ height: `${h}%` }} />
                <div className="flex-1 rounded-t-lg bg-muted/60" style={{ height: `${h * 0.8}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 opacity-40">
          <div className="h-4 w-28 bg-muted rounded-full" />
          {[37,27,22,14].map((w, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-muted rounded-full" />
                <div className="h-3 w-10 bg-muted rounded-full" />
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-muted-foreground/20" style={{ width: `${w}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Insights skeleton */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        <div className="bg-card border border-border rounded-2xl overflow-hidden opacity-40">
          <div className="px-5 py-4 border-b border-border">
            <div className="h-4 w-36 bg-muted rounded-full" />
          </div>
          {[0,1,2,3].map((i) => (
            <div key={i} className="px-5 py-4 border-b border-border last:border-0 flex gap-3">
              <div className="size-8 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-40 bg-muted rounded-full" />
                <div className="h-3 w-full bg-muted rounded-full" />
                <div className="h-3 w-3/4 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3 opacity-40">
          <div className="h-4 w-28 bg-muted rounded-full" />
          {[0,1,2,3].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Live Dashboard ────────────────────────────────────────────────────────────
function LiveDashboard({ chartAnimated, onAsk }: { chartAnimated: boolean; onAsk: (p: string) => void }) {
  return (
    <div className="space-y-5">
      <KpiGrid />
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <RevenueChart animated={chartAnimated} />
        <AgentBreakdown animated={chartAnimated} />
      </div>
      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        <InsightsFeed />
        <QuickActions onAsk={onAsk} />
      </div>
    </div>
  );
}

// ── KPI Grid ──────────────────────────────────────────────────────────────────
function KpiGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k, i) => (
        <div
          key={k.label}
          className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:shadow-md transition-shadow group"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">{k.label}</span>
            <div
              className="size-7 rounded-lg grid place-items-center group-hover:scale-110 transition-transform"
              style={{ background: `color-mix(in oklab, ${k.color} 14%, transparent)`, color: k.color }}
            >
              {k.change > 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            </div>
          </div>
          <div className="text-2xl font-semibold tracking-tight">{k.value}</div>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
              k.change > 0
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-red-500/10 text-red-500 dark:text-red-400"
            }`}>
              {k.change > 0 ? "+" : ""}{k.change}%
            </span>
            <span className="text-xs text-muted-foreground">{k.unit}</span>
          </div>
          {/* Micro sparkline */}
          <div className="flex items-end gap-0.5 h-6 pt-1">
            {[40,55,45,70,60,85,100].map((h, j) => (
              <div
                key={j}
                className="flex-1 rounded-sm transition-all duration-700"
                style={{
                  height: `${h}%`,
                  background: `color-mix(in oklab, ${k.color} ${30 + j * 10}%, transparent)`,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Revenue Chart ─────────────────────────────────────────────────────────────
function RevenueChart({ animated }: { animated: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const revMax = Math.max(...revenueTrend.map((d) => d.revenue));
  const qMax   = Math.max(...revenueTrend.map((d) => d.queries));

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Revenue & Query Trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 7 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: "var(--agent-strategy)" }} /> Revenue $M
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: "var(--agent-data)", opacity: 0.7 }} /> Queries
          </span>
        </div>
      </div>

      {/* Y-axis labels + bars */}
      <div className="flex gap-3">
        {/* Y labels */}
        <div className="flex flex-col justify-between text-[10px] text-muted-foreground h-36 py-0.5 text-right w-6 shrink-0">
          <span>{revMax.toFixed(1)}</span>
          <span>{(revMax * 0.5).toFixed(1)}</span>
          <span>0</span>
        </div>
        {/* Bars */}
        <div className="flex-1 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0,1,2].map(i => (
              <div key={i} className="border-t border-dashed border-border/60 w-full" />
            ))}
          </div>
          <div className="flex items-end gap-1.5 h-36 relative z-10">
            {revenueTrend.map((d, i) => {
              const revH = animated ? (d.revenue / revMax) * 100 : 0;
              const qH   = animated ? (d.queries / qMax) * 100 : 0;
              const isHov = hovered === i;
              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Tooltip */}
                  {isHov && (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-xl px-3 py-2 text-xs shadow-xl z-20 whitespace-nowrap pointer-events-none">
                      <div className="font-semibold mb-1">{d.month} 2025</div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-sm" style={{ background: "var(--agent-strategy)" }} />
                        ${d.revenue}M revenue
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="size-2 rounded-sm" style={{ background: "var(--agent-data)" }} />
                        {d.queries} queries
                      </div>
                    </div>
                  )}
                  <div className="w-full flex items-end gap-0.5 h-32">
                    <div
                      className="flex-1 rounded-t-md transition-all duration-700 ease-out"
                      style={{
                        height: `${revH}%`,
                        background: isHov
                          ? "var(--agent-strategy)"
                          : `color-mix(in oklab, var(--agent-strategy) 80%, transparent)`,
                        transitionDelay: `${i * 60}ms`,
                      }}
                    />
                    <div
                      className="flex-1 rounded-t-md transition-all duration-700 ease-out"
                      style={{
                        height: `${qH}%`,
                        background: isHov
                          ? "var(--agent-data)"
                          : `color-mix(in oklab, var(--agent-data) 65%, transparent)`,
                        transitionDelay: `${i * 60 + 30}ms`,
                      }}
                    />
                  </div>
                  <span className={`text-[10px] transition-colors ${isHov ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border text-xs text-muted-foreground">
        <span>May – Nov 2025</span>
        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
          <TrendingUp className="size-3" /> +56% revenue over period
        </span>
      </div>
    </div>
  );
}

// ── Agent Breakdown ───────────────────────────────────────────────────────────
function AgentBreakdown({ animated }: { animated: boolean }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Agent Usage Today</h3>
          <p className="text-xs text-muted-foreground mt-0.5">847 total queries</p>
        </div>
        <Activity className="size-4 text-muted-foreground" />
      </div>

      <div className="space-y-3.5">
        {agentUsage.map((a, i) => (
          <div key={a.agent} className="space-y-1.5 group">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: a.color }} />
                {a.agent}
              </span>
              <span className="text-muted-foreground tabular-nums">{a.queries} · {a.pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: animated ? `${a.pct}%` : "0%",
                  background: a.color,
                  transitionDelay: `${i * 100}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Donut visual */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center gap-3">
          {/* Simple segmented bar as donut substitute */}
          <div className="flex-1 h-3 rounded-full overflow-hidden flex">
            {agentUsage.map((a) => (
              <div
                key={a.agent}
                className="h-full transition-all duration-700"
                style={{
                  width: animated ? `${a.pct}%` : "0%",
                  background: a.color,
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {agentUsage.map((a) => (
            <span
              key={a.agent}
              className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
              style={{
                borderColor: `color-mix(in oklab, ${a.color} 30%, transparent)`,
                background:  `color-mix(in oklab, ${a.color} 10%, transparent)`,
                color: a.color,
              }}
            >
              {a.agent}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Insights Feed ─────────────────────────────────────────────────────────────
const INSIGHT_ICONS: Record<AgentKey, React.ElementType> = {
  data: BarChart3, strategy: TrendingUp, search: Search, research: Lightbulb,
};

function InsightsFeed() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">AI-Generated Insights</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live from your agents · {recentInsights.length} new</p>
        </div>
        <Link to="/app/chat" className="text-xs text-primary hover:underline flex items-center gap-1">
          Open Chat <ChevronRight className="size-3" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {recentInsights.map((ins) => {
          const agentMeta = agents[ins.agent];
          const Icon = INSIGHT_ICONS[ins.agent];
          const color = `var(--agent-${ins.agent})`;
          const isOpen = expanded === ins.id;
          return (
            <div
              key={ins.id}
              className="px-5 py-4 hover:bg-muted/30 transition cursor-pointer group"
              onClick={() => setExpanded(isOpen ? null : ins.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="size-8 rounded-xl grid place-items-center shrink-0 mt-0.5"
                  style={{ background: `color-mix(in oklab, ${color} 12%, transparent)`, color }}
                >
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{ins.title}</span>
                    {ins.priority === "high" && (
                      <AlertCircle className="size-3.5 text-red-500 shrink-0" />
                    )}
                  </div>
                  <p className={`text-xs text-muted-foreground leading-relaxed transition-all ${isOpen ? "" : "line-clamp-1"}`}>
                    {ins.summary}
                  </p>
                  {isOpen && (
                    <div className="mt-2 pt-2 border-t border-border flex items-center gap-2">
                      <Link
                        to="/app/chat"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Zap className="size-3" /> Ask agent to elaborate
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-0.5">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full border font-medium"
                      style={{
                        borderColor: `color-mix(in oklab, ${color} 30%, transparent)`,
                        background:  `color-mix(in oklab, ${color} 10%, transparent)`,
                        color,
                      }}
                    >
                      {agentMeta.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="size-2.5" /> {ins.time}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      ins.priority === "high"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}>
                      {ins.priority}
                    </span>
                  </div>
                </div>
                <ArrowRight className={`size-4 text-muted-foreground shrink-0 mt-1 transition-transform ${isOpen ? "rotate-90" : "opacity-0 group-hover:opacity-100"}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Quick Actions ─────────────────────────────────────────────────────────────
function QuickActions({ onAsk }: { onAsk: (p: string) => void }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div>
        <h3 className="font-semibold text-sm">Regenerate Focus</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Tap to re-generate with a new lens</p>
      </div>
      <div className="space-y-2">
        {QUICK_PROMPTS.slice(1).map((q) => (
          <button
            key={q.label}
            onClick={() => onAsk(q.label)}
            className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/40 transition group"
          >
            <div
              className="size-7 rounded-lg grid place-items-center shrink-0"
              style={{ background: `color-mix(in oklab, ${q.color} 12%, transparent)`, color: q.color }}
            >
              <q.icon className="size-3.5" />
            </div>
            <span className="text-sm flex-1">{q.label}</span>
            <Zap className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
          </button>
        ))}
      </div>

      {/* Data source health */}
      <div className="pt-3 border-t border-border space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Data Health</div>
        {[
          { name: "Sales DB",            ok: true,  latency: "12ms" },
          { name: "Q3-Financials.xlsx",  ok: true,  latency: "—" },
          { name: "Customer-Survey.csv", ok: true,  latency: "syncing" },
          { name: "Legacy-Export.csv",   ok: false, latency: "error" },
        ].map((s) => (
          <div key={s.name} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground truncate flex-1">{s.name}</span>
            <span className={`flex items-center gap-1 font-medium shrink-0 ml-2 ${s.ok ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
              {s.ok
                ? <CheckCircle2 className="size-3" />
                : <AlertCircle className="size-3" />
              }
              {s.latency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
