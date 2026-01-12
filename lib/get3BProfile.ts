// lib/get3BProfile.ts

export async function get3BProfile(threeBId: string) {
  // TEMP: stubbed for deploy - no Prisma
  // TODO: Update Prisma schema to include three_b_id, snapshots, webhook_audit relations
  return null;
  
  /* Original code - restore after fixing Prisma schema:
  return prisma.customer.findUnique({
    where: { three_b_id: threeBId },
    include: {
      snapshots: {
        orderBy: { receivedat: 'desc' },
        take: 3
      },
      webhook_audit: {
        take: 10,
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  */
}
