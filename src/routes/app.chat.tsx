import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User, Loader2, Activity, Database, FileText, TrendingUp, Search, Lightbulb, BarChart3 } from "lucide-react";
import { agents, detectAgents, type AgentKey } from "@/lib/mock-data";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
});

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  agents?: AgentKey[];
  executionMs?: number;
};

const initialMsgs: Msg[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi Aarav 👋 — ask anything about your business. I'll route your question to the right agents.",
    agents: ["strategy"],
    executionMs: 240,
  },
];

const SUGGESTIONS = [
  "Analyze Q3 revenue and find top-performing segments",
  "Build a go-to-market strategy for our enterprise tier",
  "Find documents about churn from the last 90 days",
  "Research competitor pricing in the APAC market",
];

const STEPS = ["Analyzing data…", "Searching documents…", "Generating strategy…"];

function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>(initialMsgs);
  const [input, setInput] = useState("");
  const [activeAgents, setActiveAgents] = useState<AgentKey[]>([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const send = (text?: string) => {
    const prompt = (text ?? input).trim();
    if (!prompt || loading) return;
    const used = detectAgents(prompt);
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "user", content: prompt }]);
    setInput("");
    setLoading(true);
    setActiveAgents(used);
    setStep(0);

    const start = Date.now();
    let i = 0;
    const tick = setInterval(() => {
      i++;
      if (i >= STEPS.length) { clearInterval(tick); return; }
      setStep(i);
    }, 700);

    setTimeout(() => {
      clearInterval(tick);
      setMsgs((m) => [...m, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: prompt,
        agents: used,
        executionMs: Date.now() - start,
      }]);
      setLoading(false);
      setActiveAgents([]);
    }, 2400);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-background/80 backdrop-blur">
          <div>
            <h1 className="text-base font-semibold">AI Chat</h1>
            <p className="text-xs text-muted-foreground">Multi-agent · 4 agents available</p>
          </div>
          <div className="flex items-center gap-2">
            {(Object.keys(agents) as AgentKey[]).map((k) => (
              <span key={k} className={`text-[11px] px-2 py-1 rounded-full border ${agents[k].color}`}>{agents[k].label}</span>
            ))}
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {msgs.length === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="text-left p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition group">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="size-4 text-primary mt-0.5 group-hover:scale-110 transition" />
                      <span className="text-sm">{s}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {msgs.map((m) => m.role === "user" ? <UserMessage key={m.id} text={m.content} /> : <AssistantMessage key={m.id} msg={m} />)}

            {loading && <LoadingResponse agents={activeAgents} step={step} />}
          </div>
        </div>

        <div className="border-t border-border p-4 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 bg-card border border-border rounded-full shadow-sm pl-4 pr-2 py-2 focus-within:ring-2 focus-within:ring-ring/40 transition">
              <button className="size-8 grid place-items-center rounded-full hover:bg-muted text-muted-foreground">
                <Paperclip className="size-4" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask anything about your business…"
                className="flex-1 bg-transparent outline-none text-sm py-1"
              />
              <button onClick={() => send()} disabled={!input.trim() || loading}
                className="size-9 grid place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground text-center mt-2">
              💡 Tip: start with words like “analyze”, “strategy”, “find”, or “market”.
            </p>
          </div>
        </div>
      </div>

      <ActivityPanel activeAgents={activeAgents} />
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm shadow-sm">{text}</div>
      <div className="size-8 rounded-full bg-muted grid place-items-center shrink-0"><User className="size-4 text-muted-foreground" /></div>
    </div>
  );
}

