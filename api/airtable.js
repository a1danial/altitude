export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { table, offset } = req.query;
  if (!table) return res.status(400).json({ error: 'Missing table param' });

  const token = process.env.AIRTABLE_TOKEN;
  const base  = process.env.AIRTABLE_BASE || 'appPmEhB9cyajW9Gt';

  let url = `https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}?pageSize=100`;
  if (table === 'Perks') url += '&sort[0][field]=pop&sort[0][direction]=asc';
  if (offset) url += `&offset=${offset}`;

  try {
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
