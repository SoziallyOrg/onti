# Onti Banden — Task Plan

Tasks are split between **Kiro** (me — code, scaffolding, deployment scripts) and **You** (decisions, accounts, infra access, client communication).

Order matters where marked with `→`.

---

## Phase 0 — Lock down scope (before any code)

### You
- [ ] Confirm MVP scope with the client using `requirements.md` as the basis. Get a yes/no on each section.
- [ ] Answer the 6 open questions in `requirements.md`. Critical blockers for me are: photos yes/no, subdomain, existing data import.
- [ ] Agree price/timeline with client. (My estimate: ~3 dev days + 1 buffer day. You set the rate.)
- [ ] Send a short Dutch proposal to the client summarizing scope + price + timeline.

### Kiro
- [ ] Write a Dutch one-pager proposal text you can send to the client (when you ask).

---

## Phase 1 — Repo scaffolding

### You
- [ ] Decide where the GitHub repo lives (existing `SoziallyOrg/onti` works).
- [ ] Confirm Node.js 20+ is the target (matches Hostinger VPS).

### Kiro  →  *runs after Phase 0 sign-off*
- [ ] Initialize Next.js 15 + TypeScript + Tailwind in `onti/`.
- [ ] Add shadcn/ui with the components we'll need (button, input, table, dialog, form, etc.).
- [ ] Set up Prisma, write `schema.prisma` per the design.
- [ ] Add the trigram migration for fuzzy search.
- [ ] Wire up `lib/db.ts`, `lib/auth.ts`, `lib/validators.ts`.
- [ ] Add ESLint + Prettier, basic CI lint check.
- [ ] Write `README.md` with local dev instructions.

---

## Phase 2 — Core features

### Kiro
- [ ] **Auth**: Auth.js v5 with credentials provider, login page, middleware guard, sign-out.
- [ ] **User management** (admin only): create user, reset password, deactivate.
- [ ] **Seed script**: creates one initial admin user from env vars on first boot.
- [ ] **Vehicle CRUD**:
  - [ ] List page with pagination
  - [ ] New / edit forms with Zod validation
  - [ ] Archive (soft delete)
- [ ] **Search**:
  - [ ] Server action / API route doing the trigram query
  - [ ] Search bar in the top nav, present on every page
  - [ ] Keyboard shortcut (`/` to focus)
- [ ] **Vehicle detail page**:
  - [ ] Header card with car + customer
  - [ ] Maintenance timeline (reverse chronological)
  - [ ] Inline parts list per entry
- [ ] **Maintenance entries**:
  - [ ] New / edit / delete (own entries; admin can do anything)
  - [ ] Multiple parts editable on the same form
  - [ ] Autocomplete for OEM number, brand, supplier (pulls from history)
- [ ] **Photos on maintenance entries**:
  - [ ] Upload endpoint with `sharp` resize (max 2000 px, JPEG q80, strip EXIF)
  - [ ] Storage on a Docker volume mounted into the app container
  - [ ] Thumbnail grid + lightbox on the maintenance entry
  - [ ] Soft cap of 10 photos per entry, max 8 MB per upload
- [ ] **CSV exports**: vehicles, maintenance, parts. Streamed downloads, admin only.
- [ ] **Dutch UI labels**: centralized in `src/i18n/nl.ts`.

### You
- [ ] Spot-check the UI on a phone as features land — flag anything not touch-friendly.
- [ ] Provide 2–3 real example records (anonymized is fine) so we can see the timeline with realistic data.

---

## Phase 3 — Deployment

### You
- [ ] Provide SSH access to the Hostinger VPS (or set up a deploy user with sudo).
- [ ] Confirm the VPS has Docker + Docker Compose installed; install if missing.
- [ ] Create a DNS A record for the chosen subdomain (e.g. `garage.onti-banden.be`) → VPS IP.
- [ ] Open ports 80 and 443 in the Hostinger firewall; close everything else except 22.
- [ ] Disable SSH password auth, ensure only key auth.
- [ ] Create a Backblaze B2 account (free tier) and a private bucket `onti-backups`.
- [ ] Create a B2 application key scoped to that bucket; share the key+secret with me via a secure channel (1Password, Bitwarden Send, age-encrypted).

### Kiro
- [ ] Write the production `Dockerfile` (multi-stage, small image).
- [ ] Write `ops/docker-compose.yml` (caddy + app + db).
- [ ] Write `ops/Caddyfile`.
- [ ] Write `.env.example` listing every required variable.
- [ ] Write `ops/backup.sh` and `ops/restore.sh`.
- [ ] Write a `DEPLOY.md` runbook: first-time deploy, redeploy, rollback, restore from backup.

### You + Kiro (joint, when access is ready)
- [ ] First deploy on the VPS together. I drive, you watch.
- [ ] Generate the `age` keypair on your laptop (you keep the private key, I never see it).
- [ ] Configure cron for the nightly backup.
- [ ] Run the first backup manually, verify the encrypted file lands in B2.
- [ ] **Run a full restore drill** onto a temporary directory — confirm we can decrypt + restore.

---

## Phase 4 — Hand-off

### Kiro
- [ ] Record a 5-minute Loom-style walkthrough script (text), or write a short user guide in Dutch.
- [ ] Create the initial admin account; document password reset procedure for the owner.
- [ ] Set up a `MAINTENANCE.md` for you: how to apply updates, where logs live, how to add a user, how to restore.

### You
- [ ] Hand off to the client: walkthrough call, create their accounts, watch them do one real workflow.
- [ ] Add a recurring monthly calendar reminder: "Onti — restore drill + apt upgrade".
- [ ] Decide on a small support arrangement (hours/month or pay-per-incident) with the client.

---

## Phase 5 — Phase-2 backlog (not now, capture for later)

Kept here so they don't get lost. Ask client to prioritize after a few weeks of real use.

- Photos on maintenance entries (with image resize on upload)
- Customer entity (deduplicate customers across multiple vehicles)
- Appointment calendar
- SMS reminders (e.g. via Twilio) for upcoming oil changes based on km estimate
- Customer-facing read-only portal (per-vehicle history link, magic link auth)
- TecDoc / parts-supplier API integration for OEM lookups
- Reporting dashboard (busiest months, most-used brands, etc.)
- Multi-garage support if Mathias wants to sell this to other shops

---

## Decisions — resolved

| # | Question | Answer |
|---|----------|--------|
| 1 | Number of users / sites | 1 garage, multiple users, 1 admin |
| 2 | Photos in v1 | Yes (in scope) |
| 3 | Customer dedup | No — data per vehicle, identified by plate/VIN |
| 4 | Existing data import | No |
| 5 | Domain | Client registers a **separate** domain |
| 6 | GDPR | Basic privacy notice; no DPO |

## Outstanding actions before Phase 1

- [ ] **Client signs the offerte** (€4.375 build + €150/month support, excl. BTW).
- [ ] **Client registers the domain** and shares DNS access.
- [ ] **Client provides VPS SSH access** (or sets up a deploy user with sudo).
