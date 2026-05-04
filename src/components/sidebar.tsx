'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const sections = [
  {
    label: 'Focus',
    links: [
      { href: '/sessions', label: 'Sessions' },
      { href: '/projects', label: 'Projects' },
    ],
  },
  {
    label: 'Flow',
    links: [
      { href: '/sessions/new', label: 'Start Session' },
      { href: '/sessions/prepare', label: 'Prepare' },
    ],
  },
]

function isActive(pathname: string, href: string) {
  if (href === '/sessions') return pathname === '/sessions' || pathname.startsWith('/sessions/')
  if (href === '/projects') return pathname === '/projects' || pathname.startsWith('/projects/')
  return pathname === href
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="border-b border-shell-border bg-[color:var(--shell-rail)] md:w-56 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex gap-4 overflow-x-auto px-4 py-4 md:flex-col md:gap-9 md:px-5 md:py-8">
        {sections.map((section) => (
          <div key={section.label} className="min-w-max md:min-w-0">
            <p className="mb-2 px-3 text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
              {section.label}
            </p>
            <div className="flex gap-1 md:flex-col">
              {section.links.map((link) => {
                const active = isActive(pathname, link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-cool-muted text-cool-muted-foreground'
                        : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full transition-colors',
                        active ? 'bg-cool' : 'bg-transparent'
                      )}
                    />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
