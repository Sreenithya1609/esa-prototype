import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/billing")({
  component: BillingPage,
});

const plans = [
  { name: "Starter", priceUsd: 49, priceInr: 3999, features: ["1 workspace", "3 agents", "5 data sources", "Email support"] },
  { name: "Growth", priceUsd: 199, priceInr: 16999, features: ["5 workspaces", "All 4 agents", "Unlimited sources", "SSO (Google/MS)", "Priority support"], popular: true },
  { name: "Enterprise", priceUsd: 0, priceInr: 0, features: ["Unlimited everything", "SAML/Okta SSO", "Audit logs & SOC 2", "Dedicated CSM", "Custom contracts"] },
];

function BillingPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  return (
    <div className="h-full overflow-y-auto">
      <PageHeader title="Billing" subtitle="Choose the plan that fits your team" />
      <div className="p-6 max-w-6xl space-y-6">
        <div className="flex justify-end">
          <div className="flex gap-1 bg-muted p-1 rounded-xl">
            {(["USD", "INR"] as const).map((c) => (
              <button key={c} onClick={() => setCurrency(c)}
                className={`h-8 px-3 rounded-lg text-xs font-medium transition ${currency === c ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-2xl border bg-card p-6 space-y-4 ${p.popular ? "border-primary shadow-md" : "border-border"}`}>
              {p.popular && <span className="absolute -top-2 left-6 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-semibold">Most popular</span>}
              <div>
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <div className="mt-2">
                  {p.priceUsd === 0 ? (
                    <div className="text-2xl font-semibold">Custom</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold tracking-tight">
                        {currency === "USD" ? `$${p.priceUsd}` : `₹${p.priceInr.toLocaleString("en-IN")}`}
                      </span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                  )}
                </div>
              </div>
              <ul className="space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm"><Check className="size-4 text-primary mt-0.5 shrink-0" />{f}</li>
                ))}
              </ul>
              <button className={`w-full h-10 rounded-xl font-medium text-sm transition ${p.popular ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border hover:bg-muted"}`}>
                {p.priceUsd === 0 ? "Contact sales" : "Choose plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
