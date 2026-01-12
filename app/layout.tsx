import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3B Credit Builder",
  description: "Credit analysis, enforcement, and funding readiness",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <div className="pointer-events-none fixed inset-0 bg-radial-glow opacity-70" />
        <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        <main className="relative min-h-screen">{children}</main>
      </body>
    </html>
  );
}
