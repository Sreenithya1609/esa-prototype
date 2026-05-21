export const agents = {
  strategy: { label: "Strategy", color: "bg-[var(--agent-strategy)]/10 text-[var(--agent-strategy)] border-[var(--agent-strategy)]/20" },
  data: { label: "Data Analyst", color: "bg-[var(--agent-data)]/10 text-[var(--agent-data)] border-[var(--agent-data)]/20" },
  search: { label: "Search", color: "bg-[var(--agent-search)]/10 text-[var(--agent-search)] border-[var(--agent-search)]/20" },
  research: { label: "Research", color: "bg-[var(--agent-research)]/10 text-[var(--agent-research)] border-[var(--agent-research)]/20" },
} as const;

export type AgentKey = keyof typeof agents;

export function detectAgents(prompt: string): AgentKey[] {
  const p = prompt.toLowerCase();
  const out: AgentKey[] = [];
  if (/analy[sz]e|data|metric|number|kpi/.test(p)) out.push("data");
  if (/strateg|plan|roadmap|grow/.test(p)) out.push("strategy");
  if (/find|search|document|look/.test(p)) out.push("search");
  if (/market|competitor|industry|trend/.test(p)) out.push("research");
  return out.length ? out : ["strategy", "data"];
}

export const dataSources = [
  { name: "Q3-Financials.xlsx", type: "Excel", status: "Active", updated: "2h ago" },
  { name: "Customer-Survey.csv", type: "CSV", status: "Syncing", updated: "Just now" },
  { name: "Market-Report.pdf", type: "PDF", status: "Active", updated: "1d ago" },
  { name: "Sales DB", type: "Postgres", status: "Active", updated: "Live" },
  { name: "Legacy-Export.csv", type: "CSV", status: "Error", updated: "3d ago" },
];

export const reports = [
  { name: "Q3 Revenue Insights", agent: "Data Analyst", date: "Nov 12, 2025" },
  { name: "Competitor Landscape 2025", agent: "Research", date: "Nov 10, 2025" },
  { name: "Go-to-Market Strategy", agent: "Strategy", date: "Nov 08, 2025" },
  { name: "Customer Churn Analysis", agent: "Data Analyst", date: "Nov 05, 2025" },
];

export const team = [
  { name: "Aarav Mehta", email: "aarav@acme.io", role: "Admin", status: "Active" },
  { name: "Priya Shah", email: "priya@acme.io", role: "Analyst", status: "Active" },
  { name: "Daniel Kim", email: "daniel@acme.io", role: "Researcher", status: "Active" },
  { name: "Sara Lin", email: "sara@acme.io", role: "Viewer", status: "Invited" },
];

export const auditLogs = [
  { ts: "2025-11-12 14:22", user: "aarav@acme.io", action: "Connected S3 bucket", status: "Success" },
  { ts: "2025-11-12 13:48", user: "priya@acme.io", action: "Ran query: Q3 revenue", status: "Success" },
  { ts: "2025-11-12 11:10", user: "system", action: "SAML sync", status: "Success" },
  { ts: "2025-11-11 18:02", user: "daniel@acme.io", action: "Uploaded Market-Report.pdf", status: "Success" },
  { ts: "2025-11-11 09:30", user: "sara@acme.io", action: "Login attempt", status: "Failed" },
];
