import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-3 py-3 sm:px-5 sm:py-6">
      <div className="flex min-h-[calc(100vh-1.5rem)] flex-1 flex-col overflow-hidden rounded-[2rem] border border-shell-border bg-shell text-shell-foreground shadow-[0_18px_48px_-36px_rgba(32,58,108,0.28)] backdrop-blur md:min-h-[calc(100vh-3rem)]">
        <TopBar />
        <div className="flex flex-1 flex-col md:flex-row">
          <Sidebar />
          <main className="min-w-0 flex-1 p-5 sm:p-7 md:p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
