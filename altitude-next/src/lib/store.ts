import { create } from 'zustand';
import {
  PERKS as STATIC_PERKS,
  CARDS as STATIC_CARDS,
  LOUNGES as STATIC_LOUNGES,
  type Perk,
  type Card,
  type Lounge,
} from './data';
import { atFetchAll, transformPerks, transformCards, transformLounges } from './airtable';

export type DataStatus = 'idle' | 'loading' | 'ready' | 'error';

interface StoreState {
  /* ── live data (starts as static fallback) ── */
  perks: Perk[];
  cards: Card[];
  lounges: Lounge[];
  dataStatus: DataStatus;
  loadData(): Promise<void>;

  /* ── ui state ── */
  selected: string[];
  cart: string[];
  expanded: string[];
  mapReturn: string;
  mapCard: string | null;
  mapRegion: string;
  mapActiveCard: string | null;

  togglePerk(id: string): void;
  removePerk(id: string): void;
  moveUp(id: string): void;
  moveDown(id: string): void;
  toggleCartCard(id: string): void;
  moveCartLeft(id: string): void;
  moveCartRight(id: string): void;
  removeCartCard(id: string): void;
  toggleExpanded(id: string): void;
  setMapConfig(cfg: { mapReturn: string; mapCard: string | null; mapRegion: string; mapActiveCard: string | null }): void;
  setMapActiveCard(id: string | null): void;
  setMapRegion(region: string): void;
}

export const useStore = create<StoreState>((set, get) => ({
  /* ── data (static defaults; replaced by loadData on mount) ── */
  perks: STATIC_PERKS,
  cards: STATIC_CARDS,
  lounges: STATIC_LOUNGES,
  dataStatus: 'idle',

  async loadData() {
    if (get().dataStatus !== 'idle') return;
    set({ dataStatus: 'loading' });
    try {
      const [perkRecs, cardRecs, loungeRecs] = await Promise.all([
        atFetchAll('Perks'),
        atFetchAll('Cards'),
        atFetchAll('Lounges'),
      ]);
      set({
        perks:      transformPerks(perkRecs),
        cards:      transformCards(cardRecs),
        lounges:    transformLounges(loungeRecs),
        dataStatus: 'ready',
      });
    } catch {
      /* leave static fallback data in place */
      set({ dataStatus: 'error' });
    }
  },

  /* ── ui state ── */
  selected: [],
  cart: [],
  expanded: [],
  mapReturn: '/cards',
  mapCard: null,
  mapRegion: '',
  mapActiveCard: null,

  togglePerk(id) {
    set(s => {
      const i = s.selected.indexOf(id);
      return {
        selected: i > -1
          ? s.selected.filter((_, idx) => idx !== i)
          : [...s.selected, id],
      };
    });
  },

  removePerk(id) {
    set(s => ({ selected: s.selected.filter(x => x !== id) }));
  },

  moveUp(id) {
    set(s => {
      const i = s.selected.indexOf(id);
      if (i <= 0) return s;
      const next = [...s.selected];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return { selected: next };
    });
  },

  moveDown(id) {
    set(s => {
      const i = s.selected.indexOf(id);
      if (i < 0 || i >= s.selected.length - 1) return s;
      const next = [...s.selected];
      [next[i + 1], next[i]] = [next[i], next[i + 1]];
      return { selected: next };
    });
  },

  toggleCartCard(id) {
    set(s => {
      const i = s.cart.indexOf(id);
      return {
        cart: i > -1
          ? s.cart.filter((_, idx) => idx !== i)
          : [...s.cart, id],
      };
    });
  },

  moveCartLeft(id) {
    set(s => {
      const i = s.cart.indexOf(id);
      if (i <= 0) return s;
      const next = [...s.cart];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return { cart: next };
    });
  },

  moveCartRight(id) {
    set(s => {
      const i = s.cart.indexOf(id);
      if (i < 0 || i >= s.cart.length - 1) return s;
      const next = [...s.cart];
      [next[i + 1], next[i]] = [next[i], next[i + 1]];
      return { cart: next };
    });
  },

  removeCartCard(id) {
    set(s => ({ cart: s.cart.filter(x => x !== id) }));
  },

  toggleExpanded(id) {
    set(s => ({
      expanded: s.expanded.includes(id)
        ? s.expanded.filter(x => x !== id)
        : [...s.expanded, id],
    }));
  },

  setMapConfig({ mapReturn, mapCard, mapRegion, mapActiveCard }) {
    set({ mapReturn, mapCard, mapRegion, mapActiveCard });
  },

  setMapActiveCard(id) {
    set({ mapActiveCard: id });
  },

  setMapRegion(region) {
    set(s => ({ mapRegion: s.mapRegion === region ? '' : region }));
  },
}));
