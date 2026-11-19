import { KKHeader } from "@/components/kk/header";
import { KKFooter } from "@/components/kk/footer";
import { getCurrentUserAndProfile } from "@/lib/queries";

export default async function AppMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUserAndProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="kk kk-fade">
        <KKHeader user={user} profile={profile} />
      </div>
      <div className="flex-1 kk-page">{children}</div>
      <div className="kk">
        <KKFooter />
      </div>
    </div>
  );
}
