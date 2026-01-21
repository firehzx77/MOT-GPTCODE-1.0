import { NextResponse } from 'next/server';
import { z } from 'zod';
import { deepseekChat } from '@/lib/deepseek';
import { getScenarioById } from '@/lib/scenarios';
import type { ChatMessage } from '@/lib/types';
import { evaluationSystemPrompt, hintSystemPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

const BodySchema = z.object({
  scenarioId: z.string().min(1),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1)
    })
  ),
  mode: z.enum(['evaluation', 'hint']).default('evaluation')
});

function formatTranscript(msgs: ChatMessage[]) {
  return msgs
    .filter(m => m.role !== 'system')
    .map(m => (m.role === 'assistant' ? `客户: ${m.content}` : `你: ${m.content}`))
    .join('\n');
}

function extractJson(text: string) {
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) throw new Error('Model did not return JSON');
  const slice = text.slice(first, last + 1);
  return JSON.parse(slice);
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = BodySchema.parse(json);
    const scenario = getScenarioById(body.scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: 'Unknown scenarioId' }, { status: 400 });
    }

    const transcript = formatTranscript(body.messages);

    const system = body.mode === 'hint' ? hintSystemPrompt() : evaluationSystemPrompt(scenario);

    const content = await deepseekChat({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `场景：${scenario.title}\n\n对话记录：\n${transcript}` }
      ],
      temperature: body.mode === 'hint' ? 0.2 : 0.3,
      max_tokens: body.mode === 'hint' ? 220 : 900
    });

    const parsed = extractJson(content);
    return NextResponse.json({ data: parsed });
  } catch (err: any) {
    const message = typeof err?.message === 'string' ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
