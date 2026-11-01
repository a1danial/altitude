import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FALLBACK_CARDS } from './config';
import type { Card, Lounge } from './data';
import {
  atFetchAll,
  transformCards,
  transformLounges,
  transformLoungeAccess,
} from './airtable';

export type DataStatus = 'idle' | 'loading' | 'ready' | 'error';

export const CART_SLOTS = 5;

interface DataState {
  cards: Card[];
  lounges: Lounge[];
  /** per card+lounge entitlement, keyed `${cardId}|${loungeId}` */
  entitlements: Record<string, string>;
  dataStatus: DataStatus;
  loadData(): Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  cards: FALLBACK_CARDS,
  lounges: [],
  entitlements: {},
  dataStatus: 'idle',

  async loadData() {
    if (get().dataStatus !== 'idle') return;
    set({ dataStatus: 'loading' });
    try {
      const [cardRecs, loungeRecs, accessRecs] = await Promise.all([
        atFetchAll('Cards'),
        atFetchAll('Lounges'),
        atFetchAll('LoungebyCard'),
      ]);

      const lounges = transformLounges(loungeRecs);
      const access = transformLoungeAccess(accessRecs);

      const cardsByLounge = new Map<string, string[]>();
      const entitlements: Record<string, string> = {};
      for (const a of access) {
        const list = cardsByLounge.get(a.loungeId);
        if (list) list.push(a.cardId);
        else cardsByLounge.set(a.loungeId, [a.cardId]);
        if (a.entitlement) entitlements[`${a.cardId}|${a.loungeId}`] = a.entitlement;
      }
      for (const l of lounges) l.cards = cardsByLounge.get(l.id) ?? [];

      set({
        cards: transformCards(cardRecs),
        lounges,
        entitlements,
        dataStatus: 'ready',
      });
    } catch {
      /* leave fallback cards in place; lounges stay empty */
      set({ dataStatus: 'error' });
    }
  },
}));

interface SelectionState {
  /** shared card-picker selection — same cards show on both Card Explorer and Lounge Explorer for the session */
  cart: string[];
  /** last-picked lounge destination (a Place key), shared the same way */
  destination: string | null;
  /** has the opening directory modal already been shown & dismissed this session */
  directoryDismissed: boolean;

  toggleCartCard(id: string): void;
  removeCartCard(id: string): void;
  setDestination(code: string | null): void;
  dismissDirectory(): void;
  reopenDirectory(): void;
}

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set) => ({
      cart: [],
      destination: null,
      directoryDismissed: false,

      toggleCartCard(id) {
        set(s => {
          if (s.cart.includes(id)) return { cart: s.cart.filter(x => x !== id) };
          if (s.cart.length >= CART_SLOTS) return s;
          return { cart: [...s.cart, id] };
        });
      },

      removeCartCard(id) {
        set(s => ({ cart: s.cart.filter(x => x !== id) }));
      },

      setDestination(code) {
        set({ destination: code });
      },

      dismissDirectory() {
        set({ directoryDismissed: true });
      },

      reopenDirectory() {
        set({ directoryDismissed: false });
      },
    }),
    {
      name: 'altitude-selection',
      // sessionStorage doesn't exist during Next.js SSR — fall back to a no-op so the store can still be created
      storage: createJSONStorage(() => (typeof window === 'undefined'
        ? { getItem: () => null, setItem: () => {}, removeItem: () => {} }
        : sessionStorage)),
    },
  ),
);
