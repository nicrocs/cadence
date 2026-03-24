import { streamText, UIMessage, CoreMessage } from 'ai'
import { getModel } from '@/lib/ai'
import { auth } from '@clerk/nextjs/server'

// Convert UIMessage (with parts) to CoreMessage (with content string)
function uiMessagesToCoreMessages(messages: UIMessage[]): CoreMessage[] {
  return messages.map(msg => {
    // Extract text from parts
    const textContent = msg.parts
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map(part => part.text)
      .join('\\n')
    
    return {
      role: msg.role as 'user' | 'assistant',
      content: textContent,
    }
  })
}

const SYSTEM_PROMPT = `You are helping the user prepare for a focused 25-minute work session.

Your job is to help them confirm that their intention is clear and achievable in 25 minutes, and that they have everything they need to start.

Ask at most one question per response. Focus on whichever of these is most relevant to their stated intention:

1. Scope — is "done" clearly defined for this session?
2. Dependencies — do they have everything they need to start?
3. Clarity — do they understand the problem well enough to begin?

If their intention is already clear and specific, say so and tell them they're ready. Don't manufacture problems that aren't there.

When they seem ready, end with exactly "You're ready." and nothing else after that.

Keep responses short — 1-3 sentences maximum. This is a quick check-in, not a planning session.`

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { messages, intention, project } = await req.json() as { 
    messages: UIMessage[], 
    intention: string, 
    project?: string 
  }

  const model = await getModel()

  const result = streamText({
    model,
    system: `${SYSTEM_PROMPT}\n\nThe user's intention is: "${intention}"${project ? `\nTheir project is: "${project}"` : ''}`,
    messages: uiMessagesToCoreMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}