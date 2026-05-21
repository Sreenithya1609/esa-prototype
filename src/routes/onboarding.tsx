import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles, User, Building2, Briefcase,
  CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

// ── Form schema ───────────────────────────────────────────────────────────────
interface FormData {
  // Step 0 — Personal + Workspace (combined)
  firstName: string;
  orgName:   string;
  orgSize:   string;
  industry:  string;
  // Step 1 — Role & Access
  role:      string;
  useCase:   string;
  timezone:  string;
}

const INITIAL: FormData = {
  firstName: "",
  orgName: "", orgSize: "", industry: "",
  role: "", useCase: "", timezone: "",
};

// ── Validators ────────────────────────────────────────────────────────────────
type Errors = Partial<Record<keyof FormData, string>>;

function validateStep(step: number, form: FormData): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.orgName.trim())   e.orgName   = "Organisation name is required";
    if (!form.orgSize)          e.orgSize   = "Please select your team size";
    if (!form.industry)         e.industry  = "Please select your industry";
  }
  if (step === 1) {
    if (!form.role)    e.role    = "Please select your role";
    if (!form.useCase) e.useCase = "Please select your primary use case";
    if (!form.timezone) e.timezone = "Please select your timezone";
  }
  return e;
}

// ── Step config ───────────────────────────────────────────────────────────────
const STEPS = [
  { label: "About You",  icon: User },
  { label: "Access",     icon: Briefcase },
];

