# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Architecture Overview

This is a Next.js 16.0 customer management application with Supabase backend. The UI is in Portuguese (Brazilian).

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS v4 + Radix UI primitives + shadcn/ui components
- **Forms**: react-hook-form with Zod validation
- **Package Manager**: pnpm

### Project Structure

```
app/
├── page.tsx              # Main dashboard (protected, lists customers)
├── login/page.tsx        # Login page
├── actions.ts            # Server actions for customer CRUD
└── actions/auth.ts       # Authentication server actions

components/
├── customer-table.tsx    # Customer list with pagination
├── customer-dialog.tsx   # Create/edit customer modal
├── search-bar.tsx        # Customer search
├── ui/                   # shadcn/ui components

lib/
├── supabase/
│   ├── server.ts         # Server-side Supabase clients (createClient, createServiceClient)
│   └── client.ts         # Browser Supabase client
├── types.ts              # TypeScript types (Customer interface)
└── utils/                # Utility functions (phone-mask)

hooks/
└── use-toast.ts          # Toast notification hook
```

### Authentication Flow
- Cookie-based session (`session_user`)
- `requireAuth()` function in `app/actions/auth.ts` protects routes
- Password hashing with SHA-256 via Web Crypto API
- Users stored in Supabase `users` table

### Data Model
- **Customer**: id, name, email, phone (nullable), status ("ativo"/"inativo"), created_at
- **User**: username, password_hash

### Key Patterns
- Server Components for data fetching (main page fetches customers server-side)
- Server Actions for mutations (`createCustomer`, `updateCustomer`, `deleteCustomer`)
- `createServiceClient()` uses service role key for admin operations
- Brazilian phone format: (99) 99999-9999

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`