/**
 * Analyzer Rules Management
 * 
 * Central configuration for what becomes a dispute suggestion.
 * Separates policy from code for runtime control and compliance audit.
 */

import { prisma } from '@/lib/prisma';

export interface AnalyzerRule {
  id: string;
  ruleKey: string;
  description: string;
  analyzerSection: 'A' | 'B' | 'C';
  defaultRound: 1 | 2 | 3;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AnalyzerSection = 'A' | 'B' | 'C';

/**
 * Get all analyzer rules
 */
export async function getAllRules(): Promise<AnalyzerRule[]> {
  const rules = await prisma.analyzerRule.findMany({
    orderBy: [
      { analyzerSection: 'asc' },
      { defaultRound: 'asc' },
    ],
  });
  return rules as AnalyzerRule[];
}

/**
 * Get enabled rules only (for analyzer execution)
 */
export async function getEnabledRules(): Promise<AnalyzerRule[]> {
  const rules = await prisma.analyzerRule.findMany({
    where: { enabled: true },
    orderBy: [
      { analyzerSection: 'asc' },
      { defaultRound: 'asc' },
    ]
  });
  return rules as AnalyzerRule[];
}

/**
 * Get rules by section
 */
export async function getRulesBySection(section: AnalyzerSection): Promise<AnalyzerRule[]> {
  const rules = await prisma.analyzerRule.findMany({
    where: { 
      analyzerSection: section,
      enabled: true 
    },
    orderBy: { defaultRound: 'asc' }
  });
  return rules as AnalyzerRule[];
}

/**
 * Update a rule
 */
export async function updateRule(
  id: string,
  updates: Partial<Pick<AnalyzerRule, 'description' | 'analyzerSection' | 'defaultRound' | 'enabled'>>
): Promise<AnalyzerRule> {
  const rule = await prisma.analyzerRule.update({
    where: { id },
    data: updates
  });
  return rule as AnalyzerRule;
}

/**
 * Toggle rule enabled status
 */
export async function toggleRuleEnabled(id: string): Promise<AnalyzerRule> {
  const rule = await prisma.analyzerRule.findUnique({
    where: { id },
    select: { enabled: true }
  });

  if (!rule) {
    throw new Error('Rule not found');
  }

  const updated = await prisma.analyzerRule.update({
    where: { id },
    data: { enabled: !rule.enabled }
  });
  return updated as AnalyzerRule;
}

/**
 * Seed default rules (run once on setup)
 */
export async function seedDefaultRules(): Promise<void> {
  const defaultRules = [
    // Section A - Accuracy & Errors
    {
      ruleKey: 'balance_mismatch',
      description: 'Balance differs across bureaus',
      analyzerSection: 'A' as const,
      defaultRound: 1,
    },
    {
      ruleKey: 'late_on_one_bureau',
      description: 'Late payment only reported on one bureau',
      analyzerSection: 'A' as const,
      defaultRound: 1,
    },
    {
      ruleKey: 'account_status_mismatch',
      description: 'Account status differs across bureaus',
      analyzerSection: 'A' as const,
      defaultRound: 1,
    },
    {
      ruleKey: 'duplicate_account',
      description: 'Duplicate account reporting',
      analyzerSection: 'A' as const,
      defaultRound: 1,
    },
    {
      ruleKey: 'incorrect_payment_history',
      description: 'Payment history shows incorrect late payments',
      analyzerSection: 'A' as const,
      defaultRound: 1,
    },

    // Section B - Structure & Utilization
    {
      ruleKey: 'high_utilization',
      description: 'Utilization above 30% on revolving accounts',
      analyzerSection: 'B' as const,
      defaultRound: 2,
    },
    {
      ruleKey: 'thin_credit_mix',
      description: 'Insufficient credit mix (only 1 type)',
      analyzerSection: 'B' as const,
      defaultRound: 2,
    },
    {
      ruleKey: 'maxed_out_card',
      description: 'Credit card at or near limit',
      analyzerSection: 'B' as const,
      defaultRound: 2,
    },
    {
      ruleKey: 'closed_in_good_standing',
      description: 'Positive account closed (impacting age)',
      analyzerSection: 'B' as const,
      defaultRound: 2,
    },

    // Section C - History & Behavior
    {
      ruleKey: 'old_late_payment',
      description: 'Aged late payment still within reporting window',
      analyzerSection: 'C' as const,
      defaultRound: 3,
    },
    {
      ruleKey: 'recent_hard_inquiry',
      description: 'Hard inquiry within last 12 months',
      analyzerSection: 'C' as const,
      defaultRound: 3,
    },
    {
      ruleKey: 'medical_collection',
      description: 'Medical collection account',
      analyzerSection: 'C' as const,
      defaultRound: 3,
    },
    {
      ruleKey: 'short_credit_history',
      description: 'Credit history less than 24 months',
      analyzerSection: 'C' as const,
      defaultRound: 3,
    },
  ];

  for (const rule of defaultRules) {
    await prisma.analyzerRule.upsert({
      where: { ruleKey: rule.ruleKey },
      create: rule,
      update: {}, // Don't overwrite if exists
    });
  }
}

/**
 * Get section description for UI
 */
export function getSectionDescription(section: AnalyzerSection): string {
  switch (section) {
    case 'A':
      return 'Accuracy & Errors - Items that appear inaccurate or inconsistent';
    case 'B':
      return 'Structure & Utilization - Technically accurate but may hurt score';
    case 'C':
      return 'History & Behavior - Past events requiring long-term strategy';
  }
}

/**
 * Get round description for UI
 */
export function getRoundDescription(round: number): string {
  switch (round) {
    case 1:
      return 'Round 1 - Initial dispute, professional tone';
    case 2:
      return 'Round 2 - Follow-up, firmer language';
    case 3:
      return 'Round 3 - Final escalation, most assertive';
    default:
      return 'Unknown round';
  }
}

/**
 * Validate rule key (no special chars, lowercase, underscores only)
 */
export function isValidRuleKey(key: string): boolean {
  return /^[a-z_]+$/.test(key);
}
