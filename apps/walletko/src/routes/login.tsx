import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "src/features/auth/login-page";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
