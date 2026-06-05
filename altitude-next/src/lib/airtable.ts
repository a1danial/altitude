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
        lounges:   (f.lounge_lounges   as string) ?? null,
      };
    }

    perks.insurance = {
      disruptions: (f['insurance_disruptions'] as string) ?? null,
      medical:     (f['insurance_medical']     as string) ?? null,
      accident:    (f['insurance_accident']    as string) ?? null,
      condition:   (f['insurance_condition']   as string) ?? null,
      underwriter: (f['insurance_underwriter'] as string) ?? null,
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

    /* derive slug id from card name — Airtable's own id field is ignored */
    const slugId = String(f.name ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

    return {
      id:        slugId,
      name:      String(f.name      ?? ''),
      tier:      String(f.tier      ?? ''),
      net:       String(f.net       ?? ''),
      num:       String(f.num       ?? ''),
      theme:     String(f.theme     ?? ''),
      fg:        String(f.fg        ?? ''),
      minSalary: Number(f.minSalary ?? 0),
      fee:       Number(f.fee       ?? 0),
      waiver:    String(f.waiver    ?? ''),
      perks,
    };
  });
}

export function transformLounges(records: AirtableRecord[]): Lounge[] {
  return records.map(r => {
    const f = r.fields as Record<string, unknown>;
    return {
      id:     String(f.id ?? r.id),
      code:   String(f.code   ?? ''),
      city:   String(f.city   ?? ''),
      name:   String(f.name   ?? ''),
      term:   String(f.term   ?? ''),
      net:    String(f.net    ?? ''),
      region: String(f.region ?? ''),
      lon:    parseFloat(String(f.lon ?? '0')) || 0,
      lat:    parseFloat(String(f.lat ?? '0')) || 0,
      amen:   String(f.amen  ?? '').split('|').map(s => s.trim()).filter(Boolean),
      cards:  String(f.cards ?? '').split('|').map(s => s.trim()).filter(Boolean),
    };
  });
}
