'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/sessions', label: 'Sessions' },
  { href: '/songs', label: 'Songs' },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="border-b mb-8">
      <div className="max-w-xl mx-auto px-8 h-14 flex items-center justify-between mt-2">
        <Link href="/sessions" className="font-semibold tracking-tight">
          Reprise
        </Link>
        <div className="flex gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm transition-colors',
                pathname.startsWith(link.href)
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}