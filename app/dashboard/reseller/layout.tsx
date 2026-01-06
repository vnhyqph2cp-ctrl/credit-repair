import ResellerSidebar from "@/components/ResellerSidebar";

export default function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <ResellerSidebar />
      <div className="dashboard-main">{children}</div>
    </div>
  );
}
