import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", org: "", role: "Admin", industry: "Technology" });

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-background">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-sm p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary text-primary-foreground grid place-items-center">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Create your workspace</h2>
            <p className="text-sm text-muted-foreground">Tell us a bit about you and your team.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Field label="Full name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Aarav Mehta" className="input" />
          </Field>
          <Field label="Organization">
            <input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })}
              placeholder="Acme Corp" className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role">
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input">
                <option>Admin</option><option>Analyst</option><option>Researcher</option><option>Viewer</option>
              </select>
            </Field>
            <Field label="Industry">
              <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="input">
                <option>Technology</option><option>Finance</option><option>Healthcare</option><option>Retail</option><option>Other</option>
              </select>
            </Field>
          </div>
        </div>

        <button
          onClick={() => navigate({ to: "/app/chat" })}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
        >
          Create Workspace
        </button>
      </div>

      <style>{`.input{height:2.75rem;width:100%;padding:0 1rem;border-radius:0.75rem;background:var(--background);border:1px solid var(--input);font-size:.875rem;outline:none}.input:focus{box-shadow:0 0 0 2px var(--ring)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
