import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { getCurrentUserAndProfile } from "@/lib/queries";

export default async function AppMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUserAndProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} profile={profile} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

