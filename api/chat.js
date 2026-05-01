export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.ANTHROPIC_KEY || process.env.VITE_ANTHROPIC_KEY || '';

  console.log('[Vercel Chat API]');
  console.log('API KEY configured:', apiKey.length > 0 && !apiKey.includes('placeholder'));
  console.log('Messages:', req.body.messages?.length || 0);

  try {
    const payload = {
      model: req.body.model || 'claude-haiku-4-5-20251001',
      max_tokens: req.body.max_tokens || 1000,
      system: req.body.system || '',
      messages: req.body.messages || []
    };

    console.log('Sending to Anthropic...');

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
    console.log('Anthropic status:', response.status);

    if (!response.ok) {
      console.error('Anthropic error:', raw.substring(0, 200));
      return res.status(response.status).json({ error: raw });
    }

    const json = JSON.parse(raw);
    console.log('Success! Response length:', json?.content?.[0]?.text?.length);

    return res.status(200).json(json);
  } catch (e) {
    console.error('Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
