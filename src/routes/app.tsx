import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ location }) => {
    // Default landing inside the app shell
    if (location.pathname === "/app") {
      throw redirect({ to: "/app/chat" });
    }
  },
  component: AppShell,
});
