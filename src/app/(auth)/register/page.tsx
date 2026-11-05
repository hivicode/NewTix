import type { Metadata } from "next";
import { AuthForms } from "@/components/features/auth-forms";

export const metadata: Metadata = {
  title: "Daftar Akun Baru",
  description:
    "Buat akun KARCIS untuk memesan tiket gigs, festival, dan lokakarya.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthForms
      mode="register"
      redirectTo={params.redirect || "/"}
      oauthError={params.error}
    />
  );
}

