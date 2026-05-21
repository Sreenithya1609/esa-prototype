import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles, ArrowRight, TrendingUp, BarChart3, Search, Lightbulb,
  Shield, Lock, FileCheck, Check, Zap, Globe, Building2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ESA — AI-powered enterprise intelligence" },
      { name: "description", content: "Multi-agent AI platform for strategy, data, search, and research. Built for the modern enterprise." },
      { property: "og:title", content: "ESA — AI-powered enterprise intelligence" },
      { property: "og:description", content: "Multi-agent AI platform for strategy, data, search, and research." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <Security />
      <Pricing />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b border-border">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary text-primary-foreground grid place-items-center">
            <Sparkles className="size-4" />
          </div>
          <span className="font-semibold tracking-tight">ESA</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
          <a href="#security" className="hover:text-foreground transition">Security</a>
          <a href="#docs" className="hover:text-foreground transition">Docs</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline-flex h-9 px-4 rounded-xl text-sm font-medium hover:bg-muted items-center">
            Sign in
          </Link>
          <Link to="/login" className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition inline-flex items-center gap-1.5">
            Start trial <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%), radial-gradient(40% 40% at 80% 30%, color-mix(in oklab, var(--agent-search) 18%, transparent), transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-border bg-card text-xs text-muted-foreground mb-6">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          New · Multi-agent reasoning with live data sources
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight max-w-4xl mx-auto leading-[1.05]">
          AI-powered enterprise intelligence,{" "}
          <span className="bg-gradient-to-r from-primary to-[var(--agent-search)] bg-clip-text text-transparent">
            in one conversation.
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Ask one question. Get answers from Strategy, Data, Search, and Research agents —
          working together on your live business data.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/app" className="h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-2 shadow-sm">
            Launch / Trial Now <ArrowRight className="size-4" />
          </Link>
          <a href="#features" className="h-11 px-6 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted inline-flex items-center">
            See how it works
          </a>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> No credit card</span>
          <span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> SAML / Okta SSO</span>
          <span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> Deploy in your VPC</span>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative mt-16 max-w-5xl mx-auto">
      <div className="rounded-2xl border border-border bg-card shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--primary)_30%,transparent)] overflow-hidden">
        <div className="h-9 border-b border-border bg-muted/40 flex items-center gap-1.5 px-4">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-yellow-400/70" />
          <span className="size-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 text-[11px] text-muted-foreground">esa.app/chat</span>
        </div>
        <div className="p-6 grid md:grid-cols-3 gap-4 text-left">
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs text-muted-foreground">You asked</div>
            <div className="text-sm font-medium">Analyze Q3 revenue and recommend a Q4 strategy</div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <Chip color="var(--agent-data)">Data Analyst</Chip>
              <Chip color="var(--agent-strategy)">Strategy</Chip>
            </div>
            <div className="rounded-xl border border-border p-4 space-y-2">
              <div className="text-xs font-semibold text-foreground/70">Insight</div>
              <p className="text-sm text-foreground/80">Q3 revenue grew <b>+18.4%</b> QoQ, driven by Enterprise tier. FinServ vertical now <b>32%</b> of new ARR.</p>
            </div>
            <div className="rounded-xl border border-border p-4 space-y-2">
              <div className="text-xs font-semibold text-foreground/70">Recommendation</div>
              <p className="text-sm text-foreground/80">Double down on FinServ — bundle Pro + Analytics, test usage-based pricing in APAC by Q1.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">Active agents</div>
            {[
              { label: "Data Analyst", color: "var(--agent-data)" },
              { label: "Strategy", color: "var(--agent-strategy)" },
              { label: "Search", color: "var(--agent-search)" },
              { label: "Research", color: "var(--agent-research)" },
            ].map((a) => (
              <div key={a.label} className="flex items-center justify-between p-3 rounded-xl border border-border">
                <span className="text-sm">{a.label}</span>
                <span className="size-2 rounded-full" style={{ background: a.color }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="text-[11px] px-2 py-1 rounded-full border font-medium"
      style={{
        borderColor: `color-mix(in oklab, ${color} 30%, transparent)`,
        background: `color-mix(in oklab, ${color} 12%, transparent)`,
        color,
      }}
    >
      {children}
    </span>
  );
}

function Features() {
  const cards = [
    { icon: TrendingUp, color: "var(--agent-strategy)", title: "Strategy Agent", desc: "Synthesizes insights into clear recommendations, roadmaps, and bets you can act on." },
    { icon: BarChart3, color: "var(--agent-data)", title: "Data Analyst Agent", desc: "Connects to your warehouse, runs queries, and surfaces metrics that matter." },
    { icon: Search, color: "var(--agent-search)", title: "Search Agent", desc: "Semantic search across files, drives, wikis — with citations and relevance scores." },
    { icon: Lightbulb, color: "var(--agent-research)", title: "Research Agent", desc: "Tracks markets, competitors, and trends from live external sources." },
  ];
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-2xl mb-12">
        <div className="text-xs uppercase tracking-wider text-primary font-medium mb-3">Four agents. One answer.</div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Built like a real team — not a single chatbot.</h2>
        <p className="text-muted-foreground mt-3">ESA routes each question to the right specialist agents, then merges their work into a single, sourced response.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="p-6 rounded-2xl border border-border bg-card hover:shadow-sm hover:border-primary/30 transition group">
            <div
              className="size-11 rounded-xl grid place-items-center mb-4 group-hover:scale-105 transition"
              style={{ background: `color-mix(in oklab, ${c.color} 12%, transparent)`, color: c.color }}
            >
              <c.icon className="size-5" />
            </div>
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Security() {
  const items = [
    { icon: Shield, title: "SOC 2 Type II", desc: "Audited controls across people, process, and infra." },
    { icon: Lock, title: "End-to-end encryption", desc: "AES-256 at rest, TLS 1.3 in transit, customer-managed keys." },
    { icon: FileCheck, title: "GDPR & HIPAA", desc: "Data residency, BAA available, full audit logs." },
    { icon: Globe, title: "Deploy anywhere", desc: "Cloud, VPC, or fully on-prem with private LLM hosting." },
  ];
  return (
    <section id="security" className="border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-12">
          <div className="text-xs uppercase tracking-wider text-primary font-medium mb-3">Enterprise-grade security</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Your data never leaves your perimeter.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((i) => (
            <div key={i.title} className="p-6 rounded-2xl border border-border bg-card">
              <i.icon className="size-5 text-primary mb-4" />
              <h3 className="font-semibold">{i.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Starter", price: "$0", period: "/ user / mo", desc: "For small teams exploring ESA.",
      features: ["3 agents", "1 GB data sources", "Community support", "Email login"],
    },
    {
      name: "Business", price: "$49", period: "/ user / mo", desc: "For growing teams.", popular: true,
      features: ["All 4 agents", "100 GB data sources", "Google / Microsoft SSO", "Reports & exports", "Priority support"],
    },
    {
      name: "Enterprise", price: "Custom", period: "", desc: "For regulated industries.",
      features: ["Unlimited agents & data", "SAML / Okta SSO", "VPC or on-prem", "Dedicated CSM", "99.99% SLA"],
    },
  ];
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-xs uppercase tracking-wider text-primary font-medium mb-3">Pricing</div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Simple plans that scale with you.</h2>
        <p className="text-muted-foreground mt-3">Start free. Upgrade when you're ready for SSO and unlimited data.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative p-6 rounded-2xl border bg-card flex flex-col ${p.popular ? "border-primary shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--primary)_30%,transparent)]" : "border-border"}`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-6 text-[11px] px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-medium flex items-center gap-1">
                <Zap className="size-3" /> Most popular
              </span>
            )}
            <div>
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
            </div>
            <ul className="mt-5 space-y-2 flex-1">
              {p.features.map((f) => (
                <li key={f} className="text-sm flex items-start gap-2">
                  <Check className="size-4 text-primary mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to={p.name === "Enterprise" ? "/login" : "/app"}
              className={`mt-6 h-10 rounded-xl text-sm font-medium flex items-center justify-center transition ${
                p.popular
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "border border-border hover:bg-muted"
              }`}
            >
              {p.name === "Enterprise" ? "Talk to sales" : "Start trial"}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="docs" className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-xl bg-primary text-primary-foreground grid place-items-center">
              <Sparkles className="size-4" />
            </div>
            <span className="font-semibold">ESA</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">Enterprise Strategy Agent — multi-agent AI for the modern business.</p>
        </div>
        <FooterCol title="Product" items={["Features", "Pricing", "Security", "Changelog"]} />
        <FooterCol title="Company" items={["About", "Customers", "Careers", "Contact"]} />
        <FooterCol title="Resources" items={["Docs", "API", "Status", "Privacy"]} />
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2"><Building2 className="size-3.5" /> © 2026 ESA, Inc.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider mb-3">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((i) => <li key={i}><a href="#" className="hover:text-foreground transition">{i}</a></li>)}
      </ul>
    </div>
  );
}
