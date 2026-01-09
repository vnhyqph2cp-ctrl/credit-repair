import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      take: 5,
    });

    return NextResponse.json({ customers });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to read customers', details: String(error) },
      { status: 500 },
    );
  }
}
