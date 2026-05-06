export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.ANTHROPIC_KEY || '';
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const payload = {
      model: req.body.model || 'claude-haiku-4-5-20251001',
      max_tokens: req.body.max_tokens || 1000,
      system: req.body.system || '',
      messages: req.body.messages || []
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });

    const raw = await response.text();
    if (!response.ok) {
      console.error('[chat] Anthropic error:', response.status);
      return res.status(response.status).json({ error: 'Error del servicio de IA' });
    }

    const json = JSON.parse(raw);
    return res.status(200).json(json);
  } catch (e) {
    console.error('Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
