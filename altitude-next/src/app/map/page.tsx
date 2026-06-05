'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { LoungeCard } from '@/components/LoungeCard';
import { useStore } from '@/lib/store';
import { REGIONS, HOME_HUB } from '@/lib/data';

const W = 900;
const H = 400;

export default function MapPage() {
  const router = useRouter();
  const cards = useStore(s => s.cards);
  const lounges = useStore(s => s.lounges);
  const mapCard = useStore(s => s.mapCard);
  const mapRegion = useStore(s => s.mapRegion);
  const mapActiveCard = useStore(s => s.mapActiveCard);
  const mapReturn = useStore(s => s.mapReturn);
  const cart = useStore(s => s.cart);
  const setMapActiveCard = useStore(s => s.setMapActiveCard);
  const setMapRegion = useStore(s => s.setMapRegion);

  const relevantCardIds = mapCard
    ? [mapCard]
    : cart.length ? cart : cards.map(c => c.id);

  const relevantCards = relevantCardIds
    .map(id => cards.find(c => c.id === id))
    .filter((c): c is typeof cards[0] => c != null);

  const relevantLounges = lounges.filter(l => l.cards?.some(cid => relevantCardIds.includes(cid)));
  const visibleLounges = relevantLounges
    .filter(l => !mapActiveCard || l.cards?.includes(mapActiveCard))
    .filter(l => !mapRegion || l.region === mapRegion);

  /* Smart viewport bounds */
  const boundsPoints = [
    HOME_HUB,
    ...(visibleLounges.length ? visibleLounges : relevantLounges)
      .map(l => ({ lon: l.lon ?? HOME_HUB.lon, lat: l.lat ?? HOME_HUB.lat })),
  ];
  let minLon = Math.min(...boundsPoints.map(p => p.lon));
  let maxLon = Math.max(...boundsPoints.map(p => p.lon));
  let minLat = Math.min(...boundsPoints.map(p => p.lat));
  let maxLat = Math.max(...boundsPoints.map(p => p.lat));
  const padLon = Math.max((maxLon - minLon) * 0.3, 14);
  const padLat = Math.max((maxLat - minLat) * 0.36, 12);
  minLon = Math.max(minLon - padLon, -175);
  maxLon = Math.min(maxLon + padLon, 175);
  minLat = Math.max(minLat - padLat, -60);
  maxLat = Math.min(maxLat + padLat, 75);

  const proj = (lon: number, lat: number): [number, number] => [
    (lon - minLon) / (maxLon - minLon) * W,
    (maxLat - lat) / (maxLat - minLat) * H,
  ];

  /* Grid lines */
  const gridLines: React.ReactNode[] = [];
  const gStep = (maxLon - minLon) > 80 ? 30 : 15;
  for (let lon = Math.ceil(minLon / gStep) * gStep; lon <= maxLon; lon += gStep) {
    const [x] = proj(lon, 0);
    if (x >= 0 && x <= W) gridLines.push(
      <line key={`v${lon}`} x1={x.toFixed(1)} y1="0" x2={x.toFixed(1)} y2={H} className="grid" />
    );
  }
  for (let lat = Math.ceil(minLat / gStep) * gStep; lat <= maxLat; lat += gStep) {
    const [, y] = proj(0, lat);
    if (y >= 0 && y <= H) gridLines.push(
      <line key={`h${lat}`} x1="0" y1={y.toFixed(1)} x2={W} y2={y.toFixed(1)} className="grid" />
    );
  }

  const [hx, hy] = proj(HOME_HUB.lon, HOME_HUB.lat);

  /* Airport clusters from visible lounges */
  const airportMap: Record<string, { lon: number; lat: number; code: string; count: number }> = {};
  visibleLounges.forEach(l => {
    if (!airportMap[l.code]) airportMap[l.code] = { lon: l.lon ?? HOME_HUB.lon, lat: l.lat ?? HOME_HUB.lat, code: l.code, count: 0 };
    airportMap[l.code].count++;
  });
  const airports = Object.values(airportMap);

  const activeRegions = [...new Set(relevantLounges.map(l => l.region))];
  const totalAirports = [...new Set(visibleLounges.map(l => l.code))].length;
  const multiCard = relevantCards.length > 1;

  return (
    <div className="page map-page">
      <div className="page-head">
        <button className="map-back" onClick={() => router.push(mapReturn || '/cards')}>
          ← Back
        </button>
        <div className="eyebrow">Lounge Access · Global Network</div>
        <h1 className="title">Where your card <em>opens doors</em></h1>
        <p className="lede">
          {visibleLounges.length} lounge{visibleLounges.length !== 1 ? 's' : ''} across{' '}
          {totalAirports} airport{totalAirports !== 1 ? 's' : ''}
          {relevantCards.length === 1 ? ' with the ' + relevantCards[0].name : ''}.
        </p>
      </div>

      <div className="worldmap">
        <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <g>{gridLines}</g>
          <g>
            {airports.map((a, i) => {
              const [x, y] = proj(a.lon, a.lat);
              const mx = (hx + x) / 2;
              const my = (hy + y) / 2 - Math.hypot(x - hx, y - hy) * 0.22;
              return (
                <path
                  key={a.code}
                  className="arc"
                  style={{ animationDelay: `${i * 130}ms` }}
                  d={`M${hx.toFixed(1)} ${hy.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`}
                />
              );
            })}
          </g>
          <g>
            {airports.map((a, i) => {
              const [x, y] = proj(a.lon, a.lat);
              const r = 5 + Math.min(a.count, 3) * 1.5;
              return (
                <g key={a.code} className="mk lounge-mk" style={{ animationDelay: `${200 + i * 80}ms` }}>
                  <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={r} className="lounge-dot" />
                  <text x={x.toFixed(1)} y={(y - r - 6).toFixed(1)} className="lab">{a.code}</text>
                </g>
              );
            })}
          </g>
          <g className="mk home">
            <circle cx={hx.toFixed(1)} cy={hy.toFixed(1)} r="18" className="pulse" />
            <circle cx={hx.toFixed(1)} cy={hy.toFixed(1)} r="7" className="home-dot" />
            <text x={hx.toFixed(1)} y={(hy - 16).toFixed(1)} className="home-lab">{HOME_HUB.code}</text>
          </g>
        </svg>
      </div>

      <div className="map-cards-section">
        {relevantCards.map(c => {
          const isActive = mapActiveCard === c.id;
          const cardLounges = lounges.filter(l => l.cards?.includes(c.id) && relevantCardIds.includes(c.id));
          const nextCard = isActive ? null : c.id;
          return (
            <div
              key={c.id}
              className={`map-card-banner${multiCard ? ' clickable' : ''}${isActive ? ' active-banner' : ''}`}
              onClick={multiCard ? () => setMapActiveCard(nextCard) : undefined}
            >
              <div className="mcb-card" style={{ background: c.theme, color: c.fg }}>
                <div className="mcb-card-top">
                  <div className="chip" />
                  <div className="mcb-net">{c.net}</div>
                </div>
                <div>
                  <div className="mcb-tier">{c.tier}</div>
                  <div className="mcb-cname">{c.name}</div>
                </div>
              </div>
              <div className="mcb-info">
                <div className="mcb-name">{c.name}</div>
                <div className="mcb-meta">{c.perks.lounge ? c.perks.lounge.visits : '—'}</div>
                <div className="mcb-meta">{cardLounges.length} lounge{cardLounges.length !== 1 ? 's' : ''} in network</div>
                {multiCard && <div className="mcb-hint">{isActive ? '↩ Show all cards' : 'Tap to filter map'}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="map-section-label">Filter by region</div>
      <div className="region-bar">
        {REGIONS.filter(r => activeRegions.includes(r.id)).map(r => (
          <button
            key={r.id}
            className={`rchip${mapRegion === r.id ? ' active' : ''}`}
            onClick={() => setMapRegion(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="lounge-grid">
        {visibleLounges.map((l, i) => (
          <LoungeCard key={`${l.code}-${l.term}`} l={l} index={i} />
        ))}
        {visibleLounges.length === 0 && (
          <div className="empty" style={{ marginTop: 0 }}>
            <div className="ei"><Icon id="lounge" /></div>
            <h3>No lounges here</h3>
            <p>The selected card{relevantCards.length > 1 ? 's' : ''} don't have access in this region.</p>
          </div>
        )}
      </div>
    </div>
  );
}