function AssistantMessage({ msg }: { msg: Msg }) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 rounded-full bg-primary/10 grid place-items-center shrink-0"><Bot className="size-4 text-primary" /></div>
      <div className="flex-1 space-y-3">
        {msg.agents && (
          <div className="flex flex-wrap gap-1.5">
            {msg.agents.map((a) => (
              <span key={a} className={`text-[11px] px-2 py-1 rounded-full border ${agents[a].color} font-medium`}>{agents[a].label}</span>
            ))}
          </div>
        )}
        {msg.agents?.includes("data") && (
          <ResponseCard icon={BarChart3} title="Data Insights" tint="var(--agent-data)">
            <ul className="space-y-1.5 text-sm text-foreground/80">
              <li>• Q3 revenue grew <b>+18.4%</b> QoQ, driven by Enterprise tier.</li>
              <li>• Top segment: <b>Financial Services</b> (32% of new ARR).</li>
              <li>• Churn fell to <b>2.1%</b> — best quarter in 4 periods.</li>
            </ul>
          </ResponseCard>
        )}
        {msg.agents?.includes("strategy") && (
          <ResponseCard icon={TrendingUp} title="Strategy Recommendations" tint="var(--agent-strategy)">
            <ol className="space-y-1.5 text-sm text-foreground/80 list-decimal pl-5">
              <li>Double down on FinServ vertical with co-branded launch.</li>
              <li>Bundle Pro + Analytics for mid-market expansion.</li>
              <li>Test usage-based pricing in APAC by Q1.</li>
            </ol>
          </ResponseCard>
        )}
        {msg.agents?.includes("search") && (
          <ResponseCard icon={FileText} title="Documents Found" tint="var(--agent-search)">
            <ul className="space-y-1.5 text-sm">
              {["Q3-Financials.xlsx", "Customer-Survey.csv", "Pricing-Playbook.pdf"].map((d) => (
                <li key={d} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                  <span className="flex items-center gap-2"><FileText className="size-3.5 text-muted-foreground" />{d}</span>
                  <span className="text-xs text-muted-foreground">Relevance 94%</span>
                </li>
              ))}
            </ul>
          </ResponseCard>
        )}
        {msg.agents?.includes("research") && (
          <ResponseCard icon={Search} title="Market Research" tint="var(--agent-research)">
            <p className="text-sm text-foreground/80">
              APAC enterprise AI spend projected at <b>$14.2B</b> in 2026 (+27% YoY). Top 3 competitors expanding presence in Singapore and Tokyo.
            </p>
          </ResponseCard>
        )}
        <div className="text-[11px] text-muted-foreground flex gap-4">
          <span>Agents: {msg.agents?.map((a) => agents[a].label).join(", ")}</span>
          <span>Execution: {msg.executionMs ?? 0}ms</span>
        </div>
      </div>
    </div>
  );
}

function ResponseCard({ icon: Icon, title, children, tint }: { icon: typeof Bot; title: string; children: React.ReactNode; tint: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg grid place-items-center" style={{ background: `color-mix(in oklab, ${tint} 12%, transparent)`, color: tint }}>
          <Icon className="size-4" />
        </div>
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function LoadingResponse({ agents: a, step }: { agents: AgentKey[]; step: number }) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 rounded-full bg-primary/10 grid place-items-center shrink-0"><Bot className="size-4 text-primary" /></div>
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {a.map((k) => (
            <span key={k} className={`text-[11px] px-2 py-1 rounded-full border ${agents[k].color} font-medium`}>{agents[k].label}</span>
          ))}
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
          {STEPS.map((s, i) => (
            <div key={s} className={`flex items-center gap-2 text-sm transition ${i <= step ? "text-foreground" : "text-muted-foreground/50"}`}>
              {i < step ? <span className="size-2 rounded-full bg-primary" /> :
                i === step ? <Loader2 className="size-3.5 animate-spin text-primary" /> :
                <span className="size-2 rounded-full bg-muted-foreground/30" />}
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityPanel({ activeAgents }: { activeAgents: AgentKey[] }) {
  return (
    <aside className="w-80 shrink-0 border-l border-border bg-sidebar/40 p-5 space-y-4 overflow-y-auto hidden lg:block">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Activity className="size-3.5" /> Active Agents
        </h3>
        <div className="space-y-2">
          {(Object.keys(agents) as AgentKey[]).map((k) => {
            const active = activeAgents.includes(k);
            return (
              <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                <span className="text-sm font-medium">{agents[k].label}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${active ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                  {active ? "Running" : "Idle"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Database className="size-3.5" /> Data Sources
        </h3>
        <div className="space-y-2">
          {["Q3-Financials.xlsx", "Sales DB", "Market-Report.pdf"].map((d) => (
            <div key={d} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border text-sm">
              <span className="truncate">{d}</span>
              <span className="size-2 rounded-full bg-green-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Queries today" value="47" />
        <Stat label="Reports gen." value="12" />
      </div>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border">
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
