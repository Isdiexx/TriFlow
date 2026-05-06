const GUIAS_PAIS = {
  'Chile': `Usuario chileno. Usa SIEMPRE vocabulario y comida típica chilena:
- Vocabulario: papa (NO batata/patata), palta (NO aguacate), poroto (NO frijol/judía/alubia), choclo (NO maíz/elote), zapallo italiano (NO calabacín/calabacita), zapallo (NO calabaza), durazno (NO melocotón), frutilla (NO fresa), damasco (NO albaricoque), maní (NO cacahuate), porotos verdes (NO ejotes), pimentón (NO pimiento/morrón), ají (NO chile), longaniza, vienesas (NO salchichas), ajo chilote, cilantro, perejil, betarraga (NO remolacha), arvejas (NO guisantes), choclo desgranado, lentejas, garbanzos, charquicán, pernil, cazuela, tortilla de rescoldo, hallulla, marraqueta, sopaipillas
- Platos típicos chilenos a usar a menudo: cazuela de vacuno/pollo, charquicán, porotos granados, pastel de choclo, pastel de papas, ensalada chilena (tomate+cebolla+cilantro), porotos con riendas, lentejas guisadas, arroz con pollo, churrasco, completo, pollo arvejado, pescado al horno con papas, ceviche, empanadas de pino
- Desayuno chileno típico: pan (marraqueta o hallulla) con palta/queso/huevo/jamón, té o café, yogurt con frutas/granola
- "Once" (NO snack/merienda): pan con palta, té con galletas, yogurt con frutas, sándwich
- Almuerzo: comida principal del día, plato fuerte caliente con ensalada
- Cena: liviana, suele ser pan con algo o plato pequeño
- Acompañamientos: arroz graneado, papas cocidas/al horno, ensalada chilena, puré
- Evita términos extranjeros: NO smoothie (di "batido"), NO bowl (di "plato"), NO wraps (di "tortillas con relleno")`,
  'Argentina': `Usuario argentino. Usa vocabulario y comida típica argentina:
- Vocabulario: papa, palta, frutilla, durazno, ananá, choclo, calabaza, zapallito, ají morrón, arvejas, porotos, batata (camote), maní, queso cremoso, dulce de leche, mate, facturas, medialunas, milanesa
- Platos típicos: milanesa con puré, asado, empanadas (carne, jamón y queso), pastel de papas, locro, guiso de lentejas, polenta, ñoquis, tarta de verdura, suprema, matambre, chorizo a la pomarola
- Desayuno típico: mate o café con leche con tostadas, medialunas, facturas
- "Merienda" (NO snack): mate con bizcochos, café con tostadas, sándwich de miga
- Almuerzo: principal del día, carne con guarnición o pasta los domingos
- Cena: tarde, abundante o liviana según familia`,
  'Perú': `Usuario peruano. Usa vocabulario y comida típica peruana:
- Vocabulario: papa (¡muchísimas variedades!), palta, choclo (mote), camote, ají amarillo/limo/panca, rocoto, culantro (cilantro), kion (jengibre), sillao (salsa de soya), arveja, frejol, pallar, quinua, cancha
- Platos típicos: ceviche, ají de gallina, lomo saltado, arroz con pollo, papa a la huancaína, causa limeña, tacu tacu, anticuchos, seco de res, escabeche, rocoto relleno, chaufa, tallarín saltado, pollo a la brasa con papas fritas y ensalada
- Desayuno: pan con palta/queso/huevo, jugo de fruta, café o té; quinua o avena
- "Lonche" o merienda: pan, sándwich, fruta, jugo
- Almuerzo: principal y abundante, entrada + plato de fondo`,
  'Colombia': `Usuario colombiano. Usa vocabulario y comida típica colombiana:
- Vocabulario: papa (criolla, sabanera), aguacate, fríjol, mazorca, plátano (verde y maduro fundamental), yuca, arracacha, ahuyama, mora, lulo, maracuyá, guanábana, panela
- Platos típicos: bandeja paisa, arepa (con queso, huevo, etc), ajiaco santafereño, sancocho, frijoles antioqueños, lentejas, sudado de pollo, pollo a la plancha con arroz y patacones, arroz con pollo, mondongo, tamales, empanadas
- Desayuno: arepa con queso/huevo, calentado (arroz+frijoles del día anterior), changua, chocolate con queso, tinto, jugo natural
- "Algo" (merienda): pan/galletas con café o aromática
- Almuerzo: principal, sopa + seco con arroz, principio (frijol/lenteja), proteína, ensalada, jugo`,
  'Venezuela': `Usuario venezolano. Usa vocabulario y comida típica venezolana:
- Vocabulario: aguacate, caraota (frijol negro), maíz/jojoto, plátano (fundamental), yuca, ocumo, ñame, auyama, lechosa (papaya), parchita (maracuyá), cambur (banana), cilantro, ají dulce
- Platos típicos: arepa (rellena de mil cosas), pabellón criollo (caraotas+arroz+carne mechada+plátano), cachapa, hallaca, asado negro, pollo guisado, caraotas refritas, perico, empanadas venezolanas, tequeños
- Desayuno: arepa rellena, perico (huevos revueltos con tomate), empanadas, café con leche, jugo
- Almuerzo: principal, arroz + caraotas + proteína + plátano o ensalada`,
  'México': `Usuario mexicano. Usa vocabulario y comida típica mexicana:
- Vocabulario: jitomate (tomate rojo), tomate verde, aguacate, frijol, elote/maíz, chile (poblano, jalapeño, serrano, chipotle, etc), epazote, cilantro, cebolla morada, nopales, calabacita, ejote, camote, plátano macho, tortilla de maíz/harina
- Platos típicos: tacos, enchiladas, chilaquiles, mole, pozole, tortas, sopes, tlacoyos, frijoles charros, arroz rojo, pollo en salsa verde, tinga de pollo, fajitas, ensalada de nopales, huevos rancheros/divorciados, quesadillas
- Desayuno: huevos (rancheros, divorciados, mexicana, motuleños), chilaquiles, tacos de canasta, tamales, café de olla, atole, jugo
- Comida (almuerzo principal a las 14-15h): sopa + guisado + arroz/frijoles + tortillas
- Cena: liviana, antojitos o sopa`,
  'España': `Usuario español. Usa vocabulario y comida típica española:
- Vocabulario: patata (NO papa), aguacate, judía verde, judías (alubias, fabes, pochas), maíz, calabacín, calabaza, fresa, melocotón, albaricoque, cacahuete, pimiento, guisante, garbanzo, lenteja, jamón, chorizo, queso manchego, aceite de oliva
- Platos típicos: tortilla de patatas, paella, gazpacho, salmorejo, lentejas estofadas, garbanzos con espinacas, fabada, cocido madrileño, pisto, ensaladilla rusa, pollo al ajillo, merluza a la romana, bocadillos
- Desayuno: tostadas con tomate y aceite, café con leche, zumo, fruta
- Almuerzo (14-15h): plato fuerte con legumbres/arroz/pasta, segundo de proteína con guarnición, pan
- Cena (21-22h): más liviana, ensalada, tortilla, pescado`
};

