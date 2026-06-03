'use client';

import { useEffect, useRef, useState } from 'react';

// ────────────────────────────────────────────────────────────────────
// CHANGE ME — App title shown at the top of the page.
// ────────────────────────────────────────────────────────────────────
const APP_TITLE = 'Mockup';

type Message = { role: 'user' | 'assistant'; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const next: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.message }]);
    } catch (err) {
      setMessages([
        ...next,
        { role: 'assistant', content: `⚠️ Backend error: ${err instanceof Error ? err.message : String(err)}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen flex-col items-center px-4 py-6">
      <div className="flex w-full max-w-2xl flex-1 flex-col">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">{APP_TITLE}</h1>

        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4"
        >
          {messages.length === 0 && !loading && (
            <p className="text-sm text-neutral-400">Start the conversation…</p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'ml-auto bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-900'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="max-w-[85%] rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-500">
              <span className="animate-pulse">Thinking…</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            disabled={loading}
            className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
