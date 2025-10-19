# Faktuur.io

## 🧱 Project Overview

Faktuur.io is a SaaS platform that helps small businesses create and manage quotes and invoices that comply with local regulations. The platform offers PDF generation, automated email notifications, payment tracking, and CRM features.  
The tech stack includes **Next.js 15**, **React 19**, **Hono.js**, **Prisma**, **Zustand**, **Nuqs**, **Zod**, **Shadcn UI**, and **TailwindCSS**.  
The application is deployed on a **VPS with Coolify** and uses **PostgreSQL** in production and **SQLite** locally.

The goal of this file is to guide GitHub Copilot to generate consistent, maintainable, and strongly typed code aligned with the architecture and conventions of Faktuur.io.

---

## 🏗️ Architecture

- **Monolithic repository** (not Turborepo)
- **Frontend**: Next.js 15 + React 19 with Server Components and Server Actions
- **Backend**: Hono.js located under `/api` route
- **ORM**: Prisma with SQLite (local) and PostgreSQL (production)
- **Authentication**: Better-auth handled entirely in Hono backend
- **Styling**: TailwindCSS + Shadcn UI (components inside `/components/ui`)
- **Type checking**: Full strict TypeScript typing enforced
- **Testing**: Playwright for E2E and integration testing
- **PDF generation**: Puppeteer
- **Email sending**: UseSend (depending on environment)

---

## 🧩 Directory Structure

Copilot must respect this folder structure:

```
/faktuur.io
├── .github                               # GitHub-specific files
│   ├── copilot-instructions.md           # This file
│   ├── prompts                           # Example prompts for Copilot
│   └── workflows                         # GitHub Actions workflows
├── README.md                             # Project overview and setup
├── app                                   # Next.js frontend
│   ├── api                               # Hono.js API routes (if any)
│   │   ├── [...route]
│   │   └── auth                          # Better-auth handlers and config
│   ├── dashboard/                        # Dashboard pages and components
│   ├── global.css                        # Global styles
│   ├── layout.tsx                        # Root layout
│   └── page.tsx                          # Home page
├── components                            # Shared React components
│   ├── customs                           # Custom components
│   └── ui                                # UI components
├── generated/                            # Auto-generated files (e.g., Prisma client)
├── hooks/                                # Zustand stores and React hooks
├── lib
│   ├── auth-client.ts                    # Better-auth client helpers
│   ├── auth.ts                           # Auth utilities
│   ├── dal/                              # Frontend DAL (calls backend API)
│   ├── prisma.ts                         # Prisma client for frontend (if needed)
│   └── utils.ts                          # Shared frontend utilities
├── package.json
├── prisma
├── public
├── tailwind.config.ts
├── tests
└── tsconfig.json

```

---

## ⚙️ Coding Conventions

### TypeScript

- Always use **strict typing**.
- Avoid `any`. Prefer `unknown`, `never`, or properly inferred types.
- Use **Zod** for runtime validation.
- Ensure **function return types** are explicitly declared.
- Enforce **immutability**: use `readonly` where possible.
- Follow naming conventions:
  - Classes/Types: `PascalCase`
  - Variables/Functions: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`

### Backend (Hono.js)

- Routes live under `/app/api/`.
- Each route imports from `dal` or `services`, not directly from Prisma.
- Use **dependency injection** and **composition** rather than hard imports.
- Return standardized JSON responses using:
  ```ts
  { success: boolean; data?: T; error?: string }
  ```
- Handle errors gracefully and log them appropriately.
- Use environment variables via `process.env`.
- Add `env.ts` for environment variable schema validation using Zod.
- Separate business logic into services.

### Frontend (Next.js 15 + React 19)

- Use **React Server Components (RSC)** and **Server Actions** instead of API routes.
- Avoid calling the database directly.
- UI logic and display components use **Shadcn UI**.
- Manage state with **Zustand** (no Redux).
- Manage **TanStack Query (formerly React Query)** for data fetching and caching.
- Use **Nuqs** for URL state management.
- Form validation with **Zod** + **react-hook-form**.
- Use TailwindCSS for styling — no CSS-in-JS.
- Keep components small, reusable, and stateless when possible.
- Support dark and light modes via Tailwind configuration.

### Database (Prisma)

- Define models in `prisma/schema.prisma`.
- Use one Prisma client instance under `/lib/prisma.ts`.
- Write all data access through the **Data Access Layer (DAL)**.
- DAL should return typed entities and handle all error mapping.

### Email & PDF

- PDF generation via **Puppeteer**.
- Templates live in `/api/services/pdf/templates`.
- Email sending handled by `useSend` and `React-Email`.
- Emails should include both HTML and plain-text versions.
- Use templating for branding consistency.

---

## 🧠 Copilot Behavior

Copilot should:

- Respect the folder structure and file naming conventions.
- Always propose **TypeScript with strict mode**.
- Suggest **async/await** rather than Promises directly.
- Prefer **functional programming** style over OOP.
- Use modern syntax: optional chaining, nullish coalescing, etc.
- Provide concise, readable code with meaningful variable names.
- Generate comments only when clarity is required (avoid verbosity).
- Suggest **unit and E2E tests** automatically when writing key features.
- Avoid introducing third-party libraries not already part of the stack.
- If you suggest a new library, provide a brief justification.

---

## 🧪 Testing

- Use **Playwright** for end-to-end testing.
- Tests must be placed under `/tests` and follow this naming:

  ```
  /tests/[feature]/[action].spec.ts
  ```

- Test naming convention:

  ```ts
  test.describe('Invoices', () => {
    test('should create an invoice successfully', async ({ page }) => { ... });
  });
  ```

- Prefer data seeding with Prisma in test setup.

---

## 🚀 Deployment

- Deployed using **Coolify** on a VPS.
- Database migrations are run with:

  ```bash
  pnpm dlx prisma migrate deploy
  ```

- Environment files:
  - `.env.local` → SQLite for development
  - `.env.production` → PostgreSQL + live credentials

- Avoid using hardcoded values. Always reference environment variables.
- Use Docker for local and production environments.

---

## 🧭 Example Prompts for Copilot

| Goal                  | Example Prompt                                                                        |
| --------------------- | ------------------------------------------------------------------------------------- |
| Add a new API route   | “Create a Hono route `/api/routes/invoices.ts` to list all invoices using the DAL.”   |
| Create a DAL function | “Write a function in `/api/dal/invoice.ts` to get unpaid invoices.”                   |
| Add a server action   | “Implement a Next.js Server Action to mark an invoice as paid using the backend API.” |
| Generate a PDF        | “Create a Puppeteer-based function to generate a PDF invoice from a React component.” |
| Send an email         | “Implement a service to send a payment reminder email using Resend.”                  |
| Add a test            | “Write a Playwright test to check if a quote can be created and previewed.”           |

---

## 🚫 Forbidden Patterns

You must **never**:

- Access Prisma directly from frontend code.
- Create `/api` that bypass DAL or services.
- Use `fetch()` calls within the backend.
- Suggest non-TypeScript code.
- Use CSS-in-JS, jQuery, or legacy React patterns (like class components).
- Generate untyped objects or unvalidated inputs.

---

## ✅ Summary

You should act as a **TypeScript-first assistant** that writes production-quality, modular, and testable code following these principles:

- Type-safe, validated, and documented.
- RSC and Server Actions only, no Next.js API routes.
- Clear separation between frontend, backend, DAL, and services.
- Predictable architecture compatible with Coolify deployment.

---

Answer me in French
