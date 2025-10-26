import React, { useState, useRef, useEffect } from "react";
import { Loader2, Send, Mic, Sparkles, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIWorkoutAssistant() {
  const [mode, setMode] = useState("workout");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hey there! I’m  AI Coach  — your personal fitness assistant. Ready to start?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [toast, setToast] = useState(false);
  const chatRef = useRef(null);

  // 🧠 Mode-specific prompts
  const modePrompts = {
    workout:
      "You are a certified personal trainer specializing in strength, hypertrophy, and endurance training. Provide detailed and safe workout plans.",
    nutrition:
      "You are a nutrition coach who designs meal plans for fat loss, muscle gain, or balanced diet. Include calories, macros, and timing.",
    progress:
      "You are a motivational coach who analyzes progress and provides recovery tips, consistency advice, and weekly improvement insights.",
  };

  // 🗑️ Clear history on refresh
  useEffect(() => {
    localStorage.removeItem("aiChatHistory");
  }, []);

  // 🕓 Auto-scroll
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // 🎬 Intro fade
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const saveAsTxt = (content, filename = "plan.txt") => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async (prompt = null) => {
    const message = prompt || input;
    if (!message.trim()) return;

    const newMessages = [...messages, { role: "user", text: message }];
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
            ...newMessages.map((m) => ({ role: m.role, content: m.text })),
          ],
        }),
      });
      const data = await response.json();
      const reply =
        data?.choices?.[0]?.message?.content?.trim() ||
        "⚠️ Sorry, I didn’t catch that. Try again.";

      setMessages([...newMessages, { role: "assistant", text: reply }]);
      if (reply.toLowerCase().includes("plan")) {
        setToast(true);
        setTimeout(() => setToast(false), 3000);
      }
    } catch (error) {
      console.error("AI error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", text: "⚠️ Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "👋 Chat cleared. Hi again! I'm Coach BG AI — ready to help you restart.",
      },
    ]);
  };

  // 🎯 Quick prompts by mode
  const quickPrompts = {
    workout: [
      "Create a 3-day fat loss plan",
      "Show me upper body dumbbell workout",
      "Full-body routine for home training",
    ],
    nutrition: [
      "Suggest a high-protein breakfast",
      "Make a post-workout meal plan",
      "Create a 1,800 kcal fat loss menu",
    ],
    progress: [
      "Analyze my last week’s progress",
      "Give me recovery advice",
      "How to stay consistent long-term",
    ],
  };

  // 🎨 Dynamic background
  const modeBg = {
    workout: "from-blue-900/30 via-purple-900/20 to-black",
    nutrition: "from-green-900/30 via-emerald-800/20 to-black",
    progress: "from-pink-900/30 via-purple-900/20 to-black",
  };

  return (
    <section
      className={`relative container mx-auto px-4 py-10 min-h-[90vh] flex flex-col transition-all duration-700 bg-gradient-to-b ${modeBg[mode]}`}
    >
      {/* INTRO SCREEN */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center bg-black/90 backdrop-blur-xl"
          >
            <Sparkles className="w-10 h-10 text-blue-400 animate-pulse mb-3" />
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome 💪💪💪
            </h2>
            <p className="text-slate-300">Loading your AI Fitness Session...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            AI Workout Assistant
          </h1>
          <p className="text-slate-400 text-sm"></p>
        </div>
        <button
          onClick={clearChat}
          title="Clear chat"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* MODE SWITCHER */}
      <div className="flex justify-center gap-3 mb-4">
        {[
          { id: "workout", label: "💪 Workouts" },
          { id: "nutrition", label: "🥗 Nutrition" },
          { id: "progress", label: "📈 Progress" },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setMode(btn.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border backdrop-blur-md transition-all duration-200 ${
              mode === btn.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md border-blue-500"
                : "bg-white/10 text-slate-300 hover:bg-white/20 border-white/10"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* STATUS */}
      <div className="flex justify-center items-center gap-2 mb-3 text-xs text-slate-400">
        <div
          className={`w-2 h-2 rounded-full ${
            loading ? "bg-blue-400 animate-pulse" : "bg-green-400"
          }`}
        />
        {loading ? "Coach BG is thinking..." : "Online"}
      </div>

      {/* CHAT BOX */}
      <div
        ref={chatRef}
        className="flex-1 bg-black/40 border border-white/10 rounded-2xl shadow-inner backdrop-blur-md p-5 overflow-y-auto"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`mb-5 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl leading-relaxed whitespace-pre-line text-sm sm:text-base ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-white/10 text-slate-100 border border-white/10"
              }`}
            >
              {msg.text}
              {msg.role === "assistant" && msg.text.length > 30 && (
                <button
                  onClick={() => saveAsTxt(msg.text, `ai_${mode}_plan.txt`)}
                  className="block mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  💾 Save this plan
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-center mt-4">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        )}
      </div>

      {/* QUICK PROMPTS */}
      {!loading && (
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {quickPrompts[mode].map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg transition border border-white/10"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div className="mt-5 flex items-center gap-2 bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${mode}...`}
          className="flex-grow bg-transparent text-slate-100 placeholder-slate-400 px-4 py-2 focus:outline-none text-sm sm:text-base"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          title="Voice mode (coming soon)"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <Mic size={18} />
        </button>
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm"
          ></motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
