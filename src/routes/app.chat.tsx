import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Paperclip, Bot, User, Activity, Database,
  Lightbulb, Sparkles, X, ChevronDown,
} from "lucide-react";
import {
  ResponseRenderer, ExecutionTimeline, AgentChips,
  AGENT_META, type AIResponse, type AgentKey,
} from "@/components/gen-ui";
import { generateResponse } from "@/lib/response-generator";

export const Route = createFileRoute("/app/chat")({
  component: ChatPage,
});

// ── Message types ─────────────────────────────────────────────────────────────
type UserMsg = {
  id: string;
  role: "user";
  content: string;
};
type AssistantMsg = {
  id: string;
  role: "assistant";
  response: AIResponse;
  // progressive reveal state
  phase: "steps" | "rendering" | "done";
  currentStep: number;
  visibleSections: number;
};
type Msg = UserMsg | AssistantMsg;

// ── Suggestions ───────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { text: "Analyze Q3 revenue and find top-performing segments", agents: ["data", "strategy"] as AgentKey[] },
  { text: "Build a go-to-market strategy for our enterprise tier", agents: ["strategy"] as AgentKey[] },
  { text: "Find documents about churn from the last 90 days",    agents: ["search"] as AgentKey[] },
  { text: "Research competitor pricing in the APAC market",      agents: ["research", "strategy"] as AgentKey[] },
];

