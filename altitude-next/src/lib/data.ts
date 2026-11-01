export interface Perk {
  id: string;
  name: string;
  pop: number;
  desc: string;
}

export interface LoungePerks {
  visits: string | null;
  access: string | null;
  condition: string | null;
  network: string | null;
}

export interface InsurancePerks {
  disruptions: string | null;
  medical: string | null;
  accident: string | null;
  condition: string | null;
  underwriter: string | null;
  underwriterUrl: string | null;
}

export interface CurtailPerks {
  flightDelay: string | null;
  flightCancellation: string | null;
  baggageDelay: string | null;
  condition: string | null;
  underwriter: string | null;
  underwriterUrl: string | null;
}

export type VasVariant = 'standard' | 'icon' | 'button' | 'image';

export interface VasItem {
  variant: VasVariant;
  text: string;
  icon?: string;
  label?: string;
  href?: string;
  image?: string;
}

export interface Card {
  id: string;
  card_name: string;
  bank: string;
  tier: string;
  net: string;
  ui_card_background: string;
  ui_card_text_color: string;
  min_income: number | null;
  invitation_only: boolean;
  /** true when invitation_only is set AND min_income is also present — a data-entry violation that must surface as a UI error, never crash */
  invitationIncomeConflict: boolean;
  annual_fee: number | null;
  annual_fee_details: string[];
  apply_url: string;
  lounge: LoungePerks | null;
  insurance: InsurancePerks | null;
  spending_rewards_cashback: string | null;
  spending_rewards_details: string | null;
  fx_fee_pct: string | null;
  fx_provider: string | null;
  curtail: CurtailPerks | null;
  vas_list: VasItem[];
}

export interface Lounge {
  id: string;
  airport_code: string;
  city: string;
  country: string;
  airport: string;
  lounge_name: string;
  location: string;
  terminal: string | null;
  opening_hours: string | null;
  region: string;
  lon: number;
  lat: number;
  /** populated from the LoungebyCard join in store.loadData — card ids with access to this lounge */
  cards: string[];
}

export interface Region {
  id: string;
  label: string;
}

export const REGIONS: Region[] = [
  { id: 'apac', label: 'Asia-Pacific' },
  { id: 'mideast', label: 'Middle East' },
  { id: 'europe', label: 'Europe' },
  { id: 'americas', label: 'Americas' },
  { id: 'africa', label: 'Africa' },
];
