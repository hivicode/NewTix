import type { Metadata } from "next";
import { AuthForms } from "@/components/features/auth-forms";

export const metadata: Metadata = {
  title: "Masuk Akun Member",
  description:
    "Masuk ke akun NewTix untuk mengakses album tiket dan acara pilihanmu.",
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
