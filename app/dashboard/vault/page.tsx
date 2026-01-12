import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";

export default function VaultPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Vault</h1>
        <p className="text-muted-foreground">
          Secure storage for reports, letters, bureau responses, and outcome proof.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <VaultLink href="/dashboard/vault/reports">
          <StatCard label="Reports" value={0} />
        </VaultLink>

        <VaultLink href="/dashboard/vault/letters">
          <StatCard label="Letters" value={0} />
        </VaultLink>

        <VaultLink href="/dashboard/vault/responses">
          <StatCard label="Responses" value={0} />
        </VaultLink>

        <VaultLink href="/dashboard/vault/evidence">
          <StatCard label="Evidence" value={0} />
        </VaultLink>
      </div>

      <p className="text-xs text-muted-foreground">
        Vault items are created automatically from analyzer and enforcement activity.
      </p>
    </div>
  );
}

/* -------- helper -------- */

function VaultLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block focus:outline-none focus:ring-2 focus:ring-neon-teal rounded-xl"
    >
      {children}
    </Link>
  );
}
