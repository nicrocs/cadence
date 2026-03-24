import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { getModel } from '@/lib/ai';

const SYSTEM_PROMPT = `You are helping the user prepare for a focused 25-minute work session.

Your job is to help them confirm that their intention is clear and achievable in 25 minutes, and that they have everything they need to start.

Ask at most one question per response. Focus on whichever of these is most relevant to their stated intention:

1. Scope — is "done" clearly defined for this session?
2. Dependencies — do they have everything they need to start?
3. Clarity — do they understand the problem well enough to begin?

If their intention is already clear and specific, say so and tell them they're ready. Don't manufacture problems that aren't there.

When they seem ready, end with exactly "You're ready." and nothing else after that.

Keep responses short — 1-3 sentences maximum. This is a quick check-in, not a planning session.
Respond to the user in Markdown format.
`

export async function POST(req: Request) {
  const model = await getModel();
const { messages }: { messages: UIMessage[] } = await req.json();
    

  const result = streamText({
    model,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}