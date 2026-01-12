import { NextResponse } from 'next/server';

// TEMP: no Prisma on Vercel; return stub data
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const threeBId = searchParams.get('threeBId');

  if (!threeBId) {
    return NextResponse.json(
      { error: 'threeBId is required' },
      { status: 400 }
    );
  }

  const customer = {
    id: threeBId,
    name: null,
    email: null,
    snapshots: [],
  };

  return NextResponse.json({ threeBId, customer });
}
