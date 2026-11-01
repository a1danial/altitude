import type { Card } from './data';

/**
 * Option 1 — which cards the Opening Directory's card-fan shows.
 * Real kebab-case card_ids, pulled live from Airtable (2026-11-01).
 */
export const DIRECTORY_CARD_IDS: string[] = [
  'maybank-visa-infinite',
  'rhb-visa-infinite',
  'cimb-travel-platinum',
  'uob-world',
  'rhb-premier-visa-infinite',
];

/**
 * Option 2 (required) — hardcoded fallback for the Card Explorer when Airtable fails.
 * Mirrors the live Cards table (8 rows, pulled 2026-11-01) with the same shape
 * `transformCards` produces, so the rest of the app can't tell the difference.
 */
export const FALLBACK_CARDS: Card[] = [
  {
    id: 'rhb-visa-signature', card_name: 'Visa Signature', bank: 'RHB', tier: 'Signature', net: 'Signature',
    ui_card_background: 'linear-gradient(135deg, #2e3340 0%, #0a0b0f 100%)', ui_card_text_color: '#dfe3ea',
    min_income: 80000, invitation_only: false, invitationIncomeConflict: false,
    annual_fee: 0,
    annual_fee_details: ['· Free for life for principal and supplementary cards', '· RM25 Service Tax per card upon activation and each anniversary'],
    apply_url: 'https://www.rhbgroup.com/personal/cards/credit-cards/rhb-visa-signature-credit-card/index.html',
    lounge: {
      visits: '12 per year',
      access: 'Principal and supplementary, each with own quota (not shared); accompanying guests get 25% off walk-in rate in Malaysia, 20% overseas (excl. Shanghai & Beijing)',
      condition: 'Minimum RM500 spend in the previous calendar month',
      network: 'Selected Plaza Premium Lounges in Malaysia',
    },
    insurance: null,
    spending_rewards_cashback: null, spending_rewards_details: null,
    fx_fee_pct: '1', fx_provider: 'Visa',
    curtail: null, vas_list: [],
  },
  {
    id: 'cimb-travel-platinum', card_name: 'Travel Platinum', bank: 'CIMB', tier: 'Platinum', net: 'Platinum',
    ui_card_background: 'linear-gradient(135deg, #3a2f17 0%, #0c0a07 100%)', ui_card_text_color: '#ecdcb4',
    min_income: 24000, invitation_only: false, invitationIncomeConflict: false,
    annual_fee: 0,
    annual_fee_details: ['· Free for life for principal and supplementary cards'],
    apply_url: 'https://www.cimb.com.my/en/personal/day-to-day-banking/cards/credit-card/cimb-travel-platinum-credit-card.html',
    lounge: {
      visits: '4 per year (1 per quarter), plus 12 Sky Lounge visits',
      access: 'Shared between principal & supplementary; children under 2 free; accompanying guests get 50% off walk-in rate',
      condition: 'Min. RM3,000 spend per quarter for Plaza Premium; min. RM2,000 in the same calendar month for Sky Lounge (valid 1 Feb 2026–31 Jan 2027)',
      network: '150+ selected Plaza Premium First & Plaza Premium Lounges worldwide + Sky Lounge & Sky Lounge Xpress, SkyPark Terminal (Subang)',
    },
    insurance: {
      disruptions: null, medical: null, accident: 'Up to RM300,000',
      condition: 'Fare charged to card under MCC 3000 to 3308 (Airlines) or 4511 (Air Carrier, Airlines)',
      underwriter: 'Berjaya Sompo',
      underwriterUrl: 'https://www.cimb.com.my/content/dam/cimb/personal/documents/tnc/cards/credit-card/conventional/berjaya-sompo-air-travel-pa-tnc.pdf',
    },
    spending_rewards_cashback: null, spending_rewards_details: null,
    fx_fee_pct: '1', fx_provider: 'Mastercard',
    curtail: null, vas_list: [],
  },
  {
    id: 'rhb-premier-visa-infinite', card_name: 'Premier Visa Infinite', bank: 'RHB', tier: 'Infinite', net: 'Infinite',
    ui_card_background: 'linear-gradient(135deg, rgba(232,217,168,0) 0%, rgba(232,217,168,0.2) 50%, rgba(232,217,168,0) 100%), #0d1424',
    ui_card_text_color: '#e8d9a8',
    min_income: null, invitation_only: true, invitationIncomeConflict: false,
    annual_fee: 0,
    annual_fee_details: ['· Free for life for principal and supplementary cards'],
    apply_url: 'https://www.rhbgroup.com/personal/cards/credit-cards/rhb-premier-visa-infinite-credit-card/index.html',
    lounge: {
      visits: 'Unlimited with RM100,000 annual spend; otherwise up to 12 per year',
      access: 'Principal and supplementary, each with own quota (not shared); accompanying adults get 25% off walk-in rate in Malaysia, 20% overseas',
      condition: '3 on card activation; +1 per month with min. RM1,000 retail spend in the previous calendar month (max 9); unlimited with RM100,000 cumulative retail spend in the calendar year',
      network: 'Selected Plaza Premium Lounges & Aerotel in Malaysia and overseas (Singapore, Hong Kong, Taiwan, Indonesia, Philippines, Cambodia, Australia, England and more)',
    },
    insurance: {
      disruptions: null, medical: null, accident: null, condition: null,
      underwriter: 'RHB Insurance',
      underwriterUrl: 'https://www.rhbgroup.com/-/media/Assets/Corporate-Website/Document/travel_insurance/visa_infinite_travel_insurance.pdf',
    },
    spending_rewards_cashback: null, spending_rewards_details: null,
    fx_fee_pct: '1', fx_provider: 'Visa',
    curtail: null, vas_list: [],
  },
  {
    id: 'rhb-world-mastercard', card_name: 'World Mastercard', bank: 'RHB', tier: 'World', net: 'World',
    ui_card_background: 'linear-gradient(135deg, #163a31 0%, #08110e 100%)', ui_card_text_color: '#cfe6da',
    min_income: 80000, invitation_only: false, invitationIncomeConflict: false,
    annual_fee: 0,
    annual_fee_details: ['· Free for life for principal and supplementary cards'],
    apply_url: 'https://www.rhbgroup.com/personal/cards/credit-cards/rhb-world-mastercard-credit-card/index.html',
    lounge: {
      visits: '12 per year',
      access: 'Principal and supplementary, each with own quota (not shared); accompanying adults get 25% off walk-in rate in Malaysia, 20% overseas',
      condition: 'Minimum RM500 spend in the previous calendar month',
      network: 'Selected Plaza Premium Lounges in Malaysia',
    },
    insurance: null,
    spending_rewards_cashback: null, spending_rewards_details: null,
    fx_fee_pct: '1', fx_provider: 'Mastercard',
    curtail: null, vas_list: [],
  },
  {
    id: 'rhb-visa-infinite', card_name: 'Visa Infinite', bank: 'RHB', tier: 'Infinite', net: 'Infinite',
    ui_card_background: 'linear-gradient(135deg, rgba(240,220,176,0) 0%, rgba(240,220,176,0.2) 50%, rgba(240,220,176,0) 100%), #2a2114',
    ui_card_text_color: '#f0dcb0',
    min_income: 150000, invitation_only: false, invitationIncomeConflict: false,
    annual_fee: 0,
    annual_fee_details: ['· Waived for Principal and Supplementary'],
    apply_url: 'https://www.rhbgroup.com/personal/cards/credit-cards/rhb-visa-infinite-credit-card/index.html',
    lounge: {
      visits: '(1) Unlimited with RM100,000 annual spend; or\n(2) 12 per year with RM1,000 spend in previous month',
      access: 'Principal and supplementary, each with own quota (not shared); accompanying adults get 25% off walk-in rate in Malaysia, 20% overseas',
      condition: '(1) RM100,000 annual spend; or\n(2) RM1,000 spend in previous month',
      network: 'Selected Plaza Premium Lounges & Aerotel in Malaysia and Singapore',
    },
    insurance: null,
    spending_rewards_cashback: null, spending_rewards_details: null,
    fx_fee_pct: '1', fx_provider: 'Visa',
    curtail: null, vas_list: [],
  },
  {
    id: 'uob-world', card_name: 'World Card', bank: 'UOB', tier: 'World', net: 'World',
    ui_card_background: 'linear-gradient(135deg, #163a31 0%, #08110e 100%)', ui_card_text_color: '#cfe6da',
    min_income: 60000, invitation_only: false, invitationIncomeConflict: false,
    annual_fee: 600,
    annual_fee_details: ['· Waived with RM50,000 annual spend', '· RM150 for Supplementary'],
    apply_url: 'https://www.uob.com.my/personal/cards/credit-cards/uob-world-mastercard.page',
    lounge: {
      visits: '6 per year',
      access: 'Principal only; 50% off walk-in rate for accompanying guests at Plaza Premium Lounge',
      condition: 'Complimentary',
      network: 'Plaza Premium Lounge at KLIA T1 only',
    },
    insurance: null,
    spending_rewards_cashback: null, spending_rewards_details: null,
    fx_fee_pct: '1', fx_provider: 'Mastercard',
    curtail: null, vas_list: [],
  },
  {
    id: 'rhb-platinum-business', card_name: 'Platinum Business', bank: 'RHB', tier: 'Platinum', net: 'Platinum',
    ui_card_background: 'linear-gradient(135deg, #3a2f17 0%, #0c0a07 100%)', ui_card_text_color: '#ecdcb4',
    min_income: 24000, invitation_only: false, invitationIncomeConflict: false,
    annual_fee: 0,
    annual_fee_details: ['· Free for life for principal and supplementary cards'],
    apply_url: 'https://www.rhbgroup.com/personal/cards/credit-cards/rhb-platinum-business-credit-card/index.html',
    lounge: {
      visits: '12 per year',
      access: 'Principal and supplementary, each with own quota (not shared); accompanying adults get 25% off walk-in rate in Malaysia, 20% overseas',
      condition: 'Minimum RM500 spend in the previous calendar month',
      network: 'Selected Plaza Premium Lounges in Malaysia',
    },
    insurance: null,
    spending_rewards_cashback: null, spending_rewards_details: null,
    fx_fee_pct: '1', fx_provider: 'Mastercard',
    curtail: null, vas_list: [],
  },
  {
    id: 'maybank-visa-infinite', card_name: 'Visa Infinite', bank: 'Maybank', tier: 'Infinite', net: 'Infinite',
    ui_card_background: 'linear-gradient(135deg, rgba(240,220,176,0) 0%, rgba(240,220,176,0.2) 50%, rgba(240,220,176,0) 100%), #2a2114',
    ui_card_text_color: '#f0dcb0',
    min_income: 100000, invitation_only: false, invitationIncomeConflict: false,
    annual_fee: 800,
    annual_fee_details: ['· Waived for the first year, and subsequent years with RM80,000 annual spend', '· Waived for up to 4 Supplementary, with RM400 per card thereafter'],
    apply_url: 'https://www.maybank2u.com.my/maybank2u/malaysia/en/personal/cards/credit/maybank_visa_infinite.page',
    lounge: {
      visits: '5 per year (until 31 Dec 2027)',
      access: 'Principal cardmember only; accompanying guests get 20% off walk-in rate',
      condition: 'Complimentary',
      network: 'Plaza Premium Lounges in Malaysia & worldwide + Sky Lounge (Subang Airport)',
    },
    insurance: {
      disruptions: 'Up to RM2,000 for missed connecting flight\nUp to RM2,000 for luggage delay\nUp to RM6,000 for luggage loss',
      medical: null,
      accident: 'Up to RM2 million',
      condition: 'Fare charged to card',
      underwriter: 'Etiqa General Insurance Berhad',
      underwriterUrl: null,
    },
    spending_rewards_cashback: null, spending_rewards_details: null,
    fx_fee_pct: '1', fx_provider: 'Visa',
    curtail: null, vas_list: [],
  },
];

/** one FX-fee disclosure URL per provider — not an Airtable field, hardcoded per the schema notes */
export const FX_PROVIDER_URLS: Record<string, string> = {
  Visa: '#',
  Mastercard: '#',
};
