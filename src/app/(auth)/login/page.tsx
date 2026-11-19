import type { Metadata } from "next";
import { AuthForms } from "@/components/features/auth-forms";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your NewTix account to view your tickets and bookings.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthForms
      mode="login"
      redirectTo={params.redirect || "/"}
      oauthError={params.error}
    />
  );
}
