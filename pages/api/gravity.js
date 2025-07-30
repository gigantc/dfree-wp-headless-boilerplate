export default async function handler(req, res) {
  const { id } = req.query;

  // WP username and app password
  // or your WP username
  const username = 'superadmin';
  // or app password
  const password = '348Y 1i46 uuI9 8uJm HTgU ixJT';

  const url = `http://rrheadless.local/wp-json/gf/v2/forms/${id}`;
  const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const wpRes = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    });
    const data = await wpRes.json();
    res.status(wpRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch form', details: err.message });
  }
}