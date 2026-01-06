// lib/auth.ts
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@supabase/ssr'

// Get user session from Supabase
export async function getServerSession() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return { user: { id: user.id, email: user.email } }
}

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

export async function requireAuth() {
  const customer = await getSessionCustomer()
  if (!customer) {
    throw new Error('Unauthorized')
  }
  return customer
}

export async function requireAdmin() {
  const customer = await requireAuth()
  if (customer.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }
  return customer
}

export async function isAdmin(customer: { role: string | null } | null): Promise<boolean> {
  return customer?.role === 'admin'
}

export async function requireReseller() {
  const customer = await requireAuth()
  if (customer.role !== 'reseller' && customer.role !== 'admin') {
    throw new Error('Forbidden: Reseller or Admin access required')
  }
  return customer
}