// ── Main component ────────────────────────────────────────────────────────────
function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState<FormData>(INITIAL);
  const [errors, setErrors]   = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function touch(field: keyof FormData) {
    setTouched((t) => ({ ...t, [field]: true }));
    const stepErrors = validateStep(step, { ...form });
    if (stepErrors[field]) setErrors((e) => ({ ...e, [field]: stepErrors[field] }));
  }

  function handleNext() {
    const stepErrors = validateStep(step, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      const allTouched = Object.fromEntries(Object.keys(stepErrors).map((k) => [k, true]));
      setTouched((t) => ({ ...t, ...allTouched }));
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  }

  function handleBack() {
    setErrors({});
    setStep((s) => s - 1);
  }

  function handleSubmit() {
    const stepErrors = validateStep(1, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setTouched({ role: true, useCase: true, timezone: true });
      return;
    }
    setSubmitting(true);
    setTimeout(() => navigate({ to: "/app/dashboard" }), 1200);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Create your workspace</h2>
            <p className="text-sm text-muted-foreground">
              Step {step + 1} of {STEPS.length} — {STEPS[step].label}
            </p>
          </div>
        </div>

        {/* ── Step indicators ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const done   = i < step;
              const active = i === step;
              return (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    done ? "text-green-600 dark:text-green-400" : active ? "text-primary" : "text-muted-foreground"
                  }`}>
                    <div className={`size-6 rounded-full grid place-items-center border-2 transition-all ${
                      done
                        ? "bg-green-500 border-green-500 text-white"
                        : active
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }`}>
                      {done
                        ? <CheckCircle2 className="size-3.5" />
                        : <span className="text-[10px] font-bold">{i + 1}</span>
                      }
                    </div>
                    <span className="hidden sm:block">{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: done ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Thin progress bar */}
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: step === 0 ? "0%" : "100%" }}
            />
          </div>
        </div>

        {/* ── Form card ── */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">

          {/* ── Step 0: Personal + Workspace combined ── */}
          {step === 0 && (
            <div className="space-y-4">
              <SectionTitle
                icon={User}
                title="About You & Your Workspace"
                subtitle="Tell us about yourself and your organisation"
              />

              {/* Personal section */}
              <div className="space-y-1 pt-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="size-3" /> Personal
                </p>
              </div>
              <Field label="First Name" required error={touched.firstName ? errors.firstName : ""}>
                <input
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  onBlur={() => touch("firstName")}
                  placeholder="Aarav"
                  className={inputCls(touched.firstName ? errors.firstName : "")}
                />
              </Field>

              {/* Workspace section */}
              <div className="space-y-1 pt-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="size-3" /> Workspace
                </p>
              </div>
              <Field label="Organisation Name" required error={touched.orgName ? errors.orgName : ""}>
                <input
                  value={form.orgName}
                  onChange={(e) => set("orgName", e.target.value)}
                  onBlur={() => touch("orgName")}
                  placeholder="Acme Corp"
                  className={inputCls(touched.orgName ? errors.orgName : "")}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Team Size" required error={touched.orgSize ? errors.orgSize : ""}>
                  <select
                    value={form.orgSize}
                    onChange={(e) => set("orgSize", e.target.value)}
                    onBlur={() => touch("orgSize")}
                    className={inputCls(touched.orgSize ? errors.orgSize : "")}
                  >
                    <option value="">Select…</option>
                    <option>1–10</option>
                    <option>11–50</option>
                    <option>51–200</option>
                    <option>201–1000</option>
                    <option>1000+</option>
                  </select>
                </Field>
                <Field label="Industry" required error={touched.industry ? errors.industry : ""}>
                  <select
                    value={form.industry}
                    onChange={(e) => set("industry", e.target.value)}
                    onBlur={() => touch("industry")}
                    className={inputCls(touched.industry ? errors.industry : "")}
                  >
                    <option value="">Select…</option>
                    <option>Technology</option>
                    <option>Financial Services</option>
                    <option>Healthcare</option>
                    <option>Retail & E-commerce</option>
                    <option>Manufacturing</option>
                    <option>Consulting</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* ── Step 1: Role & Access ── */}
          {step === 1 && (
            <div className="space-y-4">
              <SectionTitle icon={Briefcase} title="Role & Access" subtitle="How will you use ESA?" />
              <Field
                label="Your Role" required
                error={touched.role ? errors.role : ""}
                hint="Determines your default permissions"
              >
                <select
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                  onBlur={() => touch("role")}
                  className={inputCls(touched.role ? errors.role : "")}
                >
                  <option value="">Select role…</option>
                  <option>Admin</option>
                  <option>Analyst</option>
                  <option>Researcher</option>
                  <option>Viewer</option>
                </select>
              </Field>
              <Field label="Primary Use Case" required error={touched.useCase ? errors.useCase : ""}>
                <select
                  value={form.useCase}
                  onChange={(e) => set("useCase", e.target.value)}
                  onBlur={() => touch("useCase")}
                  className={inputCls(touched.useCase ? errors.useCase : "")}
                >
                  <option value="">Select use case…</option>
                  <option>Revenue & Financial Analysis</option>
                  <option>Strategy & Planning</option>
                  <option>Market & Competitor Research</option>
                  <option>Document Search & Retrieval</option>
                  <option>Customer & Churn Analysis</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Timezone" required error={touched.timezone ? errors.timezone : ""}>
                <select
                  value={form.timezone}
                  onChange={(e) => set("timezone", e.target.value)}
                  onBlur={() => touch("timezone")}
                  className={inputCls(touched.timezone ? errors.timezone : "")}
                >
                  <option value="">Select timezone…</option>
                  <option>Asia/Kolkata (IST)</option>
                  <option>America/New_York (EST)</option>
                  <option>America/Los_Angeles (PST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>Europe/Berlin (CET)</option>
                  <option>Asia/Singapore (SGT)</option>
                  <option>Asia/Tokyo (JST)</option>
                  <option>Australia/Sydney (AEST)</option>
                </select>
              </Field>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between pt-2">
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition"
              >
                <ChevronLeft className="size-4" /> Back
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
              >
                Continue <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition"
              >
                {submitting
                  ? <><Loader2 className="size-4 animate-spin" /> Creating workspace…</>
                  : <><CheckCircle2 className="size-4" /> Create Workspace</>
                }
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          <span className="text-destructive">*</span> All fields are required
        </p>
      </div>

      <style>{`select option[value=""] { color: var(--muted-foreground); }`}</style>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function inputCls(error?: string) {
  return `w-full h-11 px-4 rounded-xl bg-background border text-sm outline-none transition focus:ring-2 ${
    error ? "border-destructive focus:ring-destructive/30" : "border-input focus:ring-ring/40"
  }`;
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: typeof User; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 pb-1">
      <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
        <Icon className="size-4" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  );
}

function Field({
  label, required, error, hint, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
        {hint && <span className="font-normal text-muted-foreground/70 ml-1">— {hint}</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="size-3 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
