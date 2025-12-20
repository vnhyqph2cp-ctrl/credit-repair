import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await context.params;

  const now = new Date().toISOString();

  const report = {
    customerId,
    threeBId: '3b_mock_123',
    asOf: now,
    scores: [
      { bureau: 'TU', score: 682, pulledAt: now },
      { bureau: 'EQF', score: 675, pulledAt: now },
      { bureau: 'EXP', score: 689, pulledAt: now },
    ],
    summary: {
      negatives: 3,
      latePayments: 5,
      utilizationPercent: 42,
      oldestAccountYears: 7,
      inquiriesLast12Months: 4,
    },
    tradelines: [],
    inquiries: [],
    publicRecords: [],
    alerts: [],
  };

  return new Response(JSON.stringify({ data: { report }, error: null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

