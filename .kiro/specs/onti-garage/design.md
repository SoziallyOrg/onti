# Onti Banden — Technical Design

## Architecture overview

A single Next.js application, self-hosted on the Hostinger VPS, talking to a local Postgres. No external services for auth or storage.

```
┌──────────────────────── Hostinger VPS ────────────────────────┐
│                                                                │
│  Caddy  ──HTTPS──▶  Next.js app  ──TCP──▶  Postgres 16         │
│   :443               (Node, :3000)         (volume on disk)    │
│                                                                │
│              cron (nightly) ──▶ pg_dump | age | rclone         │
└────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
                            Backblaze B2 / Cloudflare R2
                              (encrypted dumps, 30 days)
```

Everything orchestrated with `docker compose`. One command to deploy: `docker compose up -d --build`.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| ORM | Prisma |
| Database | Postgres 16 |
| Auth | Auth.js v5 (NextAuth), credentials provider |
| Validation | Zod |
| CSV export | Streaming via `csv-stringify` |
| Reverse proxy / TLS | Caddy 2 |
| Containerization | Docker + Docker Compose |
| Backups | `pg_dump` + `age` (encryption) + `rclone` (upload) |

Rationale: this stack is boring, well-documented, and runs comfortably on a small VPS. No paid SaaS, no vendor lock-in for either auth or data.

## Data model (Prisma)

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  passwordHash String
  role         Role     @default(MECHANIC)
  active       Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  maintenanceEntries MaintenanceEntry[]
}

enum Role {
  ADMIN
  MECHANIC
}

model Vehicle {
  id            String   @id @default(cuid())
  vin           String   @unique
  plate         String
  make          String
  model         String
  engine        String?
  modelYear     Int?
  customerName  String
  customerPhone String?
  archived      Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  maintenanceEntries MaintenanceEntry[]

  @@index([plate])
  @@index([vin])
}

model MaintenanceEntry {
  id          String   @id @default(cuid())
  vehicleId   String
  vehicle     Vehicle  @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  date        DateTime
  km          Int
  oilType     String?
  oilLiters   Decimal? @db.Decimal(4, 2)
  notes       String?
  createdById String
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  parts PartUsed[]

  @@index([vehicleId, date(sort: Desc)])
}

model PartUsed {
  id             String           @id @default(cuid())
  maintenanceId  String
  maintenance    MaintenanceEntry @relation(fields: [maintenanceId], references: [id], onDelete: Cascade)
  category       PartCategory
  oemNumber      String?
  brand          String?
  supplier       String?
  notes          String?
  createdAt      DateTime         @default(now())
}

model Photo {
  id            String           @id @default(cuid())
  maintenanceId String
  maintenance   MaintenanceEntry @relation(fields: [maintenanceId], references: [id], onDelete: Cascade)
  filename      String           // UUID-based, stored on disk volume
  mimeType      String
  sizeBytes     Int
  caption       String?
  createdAt     DateTime         @default(now())

  @@index([maintenanceId])
}

enum PartCategory {
  OIL_FILTER
  AIR_FILTER
  CABIN_FILTER
  FUEL_FILTER
  BRAKE_PAD
  BRAKE_DISC
  OTHER
}
```

A raw migration adds the trigram index for fuzzy plate/VIN search:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX vehicle_plate_trgm  ON "Vehicle" USING gin (plate  gin_trgm_ops);
CREATE INDEX vehicle_vin_trgm    ON "Vehicle" USING gin (vin    gin_trgm_ops);
```

Search query (simplified):
```sql
SELECT * FROM "Vehicle"
WHERE archived = false
  AND (plate ILIKE $1 OR vin ILIKE $1
       OR similarity(plate, $2) > 0.3
       OR similarity(vin,   $2) > 0.3)
ORDER BY GREATEST(similarity(plate, $2), similarity(vin, $2)) DESC
LIMIT 20;
```

## Auth flow

