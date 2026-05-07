import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nombre, email, especialidad } = req.body || {};

  // Validaciones
  if (!nombre || !email || !especialidad) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  if (nombre.length > 100 || email.length > 100 || especialidad.length > 100) {
    return res.status(400).json({ error: 'Campos demasiado largos' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://uiktwbtwzotqduzwtjcb.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

    if (!supabaseKey) {
      // Fallback: usar REST API directo con anon key hardcodeada (es publishable, seguro)
      const anonKey = 'sb_publishable_ONXQyJvXKUIUqppaWnZG4w_epX1u7ml';
      const response = await fetch(`${supabaseUrl}/rest/v1/profesionales_preregistro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          nombre: nombre.trim().slice(0, 100),
          email: email.trim().toLowerCase().slice(0, 100),
          especialidad: especialidad.trim().slice(0, 100),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (data?.code === '23505') {
          return res.status(409).json({ error: 'Este email ya está pre-registrado' });
        }
        console.error('[pro-registro] Supabase error:', response.status, data);
        return res.status(500).json({ error: 'Error al registrar' });
      }
      return res.status(200).json({ ok: true });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('profesionales_preregistro').insert({
      nombre: nombre.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 100),
      especialidad: especialidad.trim().slice(0, 100),
    });

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Este email ya está pre-registrado' });
      }
      console.error('[pro-registro] Insert error:', error);
      return res.status(500).json({ error: 'Error al registrar' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[pro-registro] error:', e.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
