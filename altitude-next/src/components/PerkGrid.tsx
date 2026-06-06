'use client';

import { useStore } from '@/lib/store';
import { PerkCard } from './PerkCard';
import { PrioritySidebar } from './PrioritySidebar';

export default function PerkGrid() {
  const perks    = useStore(s => s.perks);
  const selected = useStore(s => s.selected);
  const sorted   = [...perks].sort((a, b) => a.pop - b.pop);
  const hasSide  = selected.length > 0;

  return (
    <div className={`profile-grid${hasSide ? ' has-side' : ''}`}>
      <div className="perks">
        {sorted.map((p, i) => (
          <PerkCard key={p.id} p={p} index={i} />
        ))}
      </div>
      {hasSide && <PrioritySidebar />}
    </div>
  );
}
