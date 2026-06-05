'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon, CheckIcon } from '@/components/Icon';
import { useStore } from '@/lib/store';
import { type Card, type Perk } from '@/lib/data';
import { orderedPerks, fmtRM } from '@/lib/utils';

const LOUNGE_FIELDS = [
  { key: 'visits',    label: 'Visits',            uw: false },
  { key: 'access',    label: 'Access',            uw: false },
  { key: 'lounges',   label: 'Network',           uw: false },
  { key: 'condition', label: 'Condition',         uw: false },
];

const INS_FIELDS = [
  { key: 'disruptions', label: 'Travel Disruptions', uw: false },
  { key: 'medical',     label: 'Medical',            uw: false },
  { key: 'accident',    label: 'Accident',           uw: false },
  { key: 'condition',   label: 'Condition',          uw: false },
  { key: 'underwriter', label: 'Underwriter',        uw: true },
];

function CmpCell({ c, p }: { c: Card; p: Perk }) {
  const v = c.perks[p.id as keyof typeof c.perks];
  if (!v) return <td><span className="cell-no">—</span></td>;
  if (p.id === 'lounge' || p.id === 'insurance') {
    return (
      <td>
        <div className="cell-yes">
          <span className="ck"><CheckIcon /> Included</span>
        </div>
      </td>
    );
  }
  return (
    <td>
      <div className="cell-yes">
        <span className="ck"><CheckIcon /> Included</span>
        <div className="det">{v as string}</div>
      </div>
    </td>
  );
}

