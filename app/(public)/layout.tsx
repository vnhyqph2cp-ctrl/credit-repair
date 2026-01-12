import PublicHeader from "@/components/PublicHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main className="relative min-h-screen">{children}</main>
    </>
  );
}
