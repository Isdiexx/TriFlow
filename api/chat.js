export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_KEY || process.env.VITE_ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        system: req.body.system || "",
        messages: req.body.messages || []
      })
    });
    const json = await response.json();
    const text = json?.content?.[0]?.text || json?.error?.message || "Sin respuesta";
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ text: "Error: " + e.message });
  }
}
