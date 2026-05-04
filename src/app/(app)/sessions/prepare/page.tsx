'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getActiveSession, saveActiveSession, ActiveSession } from '@/lib/active-session'

export default function PreparePage() {
  const router = useRouter()
  const [session] = useState<ActiveSession | null>(() => {
    if (typeof window === 'undefined') return null
    return getActiveSession()
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const hasInitializedRef = useRef(false)
  const hasPromptedRef = useRef(false)

  useEffect(() => {
    if (!session) {
      router.replace('/sessions/new')
    }
  }, [router, session])

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/prepare',
      body: {
        intention: session?.intention,
        project: session?.projectName,
      },
    }),
    onFinish: ({ message }) => {
      // Persist conversation to localStorage
      const current = getActiveSession()
      if (current) {
        const textContent = message.parts
          .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
          .map(part => part.text)
          .join('')
        
        saveActiveSession({
          ...current,
          prepConversation: [
            ...(current.prepConversation ?? []),
            { role: 'assistant', content: textContent },
          ],
        })
      }
    },
  })

  useEffect(() => {
    if (session?.intention && messages.length === 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true
      setMessages([
        {
          id: 'opening',
          role: 'assistant',
          parts: [{ type: 'text', text: `You want to: "${session.intention}". Let me ask you one thing before you start.` }],
        },
      ])
    }
  }, [session?.intention, messages.length, setMessages])

  useEffect(() => {
    if (
      hasInitializedRef.current &&
      !hasPromptedRef.current &&
      messages.length === 1 &&
      messages[0]?.id === 'opening'
    ) {
      hasPromptedRef.current = true
      sendMessage({ text: 'What would you like to know before I start?' })
    }
  }, [messages, sendMessage])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const lastMessage = messages[messages.length - 1]
  const isReady =
    lastMessage?.role === 'assistant' &&
    lastMessage.parts.some(part => part.type === 'text' && part.text.includes("You're ready."))

  function handleStart() {
    router.push('/sessions/active')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({ text: input })
      setInput('')
    }
  }

  const isLoading = status === 'submitted' || status === 'streaming'

  if (!session) return null

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-32">
      <div className="rounded-[1.5rem] border bg-card/90 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Session Prep
        </p>
        {session.projectName && (
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {session.projectName}
          </p>
        )}
        <p
          className="mt-3 text-base font-medium leading-snug text-foreground"
          style={{ borderLeft: '2px solid var(--cool)', paddingLeft: '0.75rem' }}
        >
          {session.intention}
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-[1.5rem] border bg-background/65 p-5 shadow-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === 'assistant'
                ? 'max-w-[90%] rounded-2xl rounded-bl-md bg-card px-4 py-3 text-foreground shadow-sm'
                : 'ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-cool px-4 py-3 text-cool-foreground'
            }
          >
            <p className="text-sm leading-relaxed">
              {m.parts.map((part, index) =>
                part.type === 'text' ? <span key={index}>{part.text}</span> : null
              )}
            </p>
          </div>
        ))}
        {isLoading && (
          <p className="text-sm text-muted-foreground animate-pulse">...</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!isReady && (
        <form
          onSubmit={handleSubmit}
          className="fixed bottom-20 left-0 right-0 mx-auto flex w-full max-w-3xl gap-2 px-4 sm:px-8"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Reply..."
            disabled={isLoading}
            autoFocus
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </form>
      )}

      <div className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-3xl px-4 sm:px-8">
        <Button
          onClick={handleStart}
          size="lg"
          className="w-full rounded-full shadow-lg"
          variant={isReady ? 'default' : 'outline'}
        >
          {isReady ? "I'm ready — start the timer" : 'Skip — start timer now'}
        </Button>
      </div>
    </div>
  )
}
