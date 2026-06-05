import type { Lounge } from '@/lib/data';

interface Props {
  l: Lounge;
  index: number;
}

export function LoungeCard({ l, index }: Props) {
  return (
    <div className="lcard2" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="l2top">
        <div className="code">{l.code}</div>
        <div className="net2">{l.net}</div>
      </div>
      <h3>{l.name}</h3>
      <div className="city">{l.city}</div>
      <div className="term">{l.term}</div>
      <div className="amen">
        {l.amen.map(a => <span key={a}>{a}</span>)}
      </div>
    </div>
  );
}
