'use client';

import { Icon } from './Icon';
import { useStore } from '@/lib/store';
import type { Perk } from '@/lib/data';

interface Props {
  p: Perk;
  index: number;
}

export function PerkCard({ p, index }: Props) {
  const selected = useStore(s => s.selected);
  const togglePerk = useStore(s => s.togglePerk);
  const sel = selected.includes(p.id);
  const rank = sel ? selected.indexOf(p.id) + 1 : null;
  const popular = p.pop <= 4;

  return (
    <div
      className={`perk${sel ? ' sel' : ''}`}
      onClick={() => togglePerk(p.id)}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="nbadge">{rank ?? ''}</div>
      <div className="ptop">
        <div className="ico"><Icon id={p.id} /></div>
        {popular && <span className="pop">Popular</span>}
      </div>
      <h3>{p.name}</h3>
      <p>{p.desc}</p>
    </div>
  );
}
