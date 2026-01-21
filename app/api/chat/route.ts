import { NextResponse } from 'next/server';
import { z } from 'zod';
import { deepseekChat } from '@/lib/deepseek';
import { getScenarioById } from '@/lib/scenarios';
import type { ChatMessage } from '@/lib/types';
import { roleplaySystemPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

const BodySchema = z.object({
  scenarioId: z.string().min(1),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1)
    })
  )
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = BodySchema.parse(json);
    const scenario = getScenarioById(body.scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: 'Unknown scenarioId' }, { status: 400 });
    }

    const conversation: ChatMessage[] = body.messages;

    // Build OpenAI-compatible messages for DeepSeek
    const messages = [
      { role: 'system' as const, content: roleplaySystemPrompt(scenario) },
      ...conversation
        .filter(m => m.role !== 'system')
        .slice(-40)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    ];

    const reply = await deepseekChat({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages,
      temperature: 0.8,
      max_tokens: 280
    });

    return NextResponse.json({ reply });
  } catch (err: any) {
    const message = typeof err?.message === 'string' ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
