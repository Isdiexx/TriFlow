export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  const apiKey = process.env.ANTHROPIC_KEY || process.env.VITE_ANTHROPIC_KEY || "";
  console.log("API KEY exists:", apiKey.length > 0, "length:", apiKey.length);
  console.log("Request body keys:", Object.keys(req.body));
  console.log("Messages count:", req.body.messages?.length);
  try {
    const payload = {
      model: "claude-3-5-sonnet-latest",
      max_tokens: 500,
      system: req.body.system || "",
      messages: req.body.messages || []
    };
    console.log("Sending to Anthropic:", JSON.stringify(payload).substring(0, 200));
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(payload)
    });
    const raw = await response.text();
    console.log("Anthropic raw response:", raw.substring(0, 500));
    const json = JSON.parse(raw);
    return res.status(200).json(json);
  } catch (e) {
    console.log("Error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
