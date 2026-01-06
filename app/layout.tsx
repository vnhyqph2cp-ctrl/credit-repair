// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3B Credit Builder",
  description: "Credit Builder, Monitoring, Disputes, Funding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
  <body className="min-h-screen"> 
        {children}
      </body>
    </html>
  );
}
