import type { VasItem, VasVariant } from './data';

const VARIANTS: VasVariant[] = ['standard', 'icon', 'button', 'image'];

/** the design system's 13 supported vas icon names (same set as the legacy perk ids) */
export const VAS_ICONS = [
  'lounge', 'insurance', 'overseas', 'miles', 'transfer', 'fasttrack',
  'hotel', 'golf', 'concierge', 'roaming', 'businessclass', 'wifi', 'protection',
];

/** parses the vas_list JSON field; never throws — bad or empty JSON just yields no items */
export function parseVasList(raw: string | null | undefined): VasItem[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const items: VasItem[] = [];
  for (const entry of parsed) {
    if (!entry || typeof entry !== 'object') continue;
    const e = entry as Record<string, unknown>;
    const variant = VARIANTS.includes(e.variant as VasVariant) ? (e.variant as VasVariant) : 'standard';
    const text = typeof e.text === 'string' ? e.text : '';
    if (!text) continue;
    const item: VasItem = { variant, text };
    if (variant === 'icon') {
      item.icon = VAS_ICONS.includes(e.icon as string) ? (e.icon as string) : undefined;
    }
    if (variant === 'button') {
      item.label = typeof e.label === 'string' && e.label ? e.label : 'Learn more';
      item.href = typeof e.href === 'string' && e.href ? e.href : '#';
    }
    if (variant === 'image') {
      item.image = typeof e.image === 'string' ? e.image : '';
      item.href = typeof e.href === 'string' && e.href ? e.href : '#';
    }
    items.push(item);
  }
  return items;
}

export type TextSegment =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; href: string };

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** splits text containing `[label](url)` markdown-style links into renderable segments */
export function parseInlineLinks(text: string | null | undefined): TextSegment[] {
  if (!text) return [];
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(LINK_RE)) {
    const [full, label, href] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) segments.push({ type: 'text', text: text.slice(lastIndex, index) });
    segments.push({ type: 'link', text: label, href: href || '#' });
    lastIndex = index + full.length;
  }
  if (lastIndex < text.length) segments.push({ type: 'text', text: text.slice(lastIndex) });
  return segments;
}
