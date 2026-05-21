import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/app") {
      throw redirect({ to: "/app/dashboard" });
    }
  },
  component: AppShell,
});
