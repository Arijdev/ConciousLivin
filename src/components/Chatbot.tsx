'use client';
import React, { useState } from 'react';

type Msg = { role: 'user' | 'assistant'; text: string };

const answers: Record<string, string> = {
  'consultation': 'You can book a free consultation from the Consultation page. Tell us your goals and preferred time.',
  'resources': 'Health resources are available in Resource Library; many are free and premium guides have discounted prices.',
  'payment': 'We accept secure online payments; prices update by country/currency automatically.',
  'supplements': 'Premium supplements and health programs are listed on the home page under Products.',
  'contact': 'Use the book consultation form or footer contact links, and our team replies within one business day.',
};

function reply(q: string) {
  const lower = q.toLowerCase();
  for (const k of Object.keys(answers)) {
    if (lower.includes(k)) return answers[k];
  }
  return 'A team member will follow up shortly. Could you share your email and main health goal?';
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', text: 'Hi! Ask me about consultations, resources, pricing, or supplements.' }]);
  const [input, setInput] = useState('');

  const send = async () => {
    if (!input.trim()) return;
    const u = input.trim();
    setMsgs((m) => [...m, { role: 'user', text: u }, { role: 'assistant', text: '...' }]);
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
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="h-64 overflow-y-auto px-3 py-2 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : ''}`}>
                <span className={`inline-block rounded-lg px-3 py-2 ${m.role === 'user' ? 'bg-[#E6F4F1] dark:bg-[#134E4A]' : 'bg-[#F1F5F9] dark:bg-[#1E293B]'}`}>{m.text}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t px-3 py-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} className="flex-1 rounded-lg border px-3 py-2 text-sm" placeholder="Type a question..." />
            <button onClick={send} className="rounded-lg bg-[#0F766E] px-3 py-2 text-sm text-white">Send</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="h-14 w-14 rounded-full bg-[#0F766E] text-2xl text-white">💬</button>
    </div>
  );
}
