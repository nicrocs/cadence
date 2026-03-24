import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'

export type AIProvider = 'anthropic' | 'ollama' | 'openai'

export function getProvider() {
  const provider = (process.env.AI_PROVIDER ?? 'anthropic') as AIProvider

  if (provider === 'ollama') {
    const baseURL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
    const ollama = createOpenAI({
      baseURL: `${baseURL}/v1`,
      apiKey: 'ollama', // Ollama doesn't need a real key but the SDK requires one
    })

    // Model resolution happens at call time — see getModel()
    return { provider: 'ollama' as const, client: ollama }
  }

  if (provider === 'openai') {
  // create OpenAI client with API key
  // return the model
    const openAI = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ollama doesn't need a real key but the SDK requires one
    })
    return { provider: 'openai' as const, client: openAI}
}

  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  return { provider: 'anthropic' as const, client: anthropic }
}

export async function getModel() {
  const { provider, client } = getProvider()

  if (provider === 'ollama') {
    const model = process.env.OLLAMA_MODEL

    if (model) return (client as ReturnType<typeof createOpenAI>)(model)

    // Fetch whichever model is currently running
    const baseURL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
    const res = await fetch(`${baseURL}/api/tags`)
    const data = await res.json()
    const running = data?.models?.[0]?.name

    if (!running) throw new Error('No Ollama models found. Make sure Ollama is running.')

    return (client as ReturnType<typeof createOpenAI>)(running)
  }

    if (provider === 'openai') {
      const model = process.env.OPENAI_MODEL || "gpt-4.1-mini"
      return (client as ReturnType<typeof createOpenAI>)(model)
    }


  return (client as ReturnType<typeof createAnthropic>)('claude-sonnet-4-20250514')
}