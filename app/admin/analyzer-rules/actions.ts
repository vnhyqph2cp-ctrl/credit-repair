"use server";

/**
 * Admin Actions - Analyzer Rules Management
 */

import { getAllRules, updateRule, toggleRuleEnabled, seedDefaultRules } from "@/lib/analyzer-rules";
import { requireAdmin } from "@/lib/auth";

/**
 * Get all analyzer rules (admin only)
 */
export async function getRules() {
  await requireAdmin();
  return await getAllRules();
}

/**
 * Update a rule
 */
export async function updateAnalyzerRule(
  id: string,
  updates: {
    description?: string;
    analyzerSection?: 'A' | 'B' | 'C';
    defaultRound?: 1 | 2 | 3;
    enabled?: boolean;
  }
) {
  await requireAdmin();
  try {
    const rule = await updateRule(id, updates);
    return { success: true, rule };
  } catch (error) {
    console.error('Failed to update rule:', error);
    return { success: false, error: 'Failed to update rule' };
  }
}

/**
 * Toggle rule enabled status
 */
export async function toggleRule(id: string) {
  await requireAdmin();
  try {
    const rule = await toggleRuleEnabled(id);
    return { success: true, rule };
  } catch (error) {
    console.error('Failed to toggle rule:', error);
    return { success: false, error: 'Failed to toggle rule' };
  }
}

/**
 * Seed default rules (run once)
 */
export async function seedRules() {
  await requireAdmin();
  try {
    await seedDefaultRules();
    // Revalidate the page to show new rules
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin/analyzer-rules');
  } catch (error) {
    console.error('Failed to seed rules:', error);
    throw new Error('Failed to seed rules');
  }
}
