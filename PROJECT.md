# Onti Garage — Project Status & VPS Info

## What is this?

Internal maintenance tracking system for **Onti Banden** (tire & garage shop, Belgium). A mechanic types a license plate → sees the full history of parts, oils, brands and suppliers used on that car.

## Client

- **Business**: Onti Banden — https://www.onti-banden.be/
- **What they want**: "het technisch geheugen van de garage"
- **Offerte**: €4.375 build + €150/month support (see PROPOSAL.md)
- **Status**: MVP built, testing on staging VPS

---

## Current state (May 2026)

### Features complete

- Login (email/password, bcrypt, 30-day sessions)
- Admin user management (create, deactivate, reset pw)
- Vehicle CRUD (plate, VIN, make, model, engine, year, customer)
- Fuzzy search on plate/VIN (typo-tolerant via pg_trgm)
- Maintenance entries (date, km, oil, notes)
- Parts per entry (category, OEM number, brand, supplier)
- Photo uploads (sharp resize to JPEG, max 10 per entry, 10 MB limit)
- CSV exports (vehicles, maintenance, parts — Belgian Excel format)
- Archive/unarchive vehicles (soft delete)
- Mobile bottom nav + responsive UI
- Dutch UI labels throughout
- Docker deployment (Postgres + Next.js + Caddy)

### Remaining for production

- Client registers a domain → enable HTTPS in Caddyfile
- Configure Backblaze B2 + nightly backup cron
- Run a restore drill
- Remove demo data and create real admin account for client

---

## Tech stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS 3 + shadcn-style components
- Barlow font (Google Fonts)
- PostgreSQL 16 + Prisma 6
- Auth.js v5 (next-auth beta.31)
- sharp (photo processing)
- csv-stringify (exports)
- Docker + Docker Compose + Caddy 2

---

## VPS (DigitalOcean — staging/test)

- **Provider**: DigitalOcean
- **Plan**: Basic Droplet, 1 vCPU / 512 MB / 10 GB SSD
- **Region**: AMS3 (Amsterdam)
- **OS**: Ubuntu
- **Public IP**: 188.166.110.189
- **App URL**: http://188.166.110.189
- **App location on VPS**: /opt/onti
- **Docker stack**: /opt/onti/ops/docker-compose.yml
- **Env file**: /opt/onti/ops/.env (not in git!)

### VPS commands

```bash
# Pull latest and rebuild
cd /opt/onti && git fetch origin && git reset --hard origin/main-final-v2
sed -i 's/{$DOMAIN:localhost}/:80/' ops/Caddyfile
cd ops && docker compose up -d --build

# View logs
docker compose logs -f app

# Full reset (wipes database + photos)
docker compose down
docker volume rm ops_pgdata ops_photos 2>/dev/null || true
docker compose up -d --build
sleep 30
set -a; source .env; set +a
docker compose exec -e ADMIN_EMAIL -e ADMIN_PASSWORD -e ADMIN_NAME app node_modules/.bin/tsx prisma/seed.ts

# Seed demo data
docker compose cp ../prisma/seed-demo.ts app:/app/prisma/seed-demo.ts
docker compose exec app node_modules/.bin/tsx prisma/seed-demo.ts
```

---

## Git branches

| Branch | What |
|--------|------|
| **main-final-v2** | Latest working code — PULL THIS ONE |
| main-final | Previous (missing body size fix) |
| main | Old, diverged — don't use |

### Pull latest on any machine

```bash
git fetch origin
git reset --hard origin/main-final-v2
```

---

## Test credentials (staging)

```
Email: owner@onti-banden.be
Password: ChangeMe-Demo-123
```

---

## Next steps

1. Set main-final-v2 as default branch on GitHub
2. Client registers domain → enable HTTPS
3. Configure backups (B2 + age + cron)
4. Training session with client
