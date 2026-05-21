/**
 * Mock AI response generator.
 * Maps prompt keywords → structured AIResponse objects.
 * Swap this out for a real API call without touching any UI components.
 */
import type { AIResponse, AgentKey, Section } from "@/components/gen-ui";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function execTime() {
  return `${(Math.random() * 2 + 0.8).toFixed(1)}s`;
}

// ── Prompt → response mapping ─────────────────────────────────────────────────
export function generateResponse(prompt: string): AIResponse {
  const p = prompt.toLowerCase();

  // Revenue / Q3 / financial
  if (/revenue|q3|q4|financ|arr|growth/.test(p)) {
    return {
      agents: ["data", "strategy"],
      executionTime: execTime(),
      steps: [
        "Connecting to Sales DB…",
        "Running Data Analyst agent…",
        "Querying Q3 revenue metrics…",
        "Generating strategy recommendations…",
        "Composing response…",
      ],
      sections: [
        {
          type: "metrics",
          title: "Q3 Financial Snapshot",
          items: [
            { label: "Total Revenue", value: "$2.84M", change: 18.4 },
            { label: "New ARR",       value: "$640K",  change: 22.1 },
            { label: "Churn Rate",    value: "2.1%",   change: -0.4 },
          ],
        },
        {
          type: "insight",
          title: "Revenue Spike Detected",
          content: "Enterprise tier drove +18.4% QoQ growth. FinServ vertical now accounts for 32% of new ARR — the highest concentration in 6 quarters.",
          severity: "success",
        },
        {
          type: "chart",
          title: "Monthly Revenue ($M)",
          data: [
            { label: "May", value: 1.82, color: "var(--agent-strategy)" },
            { label: "Jun", value: 1.95, color: "var(--agent-strategy)" },
            { label: "Jul", value: 2.10, color: "var(--agent-strategy)" },
            { label: "Aug", value: 2.25, color: "var(--agent-strategy)" },
            { label: "Sep", value: 2.38, color: "var(--agent-strategy)" },
            { label: "Oct", value: 2.60, color: "var(--agent-strategy)" },
            { label: "Nov", value: 2.84, color: "var(--agent-strategy)" },
          ],
        },
        {
          type: "strategy",
          title: "Q4 Revenue Strategy",
          content: "Based on Q3 performance, the highest-leverage Q4 moves are in FinServ expansion and mid-market bundling.",
          steps: [
            "Double down on FinServ vertical with co-branded enterprise launch.",
            "Bundle Pro + Analytics for mid-market — projected +$180K ARR.",
            "Test usage-based pricing in APAC by Q1 to reduce churn friction.",
          ],
        },
      ],
    };
  }

  // Churn / retention
  if (/churn|retain|nps|survey|customer/.test(p)) {
    return {
      agents: ["data", "search"],
      executionTime: execTime(),
      steps: [
        "Connecting to Customer-Survey.csv…",
        "Running Data Analyst agent…",
        "Semantic search across survey data…",
        "Identifying churn signals…",
        "Composing response…",
      ],
      sections: [
        {
          type: "insight",
          title: "Churn Signal Detected",
          content: "3 enterprise accounts flagged low NPS (< 6) in the latest Customer-Survey.csv. Accounts: Meridian Corp, BlueWave Ltd, Apex Systems. Immediate CSM outreach advised.",
          severity: "warning",
        },
        {
          type: "metrics",
          title: "Retention Metrics",
          items: [
            { label: "Churn Rate",    value: "2.1%",  change: -0.4 },
            { label: "NPS Score",     value: "61",    change: -4 },
            { label: "At-Risk ARR",   value: "$92K",  change: 12 },
          ],
        },
        {
          type: "documents",
          title: "Relevant Documents",
          items: [
            { name: "Customer-Survey.csv",    relevance: 97, type: "CSV" },
            { name: "Churn-Analysis-Q2.pdf",  relevance: 88, type: "PDF" },
            { name: "NPS-Tracker.xlsx",       relevance: 81, type: "Excel" },
          ],
        },
        {
          type: "strategy",
          title: "Retention Playbook",
          content: "Proactive intervention on at-risk accounts can recover up to 70% of flagged ARR based on historical data.",
          steps: [
            "Assign dedicated CSM to Meridian Corp, BlueWave, and Apex within 24h.",
            "Offer 2-month extension + onboarding refresh to low-NPS accounts.",
            "Schedule executive business review for accounts > $30K ARR.",
          ],
        },
      ],
    };
  }

  // Market / competitor / APAC / research
  if (/market|competitor|apac|industry|trend|research/.test(p)) {
    return {
      agents: ["research", "strategy"],
      executionTime: execTime(),
      steps: [
        "Scanning live market signals…",
        "Running Research agent…",
        "Analysing competitor pricing…",
        "Generating strategic recommendations…",
        "Composing response…",
      ],
      sections: [
        {
          type: "insight",
          title: "APAC Market Opportunity",
          content: "Enterprise AI spend in APAC is projected at $14.2B in 2026 (+27% YoY). Singapore and Tokyo are the fastest-growing entry markets with low incumbent saturation.",
          severity: "info",
        },
        {
          type: "chart",
          title: "APAC AI Spend by Market ($B)",
          data: [
            { label: "Singapore", value: 3.2, color: "var(--agent-research)" },
            { label: "Tokyo",     value: 4.1, color: "var(--agent-research)" },
            { label: "Sydney",    value: 2.8, color: "var(--agent-research)" },
            { label: "Mumbai",    value: 2.4, color: "var(--agent-research)" },
            { label: "Seoul",     value: 1.7, color: "var(--agent-research)" },
          ],
        },
        {
          type: "insight",
          title: "Competitor Pricing Shift",
          content: "Rival A dropped SMB pricing by 15% last week. Rival B launched a freemium tier targeting APAC startups. Recommend reviewing mid-market positioning before Q1.",
          severity: "warning",
        },
        {
          type: "strategy",
          title: "APAC Entry Strategy",
          content: "A phased APAC entry starting with Singapore in Q1 minimises risk while capturing the highest-value segment.",
          steps: [
            "Launch Singapore pilot with 3 anchor enterprise customers in Q1.",
            "Localise pricing to SGD/JPY with regional payment methods.",
            "Partner with local SI firms for faster enterprise sales cycles.",
          ],
        },
      ],
    };
  }

  // Document / search / find
  if (/find|search|document|look|file/.test(p)) {
    return {
      agents: ["search"],
      executionTime: execTime(),
      steps: [
        "Connecting to document store…",
        "Running Search agent…",
        "Semantic search across 47 documents…",
        "Ranking by relevance…",
        "Composing response…",
      ],
      sections: [
        {
          type: "documents",
          title: "Top Matching Documents",
          items: [
            { name: "Q3-Financials.xlsx",       relevance: 96, type: "Excel" },
            { name: "Customer-Survey.csv",       relevance: 91, type: "CSV" },
            { name: "Pricing-Playbook.pdf",      relevance: 87, type: "PDF" },
            { name: "Market-Report-2025.pdf",    relevance: 82, type: "PDF" },
            { name: "Go-To-Market-Strategy.pptx",relevance: 78, type: "PowerPoint" },
          ],
        },
        {
          type: "summary",
          title: "Search Summary",
          content: `Found 5 highly relevant documents matching "${prompt}". The top result (Q3-Financials.xlsx) contains the most recent financial data. Use the chat to ask follow-up questions about any document.`,
        },
      ],
    };
  }

  // Strategy / plan / roadmap
  if (/strateg|plan|roadmap|grow|expand|launch/.test(p)) {
    return {
      agents: ["strategy", "data"],
      executionTime: execTime(),
      steps: [
        "Analysing business context…",
        "Running Strategy agent…",
        "Cross-referencing data metrics…",
        "Building roadmap…",
        "Composing response…",
      ],
      sections: [
        {
          type: "summary",
          title: "Strategic Context",
          content: "Based on current performance data, the business is in a strong growth phase with Q3 revenue up 18.4% QoQ. The primary strategic levers are vertical expansion, pricing optimisation, and APAC entry.",
        },
        {
          type: "strategy",
          title: "90-Day Growth Roadmap",
          content: "A focused 90-day plan targeting the highest-ROI initiatives based on current data.",
          steps: [
            "Month 1: FinServ vertical push — co-branded launch with 2 anchor partners.",
            "Month 2: Mid-market bundle rollout — Pro + Analytics at $199/mo.",
            "Month 3: APAC pilot — Singapore with 3 enterprise accounts.",
          ],
        },
        {
          type: "metrics",
          title: "Projected Impact",
          items: [
            { label: "ARR Uplift",    value: "+$420K", change: 15 },
            { label: "New Accounts",  value: "28",     change: 22 },
            { label: "Churn Target",  value: "1.6%",   change: -24 },
          ],
        },
      ],
    };
  }

  // Default / general overview
  return {
    agents: ["data", "strategy"],
    executionTime: execTime(),
    steps: [
      "Connecting to data sources…",
      "Running Data Analyst agent…",
      "Running Strategy agent…",
      "Synthesising insights…",
      "Composing response…",
    ],
    sections: [
      {
        type: "summary",
        content: `I've analysed your query: "${prompt}". Here's a business overview based on your connected data sources.`,
      },
      {
        type: "metrics",
        title: "Key Metrics",
        items: [
          { label: "Revenue",      value: "$2.84M", change: 18.4 },
          { label: "Active Users", value: "1,247",  change: 9.2 },
          { label: "Churn Rate",   value: "2.1%",   change: -0.4 },
        ],
      },
      {
        type: "insight",
        title: "Top Insight",
        content: "Enterprise tier is the primary growth driver this quarter. FinServ vertical now represents 32% of new ARR — the highest concentration in 6 quarters.",
        severity: "success",
      },
    ],
  };
}
