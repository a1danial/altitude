'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

const STEPS = [
  { id: 'profile', path: '/',        num: '01', label: 'Profile' },
  { id: 'listing', path: '/cards',   num: '02', label: 'Cards' },
  { id: 'cart',    path: '/compare', num: '03', label: 'Compare' },
];

export default function Nav() {
  const pathname = usePathname();
  const cart = useStore(s => s.cart);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <div className="mark" />
          <div className="name">ALTITUDE</div>
        </Link>
        <nav className="nav-steps">
          {STEPS.map(s => {
            const active = pathname === s.path;
            return (
              <Link key={s.id} href={s.path} className={`nstep${active ? ' active' : ''}`}>
                <span className="num">{s.num}</span>
                <span>{s.label}</span>
                {s.id === 'cart' && cart.length > 0 && (
                  <span className="badge">{cart.length}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
