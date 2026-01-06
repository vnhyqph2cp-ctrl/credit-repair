/**
 * 3B Enforcement Page
 * 
 * /dashboard/enforcement
 * 
 * Main interface for the Mail Enforcement Doctrine system
 */

import { Metadata } from 'next';
import EnforcementDashboard from '../components/EnforcementDashboard';

export const metadata: Metadata = {
  title: '3B Enforcement | Credit Repair',
  description: 'Evidence-driven compliance enforcement system'
};

export default function EnforcementPage() {
  return <EnforcementDashboard />;
}
