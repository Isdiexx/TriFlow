import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.options('/api/chat', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

app.post('/api/chat', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const apiKey = process.env.ANTHROPIC_KEY || process.env.VITE_ANTHROPIC_KEY || '';
  const mockMode = process.env.MOCK_API === 'true' || !apiKey || apiKey.includes('placeholder');

  console.log('[Chat API]');
  console.log('Mock mode:', mockMode);
  console.log('API KEY configured:', apiKey.length > 0 && !apiKey.includes('placeholder'));
  console.log('Messages:', req.body.messages?.length || 0);

  try {
    const payload = {
      model: req.body.model || 'claude-opus-4-1',
      max_tokens: req.body.max_tokens || 1000,
      system: req.body.system || '',
      messages: req.body.messages || []
    };

    // Mock mode para testing sin API key real
    if (mockMode) {
      console.log('[MOCK MODE] Returning simulated response');
      const mockResponse = {
        id: 'msg_' + Date.now(),
        type: 'message',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: '¡Hola! Soy tu asistente de TriFlow. 🌱\n\nAhora estoy funcionando correctamente. Para activar respuestas reales de IA, necesitas configurar tu API key de Anthropic en el archivo `.env`.\n\n¿Cómo puedo ayudarte hoy con tus objetivos de salud y fitness?'
          }
        ],
        model: payload.model,
        stop_reason: 'end_turn',
        usage: {
          input_tokens: 100,
          output_tokens: 50
        }
      };
      return res.status(200).json(mockResponse);
    }

    console.log('Sending real request to Anthropic...');

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
    console.log('Success! Response text:', json?.content?.[0]?.text?.substring(0, 80) + '...');

    return res.status(200).json(json);
  } catch (e) {
    console.error('Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

app.options('/api/generate-menu', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

app.post('/api/generate-menu', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const apiKey = process.env.ANTHROPIC_KEY || process.env.VITE_ANTHROPIC_KEY || '';
  const { profile = {}, stock = [] } = req.body || {};
  const stockTxt = stock.length ? stock.map(s => `${s.nombre} (${s.cantidad}${s.unidad})`).join(', ') : 'sin productos registrados';
  const restricciones = (profile.restricciones || []).join(', ') || 'ninguna';
  const system = `Eres un nutricionista experto. Genera un menú semanal balanceado de 7 días Y una lista de compras inteligente.

Perfil del usuario:
- Nombre: ${profile.nombre || 'Usuario'}
- Objetivo: ${(profile.objetivo || '').replace(/_/g, ' ')}
- Peso actual: ${profile.peso_actual}kg, meta: ${profile.peso_meta}kg
- Restricciones: ${restricciones}

Despensa actual (con cantidades): ${stockTxt}

REGLAS DEL MENÚ:
1. Prioriza ingredientes de la despensa cuando sea coherente.
2. Respeta estrictamente las restricciones alimenticias.
3. Adapta porciones y macros al objetivo (déficit/superávit/mantención).
4. Sé específico: nombre del plato + ingredientes principales (máx 12 palabras por comida).

REGLAS DE LA LISTA DE COMPRAS:
1. Incluye SOLO ingredientes faltantes (no están en la despensa) O cuyo stock es claramente insuficiente para 7 días.
2. Estima cantidades realistas para 1 persona × 7 días.
3. Si la despensa cubre algo, NO lo incluyas.
4. Si la despensa está vacía, sugiere todo lo necesario para los menús.
5. Para cada item indica: nombre, cantidad numérica, unidad (g, ml, unidad, kg, l), y motivo breve.
6. Unidades válidas: g, kg, ml, l, unidad.

Responde SOLO con JSON válido, SIN markdown, SIN texto adicional. Formato exacto:
{"menu":[{"dia":"Lunes","desayuno":"...","almuerzo":"...","snack":"...","cena":"..."},...7 días...],"lista_compra":[{"nombre":"Pollo","cantidad":1400,"unidad":"g","motivo":"Para 4 almuerzos"},...]}

Incluye los 7 días en orden: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 3000, system, messages: [{ role: 'user', content: 'Genera mi menú semanal y lista de compras ahora.' }] })
    });
    const raw = await response.text();
    if (!response.ok) return res.status(response.status).json({ error: raw });
    const json = JSON.parse(raw);
    const text = json?.content?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'Respuesta IA sin JSON válido' });
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed.menu) || !parsed.menu.length) return res.status(500).json({ error: 'JSON sin array de menú' });
    return res.status(200).json({ menu: parsed.menu, lista_compra: Array.isArray(parsed.lista_compra) ? parsed.lista_compra : [] });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.options('/api/generate-training', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

app.post('/api/generate-training', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const apiKey = process.env.ANTHROPIC_KEY || process.env.VITE_ANTHROPIC_KEY || '';
  const { profile = {} } = req.body || {};

  const objetivoTexto = (profile.objetivo || '').replace(/_/g, ' ');
  const edadTexto = profile.edad || 30;

  const system = `Eres un entrenador personal certificado especializado en programación de fuerza y acondicionamiento.

Perfil del usuario:
- Nombre: ${profile.nombre || 'Usuario'}
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
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 3000, system, messages: [{ role: 'user', content: 'Genera mi mesociclo de entrenamiento de 4 semanas ahora.' }] })
    });
    const raw = await response.text();
    if (!response.ok) return res.status(response.status).json({ error: raw });
    const json = JSON.parse(raw);
    const text = json?.content?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'Respuesta IA sin JSON válido' });
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed.sesiones) || !parsed.sesiones.length) return res.status(500).json({ error: 'JSON sin array de sesiones' });
    return res.status(200).json({ sesiones: parsed.sesiones });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║        TriFlow Assistant Server - Running on Port ${PORT}      ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
});
