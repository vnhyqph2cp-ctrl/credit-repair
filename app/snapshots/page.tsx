// app/snapshots/page.tsx
import { prisma } from '@/lib/prisma';

export default async function SnapshotsPage() {
  const [snapshots, audits] = await Promise.all([
    prisma.snapshots.findMany({
      orderBy: { received_at: 'desc' },
      take: 10,
    }),
    prisma.webhook_audit.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
    }),
  ]);

  return (
    <main className="p-6 space-y-6">
      <section>
        <h1 className="text-xl font-semibold">Snapshots</h1>
        <pre className="mt-2 text-xs bg-black/5 p-3 rounded">
          {JSON.stringify(snapshots, null, 2)}
        </pre>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Webhook Audit</h2>
        <pre className="mt-2 text-xs bg-black/5 p-3 rounded">
          {JSON.stringify(audits, null, 2)}
        </pre>
      </section>
    </main>
  );
}
