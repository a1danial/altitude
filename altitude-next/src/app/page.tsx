import PerkGrid from '@/components/PerkGrid';

export default function ProfilePage() {
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
      <PerkGrid />
    </div>
  );
}
