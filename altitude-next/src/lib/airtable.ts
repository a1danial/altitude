import type { Perk, Card, CardPerks, Lounge } from './data';

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

export function transformPerks(records: AirtableRecord[]): Perk[] {
  return records.map(r => {
    const f = r.fields;
    return {
      id:   String(f.id   ?? ''),
      name: String(f.name ?? ''),
      pop:  Number(f.pop  ?? 0),
      desc: String(f.desc ?? ''),
    };
  });
}

export function transformCards(records: AirtableRecord[]): Card[] {
  return records.map(r => {
    const f = r.fields as Record<string, unknown>;
    const perks: CardPerks = {};

    if (f.lounge_visits) {
      perks.lounge = {
        visits:    (f.lounge_visits    as string) ?? null,
        access:    (f.lounge_access    as string) ?? null,
        condition: (f.lounge_condition as string) ?? null,
        lounges:   (f.lounge_network   as string) ?? null,
      };
    }

    perks.insurance = {
      disruptions: (f['travel_insurance_disruptions'] as string) ?? null,
      medical:     (f['travel_insurance_medical']     as string) ?? null,
      accident:    (f['travel_insurance_accident']    as string) ?? null,
      condition:   (f['travel_insurance_condition']   as string) ?? null,
      underwriter: (f['travel_insurance_underwriter'] as string) ?? null,
    };

    /* note: overseas is stored as "overseas+" in some Airtable bases */
    perks.overseas      = ((f['overseas'] || f['overseas+']) as string | null) ?? null;
    perks.miles         = (f['miles']          as string | null) ?? null;
    perks.transfer      = (f['transfer']       as string | null) ?? null;
    perks.fasttrack     = (f['fasttrack']      as string | null) ?? null;
    perks.hotel         = (f['hotel']          as string | null) ?? null;
    perks.golf          = (f['golf']           as string | null) ?? null;
    perks.concierge     = (f['concierge']      as string | null) ?? null;
    perks.roaming       = (f['roaming']        as string | null) ?? null;
    perks.businessclass = (f['businessclass']  as string | null) ?? null;
    perks.wifi          = (f['wifi']           as string | null) ?? null;
    perks.protection    = (f['protection']     as string | null) ?? null;

    return {
      id:        String(f.card_id   ?? r.id),
      name:      String(f.card_name ?? ''),
      tier:      String(f.tier      ?? ''),
      net:       String(f.net       ?? ''),
      num:       String(f.num       ?? ''),
      theme:     String(f.theme     ?? ''),
      fg:        String(f.fg        ?? ''),
      minSalary: Number(f.min_income ?? 0),
      fee:       Number(f.annual_fee ?? 0),
      waiver:    String(f.annual_fee_details ?? ''),
      perks,
    };
  });
}

export function transformLounges(records: AirtableRecord[]): Lounge[] {
  return records.map(r => {
    const f = r.fields as Record<string, unknown>;
    return {
      id:      String(f.lounge_id   ?? r.id),
      code:    String(f.airport_code ?? ''),
      city:    String(f.city         ?? ''),
      name:    String(f.lounge_name  ?? ''),
      term:    String(f.location     ?? ''),
      airport: String(f.airport      ?? ''),
      country: String(f.country      ?? ''),
      net:     String(f.net          ?? ''),
      region:  String(f.region       ?? ''),
      lon:     parseFloat(String(f.lon ?? '')),
      lat:     parseFloat(String(f.lat ?? '')),
      amen:    String(f.amen ?? '').split('|').map(s => s.trim()).filter(Boolean),
      cards:   [],
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
      cardId:      String(r.fields.card_id     ?? ''),
      loungeId:    String(r.fields.lounge_id   ?? ''),
      entitlement: String(r.fields.entitlement ?? ''),
    }))
    .filter(a => a.cardId && a.loungeId);
}
