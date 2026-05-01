export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_KEY || process.env.VITE_ANTHROPIC_KEY || '';
  const { profile = {}, stock = [] } = req.body || {};

  const stockTxt = stock.length
    ? stock.map(s => `${s.nombre} (${s.cantidad}${s.unidad})`).join(', ')
    : 'sin productos registrados';

  const restricciones = (profile.restricciones || []).join(', ') || 'ninguna';

  const system = `Eres un nutricionista experto. Genera un menú semanal balanceado de 7 días.

Perfil del usuario:
- Nombre: ${profile.nombre || 'Usuario'}
- Objetivo: ${(profile.objetivo || '').replace(/_/g, ' ')}
- Peso actual: ${profile.peso_actual}kg, meta: ${profile.peso_meta}kg
- Restricciones: ${restricciones}

Despensa disponible: ${stockTxt}

REGLAS:
1. Prioriza ingredientes de la despensa cuando sea coherente.
2. Respeta estrictamente las restricciones alimenticias.
3. Adapta porciones y macros al objetivo (déficit/superávit/mantención).
4. Sé específico: nombre del plato + ingredientes principales (máx 12 palabras por comida).
5. Responde SOLO con JSON válido, SIN markdown, SIN texto adicional.

Formato exacto:
{"menu":[{"dia":"Lunes","desayuno":"...","almuerzo":"...","snack":"...","cena":"..."},{"dia":"Martes",...},...]}

Incluye los 7 días en orden: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo.`;

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
        system,
        messages: [{ role: 'user', content: 'Genera mi menú semanal ahora.' }]
      })
    });

    const raw = await response.text();
    if (!response.ok) {
      console.error('Anthropic error:', raw.substring(0, 300));
      return res.status(response.status).json({ error: raw });
    }

    const json = JSON.parse(raw);
    let text = json?.content?.[0]?.text || '';

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error('No JSON found in response:', text.substring(0, 200));
      return res.status(500).json({ error: 'Respuesta IA sin JSON válido' });
    }

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed.menu) || parsed.menu.length === 0) {
      return res.status(500).json({ error: 'JSON sin array de menú' });
    }

    return res.status(200).json({ menu: parsed.menu });
  } catch (e) {
    console.error('generate-menu error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
