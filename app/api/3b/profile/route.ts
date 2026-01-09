import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const threeBId = searchParams.get('threeBId');

  if (!threeBId) {
    return NextResponse.json({ error: 'threeBId is required' }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({
    where: { id: threeBId },
    include: {
      Snapshot: {
        orderBy: { createdAt: 'desc' },
        take: 3,
      },
    },
  });

  return NextResponse.json({ threeBId, customer });
}
