'use client';

import { useStore } from '@/lib/store';
import { PerkCard } from '@/components/PerkCard';
import { PrioritySidebar } from '@/components/PrioritySidebar';

export default function ProfilePage() {
  const perks = useStore(s => s.perks);
  const selected = useStore(s => s.selected);
  const sorted = [...perks].sort((a, b) => a.pop - b.pop);
  const hasSide = selected.length > 0;

  return (
    <div className="page">
      <div className="page-head">
        <div className="eyebrow">Step One · Profile Builder</div>
        <h1 className="title">
          What makes a card<br /><em>worth carrying?</em>
        </h1>
        <p className="lede">
          Choose the travel perks that matter most to you. Select as many as you like — the order you pick them becomes your priority ranking.
        </p>
      </div>
      <div className="section-tag">
        <span className="lab">Sorted by popularity</span>
        <span className="ln" />
      </div>
      <div className={`profile-grid${hasSide ? ' has-side' : ''}`}>
        <div className="perks">
          {sorted.map((p, i) => (
            <PerkCard key={p.id} p={p} index={i} />
          ))}
        </div>
        {hasSide && <PrioritySidebar />}
      </div>
    </div>
  );
}
