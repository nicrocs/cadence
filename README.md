# Cadence

A work session tracker built around intention, focus, and continuity.

## The Loop

Most productivity tools ask you to log what you did. Cadence asks you to declare what you're *about* to do — and to note exactly where to pick up next time.

1. **Before** — set your intention for the session
2. **During** — focused work, app stays out of the way
3. **After** — log what you accomplished and where to start next time

The pickup note is the core idea. Written at the end of a session while context is fresh, it removes the "where was I?" friction that makes it hard to get back into flow.

## Stack

- [Next.js](https://nextjs.org) (App Router, Turbopack)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io) with [Neon](https://neon.tech) (Postgres)
- [Clerk](https://clerk.com) for auth
- Deployed on [Vercel](https://vercel.com)

## Related

Built as a sibling to [Reprise](https://github.com/nicrocs/reprise), a guitar practice tracker built around the same intention-first loop.

## Getting Started

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

### Environment Variables

```
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### Database

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

The Prisma client is generated locally at `prisma/generated/prisma`. All server action files require `'use server'` to prevent the client from being bundled into the client.

## Project Structure

```
src/
  app/
    (app)/          # authenticated routes with nav
    actions/        # server actions ('use server')
  components/       # shared UI components
  lib/
    prisma.ts       # singleton Prisma client
    constants.ts    # shared constants
prisma/
  schema.prisma
  generated/prisma/ # local client output
```