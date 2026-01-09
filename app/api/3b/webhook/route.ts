import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // 1. Audit webhook (always)
    const audit = await prisma.webhookAudit.create({
      data
