# Onti Garage

Internal maintenance and parts tracking system for **Onti Banden**.

The full product spec lives in [`.kiro/specs/onti-garage/`](./.kiro/specs/onti-garage):

- [`requirements.md`](./.kiro/specs/onti-garage/requirements.md) — what we're building and why
- [`design.md`](./.kiro/specs/onti-garage/design.md) — tech stack, data model, hosting
- [`tasks.md`](./.kiro/specs/onti-garage/tasks.md) — phased task plan

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS 3** + custom shadcn-style components
- **Prisma 6** + **PostgreSQL 16** (with `pg_trgm` for fuzzy plate/VIN search)
- **Auth.js v5** credentials provider (added in PR #3)
- **Docker Compose** for production hosting on a Hostinger VPS

## Local development

Requires Node 20+ and pnpm 11+ (or use `corepack enable`). Docker is needed
to run the local Postgres container.

```bash
pnpm install
cp .env.example .env
# fill in NEXTAUTH_SECRET — generate with: openssl rand -base64 32

# Start a local Postgres in Docker
pnpm db:up

# Apply migrations and generate the Prisma client
pnpm db:migrate

# Create the first admin user (env vars are read by the seed script)
ADMIN_EMAIL=you@example.com \
ADMIN_PASSWORD=ChangeMe-123 \
ADMIN_NAME="Onti Banden" \
pnpm db:seed

pnpm dev
```

Open <http://localhost:3000>.

### Useful scripts

| Command             | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `pnpm dev`          | Start the Next.js dev server with hot reload              |
| `pnpm build`        | Production build                                          |
| `pnpm start`        | Run the production build locally                          |
| `pnpm lint`         | ESLint                                                    |
| `pnpm typecheck`    | `tsc --noEmit`                                            |
| `pnpm format`       | Prettier write                                            |
| `pnpm format:check` | Prettier check (CI)                                       |
| `pnpm db:up`        | Start the local Postgres container                        |
| `pnpm db:down`      | Stop the local Postgres container (keeps the volume)      |
| `pnpm db:migrate`   | Apply pending migrations and regenerate the Prisma client |
| `pnpm db:deploy`    | Apply migrations without prompting (used in production)   |
| `pnpm db:reset`     | Drop the dev DB and re-run all migrations (destructive)   |
| `pnpm db:seed`      | Run `prisma/seed.ts` (creates the admin from env vars)    |
| `pnpm db:studio`    | Open Prisma Studio to browse the data                     |
| `pnpm db:generate`  | Regenerate the Prisma client only                         |

## Brand

The marketing site at <https://www.onti-banden.be/> uses Avenir, Lulo Clean
and Museo as display fonts. Those are licensed via the Wix font service and
cannot be reused on a self-hosted app without a separate Monotype / Adobe
licence. We instead use **Barlow** (Google Fonts, OFL) which is also part of
the published brand and is free to self-host. The colour palette is taken
1:1 from the brand tokens published on the site.

If a Monotype seat is acquired later, swapping in the licensed fonts is a
~30 minute change — see `src/app/layout.tsx` and `tailwind.config.ts`.

## Project layout

```
onti/
├── .kiro/specs/onti-garage/  # Product spec (requirements, design, tasks)
├── prisma/
│   ├── schema.prisma          # Data model
│   ├── migrations/            # Versioned SQL migrations
│   └── seed.ts                # Idempotent admin seeder
├── src/
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # UI components (shadcn-style)
│   └── lib/                   # Helpers (db, auth, validators, csv)
├── ops/                       # Docker, Caddy, backup scripts (PR #6)
├── docker-compose.dev.yml     # Local Postgres only
├── PROPOSAL.md                # Client offerte (Dutch)
└── README.md
```

## License

Proprietary — internal use by Onti Banden only.
