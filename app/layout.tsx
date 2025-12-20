// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3B Credit Builder",
  description: "Build credit the smart way with AI-powered monitoring, disputes, and funding roadmap",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">
        {children}
      </body>
    </html>
  );
}
