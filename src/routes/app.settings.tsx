import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Cpu, Shield } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [tab, setTab] = useState<"llm" | "sso">("llm");
  const [ssoTab, setSsoTab] = useState<"saml" | "okta">("saml");

  return (
    <div className="h-full overflow-y-auto">
      <PageHeader title="Settings" subtitle="Configure LLM providers and enterprise SSO" />
      <div className="p-6 max-w-3xl space-y-6">
        <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
          <TabBtn active={tab === "llm"} onClick={() => setTab("llm")} icon={Cpu} label="LLM Config" />
          <TabBtn active={tab === "sso"} onClick={() => setTab("sso")} icon={Shield} label="SSO Config" />
        </div>

        {tab === "llm" && (
          <Card>
            <Field label="Provider">
              <select className="input"><option>OpenAI</option><option>Anthropic</option><option>Google</option><option>Azure</option></select>
            </Field>
            <Field label="API Key">
              <input type="password" placeholder="sk-••••••••" className="input" />
            </Field>
            <Field label="Model">
              <select className="input"><option>gpt-5.2</option><option>claude-sonnet-4</option><option>gemini-2.5-pro</option></select>
            </Field>
            <div className="flex gap-2 pt-2">
              <button className="h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted">Test connection</button>
              <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Save</button>
            </div>
          </Card>
        )}

        {tab === "sso" && (
          <Card>
            <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
              <TabBtn active={ssoTab === "saml"} onClick={() => setSsoTab("saml")} label="SAML" />
              <TabBtn active={ssoTab === "okta"} onClick={() => setSsoTab("okta")} label="Okta" />
            </div>
            {ssoTab === "saml" ? (
              <div className="space-y-4 pt-4">
                <Field label="Entity ID"><input className="input" placeholder="urn:acme:esa" /></Field>
                <Field label="ACS URL"><input className="input" defaultValue="https://esa.acme.io/auth/saml/acs" /></Field>
                <Field label="SSO URL"><input className="input" placeholder="https://idp.acme.com/sso" /></Field>
                <Field label="X.509 Certificate"><textarea rows={4} className="input min-h-[100px] py-2" placeholder="-----BEGIN CERTIFICATE-----" /></Field>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <Field label="Okta Domain"><input className="input" placeholder="company.okta.com" /></Field>
                <Field label="Client ID"><input className="input" /></Field>
                <Field label="Client Secret"><input type="password" className="input" /></Field>
              </div>
            )}
            <div className="pt-2"><button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Save SSO</button></div>
          </Card>
        )}

        <style>{`.input{height:2.5rem;width:100%;padding:0 .75rem;border-radius:.75rem;background:var(--background);border:1px solid var(--input);font-size:.875rem;outline:none}.input:focus{box-shadow:0 0 0 2px var(--ring)}`}</style>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-card border border-border rounded-2xl p-6 space-y-4">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-xs font-medium text-muted-foreground">{label}</span>{children}</label>;
}
function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon?: typeof Cpu; label: string }) {
  return (
    <button onClick={onClick}
      className={`h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-2 transition ${active ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
      {Icon && <Icon className="size-4" />}{label}
    </button>
  );
}
