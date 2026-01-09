// api/create-test-customer.ts
import { prisma } from '@/lib/prisma';

export default async function handler() {
  const customer = await prisma.customer.create({
    data: {
      email: 'bounceback@3boost.com',
      first_name: 'Brian',
      last_name: 'Test',
      customer_type: 'PERSONAL'
    }
  });
  return Response.json({ threeBId: customer.three_b_id });
}
