import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, ArrowLeft, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type Modal = null | "okta" | "saml";

function validateEmail(v: string) {
  if (!v.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
  return "";
}
function validatePassword(v: string) {
  if (!v) return "Password is required";
  if (v.length < 8) return "Password must be at least 8 characters";
  return "";
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const [modal, setModal] = useState<Modal>(null);
  const [ssoInput, setSsoInput] = useState("");

  const emailErr = touched.email ? validateEmail(email) : "";
  const passwordErr = touched.password ? validatePassword(password) : "";
  const formValid = !validateEmail(email) && !validatePassword(password);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-[var(--agent-search)] text-primary-foreground">
        <a href="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <div className="size-9 rounded-xl bg-white/15 grid place-items-center backdrop-blur">
            <Sparkles className="size-5" />
          </div>
          <span className="font-semibold tracking-tight">Enterprise Strategy Agent</span>
        </a>
        <div className="space-y-4 max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Multi-agent intelligence for the modern enterprise.
          </h1>
          <p className="text-primary-foreground/80">
            Ask one question. Get answers from Strategy, Data, Search, and Research agents — together.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {["SOC 2 Type II", "GDPR Ready", "HIPAA Compliant", "SSO / SAML"].map((b) => (
              <span key={b} className="text-xs px-3 py-1 rounded-full bg-white/15 backdrop-blur font-medium">{b}</span>
            ))}
          </div>
        </div>
        <div className="text-xs text-primary-foreground/60">© 2026 ESA, Inc. All rights reserved.</div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex items-center justify-center p-6 relative overflow-y-auto">
        <a href="/" className="absolute top-6 left-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5">
          <ArrowLeft className="size-4" /> Back
        </a>

        <div className="w-full max-w-md space-y-6 py-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <div className="size-8 rounded-xl bg-primary text-primary-foreground grid place-items-center">
                <Sparkles className="size-4" />
              </div>
              <span className="font-semibold">ESA</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Sign in to ESA</h2>
            <p className="text-sm text-muted-foreground">Enter your credentials to access your workspace</p>
          </div>

          {/* Email / password */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Mail className="size-3" /> Work Email <span className="text-destructive ml-0.5">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@company.com"
                autoComplete="email"
                className={`w-full h-11 px-4 rounded-xl bg-background border text-sm outline-none transition focus:ring-2 focus:ring-ring/40 ${emailErr ? "border-destructive" : "border-input"}`}
              />
              {emailErr && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="size-3" /> {emailErr}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Lock className="size-3" /> Password <span className="text-destructive ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="Min. 8 characters"
                  autoComplete="current-password"
                  className={`w-full h-11 px-4 pr-11 rounded-xl bg-background border text-sm outline-none transition focus:ring-2 focus:ring-ring/40 ${passwordErr ? "border-destructive" : "border-input"}`}
                />
                <button type="button" onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordErr && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="size-3" /> {passwordErr}</p>}
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
            </div>

            {/* Sign in — plain anchor, no JS needed */}
            {formValid ? (
              <a
                href="/app/dashboard"
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                Sign in
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setTouched({ email: true, password: true })}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> Or continue with <div className="h-px flex-1 bg-border" />
          </div>

          {/* Social / SSO — plain anchors */}
          <div className="space-y-2">
            <a href="/app/dashboard"
              className="w-full h-11 rounded-xl border border-[#dadce0] bg-white hover:bg-[#f8f9fa] transition-colors flex items-center gap-3 px-4 text-sm font-medium text-[#3c4043] shadow-sm"
              style={{ fontFamily: "'Google Sans', Roboto, sans-serif" }}>
              <svg className="size-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="flex-1 text-center">Continue with Google</span>
            </a>

            <a href="/app/dashboard"
              className="w-full h-11 rounded-xl border border-[#8c8c8c] bg-white hover:bg-[#f3f3f3] transition-colors flex items-center gap-3 px-4 text-sm font-medium text-[#5e5e5e]"
              style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              <svg className="size-5 shrink-0" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              <span className="flex-1 text-center">Continue with Microsoft</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setModal("okta")}
                className="w-full h-11 rounded-xl border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center gap-2 px-4 text-sm font-medium">
                <svg viewBox="0 0 24 24" className="size-4" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#007DC1"/>
                  <circle cx="12" cy="12" r="5.5" fill="white"/>
                </svg>
                Okta
              </button>
              <button onClick={() => setModal("saml")}
                className="w-full h-11 rounded-xl border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center gap-2 px-4 text-sm font-medium">
                <svg viewBox="0 0 24 24" className="size-4" fill="none">
                  <rect width="24" height="24" rx="4" fill="#E8F0FE"/>
                  <path d="M12 6l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 15l-3.75 2.75 1.5-4.5L6 10.5h4.5L12 6z" fill="#4285F4"/>
                </svg>
                SAML SSO
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By continuing you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* SSO Modal */}
      {modal && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">
              {modal === "okta" ? "Sign in with Okta" : "Sign in with SAML"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {modal === "okta" ? "Enter your company Okta domain to continue." : "Enter your work email — we'll route you to your IdP."}
            </p>
            <input
              autoFocus
              value={ssoInput}
              onChange={(e) => setSsoInput(e.target.value)}
              placeholder={modal === "okta" ? "company.okta.com" : "you@company.com"}
              className="w-full h-11 px-4 rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => { setModal(null); setSsoInput(""); }}
                className="h-10 px-4 rounded-xl text-sm hover:bg-muted">Cancel</button>
              {ssoInput.trim() ? (
                <a href="/app/dashboard"
                  className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 flex items-center">
                  Continue
                </a>
              ) : (
                <button disabled
                  className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium opacity-50 cursor-not-allowed">
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
