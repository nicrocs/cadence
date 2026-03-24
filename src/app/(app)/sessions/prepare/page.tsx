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
  const [session, setSession] = useState<ActiveSession | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [hasInitialized, setHasInitialized] = useState(false)

  // Load session on client-side only to avoid hydration mismatch
  useEffect(() => {
    const loadedSession = getActiveSession()
    setSession(loadedSession)
    if (!loadedSession) {
      router.replace('/sessions/new')
    }
  }, [router])

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

  // Initialize with opening message
  useEffect(() => {
    if (session?.intention && messages.length === 0 && !hasInitialized) {
      setHasInitialized(true)
      setMessages([
        {
          id: 'opening',
          role: 'assistant',
          parts: [{ type: 'text', text: `You want to: "${session.intention}". Let me ask you one thing before you start.` }],
        },
      ])
    }
  }, [session?.intention, messages.length, setMessages, hasInitialized])

  // Trigger AI to ask its question after opening message is set
  useEffect(() => {
    if (hasInitialized && messages.length === 1 && messages[0]?.id === 'opening') {
      // Send a hidden message to trigger the AI to respond
      sendMessage({ text: 'What would you like to know before I start?' })
    }
  }, [hasInitialized, messages, sendMessage])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Detect if AI has said "You're ready."
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
    <main className="max-w-lg mx-auto p-8 flex flex-col gap-6 pb-32">
      {/* Header */}
      <div>
        {session.projectName && (
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-1">
            {session.projectName}
          </p>
        )}
        <p
          className="text-base font-medium text-foreground leading-snug"
          style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '0.75rem' }}
        >
          {session.intention}
        </p>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === 'assistant'
                ? 'text-foreground'
                : 'text-muted-foreground text-right'
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

      {/* Input */}
      {!isReady && (
        <form
          onSubmit={handleSubmit}
          className="fixed bottom-20 left-0 right-0 max-w-lg mx-auto px-8 flex gap-2"
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

      {/* Start timer — always visible, prominent when ready */}
      <div className="fixed bottom-6 left-0 right-0 max-w-lg mx-auto px-8">
        <Button
          onClick={handleStart}
          size="lg"
          className="w-full"
          variant={isReady ? 'default' : 'outline'}
        >
          {isReady ? "I'm ready — start the timer" : 'Skip — start timer now'}
        </Button>
      </div>
    </main>
  )
}