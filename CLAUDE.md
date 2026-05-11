@AGENTS.md
# Project Rules

## Stack
- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui
- Supabase

## General Rules
- Always use TypeScript
- Never use `any`
- Prefer server components
- Use client components only when necessary
- Keep components small and reusable

## Styling
- Use Tailwind classes only
- Do not use inline styles
- Use `cn()` utility for conditional classes
- Follow shadcn/ui patterns

## Components
- Shared UI goes into `/components/ui`
- Feature components go into `/components/features`
- Layout components go into `/components/layout`

## Data Fetching
- Use server actions when possible
- Use Supabase server client on server side
- Avoid client-side fetching unless needed

## Supabase
- Use RLS everywhere
- Never expose service role key
- Keep queries typed
- Store DB types in `/types/database.ts`

## Forms
- Use react-hook-form
- Use zod validation
- Validate on both client and server

## Naming
- kebab-case for folders
- PascalCase for components
- camelCase for variables/functions

## Performance
- Optimize images
- Avoid unnecessary client components
- Lazy load heavy components

## Forbidden
- No inline fetch inside components
- No duplicated UI
- No large monolithic files
- No business logic inside UI components