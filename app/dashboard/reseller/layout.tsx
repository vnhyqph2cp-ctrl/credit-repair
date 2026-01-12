// app/dashboard/reseller/layout.tsx
import { ReactNode } from "react";
import ResellerSidebar from "@/components/dashboard/reseller/ResellerSidebar";

export default function ResellerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <ResellerSidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
