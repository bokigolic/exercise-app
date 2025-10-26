// ✅ Production-safe version (bez node-fetch)
export async function handler(event) {
  try {
    console.log("✅ openai-proxy called from production");

    const { messages } = JSON.parse(event.body || "{}");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://bokigym.netlify.app/",
        "X-Title": "BokiGym AI Workout Assistant",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    // Debug log
    console.log("📩 OpenRouter response:", JSON.stringify(data).slice(0, 300));

    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("❌ Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
