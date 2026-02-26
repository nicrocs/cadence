import { createSession } from '@/app/actions/sessions'
import { SessionForm } from '@/components/session-form'

export default function NewSessionPage() {
  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Log a Work Session</h1>
      <SessionForm action={createSession} submitLabel="Save Session" />
    </main>
  )
}