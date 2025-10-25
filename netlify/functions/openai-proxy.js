// netlify/functions/openai-proxy.js
export async function handler(event) {
  try {
    // ✅ Prikaži u Netlify logovima da li API key postoji
    console.log("🧩 OpenAI key length:", process.env.OPENAI_API_KEY?.length || "missing");

    const { messages } = JSON.parse(event.body || "{}");

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY in environment");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        // Koristimo stabilan model
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 400,
      }),
    });

    const data = await response.json();

    // ✅ Loguj rezultat u Netlify funkciji
    console.log("🔍 OpenAI response:", JSON.stringify(data, null, 2));

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
