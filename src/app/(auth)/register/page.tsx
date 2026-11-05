import type { Metadata } from "next";
import { AuthForms } from "@/components/features/auth-forms";

export const metadata: Metadata = {
  title: "Daftar Member Baru",
  description:
    "Buat akun NewTix untuk memesan tiket konser, festival, dan lokakarya seru.",
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
