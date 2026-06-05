import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const table = searchParams.get('table');
  const offset = searchParams.get('offset');

  if (!table) {
    return Response.json({ error: 'Missing table param' }, { status: 400 });
  }

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    return Response.json({ error: 'AIRTABLE_TOKEN not configured' }, { status: 503 });
  }

  const base = process.env.AIRTABLE_BASE ?? 'appPmEhB9cyajW9Gt';

  let url = `https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}?pageSize=100`;
  if (table === 'Perks') url += '&sort[0][field]=pop&sort[0][direction]=asc';
  if (offset) url += `&offset=${encodeURIComponent(offset)}`;

  try {
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const data = await r.json();
    /* forward Airtable's status so the client can detect auth/not-found errors */
    return Response.json(data, { status: r.status });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
