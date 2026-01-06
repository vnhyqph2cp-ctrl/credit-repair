/**
 * Analyzer Items API with Enforcement Integration
 * 
 * GET /api/enforcement/analyzer-items
 * Retrieve all analyzer items with enforcement status
 * 
 * POST /api/enforcement/analyzer-items
 * Create new dispute item with mandatory Round 1 identity verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  enforceIdentityVerification, 
  calculateResponseDeadline 
} from '@/lib/enforcement/enforcement-engine';
import { RoundStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email }
    });
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const bureau = searchParams.get('bureau');
    const violationsOnly = searchParams.get('violationsOnly') === 'true';
    
    let whereClause: any = {
      memberId: customer.id
    };
    
    if (status) {
      whereClause.roundStatus = status;
    }
    
    if (bureau) {
      whereClause.bureau = bureau;
    }
    
    if (violationsOnly) {
      whereClause.proceduralViolation = true;
    }
    
    const items = await prisma.analyzerItem.findMany({
      where: whereClause,
      include: {
        mailEvidence: {
          orderBy: { receivedAt: 'desc' },
          take: 5 // Latest 5 pieces of evidence
        }
      },
      orderBy: [
        { proceduralViolation: 'desc' }, // Violations first
        { responseDeadline: 'asc' }      // Then by urgency
      ]
    });
    
    // Calculate enforcement metadata
    const itemsWithMeta = items.map(item => {
      const now = new Date();
      const daysFromDispute = Math.floor(
        (now.getTime() - item.disputeFiledAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      const daysUntilDeadline = Math.floor(
        (item.responseDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return {
        ...item,
        enforcement: {
          daysFromDispute,
          daysUntilDeadline,
          isOverdue: daysUntilDeadline < 0,
          urgency: daysUntilDeadline <= 3 ? 'critical' : daysUntilDeadline <= 7 ? 'high' : 'normal'
        }
      };
    });
    
    return NextResponse.json({ items: itemsWithMeta });
    
  } catch (error) {
    console.error('Analyzer items retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analyzer items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email }
    });
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    const body = await request.json();
    
    const {
      bureau,
      creditor,
      accountNumber,
      itemType,
      disputeReason,
      analyzerSection,
      ruleKey,
      metadata
    } = body;
    
    // Validation
    if (!bureau || !creditor || !disputeReason) {
      return NextResponse.json(
        { error: 'Missing required fields: bureau, creditor, disputeReason' },
        { status: 400 }
      );
    }
    
    // MANDATORY: Enforce identity verification for Round 1
    const isVerified = await enforceIdentityVerification(customer.id, bureau);
    
    const disputeFiledAt = new Date();
    const responseDeadline = calculateResponseDeadline(disputeFiledAt);
    
    // Create analyzer item
    const item = await prisma.analyzerItem.create({
      data: {
        memberId: customer.id,
        bureau,
        creditor,
        accountNumber,
        itemType: itemType || 'tradeline',
        disputeReason,
        roundNumber: 1,
        roundStatus: isVerified ? RoundStatus.INVESTIGATION_PENDING : RoundStatus.IDENTITY_VERIFICATION,
        disputeFiledAt,
        responseDeadline,
        analyzerSection,
        ruleKey,
        metadata: metadata || {},
        nextAction: isVerified 
          ? 'Wait for investigation results (30-day statutory deadline)'
          : 'Submit identity verification documents to bureau'
      }
    });
    
    return NextResponse.json({
      success: true,
      item: {
        id: item.id,
        roundStatus: item.roundStatus,
        responseDeadline: item.responseDeadline,
        nextAction: item.nextAction,
        identityVerificationRequired: !isVerified
      }
    });
    
  } catch (error) {
    console.error('Analyzer item creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create analyzer item', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
