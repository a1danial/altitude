'use client';

import { useStore } from '@/lib/store';

export function PrioritySidebar() {
  const perks = useStore(s => s.perks);
  const selected = useStore(s => s.selected);
  const removePerk = useStore(s => s.removePerk);
  const moveUp = useStore(s => s.moveUp);
  const moveDown = useStore(s => s.moveDown);

  if (!selected.length) return null;

  return (
    <aside className="side">
      <h4>Your priorities</h4>
      <div className="sub">
        Ranked by importance — drag-free reorder with the arrows. This order tailors your comparison &amp; card results.
      </div>
      <div className="pri-list">
        {selected.map((id, i) => {
          const p = perks.find(p => p.id === id);
          if (!p) return null;
          return (
            <div className="pri" key={id}>
              <span className="rank">{i + 1}</span>
              <span className="pname">{p.name}</span>
              <span className="ctrls">
                <button onClick={() => moveUp(id)} disabled={i === 0} title="Move up">↑</button>
                <button onClick={() => moveDown(id)} disabled={i === selected.length - 1} title="Move down">↓</button>
                <button className="rm" onClick={() => removePerk(id)} title="Remove">×</button>
              </span>
            </div>
          );
        })}
      </div>
      <span className="empty-note">
        {selected.length} perk{selected.length > 1 ? 's' : ''} prioritised.
      </span>
    </aside>
  );
}
