// lib/session.ts
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function getSessionCustomer() {
  const cookieStore = await cookies()
  const customerId = cookieStore.get('customer_id')?.value

  if (!customerId) {
    return null
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  })

  return customer
}
