import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type AddressInput = {
  addressLine1: string
  city: string
  state: string
  zipCode: string
  country: string
}

type UnclaimedPropertyInput = {
  state: string
  holder: string
  amountCents: number
  assetType: string
  referenceNumber?: string
  metadata?: any
}

type UnclaimedAgreementInput = {
  agreementType: 'FINDER_FEE' | 'POWER_OF_ATTORNEY'
  termsAccepted: boolean
  feePercentage?: number
}

type Create3BUnclaimedClientInput = {
  email: string
  firstName: string
  lastName: string
  dateOfBirth: string
  ssnLast4: string
  address: AddressInput
  ecosystemTier?: string
  unclaimedProperties: UnclaimedPropertyInput[]
  agreements: UnclaimedAgreementInput[]
  subscriptionPlan?: string
}

function computeMonthsOld(dateDeliveredToState: string) {
  const delivered = new Date(dateDeliveredToState)
  const now = new Date()
  const diffMs = now.getTime() - delivered.getTime()
  return diffMs / (1000 * 60 * 60 * 24 * 30)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const input: Create3BUnclaimedClientInput = body.input

    // Basic auth guard placeholder (tighten later)
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1) Find or create Customer by email
    let customer = await prisma.customer.findUnique({
      where: { email: input.email },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: input.email,
          name: `${input.firstName} ${input.lastName}`,
          // you can expand with DOB/SSN in a secure table later
        },
      })
    }

    // 2) Create UnclaimedProperty (only first one for now)
    const propInput = input.unclaimedProperties[0]
    if (!propInput) {
      return NextResponse.json(
        { error: 'At least one unclaimedProperties item is required' },
        { status: 400 }
      )
    }

    // NV-specific checks (using metadata.dateDeliveredToState)
    if (propInput.state === 'NV') {
      const agr = input.agreements[0]
      if (agr && agr.agreementType === 'FINDER_FEE') {
        const dateDelivered = propInput.metadata?.dateDeliveredToState
        if (!dateDelivered) {
          return NextResponse.json(
            { error: 'NV FINDER_FEE requires metadata.dateDeliveredToState' },
            { status: 400 }
          )
        }
        const monthsOld = computeMonthsOld(dateDelivered)
        if (monthsOld < 24) {
          return NextResponse.json(
            { error: 'NV NRS 120A.740: property must be >=24 months old' },
            { status: 400 }
          )
        }
        const yearsOld = monthsOld / 12
        const maxFee = yearsOld < 5 ? 10 : 20 // percent
        if (agr.feePercentage && agr.feePercentage > maxFee) {
          return NextResponse.json(
            { error: `Fee exceeds NV cap of ${maxFee}%` },
            { status: 400 }
          )
        }
      }
    }

    const property = await prisma.unclaimedProperty.create({
      data: {
        customerId: customer.id,
        state: propInput.state,
        holder: propInput.holder,
        amountCents: propInput.amountCents,
        assetType: propInput.assetType,
        referenceNumber: propInput.referenceNumber,
        status: 'PENDING',
        metadata: propInput.metadata ?? {},
      },
    })

    // 3) Create UnclaimedAgreement (first one only for now)
    const agrInput = input.agreements[0]
    if (!agrInput) {
      return NextResponse.json(
        { error: 'At least one agreements item is required' },
        { status: 400 }
      )
    }

    const agreement = await prisma.unclaimedAgreement.create({
      data: {
        customerId: customer.id,
        unclaimedPropertyId: property.id,
        agreementType: agrInput.agreementType,
        termsAccepted: agrInput.termsAccepted,
        signedAt: agrInput.termsAccepted ? new Date() : null,
        feePercentage: agrInput.feePercentage,
        metadata: {},
      },
    })

    return NextResponse.json({
      customerId: customer.id,
      profileStatus: 'ACTIVE',
      unclaimedProperty: {
        id: property.id,
        amountCents: property.amountCents,
        status: property.status,
      },
      agreement: {
        id: agreement.id,
        agreementType: agreement.agreementType,
        termsAccepted: agreement.termsAccepted,
        feePercentage: agreement.feePercentage,
      },
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message ?? 'Internal error' },
      { status: 500 }
    )
  }
}
