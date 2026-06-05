'use client';

import { useStore } from '@/lib/store';
import { topPerks } from '@/lib/utils';
import { Icon } from '@/components/Icon';
import { CardRow } from '@/components/CardRow';

export default function CardsPage() {
  const cards = useStore(s => s.cards);
  const perks = useStore(s => s.perks);
  const selected = useStore(s => s.selected);
  const top = topPerks(3, selected, perks);
  const tailored = selected.length > 0;

  return (
    <div className="page">
      <div className="page-head">
        <div className="eyebrow">Step Three · Card Index</div>
        <h1 className="title">Every card, <em>in full</em></h1>
        <p className="lede">
          Browse the complete range. Add any card to your comparison to weigh it against the rest.
        </p>
        <div className="tailored">
          <Icon id="miles" />
          {tailored ? (
            <>Showing your top perks: <b>{top.map(p => p.name).join(' · ')}</b></>
          ) : (
            <>Showing default perks: <b>{top.map(p => p.name).join(' · ')}</b> — set priorities to personalise</>
          )}
        </div>
      </div>
      <div className="list">
        {cards.map((c, i) => (
          <CardRow key={c.id} c={c} top={top} index={i} />
        ))}
      </div>
    </div>
  );
}
