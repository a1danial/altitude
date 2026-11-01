import type { Card, Lounge, LoungePerks, InsurancePerks, CurtailPerks } from './data';
import { parseVasList } from './vas';

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

async function fetchPage(
  table: string,
  offset?: string,
): Promise<{ records: AirtableRecord[]; offset?: string }> {
  const params = new URLSearchParams({ table });
  if (offset) params.set('offset', offset);
  const res = await fetch(`/api/airtable?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Airtable fetch failed: ${res.status}`);
  return res.json();
}

export async function atFetchAll(table: string): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const data = await fetchPage(table, offset);
    records.push(...(data.records ?? []));
    offset = data.offset;
  } while (offset);
  return records;
}

/** "TBC" and "Unavailable" are both not-yet-researched/not-offered sentinels — treat as blank everywhere */
function blank(v: unknown): string | null {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!s || s === 'TBC' || s === 'Unavailable') return null;
  return s;
}

function blankNum(v: unknown): number | null {
  return typeof v === 'number' ? v : null;
}

export function transformCards(records: AirtableRecord[]): Card[] {
  return records.map(r => {
    const f = r.fields;

    const loungeFields: Array<keyof LoungePerks> = ['visits', 'access', 'condition', 'network'];
    const loungeRaw: LoungePerks = {
      visits: blank(f.lounge_visits),
      access: blank(f.lounge_access),
      condition: blank(f.lounge_condition),
      network: blank(f.lounge_network),
    };
    const lounge = loungeFields.some(k => loungeRaw[k]) ? loungeRaw : null;

    // the underwriter link only makes sense alongside an underwriter name — ignore a
    // stray URL (seen in the data) when the name itself is blank
    const insuranceUnderwriter = blank(f.travel_insurance_underwriter);
    const insuranceRaw: InsurancePerks = {
      disruptions: blank(f.travel_insurance_disruptions),
      medical: blank(f.travel_insurance_medical),
      accident: blank(f.travel_insurance_accident),
      condition: blank(f.travel_insurance_condition),
      underwriter: insuranceUnderwriter,
      underwriterUrl: insuranceUnderwriter ? blank(f.travel_insurance_underwriter_url) : null,
    };
    const insurance = [
      insuranceRaw.disruptions, insuranceRaw.medical, insuranceRaw.accident,
      insuranceRaw.condition, insuranceRaw.underwriter,
    ].some(Boolean) ? insuranceRaw : null;

    const curtailUnderwriter = blank(f.curtail_underwriter);
    const curtailRaw: CurtailPerks = {
      flightDelay: blank(f.curtail_flight_delay),
      flightCancellation: blank(f.curtail_flight_cancellation),
      baggageDelay: blank(f.curtail_baggage_delay),
      condition: blank(f.curtail_condition),
      underwriter: curtailUnderwriter,
      underwriterUrl: curtailUnderwriter ? blank(f.curtail_underwriter_url) : null,
    };
    const curtail = [
      curtailRaw.flightDelay, curtailRaw.flightCancellation, curtailRaw.baggageDelay,
      curtailRaw.condition, curtailRaw.underwriter,
    ].some(Boolean) ? curtailRaw : null;

    const invitationOnly = Boolean(f.invitation_only);
    const rawMinIncome = blankNum(f.min_income);
    // Required invariant: invitation_only ⇒ min_income blank. Flag violations instead of crashing.
    const invitationIncomeConflict = invitationOnly && rawMinIncome != null;
    const minIncome = invitationOnly ? null : rawMinIncome;

    const annualFeeDetails = (blank(f.annual_fee_details) ?? '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    return {
      id: String(f.card_id ?? r.id),
      card_name: String(f.card_name ?? ''),
      bank: String(f.bank ?? ''),
      tier: String(f.tier ?? ''),
      net: String(f.net ?? ''),
      ui_card_background: String(f.ui_card_background ?? ''),
      ui_card_text_color: String(f.ui_card_text_color ?? ''),
      min_income: minIncome,
      invitation_only: invitationOnly,
      invitationIncomeConflict,
      annual_fee: blankNum(f.annual_fee),
      annual_fee_details: annualFeeDetails,
      apply_url: blank(f.apply_url) ?? '#',
      lounge,
      insurance,
      spending_rewards_cashback: blank(f.spending_rewards_cashback),
      spending_rewards_details: blank(f.spending_rewards_details),
      fx_fee_pct: blank(f.fx_fee_pct),
      fx_provider: blank(f.fx_provider),
      curtail,
      vas_list: parseVasList(blank(f.vas_list)),
    };
  });
}

export function transformLounges(records: AirtableRecord[]): Lounge[] {
  return records.map(r => {
    const f = r.fields;
    return {
      id: String(f.lounge_id ?? r.id),
      airport_code: String(f.airport_code ?? ''),
      city: String(f.city ?? ''),
      country: String(f.country ?? ''),
      airport: String(f.airport ?? ''),
      lounge_name: String(f.lounge_name ?? ''),
      location: String(f.location ?? ''),
      terminal: blank(f.terminal),
      opening_hours: blank(f.opening_hours),
      region: String(f.region ?? ''),
      lon: parseFloat(String(f.lon ?? '')),
      lat: parseFloat(String(f.lat ?? '')),
      /* not an Airtable field — populated from the LoungebyCard join in store.loadData */
      cards: [],
    };
  });
}

export interface LoungeAccess {
  cardId: string;
  loungeId: string;
  entitlement: string;
}

export function transformLoungeAccess(records: AirtableRecord[]): LoungeAccess[] {
  return records
    .map(r => ({
      cardId: String(r.fields.card_id ?? ''),
      loungeId: String(r.fields.lounge_id ?? ''),
      entitlement: String(r.fields.entitlement ?? ''),
    }))
    .filter(a => a.cardId && a.loungeId);
}
