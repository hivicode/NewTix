export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="kk kk-fade">
      <div className="gate kk-gate">{children}</div>
    </div>
  );
}
