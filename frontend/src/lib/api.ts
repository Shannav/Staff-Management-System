import { useAuth } from "../store/auth";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export async function signIn(email: string, password: string): Promise<void> {
  const response = await fetch(`${apiBase}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? "Unable to sign in. Check your connection and try again.");
  }
  const body = (await response.json()) as { access_token: string };
  useAuth.getState().setSession(body.access_token, email);
}
