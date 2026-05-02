export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_KEY || process.env.VITE_ANTHROPIC_KEY || '';
  const { profile = {} } = req.body || {};

  const objetivoTexto = (profile.objetivo || '').replace(/_/g, ' ');
  const edadTexto = profile.edad || 30;
  const pais = profile.pais || 'Chile';

  const system = `Eres un entrenador personal certificado especializado en programación de fuerza y acondicionamiento.

Perfil del usuario:
- Nombre: ${profile.nombre || 'Usuario'}
- País: ${pais} (usa vocabulario local: en Chile "polera"/"calza", en Argentina "remera"/"calza", en México "playera"/"licra", etc. Usa términos de ejercicios universales pero el lenguaje natural debe sentirse del país)
- Objetivo: ${objetivoTexto}
- Peso actual: ${profile.peso_actual}kg, Meta: ${profile.peso_meta}kg
- Edad: ${edadTexto} años

Genera un mesociclo de 4 semanas (12 sesiones, 3 días por semana: Lunes, Miércoles, Viernes) con la siguiente estructura:

SEMANA 1 - ACTIVACIÓN:
- Enfoque en técnica, movimientos fundamentales
- 3 series x 12 repeticiones
- Descanso: 60 segundos entre series
- Intensidad: 60-70% del máximo estimado

SEMANA 2 - VOLUMEN:
- Aumenta el volumen total
- 4 series x 10-12 repeticiones
- Descanso: 60 segundos entre series
- Intensidad: 70-75% del máximo estimado

SEMANA 3 - INTENSIDAD:
- Enfoque en cargas pesadas
- 4-5 series x 6-8 repeticiones
- Descanso: 90-120 segundos entre series
- Intensidad: 80-85% del máximo estimado

SEMANA 4 - DESCARGA:
- Recuperación activa
- 2-3 series x 10 repeticiones
- Descanso: 60 segundos entre series
- Intensidad: 60-70% del máximo estimado

Personalización por objetivo:
${objetivoTexto.includes('bajar') ? `
- Incluye trabajo cardiovascular (2-3 minutos al final o entre ejercicios)
- Énfasis en volumen moderado con poco descanso (metabolismo elevado)
- Ejercicios multiarticulares eficientes
- Circuitos que elevan frecuencia cardíaca
` : ''}
${objetivoTexto.includes('musculo') || objetivoTexto.includes('ganancia') ? `
- Enfoque en movimientos compuestos (sentadilla, peso muerto, press)
- Progresión de carga cada semana cuando sea posible
- Ejercicios de aislamiento complementarios
- Volumen y frecuencia altos para hipertrofia
` : ''}
${objetivoTexto.includes('rendimiento') ? `
- Combinación de fuerza, potencia y acondicionamiento
- Ejercicios explosivos y reactivos
- Trabajo cardiovascular de alta intensidad
- Variedad en intensidades y volúmenes
` : ''}

Para cada sesión, proporciona:
- Día de la semana
- Grupo muscular principal
- Descripción detallada: lista de 4-6 ejercicios con sets x reps

Responde SOLO con JSON válido, SIN markdown, SIN texto adicional. Formato exacto:
{"sesiones":[{"semana":1,"dia":"Lunes","grupo":"Cuerpo Completo","descripcion":"Sentadilla 4x10, Peso muerto rumano 3x10, Press de banca 3x10, Remo con barra 3x10, Plancha frontal 3x45s"},{"semana":1,"dia":"Miércoles","grupo":"Cuerpo Completo","descripcion":"Sentadilla búlgara 3x12, Peso muerto 3x10, Press inclinado 3x10, Remo invertido 3x12, Bicicleta 3min"},{"semana":1,"dia":"Viernes","grupo":"Cuerpo Completo","descripcion":"Leg press 4x12, Hiperextensiones 3x12, Press militar 3x10, Jalón lat 3x12, Core: Dead bug 3x10"},{"semana":2,"dia":"Lunes","grupo":"Cuerpo Completo","descripcion":"Sentadilla 4x10, Peso muerto rumano 4x10, Press de banca 4x10, Remo con barra 4x10, Plancha frontal 3x50s"},{"semana":2,"dia":"Miércoles","grupo":"Cuerpo Completo","descripcion":"Sentadilla búlgara 4x10, Peso muerto 4x10, Press inclinado 4x10, Remo invertido 4x10, Bicicleta 4min"},{"semana":2,"dia":"Viernes","grupo":"Cuerpo Completo","descripcion":"Leg press 4x10, Hiperextensiones 4x10, Press militar 4x10, Jalón lat 4x10, Core: Plancha lateral 3x40s cada lado"},{"semana":3,"dia":"Lunes","grupo":"Cuerpo Completo","descripcion":"Sentadilla 5x6, Peso muerto rumano 4x8, Press de banca 4x8, Remo con barra 4x8, Plancha frontal 3x60s"},{"semana":3,"dia":"Miércoles","grupo":"Cuerpo Completo","descripcion":"Sentadilla búlgara 4x8, Peso muerto 5x6, Press inclinado 4x8, Remo invertido 4x8, Bicicleta 5min intenso"},{"semana":3,"dia":"Viernes","grupo":"Cuerpo Completo","descripcion":"Leg press 5x8, Hiperextensiones 4x8, Press militar 4x8, Jalón lat 4x8, Core: Ab wheel 3x8"},{"semana":4,"dia":"Lunes","grupo":"Recuperación","descripcion":"Sentadilla goblet 3x12, Peso muerto rumano 3x12, Push-ups 3x12, Remo TRX 3x12, Movilidad 10min"},{"semana":4,"dia":"Miércoles","grupo":"Recuperación","descripcion":"Step-ups 3x12, Caminata con peso 10min, Press con mancuernas 3x12, Remo con mancuernas 3x12, Yoga 10min"},{"semana":4,"dia":"Viernes","grupo":"Recuperación","descripcion":"Sentadilla Smith 3x12, Extensor de caderas 3x12, Flexiones inclinadas 3x12, Remo bajo 3x12, Estiramiento 10min"}]}`;

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
        max_tokens: 3000,
        system,
        messages: [{ role: 'user', content: 'Genera mi mesociclo de entrenamiento de 4 semanas ahora.' }]
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
    if (!Array.isArray(parsed.sesiones) || parsed.sesiones.length === 0) {
      return res.status(500).json({ error: 'JSON sin array de sesiones' });
    }

    return res.status(200).json({ sesiones: parsed.sesiones });
  } catch (e) {
    console.error('generate-training error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
