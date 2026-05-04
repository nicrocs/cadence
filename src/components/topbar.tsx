import Link from 'next/link'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { buttonVariants } from '@/components/ui/button'

export function TopBar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-shell-border bg-background/70 px-5 py-5 backdrop-blur sm:px-6">
      <div className="min-w-0">
        <Link
          href="/sessions"
          className="inline-flex items-center gap-3 text-[1.35rem] font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80 sm:text-[1.5rem]"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-cool" />
          Cadence
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/sessions/new"
          className={buttonVariants({
            size: 'sm',
            variant: 'outline',
            className:
              'h-10 rounded-[1rem] border-cool/55 bg-background/80 px-5 text-sm text-cool shadow-none hover:bg-cool-muted hover:text-cool-muted-foreground',
          })}
        >
          Log Session
        </Link>
        <SignedOut>
          <SignInButton>
            <button className={buttonVariants({ size: 'sm', variant: 'ghost' })}>
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className={buttonVariants({ size: 'sm' })}>
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  )
}
