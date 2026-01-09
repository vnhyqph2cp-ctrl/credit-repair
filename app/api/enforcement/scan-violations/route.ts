/**
 * Violation Scanner API (Next.js fallback)
 * 
 * POST /api/enforcement/scan-violations
 * 
 * Manual trigger for timing violation scan
 * (Also can be used as cron endpoint if Supabase Edge Functions unavailable)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { scanForTimingViolations } from '@/lib/enforcement/enforcement-engine';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Require admin access for manual scans
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is admin
    const { prisma } = await import('@/lib/prisma');
    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email }
    });
    
    if (!customer || customer.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    // Run the scan
    const result = await scanForTimingViolations();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result
    });
    
  } catch (error) {
    console.error('Violation scan error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to run violation scan', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/enforcement/scan-violations
 * 
 * Get scan history/stats
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { prisma } = await import('@/lib/prisma');
    
    // Get violation summary
    const violations = await prisma.analyzerItem.findMany({
      where: {
        proceduralViolation: true
      },
      select: {
        id: true,
        creditor: true,
        bureau: true,
        violationType: true,
        roundStatus: true,
        disputeFiledAt: true,
        responseDeadline: true,
        violationDetails: true
      },
      orderBy: {
        responseDeadline: 'desc'
      },
      take: 50
    });
    
    return NextResponse.json({
      totalViolations: violations.length,
      violations
    });
    
  } catch (error) {
    console.error('Violation history error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve violation history' },
      { status: 500 }
    );
  }
}
