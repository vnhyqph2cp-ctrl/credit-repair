/**
 * Mail Evidence Ingestion API
 * 
 * POST /api/enforcement/mail-evidence
 * 
 * Upload and classify incoming mail from bureaus.
 * All mail is evidence — this endpoint triggers state changes in the Analyzer.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { ingestMailEvidence } from '@/lib/enforcement/enforcement-engine';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get customer
    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email }
    });
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    const body = await request.json();
    
    const {
      analyzerItemId,
      bureau,
      receivedDate,
      envelopePath,
      documentPaths,
      rawText,
      roundNumber
    } = body;
    
    // Validation
    if (!bureau || !analyzerItemId) {
      return NextResponse.json(
        { error: 'Missing required fields: bureau, analyzerItemId' },
        { status: 400 }
      );
    }
    
    // Create mail evidence record
    const evidence = await prisma.mailEvidence.create({
      data: {
        memberId: customer.id,
        analyzerItemId,
        bureau,
        receivedAt: receivedDate ? new Date(receivedDate) : new Date(),
        envelopeImageUrl: envelopePath,
        documentImageUrls: documentPaths || [],
        rawText: rawText || '',
        roundNumber: roundNumber || 1,
        classification: 'GENERIC_RESPONSE', // Default until AI classifies
        triggersViolation: false,
        classifiedBy: session.user.email,
      }
    });
    
    return NextResponse.json({
      success: true,
      evidence: {
        id: evidence.id,
        classification: evidence.classification,
        triggersViolation: evidence.triggersViolation,
      }
    });
    
  } catch (error) {
    console.error('Mail evidence ingestion error:', error);
    return NextResponse.json(
      { error: 'Failed to ingest mail evidence', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/enforcement/mail-evidence?analyzerItemId=xxx
 * 
 * Retrieve all mail evidence for a specific analyzer item
 */
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
    const analyzerItemId = searchParams.get('analyzerItemId');
    const roundNumber = searchParams.get('roundNumber');
    
    let whereClause: any = {
      memberId: customer.id
    };
    
    if (analyzerItemId) {
      whereClause.analyzerItemId = analyzerItemId;
    }
    
    if (roundNumber) {
      whereClause.roundNumber = parseInt(roundNumber);
    }
    
    const evidence = await prisma.mailEvidence.findMany({
      where: whereClause,
      orderBy: { receivedAt: 'desc' },
      include: {
        analyzerItem: {
          select: {
            creditor: true,
            disputeReason: true,
            bureau: true
          }
        }
      }
    });
    
    return NextResponse.json({ evidence });
    
  } catch (error) {
    console.error('Mail evidence retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve mail evidence' },
      { status: 500 }
    );
  }
}
