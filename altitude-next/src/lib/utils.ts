import type { Card, Perk } from './data';

export const ICONS: Record<string, string> = {
  lounge:       '<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 11a2 2 0 0 1 2 2v3h14v-3a2 2 0 0 1 2-2"/><path d="M5 19v-3M19 19v-3"/>',
  insurance:    '<path d="M12 3l7 3v5c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6z"/>',
  overseas:     '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.4 2.5 13.2 0 16M12 4c-2.5 2.4-2.5 13.2 0 16"/>',
  miles:        '<path d="M21 16l-9-3.2V5.5a1.5 1.5 0 0 0-3 0v7.3L3 16v1.8l6-1.6v2.5l-1.8 1.3V21l3.3-.9 3.3.9v-1l-1.8-1.3v-2.5l6 1.6z"/>',
  transfer:     '<path d="M3 13l1.8-4.6A2 2 0 0 1 6.7 7h10.6a2 2 0 0 1 1.9 1.4L21 13"/><path d="M3 13h18v4H3z"/><circle cx="7" cy="17.5" r="1.4"/><circle cx="17" cy="17.5" r="1.4"/>',
  fasttrack:    '<polyline points="4 6 11 12 4 18"/><polyline points="12 6 19 12 12 18"/>',
  hotel:        '<path d="M3 18v-6h18v6"/><path d="M3 12V7M21 18v-2M3 18v-2"/><path d="M7 12V9.5A1.5 1.5 0 0 1 8.5 8h4A1.5 1.5 0 0 1 14 9.5V12"/>',
  golf:         '<path d="M7 21V3l9 3-9 3"/><path d="M7 21h6"/>',
  concierge:    '<path d="M4 18h16"/><path d="M5.5 18a6.5 6.5 0 0 1 13 0"/><path d="M12 6.2V4.3"/><circle cx="12" cy="3.6" r="0.7"/>',
  roaming:      '<circle cx="12" cy="12" r="3.4"/><path d="M6 6a8.5 8.5 0 0 0 0 12M18 6a8.5 8.5 0 0 1 0 12"/>',
  businessclass:'<path d="M7.5 4h1.5a2 2 0 0 1 2 2v6H7.5z"/><path d="M7.5 12h8a2 2 0 0 1 2 2v1.5h-10z"/><path d="M7.5 4v15M16 15.5v3.5"/>',
  wifi:         '<path d="M5 10.2a10 10 0 0 1 14 0M8 13.7a5.4 5.4 0 0 1 8 0"/><circle cx="12" cy="17" r="1"/>',
  protection:   '<path d="M12 3l7 3v5c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6z"/><polyline points="9 11.6 11.2 13.8 15 9.8"/>',
};

export const CHECK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 11"/></svg>';

export function svgIcon(id: string): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[id] ?? ''}</svg>`;
}

export function fmtRM(n: number | null | undefined): string {
  if (n == null) return '';
  if (n === 0) return 'Complimentary';
  return 'RM ' + n.toLocaleString('en-MY');
}

export function cmpCell(c: Card, p: Perk): string {
  const v = c.perks[p.id as keyof typeof c.perks];
  if (!v) return `<td><span class="cell-no">—</span></td>`;
  if (p.id === 'lounge') {
    return `<td><div class="cell-yes"><span class="ck">${CHECK} Included</span></div></td>`;
  }
  if (p.id === 'insurance') {
    return `<td><div class="cell-yes"><span class="ck">${CHECK} Included</span></div></td>`;
  }
  return `<td><div class="cell-yes"><span class="ck">${CHECK} Included</span><div class="det">${v}</div></div></td>`;
}

export const DEFAULT_TOP3 = ['lounge', 'insurance', 'overseas'];

export function orderedPerks(selected: string[], perks: Perk[]): Perk[] {
  if (!selected.length) return perks.slice();
  const defaultOrder = perks.map(p => p.id);
  const rest = defaultOrder.filter(id => !selected.includes(id));
  return [...selected, ...rest]
    .map(id => perks.find(p => p.id === id))
    .filter((p): p is Perk => p != null);
}

export function topPerks(n: number, selected: string[], perks: Perk[]): Perk[] {
  const defaultOrder = perks.map(p => p.id);
  const base = [...selected, ...DEFAULT_TOP3, ...defaultOrder];
  const out: string[] = [];
  for (const id of base) {
    if (!out.includes(id)) out.push(id);
    if (out.length === n) break;
  }
  return out
    .map(id => perks.find(p => p.id === id))
    .filter((p): p is Perk => p != null);
}
