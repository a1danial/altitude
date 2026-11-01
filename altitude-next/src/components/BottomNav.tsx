'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelectionStore } from '@/lib/store';
import { Icon } from './Icon';

export default function BottomNav() {
  const pathname = usePathname();
  const dismissed = useSelectionStore(s => s.directoryDismissed);
  const reopen = useSelectionStore(s => s.reopenDirectory);

  if (!dismissed) return null;

  const cardsActive = pathname.startsWith('/cards');
  const loungesActive = pathname.startsWith('/lounges');

  return (
    <>
      {/* repositioned away from the bottom nav — the design file stacks both on the same fixed spot */}
      <button className="reopen-btn" style={{ bottom: 'auto', top: 20, right: 28, left: 'auto', transform: 'none' }} onClick={reopen}>
        Reopen directory
      </button>
      <nav aria-label="Explorer" className="bottom-nav">
        <div className="bn-track">
          <div className="bn-thumb" style={{ transform: loungesActive ? 'translateX(100%)' : 'translateX(0)' }} />
          <Link href="/cards" className="bn-btn" style={{ color: cardsActive ? 'var(--on-gold)' : 'var(--text-dim)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.2" /><line x1="3" y1="10.5" x2="21" y2="10.5" /></svg>
            Cards
          </Link>
          <Link href="/lounges" className="bn-btn" style={{ color: loungesActive ? 'var(--on-gold)' : 'var(--text-dim)' }}>
            <Icon id="lounge" width={18} height={18} />
            Lounges
          </Link>
        </div>
      </nav>
    </>
  );
}
