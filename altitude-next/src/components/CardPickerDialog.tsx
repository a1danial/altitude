'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Card } from '@/lib/data';
import { CART_SLOTS } from '@/lib/store';
import { fmtRM } from '@/lib/utils';

const FEE_STEPS = [
  { v: 0, label: 'No fee' },
  { v: 300, label: 'RM300' },
  { v: 600, label: 'RM600' },
  { v: Infinity, label: 'Any fee' },
];
const INCOME_STEPS = [
  { v: 20000, label: 'RM 20k' },
  { v: 50000, label: 'RM 50k' },
  { v: 100000, label: 'RM 100k' },
  { v: Infinity, label: 'Any income' },
];
const MAX_SUGGESTIONS = 10;

function markStyle(i: number, n: number): React.CSSProperties {
  const pct = (i / (n - 1)) * 100;
  return { left: `${pct}%`, transform: `translate(-${pct}%,-50%)` };
}

interface CardPickerDialogProps {
  open: boolean;
  onClose(): void;
  cards: Card[];
  cart: string[];
  onToggle(id: string): void;
  title: string;
  addLabel: string;
}

export default function CardPickerDialog({ open, onClose, cards, cart, onToggle, title, addLabel }: CardPickerDialogProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard SSR-safe portal mount: server and first client render must both be null before we touch document.body
    setMounted(true);
  }, []);

  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [banks, setBanks] = useState<string[]>([]);
  const [cardFilters, setCardFilters] = useState<string[]>([]);
  const [feeIdx, setFeeIdx] = useState(3);
  const [incomeIdx, setIncomeIdx] = useState(3);

  const q = search.trim().toLowerCase();
  const feeCap = FEE_STEPS[feeIdx].v;
  const incomeCap = INCOME_STEPS[incomeIdx].v;

  const filtered = useMemo(() => cards.filter(c =>
    (!cardFilters.length || cardFilters.includes(c.id)) &&
    (!banks.length || banks.includes(c.bank)) &&
    (c.annual_fee ?? 0) <= feeCap &&
    (c.min_income ?? 0) <= incomeCap,
  ), [cards, cardFilters, banks, feeCap, incomeCap]);

  const allBanks = useMemo(() => [...new Set(cards.map(c => c.bank))], [cards]);

  const bankPick = (b: string) => ({ bank: b, card_name: '', onClick: () => { setBanks(s => [...s, b]); setSearch(''); } });
  const bankMatches = q ? allBanks.filter(b => !banks.includes(b) && b.toLowerCase().includes(q)).map(bankPick) : [];
  const cardMatches = q
    ? cards.filter(c => !cardFilters.includes(c.id) && !banks.includes(c.bank) &&
        (`${c.card_name} ${c.bank} ${c.tier} ${c.net}`).toLowerCase().includes(q))
      .map(c => ({ bank: c.bank, card_name: c.card_name, onClick: () => { setCardFilters(s => [...s, c.id]); setSearch(''); } }))
    : [];
  const focusBanks = (!q && focused) ? allBanks.filter(b => !banks.includes(b)).map(bankPick) : [];
  const suggestions = (q ? [...bankMatches, ...cardMatches] : focusBanks).slice(0, MAX_SUGGESTIONS);

  const full = cart.length >= CART_SLOTS;
  const noResults = filtered.length === 0 && banks.length === 0 && cardFilters.length === 0;
  const showResetCard = banks.length > 0 || cardFilters.length > 0;

  if (!open || !mounted) return null;

  const slots = Array.from({ length: CART_SLOTS }, (_, i) => cards.find(c => c.id === cart[i]) ?? null);

  return createPortal(
    <div className="pk-overlay">
      <div className="pk-scrim" onClick={onClose} />
      <div className="pk-modal">
        <header className="pk-head">
          <div className="pk-head-top">
            <h2>{title}</h2>
            <button className="pk-close" onClick={onClose} aria-label="Close">×</button>
          </div>
          <div className="pk-slots">
            {slots.map((c, i) => c ? (
              <div key={c.id} className="pk-slot" style={{ background: c.ui_card_background, border: '1px solid rgba(255,255,255,0.14)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <div className="name" style={{ color: c.ui_card_text_color }}>{c.card_name}</div>
                    <div className="meta" style={{ color: c.ui_card_text_color }}>{c.bank}</div>
                  </div>
                  <button className="remove" style={{ color: c.ui_card_text_color }} onClick={() => onToggle(c.id)} aria-label="Remove">×</button>
                </div>
              </div>
            ) : (
              <div key={i} className="pk-slot" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="placeholder">Select below</span>
              </div>
            ))}
          </div>
          <div className="pk-search-wrap">
            <input
              className="pk-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Search for a card or bank"
              style={{ paddingRight: (banks.length + cardFilters.length) ? 150 : 18 }}
            />
            <div className="pk-chips">
              {banks.map(b => (
                <span key={b} className="pk-chip">{b}<button onClick={() => setBanks(s => s.filter(x => x !== b))}>×</button></span>
              ))}
              {cardFilters.map(id => {
                const c = cards.find(x => x.id === id);
                return (
                  <span key={id} className="pk-chip">{c ? `${c.bank}: ${c.card_name}` : id}
                    <button onClick={() => setCardFilters(s => s.filter(x => x !== id))}>×</button>
                  </span>
                );
              })}
            </div>
            {(focused || q) && (
              <div className="pk-suggest">
                {suggestions.map((sg, i) => (
                  <button key={i} onClick={sg.onClick}>
                    <span className="bank">{sg.bank}</span>
                    {sg.card_name && <span className="name">{sg.card_name}</span>}
                  </button>
                ))}
                {suggestions.length === 0 && q && <div className="none">No matches</div>}
              </div>
            )}
          </div>
          <div className="pk-filters">
            <div className="pk-filter">
              <div className="lab">Annual<br />fee</div>
              <div className="slider-wrap">
                <input type="range" min={0} max={3} step={1} value={feeIdx} onChange={e => setFeeIdx(Number(e.target.value))} />
                <span className="mark" style={markStyle(feeIdx, FEE_STEPS.length)}>{FEE_STEPS[feeIdx].label}</span>
              </div>
            </div>
            <div className="pk-filter">
              <div className="lab">Minimum<br />income</div>
              <div className="slider-wrap">
                <input type="range" min={0} max={3} step={1} value={incomeIdx} onChange={e => setIncomeIdx(Number(e.target.value))} />
                <span className="mark" style={markStyle(incomeIdx, INCOME_STEPS.length)}>{INCOME_STEPS[incomeIdx].label}</span>
              </div>
            </div>
          </div>
        </header>
        <div className="pk-body">
          <div className="pk-cards-grid">
            {filtered.map(c => {
              const inCart = cart.includes(c.id);
              const blocked = !inCart && full;
              return (
                <div key={c.id} className="pk-card" style={{ background: c.ui_card_background, color: c.ui_card_text_color, borderColor: inCart ? 'var(--gold)' : 'var(--line-soft)' }}>
                  <div>
                    <div className="name">{c.card_name}</div>
                    <div className="bank">{c.bank}</div>
                  </div>
                  <div className="stats">
                    <div className="stat"><span>Min. income</span><b>{c.invitation_only ? 'By invitation' : fmtRM(c.min_income)}</b></div>
                    <div className="stat"><span>Annual fee</span><b>{fmtRM(c.annual_fee)}</b></div>
                  </div>
                  <button
                    className="add-btn"
                    disabled={blocked}
                    onClick={() => onToggle(c.id)}
                    style={{
                      cursor: blocked ? 'not-allowed' : 'pointer',
                      background: inCart ? 'var(--gradient-gold)' : 'transparent',
                      borderColor: inCart ? 'var(--gold)' : blocked ? 'var(--line-soft)' : 'var(--gold)',
                      color: inCart ? 'var(--on-gold)' : blocked ? 'var(--text-faint)' : 'var(--gold)',
                    }}
                  >
                    {inCart ? '✓ Selected' : blocked ? 'Slots full' : addLabel}
                  </button>
                </div>
              );
            })}
            {showResetCard && (
              <div className="pk-reset-card">
                <div style={{ fontSize: 13.5, color: 'var(--text-dim)', fontWeight: 300 }}>Not seeing the right cards?</div>
                <button onClick={() => { setBanks([]); setCardFilters([]); }}>Reset filters</button>
              </div>
            )}
          </div>
          {noResults && (
            <div className="pk-no-results">
              <div className="t">No cards match these filters</div>
              <p>Widen the fee or salary range, or clear the bank filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  , document.body);
}
