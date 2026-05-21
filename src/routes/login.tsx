import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type Modal = null | "okta" | "saml";

function LoginPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<Modal>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const startProvider = (label: string) => {
    setLoading(label);
    setTimeout(() => navigate({ to: "/onboarding" }), 1100);
  };

  const submitModal = () => {
    if (!input.trim()) return;
    setLoading(modal === "okta" ? "Redirecting to Okta…" : "Validating SAML response…");
    setTimeout(() => navigate({ to: "/onboarding" }), 1400);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-[var(--agent-search)] text-primary-foreground">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <div className="size-9 rounded-xl bg-white/15 grid place-items-center backdrop-blur">
            <Sparkles className="size-5" />
          </div>
          <span className="font-semibold tracking-tight">Enterprise Strategy Agent</span>
        </Link>
        <div className="space-y-4 max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Multi-agent intelligence for the modern enterprise.
          </h1>
          <p className="text-primary-foreground/80">
            Ask one question. Get answers from Strategy, Data, Search, and Research agents — together.
          </p>
        </div>
        <div className="text-xs text-primary-foreground/70">SOC 2 · GDPR · HIPAA ready</div>
      </div>

      <div className="flex items-center justify-center p-6 relative">
        <Link to="/" className="absolute top-6 left-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-sm p-8 space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in to ESA</h2>
            <p className="text-sm text-muted-foreground">Use your enterprise identity provider</p>
          </div>

          <div className="space-y-2">
            <ProviderBtn label="Continue with Google" onClick={() => startProvider("Google")} icon="G" />
            <ProviderBtn label="Continue with Microsoft" onClick={() => startProvider("Microsoft")} icon="⊞" />
          </div>

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> Or continue with enterprise SSO <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-2">
            <ProviderBtn label="Continue with Okta" onClick={() => setModal("okta")} icon="O" />
            <ProviderBtn label="Continue with SAML SSO" onClick={() => setModal("saml")} icon="◆" />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">
              {modal === "okta" ? "Sign in with Okta" : "Sign in with SAML"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {modal === "okta"
                ? "Enter your company Okta domain to continue."
                : "Enter your work email — we'll route you to your IdP."}
            </p>
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={modal === "okta" ? "company.okta.com" : "you@company.com"}
              className="w-full h-11 px-4 rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> {loading}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => { setModal(null); setInput(""); setLoading(null); }}
                className="h-10 px-4 rounded-xl text-sm hover:bg-muted"
              >Cancel</button>
              <button
                onClick={submitModal}
                disabled={!!loading}
                className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60"
              >Continue</button>
            </div>
          </div>
        </div>
      )}

      {loading && !modal && (
        <div className="fixed inset-0 bg-background/70 backdrop-blur-sm grid place-items-center z-50">
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl shadow-lg px-5 py-4">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-sm">Redirecting to {loading}…</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ProviderBtn({ label, onClick, icon }: { label: string; onClick: () => void; icon: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-11 rounded-xl border border-border bg-background hover:bg-muted transition-colors flex items-center gap-3 px-4 text-sm font-medium"
    >
      <span className="size-6 rounded-md bg-muted grid place-items-center text-xs font-bold">{icon}</span>
      {label}
    </button>
  );
}
