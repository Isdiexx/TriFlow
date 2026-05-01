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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║        TriFlow Assistant Server - Running on Port ${PORT}      ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
});
