import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await context.params;

  const health = {
    customerId,
    overallScore: 72,
    buckets: [
      { key: 'payment_history', label: 'Payment history', grade: 'B', score: 78 },
      { key: 'utilization', label: 'Utilization', grade: 'C', score: 65 },
      { key: 'age', label: 'Age of credit', grade: 'B', score: 80 },
      { key: 'mix', label: 'Credit mix', grade: 'B', score: 75 },
      { key: 'inquiries', label: 'Inquiries', grade: 'C', score: 60 },
    ],
  };

  return new Response(JSON.stringify({ data: { health }, error: null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
