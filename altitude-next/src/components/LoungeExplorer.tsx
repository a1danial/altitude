'use client';

import { useMemo, useState } from 'react';
import type { Lounge } from '@/lib/data';
import { useDataStore, useSelectionStore } from '@/lib/store';
import { CheckIcon } from './Icon';
import CardPickerDialog from './CardPickerDialog';

interface Place {
  key: string;
  type: 'country' | 'city' | 'airport';
  label: string;
  chip: string;
  code: string;
  codes: string[];
}

function buildPlaces(lounges: Lounge[]): Place[] {
  const countries = [...new Set(lounges.map(l => l.country).filter(Boolean))];
  const cities = [...new Set(lounges.map(l => `${l.city}|${l.country}`).filter(Boolean))];
  const places: Place[] = [];
  for (const c of countries) {
    places.push({ key: `country:${c}`, type: 'country', label: c, chip: c, code: '', codes: lounges.filter(l => l.country === c).map(l => l.airport_code) });
  }
  for (const s of cities) {
    const [city, country] = s.split('|');
    places.push({ key: `city:${city}`, type: 'city', label: city === country ? city : `${city}, ${country}`, chip: city, code: '', codes: lounges.filter(l => l.city === city).map(l => l.airport_code) });
  }
  for (const l of lounges) {
    places.push({ key: `airport:${l.airport_code}`, type: 'airport', label: l.airport, chip: `${l.airport} (${l.airport_code})`, code: l.airport_code, codes: [l.airport_code] });
  }
  return places;
}

export default function LoungeExplorer() {
  const cards = useDataStore(s => s.cards);
  const lounges = useDataStore(s => s.lounges);
  const entitlements = useDataStore(s => s.entitlements);
  const cart = useSelectionStore(s => s.cart);
  const toggleCartCard = useSelectionStore(s => s.toggleCartCard);
  const destination = useSelectionStore(s => s.destination);
  const setDestination = useSelectionStore(s => s.setDestination);

  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const places = useMemo(() => buildPlaces(lounges), [lounges]);
  const selectedPlace = destination ? places.find(p => p.key === destination) : null;
  const q = search.trim().toLowerCase();
  const open = !!q || focused;
  const suggestions = open
    ? places.filter(p => p.key !== destination && (!q || p.label.toLowerCase().includes(q) || p.code.toLowerCase() === q)).slice(0, 8)
    : [];

  const selectedCards = cart.map(id => cards.find(c => c.id === id)).filter((c): c is NonNullable<typeof c> => c != null);
  const codes = new Set(selectedPlace?.codes ?? []);
  const inDest = codes.size ? lounges.filter(l => codes.has(l.airport_code)) : [];

  const rows = inDest.map(l => {
    const access = selectedCards
      .filter(c => l.cards.includes(c.id))
      .map(c => ({ card: `${c.bank} ${c.card_name}`, visits: entitlements[`${c.id}|${l.id}`] ?? c.lounge?.visits ?? 'Access included' }));
    return { lounge: l, access };
  }).sort((a, b) => Number(b.access.length > 0) - Number(a.access.length > 0));

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="title">Where can your cards <em>get you in?</em></h1>
        <p className="lede">Add the airports you&apos;re flying through and the cards you carry. Lounges are matched against each card&apos;s lounge network.</p>
      </div>

      <div className="pk-search-wrap" style={{ marginTop: 20 }}>
        <input
          className="pk-search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search for a country, city or airport"
          style={{ paddingRight: selectedPlace ? 150 : 18 }}
        />
        {selectedPlace && (
          <div className="pk-chips">
            <span className="pk-chip">{selectedPlace.type === 'airport' ? selectedPlace.code : selectedPlace.chip}
              <button onClick={() => setDestination(null)}>×</button>
            </span>
          </div>
        )}
        {open && (
          <div className="pk-suggest">
            {suggestions.map(p => (
              <button key={p.key} onClick={() => { setDestination(p.key); setSearch(''); }}>
                {p.type === 'airport' && <span className="bank">{p.code}</span>}
                <span className="name">{p.label}</span>
              </button>
            ))}
            {suggestions.length === 0 && q && <div className="none">No matches</div>}
          </div>
        )}
      </div>

      <div className="lx-layout" style={{ marginTop: 28 }}>
        <aside className="lx-aside">
          <div className="lx-aside-head">
            <span className="lab">Your cards</span>
            <span className="count">{selectedCards.length} added</span>
          </div>
          {selectedCards.map(c => {
            const availableCount = inDest.filter(l => l.cards.includes(c.id)).length;
            return (
              <div key={c.id} className="lx-card-tile" style={{ background: c.ui_card_background, color: c.ui_card_text_color }}>
                <div className="top">
                  <div>
                    <div className="name">{c.card_name}</div>
                    <div className="bank">{c.bank}</div>
                  </div>
                  <button className="remove" style={{ color: c.ui_card_text_color }} onClick={() => toggleCartCard(c.id)} aria-label="Remove">×</button>
                </div>
                <div className="meta">
                  <span>{c.lounge ? `${c.lounge.visits}${c.lounge.access ? ` · ${c.lounge.access}` : ''}` : 'No lounge access'}</span>
                  <span className="avail">{availableCount} lounge{availableCount === 1 ? '' : 's'} available</span>
                </div>
              </div>
            );
          })}
          {selectedCards.length === 0 && <div className="empty"><p>No cards added</p></div>}
          <button className="lx-add-btn" onClick={() => setPickerOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.2" /><line x1="3" y1="10.5" x2="21" y2="10.5" /></svg>
            Select card
          </button>
        </aside>

        <section className="lx-section">
          <div className="lx-section-head"><h2>Lounges</h2></div>

          {rows.map(({ lounge, access }) => (
            <article key={lounge.id} className={`lx-lounge${access.length === 0 ? ' dim' : ''}`}>
              <div className="lx-lounge-top">
                <div className="lx-lounge-id">
                  <div className="tagrow">
                    <span className="tag">{lounge.airport_code}{lounge.terminal ? ` · ${lounge.terminal}` : ''}</span>
                    <span className="loc">{lounge.location}</span>
                  </div>
                  <h3>{lounge.lounge_name}</h3>
                </div>
                {lounge.opening_hours && (
                  <div className="lx-lounge-hours">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5" /><polyline points="12 7.5 12 12 15 14" /></svg>
                    {lounge.opening_hours}
                  </div>
                )}
              </div>
              <div className="lx-lounge-access">
                {access.map((a, i) => (
                  <div key={i} className="lx-access-row">
                    <CheckIcon width={13} height={13} />
                    <span className="card">{a.card} <span className="via">· {a.visits}</span></span>
                  </div>
                ))}
                {access.length === 0 && <span className="lx-none">Not covered by your cards</span>}
              </div>
            </article>
          ))}

          {rows.length === 0 && (
            <div className="empty">
              <h3>{!selectedPlace ? 'No airports selected' : 'No covered lounges'}</h3>
              <p>{!selectedPlace ? 'Search for a city or airport above.' : 'None of your cards cover lounges at this destination.'}</p>
            </div>
          )}
        </section>
      </div>

      <CardPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        cards={cards}
        cart={cart}
        onToggle={toggleCartCard}
        title="Select your cards"
        addLabel="Add card"
      />
    </div>
  );
}
