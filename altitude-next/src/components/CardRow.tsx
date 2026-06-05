'use client';

import { useRouter } from 'next/navigation';
import { Icon } from './Icon';
import { useStore } from '@/lib/store';
import { fmtRM } from '@/lib/utils';
import { type Card, type Perk, type LoungePerks, type InsurancePerks } from '@/lib/data';

interface Props {
  c: Card;
  top: Perk[];
  index: number;
}

export function CardRow({ c, top, index }: Props) {
  const router = useRouter();
  const perks = useStore(s => s.perks);
  const cart = useStore(s => s.cart);
  const expanded = useStore(s => s.expanded);
  const toggleCartCard = useStore(s => s.toggleCartCard);
  const toggleExpanded = useStore(s => s.toggleExpanded);
  const setMapConfig = useStore(s => s.setMapConfig);

  const inCart = cart.includes(c.id);
  const open = expanded.includes(c.id);

  function openMapCard() {
    setMapConfig({ mapReturn: '/cards', mapCard: c.id, mapRegion: '', mapActiveCard: null });
    router.push('/map');
  }

  const perkCols = top.map(p => {
    const v = c.perks[p.id as keyof typeof c.perks];
    let val: React.ReactNode;

    if (!v) {
      val = <div className="fi-val muted">Not included</div>;
    } else if (p.id === 'lounge') {
      const lv = v as LoungePerks;
      val = (
        <>
          <div className="fi-val">
            {lv.visits}
            <span className="waiv" style={{ color: 'var(--text-faint)' }}>{lv.access}</span>
          </div>
          <button className="map-mini" onClick={openMapCard}>
            <Icon id="overseas" /> Lounge map
          </button>
        </>
      );
    } else if (p.id === 'insurance') {
      const iv = v as InsurancePerks;
      val = <div className="fi-val">{iv.accident ?? 'Personal accident cover'}</div>;
    } else {
      val = <div className="fi-val">{v as string}</div>;
    }

    return (
      <div key={p.id}>
        <div className="fi-lab"><Icon id={p.id} /> {p.name}</div>
        {val}
      </div>
    );
  });

  return (
    <div className={`lrow${inCart ? ' in-cart' : ''}`} style={{ animationDelay: `${index * 60}ms` }}>
      <div className="lcard" style={{ background: c.theme, color: c.fg }}>
        <div className="ltop">
          <div className="chip" />
          <div className="net">{c.net}</div>
        </div>
        <div>
          <div className="ltier">{c.tier}</div>
          <div className="lname">{c.name}</div>
          <div className="lnum">{c.num}</div>
        </div>
      </div>

      <div className="linfo">
        <div>
          <div className="fi-lab"><Icon id="overseas" /> Min. Income</div>
          <div className="fi-val big">
            {fmtRM(c.minSalary)}
            <span className="waiv" style={{ color: 'var(--text-faint)' }}>per year</span>
          </div>
        </div>
        <div>
          <div className="fi-lab"><Icon id="protection" /> Annual Fee</div>
          <div className="fi-val big">
            {fmtRM(c.fee)}
            {c.waiver && <span className="waiv">{c.waiver}</span>}
          </div>
        </div>
        {perkCols}
      </div>

      <div className="lcta">
        <button
          className={`btn ${inCart ? 'addbtn added' : 'btn-gold addbtn'}`}
          onClick={() => toggleCartCard(c.id)}
        >
          {inCart ? '✓ In comparison' : 'Add to Compare'}
        </button>
        <button className="seebtn" onClick={() => toggleExpanded(c.id)}>
          {open ? 'Hide full benefits' : 'See full benefits'}
        </button>
      </div>

      {open && (
        <div className="expand">
          {perks.map(p => {
            const v = c.perks[p.id as keyof typeof c.perks];

            if (p.id === 'lounge') {
              if (!v) {
                return (
                  <div key={p.id} className="ei2 off">
                    <span className="d" />
                    <span className="t">
                      <span className="n">{p.name}</span>
                      <span className="v">Not included</span>
                    </span>
                  </div>
                );
              }
              const lv = v as LoungePerks;
              return (
                <div key={p.id} className="ei2">
                  <span className="d" />
                  <span className="t">
                    <span className="n">{p.name}</span>
                    <span className="v">{lv.visits} · {lv.access}</span>
                    <span className="v">{lv.lounges}</span>
                    <span className="v">{lv.condition ? 'Condition — ' + lv.condition : 'No spend condition'}</span>
                    <button className="map-mini" onClick={openMapCard}>
                      <Icon id="overseas" /> Lounge map
                    </button>
                  </span>
                </div>
              );
            }

            return (
              <div key={p.id} className={`ei2${v ? '' : ' off'}`}>
                <span className="d" />
                <span className="t">
                  <span className="n">{p.name}</span>
                  {v
                    ? <span className="v">{p.id === 'insurance' ? ((v as InsurancePerks).accident ?? 'Personal accident cover') : v as string}</span>
                    : <span className="v">Not included</span>
                  }
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
