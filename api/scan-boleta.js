export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_KEY || '';
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const { image, pais } = req.body || {};
  if (!image) return res.status(400).json({ error: 'No image provided' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: `Eres un asistente que analiza fotos de boletas/tickets de supermercado para extraer los productos comprados.

REGLAS:
- Extrae SOLO productos alimenticios (ignora bolsas, descuentos, IVA, totales, etc.)
- Usa nombres comunes del producto, no códigos ni abreviaciones del ticket
- Adapta los nombres al español de ${pais || 'Chile'} (ej: "palta" en Chile, "aguacate" en México)
- Estima cantidad y unidad razonables si no están claras en la boleta
- Unidades válidas: g, kg, ml, L, un (unidades)
- Si un producto aparece con peso (ej: "1.250 kg"), usa esa cantidad exacta
- Si solo dice cantidad (ej: "x2"), usa "un" como unidad
- Si no puedes determinar la cantidad, usa 1 un

Responde SOLO con JSON válido, sin markdown ni texto adicional:
{"productos":[{"nombre":"Nombre del producto","cantidad":1,"unidad":"un"}]}`,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: image.startsWith('/9j') ? 'image/jpeg' : 'image/png', data: image } },
            { type: 'text', text: 'Analiza esta boleta de supermercado y extrae todos los productos alimenticios.' }
          ]
        }]
      })
    });

    const raw = await response.text();
    if (!response.ok) {
      console.error('[scan-boleta] Anthropic error:', response.status, raw);
      return res.status(response.status).json({ error: 'Error analizando la boleta' });
    }

    const json = JSON.parse(raw);
    const text = json?.content?.[0]?.text || '';

    // Extract JSON from response
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'No se pudo interpretar la boleta' });

    const result = JSON.parse(match[0]);
    if (!Array.isArray(result.productos)) return res.status(500).json({ error: 'Formato inválido' });

    return res.status(200).json({ productos: result.productos });
  } catch (e) {
    console.error('[scan-boleta] error:', e.message);
    return res.status(500).json({ error: 'Error procesando la boleta' });
  }
}
