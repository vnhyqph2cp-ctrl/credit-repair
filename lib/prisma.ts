// lib/prisma.ts

// TEMP: Stub Prisma for Vercel production builds
const isVercelBuild = process.env.VERCEL === '1';

let prismaInstance: any;

if (isVercelBuild) {
  // Dummy client for Vercel - no real DB calls
  prismaInstance = {
    customer: {},
    snapshot: {},
    webhook_audit: {},
  };
} else {
  // Real Prisma client for local dev (if needed)
  const { PrismaClient } = require('@prisma/client');
  
  const globalForPrisma = globalThis as unknown as { prisma?: any };

  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: ['error', 'warn'],
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
