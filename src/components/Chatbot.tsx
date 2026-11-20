'use client';
import React, { useState } from 'react';
import Markdown from 'react-markdown';

type Msg = { role: 'user' | 'assistant'; text: string };

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: 'Hello! I\'m your ConciousLivin Health assistant. Ask me about consultations, guides, supplements, or anything wellness-related.' }
  ]);
  const [input, setInput] = useState('');

  const send = async () => {
    if (!input.trim()) return;
    const u = input.trim();
    setMsgs((m) => [...m, { role: 'user', text: u }, { role: 'assistant', text: '' }]);
    setInput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: u }),
      });
      const data = await res.json();
      setMsgs((m) => {
        const next = [...m];
        next[next.length - 1] = { role: 'assistant', text: data.reply || data.error || 'Sorry, try again.' };
        return next;
      });
    } catch {
      setMsgs((m) => {
        const next = [...m];
        next[next.length - 1] = { role: 'assistant', text: 'Sorry, try again.' };
        return next;
      });
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-80 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B]">
          <div className="flex items-center justify-between rounded-t-2xl bg-[#0F766E] px-4 py-2 text-white">
            <span className="text-sm font-normal">Health Team</span>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20">✕</button>
          </div>
          <div className="h-64 overflow-y-auto px-3 py-2 text-sm space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  m.role === 'user' 
                    ? 'bg-[#0F766E] text-white rounded-br-sm' 
                    : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] rounded-bl-sm'
                }`}>
                  {m.role === 'user' ? (
                    <span className="whitespace-pre-wrap">{m.text}</span>
                  ) : (
                    <Markdown
                      components={{
                        p: ({ children, ...props }) => <p {...props} className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children, ...props }) => <ul {...props} className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children, ...props }) => <ol {...props} className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        li: ({ children, ...props }) => <li {...props} className="leading-relaxed">{children}</li>,
                        strong: ({ children, ...props }) => <strong {...props} className="font-semibold">{children}</strong>,
                        em: ({ children, ...props }) => <em {...props} className="italic">{children}</em>,
                        code: ({ children, ...props }) => <code {...props} className="bg-[#E2E8F0] dark:bg-[#334155] px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                        a: ({ children, ...props }) => <a {...props} className="text-[#0F766E] dark:text-[#14B8A6] underline hover:no-underline">{children}</a>,
                      }}
                    >
                      {m.text}
                    </Markdown>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t px-3 py-2">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }} 
              className="flex-1 rounded-lg border px-3 py-2 text-sm" 
              placeholder="Ask me anything..." 
              autoFocus
            />
            <button onClick={send} className="rounded-lg bg-[#0F766E] px-4 py-2 text-sm text-white hover:bg-[#115E59] transition-colors">Send</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="h-14 w-14 rounded-full bg-[#0F766E] text-2xl text-white shadow-xl hover:bg-[#115E59] transition-colors" aria-label="Open chat">💬</button>
    </div>
  );
}
