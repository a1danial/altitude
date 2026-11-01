'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Card, VasItem } from '@/lib/data';
import { useDataStore, useSelectionStore, CART_SLOTS } from '@/lib/store';
import { Icon, CheckIcon } from './Icon';
import { fmtRM } from '@/lib/utils';
import { parseInlineLinks } from '@/lib/vas';
import { FX_PROVIDER_URLS } from '@/lib/config';
import CardPickerDialog from './CardPickerDialog';

type RowKind = 'lounge' | 'insurance' | 'spending' | 'fx' | 'curtail';
interface SubField { key: string; label: string; isLink?: boolean }
interface RowDef { id: string; label: string; kind: RowKind; subs?: SubField[]; cta?: boolean }

const PERK_ROWS: RowDef[] = [
  { id: 'lounge', label: 'Airport lounge access', kind: 'lounge', cta: true,
    subs: [{ key: 'visits', label: 'Visits' }, { key: 'access', label: 'Access' }, { key: 'network', label: 'Network' }, { key: 'condition', label: 'Condition' }] },
  { id: 'insurance', label: 'Life & medical travel insurance', kind: 'insurance',
    subs: [{ key: 'medical', label: 'Medical' }, { key: 'accident', label: 'Life' }, { key: 'condition', label: 'Condition' }, { key: 'underwriter', label: 'Insurer', isLink: true }] },
  { id: 'miles', label: 'Spending rewards', kind: 'spending' },
  { id: 'overseas', label: 'Foreign transaction fee', kind: 'fx' },
  { id: 'protection', label: 'Travel curtailments', kind: 'curtail',
    subs: [{ key: 'flightDelay', label: 'Flight delay' }, { key: 'flightCancellation', label: 'Flight Cancellation' }, { key: 'baggageDelay', label: 'Baggage delay' }, { key: 'condition', label: 'Condition' }, { key: 'underwriter', label: 'Insurer', isLink: true }] },
];

function rowValue(card: Card, kind: RowKind): string | null {
  switch (kind) {
    case 'lounge': return card.lounge ? 'Included' : null;
    case 'insurance': return card.insurance && (card.insurance.medical || card.insurance.accident) ? 'Included' : null;
    case 'spending': return card.spending_rewards_cashback;
    case 'fx': return card.fx_fee_pct;
    case 'curtail': return card.curtail ? 'Included' : null;
  }
}

function subValue(card: Card, kind: RowKind, key: string): { text: string | null; href: string | null } {
  const obj = kind === 'lounge' ? card.lounge : kind === 'insurance' ? card.insurance : kind === 'curtail' ? card.curtail : null;
  if (!obj) return { text: null, href: null };
  const rec = obj as unknown as Record<string, string | null>;
  const text = rec[key] ?? null;
  const href = key === 'underwriter' ? rec.underwriterUrl ?? null : null;
  return { text, href };
}

function CardFace({ card }: { card: Card }) {
  return (
    <div className="ce-slot-filled" style={{ background: card.ui_card_background, color: card.ui_card_text_color }}>
      <div className="name">{card.card_name}</div>
      <div className="bank">{card.bank}</div>
      <a className="apply" href={card.apply_url} target="_blank" rel="noopener noreferrer" style={{ color: card.ui_card_text_color }}>
        Apply
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="8 7 17 7 17 16" /></svg>
      </a>
    </div>
  );
}

function InlineLinks({ text }: { text: string }) {
  return (
    <>
      {parseInlineLinks(text).map((seg, i) => seg.type === 'link'
        ? <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer">{seg.text}</a>
        : <span key={i}>{seg.text}</span>)}
    </>
  );
}

function VasCell({ item }: { item: VasItem | undefined }) {
  if (!item) return null;
  if (item.variant === 'icon') {
    return (
      <div className="ce-vas-icon">
        {item.icon && <Icon id={item.icon} />}
        <span style={{ fontSize: 15, fontWeight: 300, color: 'var(--text)' }}><InlineLinks text={item.text} /></span>
      </div>
    );
  }
  if (item.variant === 'button') {
    return (
      <div className="ce-vas-cta">
        <span style={{ fontSize: 15, fontWeight: 300, color: 'var(--text)' }}><InlineLinks text={item.text} /></span>
        <a href={item.href ?? '#'} target="_blank" rel="noopener noreferrer">{item.label ?? 'Learn more'}</a>
      </div>
    );
  }
  if (item.variant === 'image') {
    return (
      <div className="ce-vas-image">
        {item.image
          ? <img src={item.image} alt="" />
          : <div className="placeholder">Image</div>}
        <span style={{ fontSize: 15, fontWeight: 300, color: 'var(--text)' }}><InlineLinks text={item.text} /></span>
        <a href={item.href ?? '#'} target="_blank" rel="noopener noreferrer">Learn more</a>
      </div>
    );
  }
  return <span style={{ fontSize: 15, fontWeight: 300, color: 'var(--text)' }}><InlineLinks text={item.text} /></span>;
}

