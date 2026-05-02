import express from 'express';
import dotenv from 'dotenv';
import generateMenuHandler from './api/generate-menu.js';
import generateTrainingHandler from './api/generate-training.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '5mb' }));

// CORS preflight handler shared
const cors = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

app.options('*', (req, res) => { cors(req, res); res.status(200).end(); });

/* ── /api/chat ─────────────────────────────────────────── */
app.post('/api/chat', async (req, res) => {
  cors(req, res);
  const apiKey = process.env.ANTHROPIC_KEY || process.env.VITE_ANTHROPIC_KEY || '';
  const mockMode = process.env.MOCK_API === 'true' || !apiKey || apiKey.includes('placeholder');

  console.log('[Chat API] Mock?', mockMode, '| Messages:', req.body.messages?.length || 0);

  try {
    const payload = {
      model: req.body.model || 'claude-haiku-4-5-20251001',
      max_tokens: req.body.max_tokens || 1000,
      system: req.body.system || '',
      messages: req.body.messages || []
    };

    if (mockMode) {
      return res.status(200).json({
        id: 'msg_' + Date.now(),
        type: 'message',
        role: 'assistant',
        content: [{ type: 'text', text: '¡Hola! Soy tu asistente TriFlow en modo mock. Configura ANTHROPIC_KEY en .env para respuestas reales.' }],
        model: payload.model,
        stop_reason: 'end_turn'
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(payload)
    });
    const raw = await response.text();
    if (!response.ok) return res.status(response.status).json({ error: raw });
    return res.status(200).json(JSON.parse(raw));
  } catch (e) {
    console.error('Chat error:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

/* ── /api/generate-menu (reusa handler de Vercel) ──────── */
app.post('/api/generate-menu', (req, res) => generateMenuHandler(req, res));

/* ── /api/generate-training (reusa handler de Vercel) ─── */
app.post('/api/generate-training', (req, res) => generateTrainingHandler(req, res));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║        TriFlow Server - Listening on port ${PORT}              ║`);
  console.log(`║        Endpoints: /api/chat, /api/generate-menu,          ║`);
  console.log(`║                   /api/generate-training                   ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
});
