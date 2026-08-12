'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { LoungeMap } from '@/components/LoungeMap';
import { useStore } from '@/lib/store';
import { REGIONS } from '@/lib/data';
import type { Card, Lounge } from '@/lib/data';

function hasCoords(l: Lounge): boolean {
  return Number.isFinite(l.lon) && Number.isFinite(l.lat);
}

export default function MapPage() {
  const router = useRouter();
  const cards = useStore(s => s.cards);
  const lounges = useStore(s => s.lounges);
  const entitlements = useStore(s => s.entitlements);
  const mapCard = useStore(s => s.mapCard);
  const mapRegion = useStore(s => s.mapRegion);
  const mapActiveCard = useStore(s => s.mapActiveCard);
  const mapReturn = useStore(s => s.mapReturn);
  const cart = useStore(s => s.cart);
  const setMapActiveCard = useStore(s => s.setMapActiveCard);
  const setMapRegion = useStore(s => s.setMapRegion);

  /* Which cards this visit is scoped to — one card, the comparison cart, or
     every card that actually carries a lounge benefit. */
  const relevantCards = useMemo<Card[]>(() => {
    if (mapCard) return cards.filter(c => c.id === mapCard);
    if (cart.length) return cards.filter(c => cart.includes(c.id));
    return cards.filter(c => c.perks.lounge);
  }, [cards, cart, mapCard]);

  const relevantCardIds = useMemo(() => relevantCards.map(c => c.id), [relevantCards]);

  const mappable = useMemo(() => lounges.filter(hasCoords), [lounges]);

  /* Every lounge reachable by the scoped cards. */
  const inNetwork = useMemo(
    () => mappable.filter(l => l.cards?.some(id => relevantCardIds.includes(id))),
    [mappable, relevantCardIds],
  );

  const loungeCountFor = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of inNetwork) {
      for (const id of l.cards ?? []) {
        if (relevantCardIds.includes(id)) counts.set(id, (counts.get(id) ?? 0) + 1);
      }
    }
    return counts;
  }, [inNetwork, relevantCardIds]);

  /* The map ignores the region filter — region only narrows the list below it. */
  const accessible = useMemo(
    () => (mapActiveCard ? inNetwork.filter(l => l.cards?.includes(mapActiveCard)) : inNetwork),
    [inNetwork, mapActiveCard],
  );

  const isAccessible = (l: Lounge) => !mapActiveCard || !!l.cards?.includes(mapActiveCard);

  const regional = useMemo(
    () => (mapRegion ? inNetwork.filter(l => l.region === mapRegion) : inNetwork),
    [inNetwork, mapRegion],
  );

  /* Accessible lounges float to the top; the rest stay visible but dimmed. */
  const listed = useMemo(() => {
    if (!mapActiveCard) return regional;
    const reach = (l: Lounge) => Number(!!l.cards?.includes(mapActiveCard));
    return [...regional].sort((a, b) => reach(b) - reach(a));
  }, [regional, mapActiveCard]);

  const activeRegions = useMemo(
    () => new Set(inNetwork.map(l => l.region)),
    [inNetwork],
  );

  const accessibleCount = listed.filter(isAccessible).length;
  const airportCount = new Set(accessible.map(l => l.airport_code)).size;
  const showAllTile = relevantCards.length > 1;

  const countLabel = mapActiveCard
    ? `${accessibleCount} of ${listed.length} lounge${listed.length !== 1 ? 's' : ''} accessible`
    : `${listed.length} lounge${listed.length !== 1 ? 's' : ''}`;

  return (
    <div className="page map-page">
      <div className="page-head">
        <button className="map-back" onClick={() => router.push(mapReturn || '/cards')}>
          ← Back
        </button>
        <div className="eyebrow">Lounge Access · Global Network</div>
        <h1 className="title">Where your card <em>opens doors</em></h1>
        <p className="lede">
          {accessible.length} lounge{accessible.length !== 1 ? 's' : ''} across{' '}
          {airportCount} airport{airportCount !== 1 ? 's' : ''}
          {relevantCards.length === 1 ? ` with the ${relevantCards[0].card_name}` : ''}. Select a card to
          filter, then narrow by region.
        </p>
      </div>

      <LoungeMap lounges={accessible} fit={mapActiveCard != null} />

      <div className="card-filter-scroll">
        <div className="card-filter-row">
          {showAllTile && (
            <div
              className={`cf-item${mapActiveCard == null ? ' active' : ''}`}
              onClick={() => setMapActiveCard(null)}
            >
              <div className="cf-card cf-all">
                <div className="cf-all-stack">
                  {relevantCards.slice(0, 3).map((c, i) => (
                    <div key={c.id} className={`cas cas-${i}`} style={{ background: c.theme }} />
                  ))}
                </div>
                <div className="cf-info">
                  <div className="cf-name">All cards</div>
                  <div className="cf-access">
                    {relevantCards.length} cards · {inNetwork.length} lounges
                  </div>
                </div>
              </div>
            </div>
          )}

          {relevantCards.map(c => {
            const count = loungeCountFor.get(c.id) ?? 0;
            const active = mapActiveCard === c.id;
            return (
              <div
                key={c.id}
                className={`cf-item${active ? ' active' : ''}`}
                onClick={() => setMapActiveCard(active && showAllTile ? null : c.id)}
              >
                <div className="cf-card">
                  <div className="cf-mini" style={{ background: c.theme, color: c.fg }}>
                    <div className="cf-mini-top">
                      <div className="cm-chip" />
                      <div className="cm-net">{c.net}</div>
                    </div>
                    <div className="cm-name">{c.card_name}</div>
                  </div>
                  <div className="cf-info">
                    <div className="cf-name">{c.card_name}</div>
                    <div className="cf-access">
                      <b>{count} lounge{count !== 1 ? 's' : ''}</b>
                      {c.perks.lounge?.visits ? ` · ${c.perks.lounge.visits}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section-rule">
        <span className="sr-lab">Region</span>
        <span className="sr-ln" />
      </div>
      <div className="region-bar">
        <button
          className={`rchip${mapRegion === '' ? ' active' : ''}`}
          onClick={() => setMapRegion('')}
        >
          All regions
        </button>
        {REGIONS.filter(r => activeRegions.has(r.id)).map(r => (
          <button
            key={r.id}
            className={`rchip${mapRegion === r.id ? ' active' : ''}`}
            onClick={() => setMapRegion(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="section-rule">
        <span className="sr-lab">{countLabel}</span>
        <span className="sr-ln" />
      </div>

      <div className="lounge-grid">
        {listed.map((l, i) => {
          const open = isAccessible(l);
          const entitlement = mapActiveCard
            ? entitlements[`${mapActiveCard}|${l.id}`]
            : undefined;
          return (
            <div
              key={l.id ?? `${l.airport_code}-${l.location}`}
              className={`lcard2${open ? '' : ' dimmed'}`}
              style={{ animationDelay: `${Math.min(i, 20) * 35}ms` }}
            >
              <div className="l2top">
                <div className="code">{l.airport_code}</div>
                {l.net && <div className="net2">{l.net}</div>}
              </div>
              <h3>{l.lounge_name}</h3>
              <div className="city">{[l.city, l.country].filter(Boolean).join(' · ')}</div>
              <div className="term">{l.location}</div>
              <div className="amen">
                {entitlement && <span>{entitlement}</span>}
                {l.amen.map(a => <span key={a}>{a}</span>)}
              </div>
            </div>
          );
        })}
        {listed.length === 0 && (
          <div className="empty" style={{ marginTop: 0 }}>
            <div className="ei"><Icon id="lounge" /></div>
            <h3>No lounges here</h3>
            <p>
              {inNetwork.length === 0
                ? 'No lounge access is mapped to the selected card yet.'
                : 'No lounges in this region for the selected card.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