function SubRows({ fields, dataKey, cols, isPrio }: {
  fields: Array<{ key: string; label: string; uw: boolean }>;
  dataKey: 'lounge' | 'insurance';
  cols: Card[];
  isPrio: boolean;
}) {
  return (
    <>
      {fields.map((f, i) => {
        const isFirst = i === 0;
        const isLast = i === fields.length - 1;
        const prioCls = isPrio ? ' is-prio' : '';
        const cls = (isFirst ? 'prio-sub prio-sub-first' : isLast ? 'prio-sub-last' : 'prio-sub') + prioCls;
        return (
          <tr key={f.key} className={cls}>
            <td className="col-feat fcell">
              <span className={`sub-label${f.uw ? ' uw' : ''}`}>{f.label}</span>
            </td>
            {cols.map(c => {
              const obj = c.perks[dataKey] as Record<string, string | null> | undefined;
              const v = obj?.[f.key] ?? null;
              return (
                <td key={c.id}>
                  <span className={`sv${!v ? ' na' : ''}${f.uw ? ' uw' : ''}`}>
                    {v ?? (f.key === 'lounges' ? '—' : 'Not covered')}
                  </span>
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

function PerkRows({ p, cols, pr }: { p: Perk; cols: Card[]; pr: number }) {
  const router = useRouter();
  const setMapConfig = useStore(s => s.setMapConfig);
  const isPrio = pr > -1;

  function openMap() {
    setMapConfig({ mapReturn: '/compare', mapCard: null, mapRegion: '', mapActiveCard: null });
    router.push('/map');
  }

  const featureCell = (
    <th className="col-feat fcell">
      <div className={`fname${isPrio ? ' prio' : ''}`}>
        <span className="fi"><Icon id={p.id} /></span>
        <span className="fn-name">{p.name}</span>
        {isPrio && <span className="prn-mini">{pr + 1}</span>}
      </div>
    </th>
  );

  if (p.id === 'lounge') {
    const ctaStyle = isPrio
      ? { background: 'linear-gradient(90deg,rgba(201,169,106,0.16),rgba(201,169,106,0.06))' }
      : undefined;
    return (
      <>
        <tr className={isPrio ? 'prio-row has-sub' : undefined}>
          {featureCell}
          {cols.map(c => <CmpCell key={c.id} c={c} p={p} />)}
        </tr>
        <SubRows fields={LOUNGE_FIELDS} dataKey="lounge" cols={cols} isPrio={isPrio} />
        <tr className="map-cta-row">
          <td
            colSpan={cols.length + 1}
            style={{ paddingTop: 0, paddingLeft: 14, paddingBottom: 12, borderTop: 'none', ...ctaStyle }}
          >
            <button className="map-cta" onClick={openMap}>
              <span className="mc-ico"><Icon id="lounge" /></span>
              <span className="mc-txt">
                <b>Explore the Lounge Access Map</b>
                <span>See every partner lounge across the global network — by airport and region.</span>
              </span>
              <span className="arr">→</span>
            </button>
          </td>
        </tr>
      </>
    );
  }

  if (p.id === 'insurance') {
    return (
      <>
        <tr className={isPrio ? 'prio-row has-sub' : undefined}>
          {featureCell}
          {cols.map(c => <CmpCell key={c.id} c={c} p={p} />)}
        </tr>
        <SubRows fields={INS_FIELDS} dataKey="insurance" cols={cols} isPrio={isPrio} />
      </>
    );
  }

  return (
    <tr className={isPrio ? 'prio-row' : undefined}>
      {featureCell}
      {cols.map(c => <CmpCell key={c.id} c={c} p={p} />)}
    </tr>
  );
}

export default function ComparePage() {
  const cards = useStore(s => s.cards);
  const perks = useStore(s => s.perks);
  const cart = useStore(s => s.cart);
  const selected = useStore(s => s.selected);
  const moveCartLeft = useStore(s => s.moveCartLeft);
  const moveCartRight = useStore(s => s.moveCartRight);
  const removeCartCard = useStore(s => s.removeCartCard);

  if (!cart.length) {
    return (
      <div className="page">
        <div className="page-head">
          <div className="eyebrow">Step Two · Card Cart</div>
          <h1 className="title">Compare, <em>side by side</em></h1>
          <p className="lede">
            Shortlist the cards you're weighing up and line them up across a single comparison table.
          </p>
        </div>
        <div className="empty">
          <div className="ei"><Icon id="overseas" /></div>
          <h3>Your comparison is empty</h3>
          <p>Add cards to your cart from the Card Index, then return here to see them measured against every perk.</p>
          <Link href="/cards" className="btn btn-gold">
            Browse all cards <span className="arr">→</span>
          </Link>
        </div>
      </div>
    );
  }

  const cols = cart.map(id => cards.find(c => c.id === id)).filter((c): c is Card => c != null);
  const orderedPerkList = orderedPerks(selected, perks);
  const tailored = selected.length > 0;

  return (
    <div className="page">
      <div className="page-head">
        <div className="eyebrow">Step Two · Card Cart</div>
        <h1 className="title">Compare, <em>side by side</em></h1>
        <p className="lede">
          {cols.length} card{cols.length > 1 ? 's' : ''} shortlisted.{' '}
          {tailored
            ? 'Perks are ordered by your priorities from the Profile Builder.'
            : 'Perks follow the standard order — set priorities in the Profile Builder to re-sort.'
          }
        </p>
      </div>
      <div className="cmp-scroll">
        <table className="cmp">
          <thead>
            <tr>
              <th className="col-feat" />
              {cols.map(c => (
                <th key={c.id} className="ccard">
                  <div className="mini" style={{ background: c.theme, color: c.fg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div className="chip" />
                      <div className="mtier">{c.net}</div>
                    </div>
                    <div className="mname">{c.name}</div>
                  </div>
                  <div className="cmeta">
                    <div className="cmeta-btns">
                      <button className="mv" onClick={() => moveCartLeft(c.id)} disabled={cart.indexOf(c.id) === 0} title="Move left">←</button>
                      <button className="mv" onClick={() => moveCartRight(c.id)} disabled={cart.indexOf(c.id) === cart.length - 1} title="Move right">→</button>
                      <button className="rm" onClick={() => removeCartCard(c.id)}>Remove ×</button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="sec-row">
              <th className="col-feat fcell">
                <div className="sec-lab">Requirements <span className="ln" /></div>
              </th>
              {cols.map(c => <td key={c.id} />)}
            </tr>
            <tr>
              <th className="col-feat fcell">
                <div className="fname">
                  <span className="fi"><Icon id="overseas" /></span>
                  Minimum Annual Income
                </div>
              </th>
              {cols.map(c => (
                <td key={c.id}>
                  <div className="req-val">{fmtRM(c.minSalary)}</div>
                  <div className="req-sub">per year</div>
                </td>
              ))}
            </tr>
            <tr>
              <th className="col-feat fcell">
                <div className="fname">
                  <span className="fi"><Icon id="protection" /></span>
                  Annual Fee
                </div>
              </th>
              {cols.map(c => (
                <td key={c.id}>
                  <div className="req-val">{fmtRM(c.fee)}</div>
                  {c.waiver && <div className="req-sub waiv">{c.waiver}</div>}
                </td>
              ))}
            </tr>

            <tr className="sec-row">
              <th className="col-feat fcell">
                <div className="sec-lab">
                  Travel Perks{tailored ? ' · your order' : ''} <span className="ln" />
                </div>
              </th>
              {cols.map(c => <td key={c.id} />)}
            </tr>
            {orderedPerkList.map(p => {
              const pr = tailored ? selected.indexOf(p.id) : -1;
              return <PerkRows key={p.id} p={p} cols={cols} pr={pr} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
