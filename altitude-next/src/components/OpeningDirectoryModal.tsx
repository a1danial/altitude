'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDataStore, useSelectionStore } from '@/lib/store';
import { DIRECTORY_CARD_IDS } from '@/lib/config';
import { Icon } from './Icon';
import { fmtRM } from '@/lib/utils';

export default function OpeningDirectoryModal() {
  const router = useRouter();
  const cards = useDataStore(s => s.cards);
  const dismissed = useSelectionStore(s => s.directoryDismissed);
  const dismiss = useSelectionStore(s => s.dismissDirectory);

  useEffect(() => {
    if (dismissed) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismissed, dismiss]);

  if (dismissed) return null;

  // Option 1 config — only cards with the fields this fan needs, in the configured order
  const fanCards = DIRECTORY_CARD_IDS
    .map(id => cards.find(c => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c && !!c.card_name && !!c.bank && !!c.ui_card_background)
    .slice(0, 5);

  const go = (path: string) => { dismiss(); router.push(path); };

  return (
    <div className="od-overlay">
      <div className="od-scrim" onClick={dismiss} />
      <div className="od-modal">
        <header className="od-head">
          <h2>Where would you like to <em>start looking?</em></h2>
          <button className="od-close" onClick={dismiss} aria-label="Dismiss">×</button>
        </header>

        <div className="od-grid">
          <section className="od-card" onClick={() => go('/cards')} role="button" tabIndex={0}>
            <div className="od-card-h">
              <div className="top">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.2" /><line x1="3" y1="10.5" x2="21" y2="10.5" /></svg>
                <h3>Card Explorer</h3>
              </div>
              <p>Every travel card in the index, compared on the things you actually use — lounge access, insurance cover, foreign transaction fees and rewards.</p>
            </div>
            <div className="od-fan-wrap">
              <div className="od-fan">
                {fanCards.map((c, i) => (
                  <div
                    key={c.id}
                    className="od-mini"
                    style={{
                      left: `${i * 3.4375 * 16}px`,
                      top: `${i * 1.875 * 16}px`,
                      background: c.ui_card_background,
                      color: c.ui_card_text_color,
                      zIndex: i,
                      boxShadow: i === fanCards.length - 1 ? 'var(--shadow-card-lg)' : 'var(--shadow-card)',
                    }}
                  >
                    <div>
                      <div className="name">{c.card_name}</div>
                      <div className="bank">{c.bank}</div>
                    </div>
                    <div className="rows">
                      <div className="row"><span>Min. income</span><b>{c.invitation_only ? 'By invitation' : fmtRM(c.min_income)}</b></div>
                      <div className="row"><span>Annual fee</span><b>{fmtRM(c.annual_fee)}</b></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="od-card" onClick={() => go('/lounges')} role="button" tabIndex={0}>
            <div className="od-card-h">
              <div className="top">
                <Icon id="lounge" width={24} height={24} />
                <h3>Lounge Explorer</h3>
              </div>
              <p>Partner lounges by airport and region, each listed with the visit allowance and spend condition the card attaches to it.</p>
            </div>
            <div className="od-map">
              <div className="od-map-head">
                <span className="lab">Lounge network</span>
                <span className="tag">Worldwide</span>
              </div>
              <div className="od-map-canvas">
                <WorldwideSvg />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/** purely decorative hub map — illustrative only, not data-driven (same as the design file) */
function WorldwideSvg() {
  return (
    <svg viewBox="0 0 520 220" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <pattern id="od-grid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M 26 0 L 0 0 0 26" fill="none" stroke="#c9a96a" strokeWidth="0.5" opacity="0.14" /></pattern>
        <linearGradient id="od-arc" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#c9a96a" stopOpacity="0.2" /><stop offset="50%" stopColor="#e8d2a0" stopOpacity="0.9" /><stop offset="100%" stopColor="#c9a96a" stopOpacity="0.2" /></linearGradient>
        <radialGradient id="od-hub" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#e8d2a0" stopOpacity="0.75" /><stop offset="45%" stopColor="#c9a96a" stopOpacity="0.3" /><stop offset="100%" stopColor="#c9a96a" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#od-grid)" />
      <g fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.6">
        <path d="M50 35 L90 28 L140 32 L150 48 L170 54 L165 72 L140 78 L125 105 L115 110 L100 88 L80 92 L60 75 L45 52 Z" />
        <path d="M125 120 L155 125 L175 145 L160 185 L145 205 L135 180 L120 148 Z" />
        <path d="M225 35 L255 30 L280 42 L275 65 L250 68 L235 55 L225 60 Z" />
        <path d="M235 78 L275 75 L295 95 L290 135 L265 178 L240 155 L230 115 Z" />
        <path d="M285 32 L360 25 L430 35 L445 65 L415 90 L380 95 L345 78 L310 75 L285 58 Z" />
        <path d="M395 155 L450 150 L465 180 L425 195 L390 178 Z" />
      </g>
      <g fill="none" stroke="url(#od-arc)" strokeDasharray="3 3">
        <path d="M 135 68 Q 180 32 226 44" strokeWidth="1.3" />
        <path d="M 226 44 Q 268 48 305 82" strokeWidth="1.3" />
        <path d="M 305 82 Q 348 88 385 118" strokeWidth="1.3" />
        <path d="M 385 118 Q 425 105 442 72" strokeWidth="1.1" />
      </g>
      <g fontFamily="Jost, sans-serif" fontSize="8" fontWeight="500" letterSpacing="0.12em" fill="#9c968b">
        <circle cx="135" cy="68" r="10" fill="url(#od-hub)" /><circle cx="135" cy="68" r="2.4" fill="#e8d2a0" /><text x="135" y="83" textAnchor="middle">JFK</text>
        <circle cx="226" cy="44" r="12" fill="url(#od-hub)" /><circle cx="226" cy="44" r="2.8" fill="#e8d2a0" /><text x="226" y="34" textAnchor="middle" fill="#e8d2a0">LHR</text>
        <circle cx="305" cy="82" r="10" fill="url(#od-hub)" /><circle cx="305" cy="82" r="2.4" fill="#e8d2a0" /><text x="305" y="97" textAnchor="middle">DXB</text>
        <circle cx="385" cy="118" r="10" fill="url(#od-hub)" /><circle cx="385" cy="118" r="2.4" fill="#e8d2a0" /><text x="385" y="133" textAnchor="middle">SIN</text>
        <circle cx="442" cy="72" r="10" fill="url(#od-hub)" /><circle cx="442" cy="72" r="2.4" fill="#e8d2a0" /><text x="442" y="87" textAnchor="middle">HND</text>
      </g>
    </svg>
  );
}
