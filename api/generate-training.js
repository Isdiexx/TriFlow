const HORARIO_DIAS = {
  2: ["Lunes","Jueves"],
  3: ["Lunes","Miércoles","Viernes"],
  4: ["Lunes","Martes","Jueves","Viernes"],
  5: ["Lunes","Martes","Miércoles","Jueves","Viernes"],
  6: ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_KEY || '';
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  const { profile = {} } = req.body || {};

  const objetivoTexto = (profile.objetivo || '').replace(/_/g, ' ');
  const edadTexto = profile.edad || 30;
  const pais = profile.pais || 'Chile';

  // Días de entrenamiento por semana (2-6, default 3)
  const diasSemana = Math.min(6, Math.max(2, parseInt(profile.dias_entrenamiento) || 3));
  const diasPlan = HORARIO_DIAS[diasSemana];
  const totalSesiones = 4 * diasSemana;
  const diasStr = diasPlan.join(', ');

  // Orden de sesiones: Sem1·Día1, Sem1·Día2... Sem4·DíaN
  const ordenSesiones = [1,2,3,4].flatMap(sem =>
    diasPlan.map(dia => `Sem${sem}·${dia}`)
  ).join(', ');

  // Ejemplo dinámico del formato esperado (solo primeras 2 entradas)
  const exEj1 = diasPlan[0];
  const exEj2 = diasPlan[1] || diasPlan[0];
  const ejemploJson = `{"sesiones":[{"semana":1,"dia":"${exEj1}","grupo":"Cuerpo Completo","descripcion":"Sentadilla 4x10, Peso muerto rumano 3x10, Press de banca 3x10, Remo con barra 3x10, Plancha frontal 3x45s"},{"semana":1,"dia":"${exEj2}","grupo":"Cuerpo Completo","descripcion":"Sentadilla búlgara 3x12, Peso muerto 3x10, Press inclinado 3x10, Remo invertido 3x12"},...(${totalSesiones} sesiones totales)]}`;

  // Recomendaciones de estructura según frecuencia
  let estructuraDias = '';
  if (diasSemana === 2) {
    estructuraDias = `Con 2 días: sesiones de cuerpo completo enfocadas en los movimientos más eficientes. Prioriza compuestos (sentadilla, press, jalón/remo). Añade trabajo cardiovascular al final de cada sesión.`;
  } else if (diasSemana === 3) {
    estructuraDias = `Con 3 días: cuerpo completo en cada sesión con variación de estímulos. Día 1: dominante pierna+push, Día 2: dominante cadera+pull, Día 3: mixto+core.`;
  } else if (diasSemana === 4) {
    estructuraDias = `Con 4 días: divide en Upper/Lower o Push/Pull. Lunes-Martes: tren superior e inferior. Jueves-Viernes: repetición con variaciones. Mayor volumen por sesión.`;
  } else if (diasSemana === 5) {
    estructuraDias = `Con 5 días: puede ser PPL (Push/Pull/Legs) + 2 sesiones extra, o Upper/Lower 2x + Full Body. Distribuye el volumen para evitar sobreentrenamiento.`;
  } else if (diasSemana === 6) {
    estructuraDias = `Con 6 días: PPL repetido (Push A/B, Pull A/B, Legs A/B) o Upper/Lower 3x. Deja al menos 1 día de descanso completo. Gestiona bien la fatiga acumulada en Sem 3.`;
  }

  const system = `Eres un entrenador personal certificado especializado en programación de fuerza y acondicionamiento.

Perfil del usuario:
- Nombre: ${profile.nombre || 'Usuario'}
- País: ${pais}
- Objetivo: ${objetivoTexto}
- Peso actual: ${profile.peso_actual}kg, Meta: ${profile.peso_meta}kg
- Edad: ${edadTexto} años
- Días de entrenamiento disponibles: ${diasSemana} días por semana (${diasStr})

═══ ESTRUCTURA DEL MESOCICLO ═══
Genera un mesociclo de 4 semanas (${totalSesiones} sesiones en total, ${diasSemana} días por semana).
Días de entrenamiento de este usuario: ${diasStr}

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

═══ ESTRUCTURA POR FRECUENCIA ═══
${estructuraDias}

═══ PERSONALIZACIÓN POR OBJETIVO ═══
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

═══ REGLAS DE GENERACIÓN ═══
- Genera EXACTAMENTE ${totalSesiones} sesiones, en este orden: ${ordenSesiones}
- Para cada sesión: día de la semana, grupo muscular principal, 4-6 ejercicios con sets×reps
- NO repitas el mismo grupo de ejercicios idéntico en la misma semana
- Responde SOLO con JSON válido, SIN markdown, SIN texto adicional

Formato (continúa hasta las ${totalSesiones} sesiones):
${ejemploJson}`;

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
        max_tokens: 5000,
        system,
        messages: [{ role: 'user', content: `Genera mi mesociclo de ${diasSemana} días por semana, 4 semanas (${totalSesiones} sesiones totales): ${diasStr}.` }]
      })
    });

    const raw = await response.text();
    if (!response.ok) {
      console.error('[generate-training] Anthropic error:', response.status);
      return res.status(response.status).json({ error: 'Error del servicio de IA' });
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

    console.log(`[generate-training] ${diasSemana} días/sem → ${parsed.sesiones.length} sesiones generadas`);
    return res.status(200).json({ sesiones: parsed.sesiones });
  } catch (e) {
    console.error('generate-training error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
