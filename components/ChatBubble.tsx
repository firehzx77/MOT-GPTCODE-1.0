'use client';

import type { ChatMessage } from '@/lib/types';

export default function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isYou = msg.role === 'user';
  const isSystem = msg.role === 'system';
  if (isSystem) return null;

  return (
    <div className={`flex ${isYou ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isYou ? (
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center mr-3 shrink-0">
          <span className="material-symbols-outlined text-lg">person</span>
        </div>
      ) : null}
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${isYou ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'}`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
      </div>
      {isYou ? (
        <div className="w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 flex items-center justify-center ml-3 shrink-0">
          <span className="material-symbols-outlined text-lg">support_agent</span>
        </div>
      ) : null}
    </div>
  );
}