// ── Chat page ─────────────────────────────────────────────────────────────────
function ChatPage() {
  const [msgs, setMsgs]   = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll on new content
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // ── Send a message ──────────────────────────────────────────────────────────
  const send = useCallback((text?: string) => {
    const prompt = (text ?? input).trim();
    if (!prompt || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: UserMsg = { id: crypto.randomUUID(), role: "user", content: prompt };
    setMsgs((m) => [...m, userMsg]);

    // Simulate network latency before starting
    timerRef.current = setTimeout(() => {
      const response = generateResponse(prompt);
      const assistantId = crypto.randomUUID();

      // Add assistant message in "steps" phase
      const assistantMsg: AssistantMsg = {
        id: assistantId,
        role: "assistant",
        response,
        phase: "steps",
        currentStep: 0,
        visibleSections: 0,
      };
      setMsgs((m) => [...m, assistantMsg]);

      // Advance through steps
      let stepIdx = 0;
      const stepDuration = 550;

      function advanceStep() {
        stepIdx++;
        if (stepIdx < response.steps.length) {
          setMsgs((m) => m.map((msg) =>
            msg.id === assistantId && msg.role === "assistant"
              ? { ...msg, currentStep: stepIdx }
              : msg
          ));
          timerRef.current = setTimeout(advanceStep, stepDuration);
        } else {
          // Steps done → switch to rendering phase, reveal sections one by one
          setMsgs((m) => m.map((msg) =>
            msg.id === assistantId && msg.role === "assistant"
              ? { ...msg, phase: "rendering" as const, currentStep: stepIdx }
              : msg
          ));
          revealSections(assistantId, response.sections.length, 0);
        }
      }

      timerRef.current = setTimeout(advanceStep, stepDuration);

      function revealSections(id: string, total: number, shown: number) {
        const next = shown + 1;
        setMsgs((m) => m.map((msg) =>
          msg.id === id && msg.role === "assistant"
            ? { ...msg, visibleSections: next }
            : msg
        ));
        if (next < total) {
          timerRef.current = setTimeout(() => revealSections(id, total, next), 180);
        } else {
          // All sections revealed → done
          timerRef.current = setTimeout(() => {
            setMsgs((m) => m.map((msg) =>
              msg.id === id && msg.role === "assistant"
                ? { ...msg, phase: "done" as const }
                : msg
            ));
            setLoading(false);
          }, 200);
        }
      }
    }, 400);
  }, [input, loading]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const allAgents = Object.keys(AGENT_META) as AgentKey[];

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-background/80 backdrop-blur shrink-0">
          <div>
            <h1 className="text-base font-semibold">AI Chat</h1>
            <p className="text-xs text-muted-foreground">Generative UI · {allAgents.length} agents</p>
          </div>
          <div className="flex items-center gap-1.5">
            {allAgents.map((k) => {
              const m = AGENT_META[k];
              return (
                <span key={k} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${m.bg}`}>
                  {m.label}
                </span>
              );
            })}
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Welcome + suggestions */}
            {msgs.length === 0 && (
              <WelcomeScreen onSend={send} />
            )}

            {/* Message list */}
            {msgs.map((msg) =>
              msg.role === "user"
                ? <UserBubble key={msg.id} msg={msg} />
                : <AssistantBubble key={msg.id} msg={msg} />
            )}

            {/* Scroll anchor */}
            <div className="h-1" />
          </div>
        </div>

        {/* Input bar */}
        <InputBar
          input={input}
          setInput={setInput}
          loading={loading}
          onSend={send}
          inputRef={inputRef}
        />
      </div>

      {/* ── Activity sidebar ── */}
      <ActivitySidebar msgs={msgs} loading={loading} />
    </div>
  );
}

// ── Welcome screen ────────────────────────────────────────────────────────────
function WelcomeScreen({ onSend }: { onSend: (t: string) => void }) {
  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-start gap-3">
        <div className="size-8 rounded-full bg-primary/10 grid place-items-center shrink-0">
          <Bot className="size-4 text-primary" />
        </div>
        <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 space-y-1 max-w-lg">
          <p className="text-sm font-medium">Hi Aarav 👋</p>
          <p className="text-sm text-muted-foreground">
            Ask anything about your business. I'll route your question to the right agents and generate a structured response.
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Lightbulb className="size-3" /> Try asking
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              onClick={() => onSend(s.text)}
              className="text-left p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition group"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="size-4 text-primary mt-0.5 shrink-0 group-hover:scale-110 transition" />
                <div className="space-y-1.5">
                  <span className="text-sm">{s.text}</span>
                  <div className="flex gap-1">
                    {s.agents.map((a) => (
                      <span key={a} className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${AGENT_META[a].bg}`}>
                        {AGENT_META[a].label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── User bubble ───────────────────────────────────────────────────────────────
function UserBubble({ msg }: { msg: UserMsg }) {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="max-w-[78%] bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm shadow-sm">
        {msg.content}
      </div>
      <div className="size-8 rounded-full bg-muted grid place-items-center shrink-0">
        <User className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}

// ── Assistant bubble ──────────────────────────────────────────────────────────
function AssistantBubble({ msg }: { msg: AssistantMsg }) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 rounded-full bg-primary/10 grid place-items-center shrink-0 mt-0.5">
        <Bot className="size-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        {/* Execution timeline (steps phase) */}
        {(msg.phase === "steps") && (
          <ExecutionTimeline
            steps={msg.response.steps}
            currentStep={msg.currentStep}
            agentKeys={msg.response.agents}
          />
        )}

        {/* Progressive section reveal (rendering + done) */}
        {(msg.phase === "rendering" || msg.phase === "done") && (
          <ResponseRenderer
            response={msg.response}
            visibleCount={msg.visibleSections}
          />
        )}

        {/* Footer: execution time when done */}
        {msg.phase === "done" && (
          <div className="text-[11px] text-muted-foreground flex items-center gap-3 pt-1">
            <span>Agents: {msg.response.agents.map((a) => AGENT_META[a].label).join(", ")}</span>
            <span>·</span>
            <span>Execution: {msg.response.executionTime}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Input bar ─────────────────────────────────────────────────────────────────
function InputBar({
  input, setInput, loading, onSend, inputRef,
}: {
  input: string;
  setInput: (v: string) => void;
  loading: boolean;
  onSend: (t?: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="border-t border-border p-4 bg-background shrink-0">
      <div className="max-w-3xl mx-auto space-y-2">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-ring/40 transition">
          <button className="size-8 grid place-items-center rounded-xl hover:bg-muted text-muted-foreground shrink-0">
            <Paperclip className="size-4" />
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
            placeholder="Ask anything about your business…"
            className="flex-1 bg-transparent outline-none text-sm py-1"
            disabled={loading}
          />
          {input && (
            <button onClick={() => setInput("")} className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="size-3.5" />
            </button>
          )}
          <button
            onClick={() => onSend()}
            disabled={!input.trim() || loading}
            className="size-9 grid place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition shrink-0"
          >
            {loading
              ? <Activity className="size-4 animate-pulse" />
              : <Send className="size-4" />
            }
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground text-center">
          Try: "analyze revenue", "build strategy", "find documents", "research market"
        </p>
      </div>
    </div>
  );
}

// ── Activity sidebar ──────────────────────────────────────────────────────────
function ActivitySidebar({ msgs, loading }: { msgs: Msg[]; loading: boolean }) {
  const lastAssistant = [...msgs].reverse().find((m): m is AssistantMsg => m.role === "assistant");

  // An agent is "running" when the latest assistant message is still in steps/rendering phase
  const inProgress = lastAssistant && (lastAssistant.phase === "steps" || lastAssistant.phase === "rendering");
  const activeAgents: AgentKey[] = inProgress ? lastAssistant.response.agents : [];

  // Which specific step is running right now — used to highlight only the relevant agent
  const currentStepLabel = inProgress
    ? lastAssistant.response.steps[lastAssistant.currentStep] ?? ""
    : "";

  const allAgents = Object.keys(AGENT_META) as AgentKey[];

  // Stats
  const totalQueries  = msgs.filter((m) => m.role === "user").length;
  const totalResponses = msgs.filter((m) => m.role === "assistant").length;

  return (
    <aside className="w-72 shrink-0 border-l border-border bg-sidebar/40 flex flex-col overflow-hidden hidden lg:flex">
      <div className="p-4 border-b border-sidebar-border">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Activity className="size-3.5" /> Agent Status
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Agent cards */}
        <div className="space-y-2">
          {allAgents.map((k) => {
            const m = AGENT_META[k];
            const isActive  = activeAgents.includes(k);
            const wasUsed   = lastAssistant?.response.agents.includes(k) ?? false;

            let statusLabel: string;
            let statusCls: string;
            if (isActive) {
              statusLabel = "Running";
              statusCls   = "bg-green-500/15 text-green-600 dark:text-green-400";
            } else if (wasUsed && lastAssistant?.phase === "done") {
              statusLabel = "Done";
              statusCls   = "bg-primary/10 text-primary";
            } else {
              statusLabel = "Active";
              statusCls   = "bg-green-500/10 text-green-600 dark:text-green-400";
            }

            return (
              <div key={k} className={`flex items-center justify-between p-3 rounded-xl bg-card border transition-all duration-300 ${
                isActive ? "border-green-500/30 shadow-sm" : "border-border"
              }`}>
                <div className="flex items-center gap-2.5">
                  <span
                    className={`size-2 rounded-full transition-all duration-300 ${isActive ? "animate-pulse" : ""}`}
                    style={{
                      background: isActive || (wasUsed && lastAssistant?.phase === "done")
                        ? m.color
                        : m.color,
                      opacity: isActive ? 1 : wasUsed ? 0.7 : 0.5,
                    }}
                  />
                  <span className="text-sm font-medium">{m.label}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${statusCls}`}>
                  {statusLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live step indicator */}
        {inProgress && currentStepLabel && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/15 text-xs">
            <span className="relative flex size-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full size-2 bg-primary" />
            </span>
            <span className="text-primary font-medium truncate">{currentStepLabel}</span>
          </div>
        )}

        {/* Data sources */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
            <Database className="size-3.5" /> Data Sources
          </h3>
          <div className="space-y-1.5">
            {[
              { name: "Sales DB",            ok: true },
              { name: "Q3-Financials.xlsx",  ok: true },
              { name: "Market-Report.pdf",   ok: true },
              { name: "Legacy-Export.csv",   ok: false },
            ].map((d) => (
              <div key={d.name} className="flex items-center justify-between px-3 py-2 rounded-xl bg-card border border-border text-xs">
                <span className="truncate text-muted-foreground">{d.name}</span>
                <span className={`size-2 rounded-full shrink-0 ml-2 ${d.ok ? "bg-green-500" : "bg-red-500"}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Session stats */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Session</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Queries",   value: String(totalQueries) },
              { label: "Responses", value: String(totalResponses) },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl bg-card border border-border">
                <div className="text-xl font-semibold tracking-tight">{s.value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Last response sections breakdown */}
        {lastAssistant && lastAssistant.phase === "done" && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Last Response</h3>
            <div className="space-y-1.5">
              {lastAssistant.response.sections.map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border text-xs">
                  <ChevronDown className="size-3 text-muted-foreground shrink-0" />
                  <span className="capitalize text-muted-foreground">{s.type}</span>
                  {"title" in s && s.title && (
                    <span className="truncate text-foreground/70 ml-auto">{s.title}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
