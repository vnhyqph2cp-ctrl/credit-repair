// api/webhooks/mfsn.ts
export async function POST(req) {
  const payload = await req.json();
  const { threeBId } = payload;  // Extract from MFSN member ID lookup

  // Audit webhook
  await prisma.webhookAudit.create({
    data: {
      externalreportid: payload.externalreportid,
      status: 'RECEIVED',
      rawpayload: payload
    }
  });

  // Create snapshot linked to 3B ID
  await prisma.snapshots.create({
    data: {
      three_b_id: threeBId,
      externalreportid: payload.externalreportid,
      rawData: payload,
      status: 'PROCESSED'
    }
  });

  return Response.json({ success: true });
}
