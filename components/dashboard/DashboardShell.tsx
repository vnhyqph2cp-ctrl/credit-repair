import Link from "next/link";

type DashboardShellProps = {
  userEmail?: string | null;
  children: React.ReactNode;
};

export function DashboardShell({ userEmail, children }: DashboardShellProps) {
  const username = userEmail?.split("@")[0] || "Member";

  return (
    <div
      className="relative flex min-h-screen justify-center px-4 py-10 text-white md:px-8 overflow-hidden"
      style={{
        backgroundImage: "url('/backgrounds/Dashboard_View.webp')",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/75" />

      {/* top chrome */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
          {/* brand */}
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl glass-card p-0">
              <span className="text-xs font-bold tracking-tight text-cyan-300">
                3B
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                Credit Builder
              </p>
              <p className="text-sm text-gray-300">
                Credit enforcement & dispute command
              </p>
            </div>
          </div>

          {/* user */}
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="hidden text-right text-xs text-gray-400 sm:block">
              <p className="font-medium text-gray-200">{username}</p>
              <p>Secure member dashboard</p>
            </div>

            <Link
              href="/logout"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs font-medium text-gray-200 backdrop-blur-md transition-all duration-200 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Sign out
            </Link>
          </div>
        </div>
      </header>

      {/* main content */}
      <main className="relative z-20 w-full max-w-6xl pt-24 md:pt-28 flex flex-col gap-6">
        {children}
      </main>
    </div>
  );
}