- Auth.js v5 with `CredentialsProvider`.
- Sessions stored as JWT in a secure, httpOnly cookie (no DB session lookup → faster).
- Middleware (`middleware.ts`) redirects unauthenticated requests to `/login`.
- Admin-only routes guarded server-side by checking `session.user.role === 'ADMIN'`.
- No password reset flow in v1; admin resets passwords from the user management page.

## Folder structure

```
onti/
├── .kiro/
│   └── specs/onti-garage/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/login/
│   │   ├── (app)/
│   │   │   ├── layout.tsx           # nav + auth guard
│   │   │   ├── page.tsx             # search-first dashboard
│   │   │   ├── vehicles/
│   │   │   │   ├── page.tsx         # list
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx     # detail + timeline
│   │   │   │       └── maintenance/new/page.tsx
│   │   │   ├── admin/users/
│   │   │   └── export/
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       ├── search/
│   │       └── export/{vehicles,maintenance,parts}.csv/
│   ├── components/ui/               # shadcn
│   ├── components/                  # app-specific
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── csv.ts
│   │   └── validators.ts            # zod schemas
│   └── i18n/nl.ts                   # Dutch labels
├── ops/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── Caddyfile
│   ├── backup.sh
│   └── restore.sh
├── .env.example
└── README.md
```

## Hosting & deployment

**docker-compose.yml** runs three services on the VPS:
- `caddy` — reverse proxy, auto-HTTPS, exposes :80/:443.
- `app` — Next.js production build. Mounts a `photos` volume at `/var/app/photos`.
- `db` — Postgres 16, data on a named volume.

Two named volumes: `pgdata` (database) and `photos` (uploaded images).

**Caddyfile** (essence):
```
garage.onti-banden.be {
  reverse_proxy app:3000
  encode zstd gzip
}
```

**Deploys:** `git pull && docker compose up -d --build` on the VPS. Migrations run as part of the app container's entrypoint (`prisma migrate deploy`).

**Environment**: a single `.env` on the VPS holds DB URL, NextAuth secret, B2 credentials, age public key.

## Backup strategy

`ops/backup.sh`, scheduled by host cron at 03:00 daily:

```bash
#!/usr/bin/env bash
set -euo pipefail

DATE=$(date +%F)

# 1. Database dump (encrypted, streamed)
docker exec onti-db pg_dump --format=custom -U onti onti \
  | age -r "$AGE_PUBKEY" \
  | rclone rcat "b2:onti-backups/db/$DATE.dump.age"

# 2. Photos (incremental sync, encrypted at rest via rclone crypt remote)
rclone sync /var/lib/docker/volumes/onti_photos/_data \
            "b2:onti-photos-crypt/" \
            --transfers 4

# 3. Prune dumps older than 30 days
rclone delete --min-age 30d b2:onti-backups/db
```

- `age` encrypts client-side; only the holder of the private key can restore.
- `rclone` handles the upload to Backblaze B2 (or R2 — same config).
- Private key kept in a password manager + a sealed paper copy.

`ops/restore.sh` documents and automates recovery onto a fresh VPS.

**Restore drill** scheduled as a calendar reminder for the developer, monthly.

## Security baseline

- HTTPS only (Caddy redirects HTTP → HTTPS).
- Bcrypt cost factor 12 for passwords.
- Rate limit on `/api/auth/callback/credentials` (5 attempts / 15 min / IP).
- CSP and standard security headers via Next.js config.
- DB not exposed to the public internet (Docker network only).
- VPS firewall: only 22/80/443 open. SSH key auth only, password disabled.
- Customer phone numbers are personal data — note in privacy section, no extra controls beyond access control + encrypted backups.

## Performance budget

- Search response: p95 < 300 ms (Postgres trigram on a few thousand rows is trivial).
- Page load: p95 < 1.5 s on 4G.
- Postgres + Node memory at idle: < 500 MB.

The dataset will stay small (a few thousand vehicles, tens of thousands of maintenance entries over years). No scaling concerns at this size.
