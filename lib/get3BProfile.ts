// lib/get3BProfile.ts
export async function get3BProfile(threeBId: string) {
  return prisma.customer.findUnique({
    where: { three_b_id: threeBId },
    include: {
      snapshots: {
        orderBy: { receivedat: 'desc' },
        take: 3
      },
      webhook_audit: {
        take
