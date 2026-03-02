import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  let redirectUrl: string | null = null;

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      redirectUrl = "/admin";
      try {
        const origin = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const res = await fetch(`${origin}/api/admin/first-page?userId=${session.user.id}`);
        const json = await res.json();
        if (json.url) redirectUrl = json.url;
      } catch {}
    }
  } catch {
    // Sessão inválida — mostra o login normalmente
  }

  if (redirectUrl) redirect(redirectUrl);

  return <LoginForm />;
}
