import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  User, Mail, Building2, Shield, Camera, Save,
  Bell, Palette, Key, LogOut, CheckCircle2, AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

type Tab = "profile" | "notifications" | "appearance" | "security";

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance",    label: "Appearance",    icon: Palette },
  { id: "security",      label: "Security",      icon: Key },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [form, setForm] = useState({
    name: "Aarav Mehta",
    email: "aarav@acme.io",
    company: "Acme Corp",
    role: "Admin",
    bio: "Enterprise strategy lead focused on AI-driven growth.",
    timezone: "Asia/Kolkata",
  });

  // Notification prefs
  const [notifs, setNotifs] = useState({
    insightAlerts: true,
    weeklyDigest: true,
    teamActivity: false,
    systemUpdates: true,
  });

  // Appearance
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [accentColor, setAccentColor] = useState("indigo");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  }

  function handleSignOut() {
    navigate({ to: "/login" });
  }

  return (
    <div className="h-full overflow-y-auto">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account and preferences"
        action={
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 h-9 px-4 rounded-xl border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        }
      />

      <div className="p-6 max-w-4xl space-y-6">
        {/* ── Avatar + name hero ── */}
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5">
          <div className="relative group">
            <div className="size-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-[var(--agent-search)] flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="size-full object-cover" />
              ) : (
                <span className="text-2xl font-semibold text-primary-foreground select-none">
                  {form.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              aria-label="Change avatar"
            >
              <Camera className="size-5 text-white" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold">{form.name}</div>
            <div className="text-sm text-muted-foreground">{form.email}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                {form.role}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="size-3" /> {form.company}
              </span>
            </div>
          </div>
          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-2 rounded-xl border border-green-500/20">
              <CheckCircle2 className="size-4" /> Saved
            </div>
          )}
        </div>

        {/* ── Tab bar ── */}
        <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                tab === t.id
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="size-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Profile tab ── */}
        {tab === "profile" && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full name" icon={User}>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="field-input"
                />
              </Field>
              <Field label="Email address" icon={Mail}>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="field-input"
                  type="email"
                />
              </Field>
              <Field label="Company" icon={Building2}>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="field-input"
                />
              </Field>
              <Field label="Role" icon={Shield}>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="field-input"
                >
                  {["Admin", "Analyst", "Researcher", "Viewer"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Bio">
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="field-input py-2 resize-none"
              />
            </Field>
            <Field label="Timezone">
              <select
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="field-input"
              >
                {[
                  "Asia/Kolkata",
                  "America/New_York",
                  "America/Los_Angeles",
                  "Europe/London",
                  "Europe/Berlin",
                  "Asia/Singapore",
                  "Asia/Tokyo",
                ].map((tz) => (
                  <option key={tz}>{tz}</option>
                ))}
              </select>
            </Field>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
              >
                <Save className="size-3.5" /> Save changes
              </button>
            </div>
          </div>
        )}

        {/* ── Notifications tab ── */}
        {tab === "notifications" && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <p className="text-sm text-muted-foreground">Choose what you want to be notified about.</p>
            {(
              [
                { key: "insightAlerts", label: "AI Insight Alerts", desc: "Get notified when agents surface high-priority insights" },
                { key: "weeklyDigest",  label: "Weekly Digest",     desc: "A summary of your workspace activity every Monday" },
                { key: "teamActivity",  label: "Team Activity",     desc: "When teammates invite users or change roles" },
                { key: "systemUpdates", label: "System Updates",    desc: "Platform updates, maintenance windows, and new features" },
              ] as const
            ).map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                </div>
                <button
                  role="switch"
                  aria-checked={notifs[item.key]}
                  onClick={() => setNotifs((n) => ({ ...n, [item.key]: !n[item.key] }))}
                  className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${
                    notifs[item.key] ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`absolute top-1 size-4 rounded-full bg-white shadow transition-transform ${
                      notifs[item.key] ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
              >
                <Save className="size-3.5" /> Save preferences
              </button>
            </div>
          </div>
        )}

        {/* ── Appearance tab ── */}
        {tab === "appearance" && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="space-y-3">
              <div className="text-sm font-medium">Theme</div>
              <div className="grid grid-cols-3 gap-3">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`p-4 rounded-xl border text-sm font-medium capitalize transition ${
                      theme === t
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"} {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium">Accent color</div>
              <div className="flex gap-3">
                {[
                  { name: "indigo", bg: "bg-indigo-500" },
                  { name: "violet", bg: "bg-violet-500" },
                  { name: "blue",   bg: "bg-blue-500" },
                  { name: "teal",   bg: "bg-teal-500" },
                  { name: "orange", bg: "bg-orange-500" },
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setAccentColor(c.name)}
                    className={`size-8 rounded-full ${c.bg} transition ring-offset-2 ring-offset-background ${
                      accentColor === c.name ? "ring-2 ring-foreground" : ""
                    }`}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
              >
                <Save className="size-3.5" /> Apply
              </button>
            </div>
          </div>
        )}

        {/* ── Security tab ── */}
        {tab === "security" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm">Change Password</h3>
              <Field label="Current password">
                <input type="password" placeholder="••••••••" className="field-input" />
              </Field>
              <Field label="New password">
                <input type="password" placeholder="••••••••" className="field-input" />
              </Field>
              <Field label="Confirm new password">
                <input type="password" placeholder="••••••••" className="field-input" />
              </Field>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
                >
                  <Key className="size-3.5" /> Update password
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm">Active Sessions</h3>
              {[
                { device: "Chrome · macOS", location: "Mumbai, IN", current: true,  time: "Now" },
                { device: "Safari · iPhone", location: "Mumbai, IN", current: false, time: "2h ago" },
                { device: "Edge · Windows",  location: "Bengaluru, IN", current: false, time: "1d ago" },
              ].map((s) => (
                <div key={s.device} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="text-sm font-medium flex items-center gap-2">
                      {s.device}
                      {s.current && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{s.location} · {s.time}</div>
                  </div>
                  {!s.current && (
                    <button className="text-xs text-destructive hover:underline">Revoke</button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="size-4" />
                <h3 className="font-semibold text-sm">Danger Zone</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button className="h-9 px-4 rounded-xl border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition">
                Delete account
              </button>
            </div>
          </div>
        )}

        {/* ── Sign out section ── */}
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Sign out of ESA</div>
            <div className="text-xs text-muted-foreground mt-0.5">You'll be redirected to the login page.</div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 h-9 px-4 rounded-xl border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
      </div>

      {/* Inline styles for field inputs */}
      <style>{`
        .field-input {
          height: 2.5rem;
          width: 100%;
          padding: 0 0.75rem;
          border-radius: 0.75rem;
          background: var(--background);
          border: 1px solid var(--input);
          font-size: 0.875rem;
          outline: none;
          color: var(--foreground);
        }
        .field-input:focus {
          box-shadow: 0 0 0 2px var(--ring);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: typeof User;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="size-3" />}
        {label}
      </span>
      {children}
    </label>
  );
}
