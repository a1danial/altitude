'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function StickyBar() {
  const pathname = usePathname();
  const cart = useStore(s => s.cart);
  const n = cart.length;

  return (
    <div id="sticky-bar">
      <div className="sb-left" id="sb-left">
        {pathname === '/cards' && n > 0 && (
          <>
            <div className="sb-count">{n}</div>
            <div className="sb-label">
              <b>{n} card{n === 1 ? '' : 's'}</b> added to compare
            </div>
          </>
        )}
      </div>
      <div id="sb-btn">
        {pathname === '/' && (
          <Link href="/cards" className="btn btn-gold">
            Browse the cards <span className="arr">→</span>
          </Link>
        )}
        {pathname === '/cards' && (
          <Link href="/compare" className="btn btn-gold">
            Go to Compare <span className="arr">→</span>
          </Link>
        )}
        {pathname === '/compare' && (
          <Link href="/cards" className="btn btn-ghost">
            Browse the cards <span className="arr">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
