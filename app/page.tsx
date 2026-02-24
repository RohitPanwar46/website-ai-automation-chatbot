"use client";
import { useState } from "react";
import { Bot, X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "assistant" | "user" | "system"; content: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const companyContext = `
    You are an AI assistant for Tech Digital Solutions.

    Company Information:
    - We provide AI chatbot development, website development, and automation services.
    - Pricing:
      Basic AI Chatbot: ₹7,999
      Pro AI Chatbot: ₹15,999
      Websites start at ₹12,000.
    - Working hours: Mon-Sat, 10AM-7PM.
    - Email: rohitpanwar8234@gmail.com
    - Phone: +91 8290727961

    Your role:
    - Greet the user professionally.
    - Answer questions about services and pricing.
    - If user shows interest, ask for their name and email for consultation.
    - Keep responses short and professional.

    Start by greeting the user.
    `;

  const handleOpen = async () => {
    setOpen(true);

    if (messages.length === 0) {
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: companyContext,
              },
            ],
          }),
        });

        if (!res.ok) {
          setError(
            "Free api key Token Exceeded or a server error. Please try again later.",
          );
          setLoading(false);
          return;
        }

        const data = await res.json();

        setMessages([{ role: "assistant", content: data.reply }]);

        setLoading(false);
      } catch (error) {
        setError("Something went wrong. Please try again.");
        console.error("Error fetching chat response:", error);
        setLoading(false);
        return;
      }
    }

    return;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: {
      role: "assistant" | "user" | "system";
      content: string;
    }[] = [...messages, { role: "user", content: input }];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: companyContext },
            ...newMessages,
          ],
        }),
      });

      if (!res.ok) {
        setError(
          "Free api key Token Exceeded or a server error. Please try again later.",
        );
        setLoading(false);
        return;
      }

      const data = await res.json();

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setError("Failed to send message. Please try again.");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const el = messagesEndRef.current;
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-gray-900 relative">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight mb-6">
          AI Chat Assistant
        </h1>

        <p className="text-gray-500 max-w-xl text-lg mb-8">
          Intelligent conversations that help businesses automate support and
          capture leads effortlessly.
        </p>

        <button
          onClick={() => handleOpen()}
          className="px-8 py-3 rounded-full bg-black text-white hover:opacity-80 transition"
        >
          Try Live Chat
        </button>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          {[
            {
              title: "Smart Replies",
              desc: "Understands natural language queries.",
            },
            {
              title: "Lead Capture",
              desc: "Collects customer information automatically.",
            },
            {
              title: "24/7 Support",
              desc: "Always available to assist your users.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CHAT BUTTON */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center hover:scale-105 transition">
          {open ? (
            <X
              onClick={() => setOpen(false)}
              size={26}
              className="text-gray-700"
            />
          ) : (
            <Bot
              onClick={() => handleOpen()}
              size={26}
              className="text-blue-600"
            />
          )}
        </button>
      </div>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed h-[500px] bottom-28 right-8 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center gap-2 font-medium">
            <Bot size={20} className="text-blue-600" />
            AI Assistant
          </div>

          <div className="flex-1 min-h-0 p-4 text-sm overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 ${msg.role === "user" ? "text-right" : ""}`}
              >
                <p
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.content}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {loading && (
              <p className="text-gray-400 animate-pulse">Thinking...</p>
            )}
          </div>

          {error && <p className="text-red-500 text-xs px-3 pb-2">{error}</p>}

          <div className="border-t border-gray-200 p-3 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="ml-2 px-4 rounded-full bg-blue-600 text-white text-sm hover:opacity-90"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
