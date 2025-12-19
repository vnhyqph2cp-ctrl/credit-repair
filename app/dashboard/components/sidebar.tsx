'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Credit Monitoring', href: '/dashboard/credit-monitoring' },
  { name: 'Disputes', href: '/dashboard/disputes' },
  { name: 'Credit Builder', href: '/dashboard/credit-builder' },
  { name: 'Funding Path', href: '/dashboard/funding-path' },
  { name: 'Affiliates', href: '/dashboard/affiliates' },
  { name: 'Billing', href: '/dashboard/billing' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[--color-border] bg-[--color-background] px-4 py-6">
      <div className="mb-8">
        <div className="text-lg font-bold">3B Credit Builder</div>
        <p className="text-xs text-[--color-text-muted]">
          Powered by MyFreeScoreNow
        </p>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-[--color-primary]/20 text-[--color-primary]'
                  : 'text-[--color-text-muted] hover:bg-[--color-border]/40 hover:text-[--color-text-main]'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
