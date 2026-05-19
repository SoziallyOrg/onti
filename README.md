# Onti Garage

Internal maintenance and parts tracking system for **Onti Banden**.

The full product spec lives in [`.kiro/specs/onti-garage/`](./.kiro/specs/onti-garage):

- [`requirements.md`](./.kiro/specs/onti-garage/requirements.md) — what we're building and why
- [`design.md`](./.kiro/specs/onti-garage/design.md) — tech stack, data model, hosting
- [`tasks.md`](./.kiro/specs/onti-garage/tasks.md) — phased task plan

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS 3** + custom shadcn-style components
- **Prisma** + **PostgreSQL 16** (added in PR #2)
- **Auth.js v5** credentials provider (added in PR #3)
- **Docker Compose** for production hosting on a Hostinger VPS

## Local development

Requires Node 20+ and pnpm 11+ (or use `corepack enable`).

```bash
pnpm install
cp .env.example .env
# fill in NEXTAUTH_SECRET — generate with: openssl rand -base64 32

pnpm dev
```

Open <http://localhost:3000>.

### Useful scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the Next.js dev server with hot reload |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build locally |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` | Prettier write |
| `pnpm format:check` | Prettier check (CI) |

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
├── prisma/                    # Schema and migrations (PR #2)
├── src/
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # UI components (shadcn-style)
│   └── lib/                   # Helpers (db, auth, validators, csv)
├── ops/                       # Docker, Caddy, backup scripts (PR #6)
├── PROPOSAL.md                # Client offerte (Dutch)
└── README.md
```

## License

Proprietary — internal use by Onti Banden only.