export default function CardExplorer() {
  const cards = useDataStore(s => s.cards);
  const cart = useSelectionStore(s => s.cart);
  const toggleCartCard = useSelectionStore(s => s.toggleCartCard);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [mobileOpenIdx, setMobileOpenIdx] = useState(0);

  const slotCards = Array.from({ length: CART_SLOTS }, (_, i) => cards.find(c => c.id === cart[i]) ?? null);
  const filledCards = slotCards.filter((c): c is Card => c != null);
  const conflicts = filledCards.filter(c => c.invitationIncomeConflict);

  const maxVas = Math.max(0, ...filledCards.map(c => c.vas_list.length));

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="title">Which card actually <em>works for your travel?</em></h1>
        <p className="lede">Select your primary travel priorities below. We&apos;ll surface the cards that excel where you need them most.</p>
      </div>

      {conflicts.length > 0 && (
        <div className="ce-error-banner">
          Data error: {conflicts.map(c => c.card_name).join(', ')} {conflicts.length === 1 ? 'is' : 'are'} marked invitation-only but also {conflicts.length === 1 ? 'has' : 'have'} a minimum income set. Showing as invitation-only; please fix in Airtable.
        </div>
      )}

      {/* ===== Desktop ===== */}
      <div className="card-explorer-desktop">
        <table className="ce-table">
          <thead>
            <tr>
              <th>
                <button className="ce-head-btn" onClick={() => setPickerOpen(true)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.2" /><line x1="3" y1="10.5" x2="21" y2="10.5" /></svg>
                  Select card
                </button>
              </th>
              {slotCards.map((c, i) => (
                <th key={i}>
                  {c ? <CardFace card={c} /> : <button className="ce-slot-empty" onClick={() => setPickerOpen(true)}>Select card</button>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="ce-sec-row"><td colSpan={CART_SLOTS + 1}><span className="lab">Requirements</span></td></tr>
            <tr>
              <th className="ce-row-head"><div className="inner"><Icon id="overseas" width={30} height={30} /><span className="lab">Minimum income</span></div></th>
              {slotCards.map((c, i) => (
                <td key={i} className="ce-cell" style={{ opacity: c ? 1 : 0.35 }}>
                  {c && <div className="val">{c.invitation_only ? 'By invitation' : fmtRM(c.min_income)}</div>}
                  {c && <div className="sub">per year</div>}
                </td>
              ))}
            </tr>
            <tr>
              <th className="ce-row-head"><div className="inner"><Icon id="protection" width={30} height={30} /><span className="lab">Annual fee</span></div></th>
              {slotCards.map((c, i) => (
                <td key={i} className="ce-cell" style={{ opacity: c ? 1 : 0.35 }}>
                  {c && <div className="val">{fmtRM(c.annual_fee)}</div>}
                  {c && c.annual_fee_details.length > 0 && (
                    <div className="sub gold">{c.annual_fee_details.map((l, li) => <div key={li}>{l}</div>)}</div>
                  )}
                </td>
              ))}
            </tr>

            <tr><td colSpan={CART_SLOTS + 1} style={{ height: 34 }} /></tr>
            <tr className="ce-sec-row"><td colSpan={CART_SLOTS + 1}><span className="lab">Travel perks</span></td></tr>

            {PERK_ROWS.map(row => (
              <PerkRowBlock key={row.id} row={row} slotCards={slotCards} />
            ))}

            {maxVas > 0 && (
              <>
                <tr><td colSpan={CART_SLOTS + 1} style={{ height: 34 }} /></tr>
                <tr className="ce-sec-row"><td colSpan={CART_SLOTS + 1}><span className="lab">Value added services</span></td></tr>
                {Array.from({ length: maxVas }, (_, ri) => (
                  <tr key={ri}>
                    <td />
                    {slotCards.map((c, i) => (
                      <td key={i} className="ce-cell" style={{ opacity: c ? 1 : 0.35 }}>
                        {c && <VasCell item={c.vas_list[ri]} />}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Mobile ===== */}
      <div className="card-explorer-mobile">
        <div className="ce-mobile-tiles">
          <div className="ce-mobile-row">
            <button className="ce-mobile-tile" style={{ background: 'rgba(201,169,106,0.05)', border: '1px solid var(--gold)', color: 'var(--gold)', alignItems: 'center', justifyContent: 'center' }} onClick={() => setPickerOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.2" /><line x1="3" y1="10.5" x2="21" y2="10.5" /></svg>
              <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Select card</span>
            </button>
            {slotCards.slice(0, 2).map((c, i) => (
              <MobileTile key={i} card={c} active={mobileOpenIdx === i} onClick={() => setMobileOpenIdx(i)} />
            ))}
          </div>
          <div className="ce-mobile-row">
            {slotCards.slice(2, 5).map((c, i) => (
              <MobileTile key={i + 2} card={c} active={mobileOpenIdx === i + 2} onClick={() => setMobileOpenIdx(i + 2)} />
            ))}
          </div>
        </div>

        {slotCards[mobileOpenIdx] && <MobileActiveCard card={slotCards[mobileOpenIdx]!} />}
      </div>

      <CardPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        cards={cards}
        cart={cart}
        onToggle={toggleCartCard}
        title="Select cards to compare"
        addLabel="Add to compare"
      />
    </div>
  );
}

function PerkRowBlock({ row, slotCards }: { row: RowDef; slotCards: (Card | null)[] }) {
  return (
    <>
      <tr>
        <th className="ce-row-head"><div className="inner"><Icon id={row.id} width={30} height={30} /><span className="lab">{row.label}</span></div></th>
        {slotCards.map((c, i) => (
          <td key={i} className="ce-cell" style={{ opacity: c ? 1 : 0.35 }}>
            {!c ? null : row.kind === 'fx' ? (
              !c.fx_fee_pct ? <span className="missing">Not offered</span> : (
                <span className="mixed">
                  <a href={(c.fx_provider && FX_PROVIDER_URLS[c.fx_provider]) || '#'} target="_blank" rel="noopener noreferrer">{c.fx_provider ?? 'FX provider'}</a>
                  {` rate, plus ${c.fx_fee_pct}% ${c.bank} fee`}
                </span>
              )
            ) : (() => {
              const val = rowValue(c, row.kind);
              if (!val) return <span className="missing">Not offered</span>;
              if (row.kind === 'spending') {
                return (
                  <>
                    <div className="yes"><CheckIcon /><span>{val}</span></div>
                    {c.spending_rewards_details && <div className="yes-sub">{c.spending_rewards_details}</div>}
                  </>
                );
              }
              return <div className="yes"><CheckIcon /><span>{val}</span></div>;
            })()}
          </td>
        ))}
      </tr>
      {row.subs?.map((f) => (
        <tr key={f.key} className="ce-subrow">
          <td className="lab-cell"><span className="sub-lab">{f.label}</span></td>
          {slotCards.map((c, i) => {
            if (!c) return <td key={i} />;
            const { text, href } = subValue(c, row.kind, f.key);
            if (!text) return <td key={i} />;
            return (
              <td key={i}>
                {f.isLink && href
                  ? <a className="sub-val link" href={href} target="_blank" rel="noopener noreferrer">{text}</a>
                  : <span className="sub-val">{text}</span>}
              </td>
            );
          })}
        </tr>
      ))}
      {row.cta && (
        <tr className="ce-cta-row">
          <td />
          <td colSpan={5}>
            <Link href="/lounges" className="ce-map-cta">
              <span className="ico">
                <span style={{ width: 20, height: 20, borderRadius: '50%', border: '1.4px solid var(--on-gold)', display: 'grid', placeItems: 'center' }}>
                  <span style={{ width: 7, height: 7, background: 'var(--on-gold)', transform: 'rotate(45deg)' }} />
                </span>
              </span>
              <span className="txt">
                <b>Explore the Lounge Access Map</b>
                <span>See every partner lounge across the global network — by airport and region.</span>
              </span>
              <span className="arr">→</span>
            </Link>
          </td>
        </tr>
      )}
    </>
  );
}

function MobileTile({ card, active, onClick }: { card: Card | null; active: boolean; onClick(): void }) {
  if (!card) {
    return (
      <button className="ce-mobile-tile empty" style={{ background: active ? 'rgba(201,169,106,0.08)' : 'rgba(255,255,255,0.02)', border: active ? '1px dashed var(--gold)' : '1px dashed var(--line)', color: 'var(--gold)' }} onClick={onClick}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.2" /><line x1="3" y1="10.5" x2="21" y2="10.5" /></svg>
        <span style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Add</span>
      </button>
    );
  }
  return (
    <button
      className="ce-mobile-tile"
      style={{ background: active ? card.ui_card_background : 'var(--surface)', border: active ? '1px solid rgba(255,255,255,0.14)' : '1px solid var(--line-soft)', color: active ? card.ui_card_text_color : 'var(--text-dim)' }}
      onClick={onClick}
    >
      <span className="name">{card.card_name}</span>
      <span className="bank">{card.bank}</span>
    </button>
  );
}

function MobileActiveCard({ card }: { card: Card }) {
  return (
    <div>
      <div className="ce-mobile-section-head"><span className="lab">Requirements</span></div>
      <div className="ce-mobile-reqs">
        <div style={{ flex: '0 0 38%', minWidth: 0 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Min. income</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--text)', marginTop: 4 }}>{card.invitation_only ? 'By invitation' : fmtRM(card.min_income)}</div>
        </div>
        <div style={{ flex: '0 0 62%', minWidth: 0 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Annual fee</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--text)', marginTop: 4 }}>{fmtRM(card.annual_fee)}</div>
          {card.annual_fee_details.map((l, i) => <div key={i} style={{ fontSize: 12, color: 'var(--gold)', marginTop: 2 }}>{l}</div>)}
        </div>
      </div>

      <div className="ce-mobile-section-head"><span className="lab">Travel perks</span></div>
      {PERK_ROWS.map(row => {
        if (row.kind === 'fx') {
          if (!card.fx_fee_pct) return null;
          return (
            <div key={row.id} className="ce-mobile-perk">
              <div className="ce-mobile-perk-head"><Icon id="overseas" width={20} height={20} /><span className="lab">{row.label}</span></div>
              <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 300, padding: '10px 14px 4px' }}>
                <a href={(card.fx_provider && FX_PROVIDER_URLS[card.fx_provider]) || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>{card.fx_provider}</a>
                {` rate, plus ${card.fx_fee_pct}% ${card.bank} fee`}
              </div>
            </div>
          );
        }
        const val = rowValue(card, row.kind);
        if (!val) return null;
        if (row.subs) {
          return (
            <div key={row.id} className="ce-mobile-perk">
              <div className="ce-mobile-perk-head"><Icon id={row.id} width={20} height={20} /><span className="lab">{row.label}</span></div>
              {row.subs.map(f => {
                const { text, href } = subValue(card, row.kind, f.key);
                if (!text) return null;
                return (
                  <div key={f.key} className="ce-mobile-sub">
                    <div className="k">{f.label}</div>
                    <div className={f.isLink && href ? 'v link' : 'v'}>
                      {f.isLink && href ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>{text}</a> : text}
                    </div>
                  </div>
                );
              })}
              {row.cta && (
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 96, flexShrink: 0, background: 'rgba(201,169,106,0.1)' }} />
                  <div style={{ flex: 1, padding: '10px 14px' }}>
                    <Link href="/lounges" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text)', background: 'linear-gradient(100deg,rgba(201,169,106,0.17),rgba(201,169,106,0.04))', border: '1px solid var(--gold)', borderRadius: 13, padding: '12px 14px' }}>
                      <b style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 14 }}>Explore the Lounge Access Map</b>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        }
        return (
          <div key={row.id} className="ce-mobile-perk">
            <div className="ce-mobile-perk-head"><Icon id={row.id} width={20} height={20} /><span className="lab">{row.label}</span></div>
            <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 300, padding: '10px 14px 4px' }}>{val}</div>
            {row.kind === 'spending' && card.spending_rewards_details && (
              <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 300, padding: '0 14px 10px' }}>{card.spending_rewards_details}</div>
            )}
          </div>
        );
      })}

      {card.vas_list.length > 0 && (
        <>
          <div className="ce-mobile-section-head"><span className="lab">Value added services</span></div>
          {card.vas_list.map((v, i) => <div key={i} className="ce-mobile-vas"><VasCell item={v} /></div>)}
        </>
      )}

      <a className="ce-mobile-apply" href={card.apply_url} target="_blank" rel="noopener noreferrer">Apply</a>
    </div>
  );
}