const defaultGuide = `Usuario latinoamericano. Usa vocabulario neutro pero priorizando comida casera, accesible y nutritiva. Evita términos demasiado regionales si no estás seguro.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_KEY || '';
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  const { profile = {}, stock = [] } = req.body || {};

  const stockTxt = stock.length
    ? stock.map(s => `${s.nombre} (${s.cantidad}${s.unidad})`).join(', ')
    : 'sin productos registrados';

  const restricciones = (profile.restricciones || []).join(', ') || 'ninguna';
  const pais = profile.pais || 'Chile';
  const guiaPais = GUIAS_PAIS[pais] || defaultGuide;

  const system = `Eres un nutricionista experto en cocina latinoamericana y mediterránea. Generas menús personalizados, culturalmente relevantes y nutricionalmente balanceados.

═══ LOCALIZACIÓN — CRÍTICO ═══
País del usuario: ${pais}

${guiaPais}

REGLA INQUEBRANTABLE: NUNCA uses palabras o platos típicos de otros países. Si el usuario es chileno, no le hables de "tortillas de maíz", "elote" o "frijoles"; háblale de "papas", "choclo" y "porotos". Esto vale para TODAS las nacionalidades.

═══ PERFIL DEL USUARIO ═══
- Nombre: ${profile.nombre || 'Usuario'}
- Objetivo: ${(profile.objetivo || '').replace(/_/g, ' ')}
- Peso actual: ${profile.peso_actual}kg, meta: ${profile.peso_meta}kg
- Restricciones: ${restricciones}

Despensa actual (con cantidades): ${stockTxt}

═══ REGLAS DEL MENÚ ═══
1. Usa SIEMPRE vocabulario y platos del país del usuario (ver arriba).
2. Prioriza ingredientes de la despensa cuando sea coherente.
3. Respeta estrictamente las restricciones alimenticias.
4. Adapta porciones y macros al objetivo (déficit/superávit/mantención).
5. Sé específico: nombre del plato + ingredientes principales (máx 14 palabras por comida).
6. Variedad: NO repitas el mismo plato más de una vez en la semana.
7. Para Chile usa "Once" en vez de "Snack" o "Merienda". Para Argentina usa "Merienda". Para Colombia "Algo". Para Perú "Lonche". Para México mantén "Snack" o "Antojito". Etc.

═══ REGLAS DE LA LISTA DE COMPRAS ═══
1. Incluye SOLO ingredientes faltantes (no están en la despensa) O cuyo stock es insuficiente para 7 días.
2. Estima cantidades realistas para 1 persona × 7 días.
3. Si la despensa cubre algo, NO lo incluyas.
4. Si la despensa está vacía, sugiere todo lo necesario.
5. Para cada item indica: nombre (con vocabulario local), cantidad numérica, unidad (g, ml, unidad, kg, l), y motivo breve.
6. Unidades válidas: g, kg, ml, l, unidad.

═══ FORMATO DE RESPUESTA ═══
Responde SOLO con JSON válido, SIN markdown, SIN texto adicional. Formato exacto:
{"menu":[{"dia":"Lunes","desayuno":"...","almuerzo":"...","snack":"...","cena":"..."},...7 días...],"lista_compra":[{"nombre":"Pollo","cantidad":1400,"unidad":"g","motivo":"Para 4 almuerzos"},...]}

Incluye los 7 días en orden: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo.
La clave "snack" en el JSON debe contener la merienda/once/algo según el país (mantén la clave "snack" pero el contenido debe usar el término local cuando aplique).`;

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
        messages: [{ role: 'user', content: `Genera mi menú semanal y lista de compras para ${pais} ahora.` }]
      })
    });

    const raw = await response.text();
    if (!response.ok) {
      console.error('[generate-menu] Anthropic error:', response.status);
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
    if (!Array.isArray(parsed.menu) || parsed.menu.length === 0) {
      return res.status(500).json({ error: 'JSON sin array de menú' });
    }

    return res.status(200).json({ menu: parsed.menu, lista_compra: Array.isArray(parsed.lista_compra) ? parsed.lista_compra : [] });
  } catch (e) {
    console.error('generate-menu error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
