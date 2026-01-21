import type { ChatMessage } from '@/lib/types';

type DeepSeekChatRequest = {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
};

type DeepSeekChatResponse = {
  id?: string;
  choices?: Array<{ message?: { role: string; content: string } }>;
  error?: { message?: string; type?: string };
};

export function normalizeMessages(msgs: ChatMessage[]) {
  return msgs
    .filter(m => m.role === 'system' || m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role, content: m.content }));
}

export async function deepseekChat(req: DeepSeekChatRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('Missing DEEPSEEK_API_KEY');
  }
  const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1').replace(/\/$/, '');
  const url = `${baseUrl}/chat/completions`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(req)
  });

  let json: DeepSeekChatResponse;
  try {
    json = (await res.json()) as DeepSeekChatResponse;
  } catch {
    throw new Error(`DeepSeek API returned non-JSON response (status ${res.status})`);
  }

  if (!res.ok) {
    const msg = json?.error?.message || `DeepSeek API error (status ${res.status})`;
    throw new Error(msg);
  }

  const content = json?.choices?.[0]?.message?.content;
  if (!content) throw new Error('DeepSeek API returned empty content');
  return content;
}
