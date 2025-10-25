import React, { useState } from "react";

export default function AIWorkoutAssistant() {
  const [mode, setMode] = useState("workout");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hi! I'm your AI Workout Assistant. Choose a mode below or tell me your goal!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 Mode context
  const modePrompts = {
    workout:
      "You are a certified personal trainer specializing in strength, hypertrophy, and endurance training. Provide detailed and safe workout plans.",
    nutrition:
      "You are a nutrition coach who designs meal plans for specific goals (fat loss, muscle gain, or balanced diet). Include calories, macros, and timing.",
    progress:
      "You are a motivational fitness coach who analyzes progress and gives weekly guidance, recovery tips, and consistency strategies.",
  };

  // 💾 Save text file
  const saveAsTxt = (content, filename = "plan.txt") => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/.netlify/functions/openai-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: modePrompts[mode] },
            ...newMessages.map((m) => ({
              role: m.role,
              content: m.text,
            })),
          ],
        }),
      });

      const data = await response.json();
      const reply =
        data?.choices?.[0]?.message?.content?.trim() ||
        "⚠️ Sorry, I didn’t get that. Try again.";

      setMessages([...newMessages, { role: "assistant", text: reply }]);
    } catch (error) {
      console.error("AI error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: "⚠️ Connection error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-10 min-h-[70vh] flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold text-center mb-4">
          AI Workout Assistant 🤖
        </h1>

        {/* --- MODE SWITCHER --- */}
        <div className="flex justify-center gap-3 mb-6">
          {[
            { id: "workout", label: "💪 Workouts" },
            { id: "nutrition", label: "🥗 Nutrition" },
            { id: "progress", label: "📈 Progress" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setMode(btn.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                mode === btn.id
                  ? "bg-blue-600 text-white border-blue-500 shadow"
                  : "bg-white/10 text-slate-300 hover:bg-white/20 border-white/20"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* --- CHAT BOX --- */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 h-[60vh] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`inline-block whitespace-pre-line px-4 py-2 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {msg.text}
              </p>

              {/* 💾 Save button samo za AI odgovore */}
              {msg.role === "assistant" && msg.text.length > 20 && (
                <div className="mt-1">
                  <button
                    onClick={() => saveAsTxt(msg.text, `ai_${mode}_plan.txt`)}
                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    💾 Save this plan
                  </button>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <p className="text-gray-400 italic text-center mt-2">Thinking…</p>
          )}
        </div>
      </div>

      {/* --- INPUT --- */}
      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${mode}...`}
          className="flex-grow border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </section>
  );
}
