import { Metadata } from "next";
import { LoginForm } from "./login-form";
import { genTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: genTitle("Se connecter"),
};

export default function LoginPage() {
  return <LoginForm />;
}
