# Onti Banden — Garage Management System

## Problem

Onti Banden (tire & maintenance garage in Belgium) currently has no centralized record of which parts and brands were used on each customer vehicle. When the same car returns, mechanics waste time looking up old invoices or guessing part numbers, and ordering errors happen.

## Goal

Build a small, fast, internal web application that acts as the **technical memory of the garage**. The single most important workflow:

> Car arrives → mechanic types license plate or VIN → instantly sees the full maintenance history, parts used, OEM numbers, brands and suppliers.

## Users

- **Owner** (admin): full access, can create/manage user accounts.
- **Mechanics** (2–3 initially): can search vehicles, add maintenance entries, view history.

No customer-facing accounts in v1.

## Functional Requirements

### Vehicles
- Fields: license plate, VIN, make, model, engine, model year, customer name, customer GSM number.
- VIN is the canonical unique identifier (plates can be reassigned).
- Create / view / edit / archive (no hard delete).

### Search
- Single search bar matching on **plate** or **VIN**.
- Typo-tolerant (Postgres trigram or similar).
- Results in < 1 second on a phone over 4G.

### Maintenance entries
- Each entry belongs to one vehicle.
- Fields: date, kilometer reading, oil type, oil liters, free-text notes, created-by (user).
- Edit and delete allowed for the user who created it; admin can edit/delete anything.

### Parts used
- Multiple parts per maintenance entry.
- Fields: category (filter — oil/air/cabin/fuel, brake pad, brake disc, other), OEM/OEN number, brand, supplier, free-text note.
- Autocomplete suggestions based on previously entered values (so the same OEM number doesn't get re-typed).

### Vehicle detail page
- Header: car identity + customer info.
- Reverse-chronological timeline of maintenance entries.
- Each entry shows oil/km/notes plus the parts used inline.

### Export
- CSV export per table: vehicles, maintenance entries, parts.
- Triggered from the UI by an admin user.

### Authentication
- Email + password.
- Bcrypt-hashed passwords stored in our Postgres.
- Session cookies (httpOnly, secure).
- Admin-only user-management page (create user, reset password, deactivate).
- No public sign-up.

## Non-Functional Requirements

- **Cloud-hosted** on the existing Hostinger VPS.
- **HTTPS** via Caddy + Let's Encrypt.
- **Responsive UI** — usable on a workshop tablet, phone, or PC. Touch-friendly.
- **UI language: Dutch** (technical labels in Dutch, code/identifiers in English).
- **Automated daily backups**, encrypted, off-site (free tier of Backblaze B2 or Cloudflare R2). 30-day retention.
- **Restore tested** at least once before go-live, then monthly.
- **Recovery Point Objective**: ≤ 24 hours of data loss in worst case.
- **Recovery Time Objective**: ≤ 2 hours to restore from off-site backup onto a fresh VPS.
- **Audit fields**: every record carries `created_at`, `updated_at`, `created_by`.

### Photos (in scope)
- Multiple photos per maintenance entry (typical use: worn parts, before/after).
- Upload from phone or PC. Auto-resize to max 2000 px on the long side, JPEG quality 80, EXIF stripped.
- Stored on the VPS in a Docker volume; included in nightly off-site backup.
- Display: thumbnail grid on the maintenance entry, click-to-enlarge.
- Soft cap at 10 photos per entry to keep storage predictable.

## Out of Scope (v1)

These are explicitly deferred — discuss with client as phase 2+:

- Appointment / calendar booking.
- Invoicing or pricing.
- Stock / inventory management.
- SMS/email reminders to customers.
- Customer-facing portal.
- Multi-garage / multi-tenant support.
- Integration with parts supplier APIs (TecDoc, etc.).
- Reporting dashboards.
- Customer entity / cross-vehicle customer view.

## Decisions (resolved with client)

1. **Users** — single garage, multiple users, exactly 1 admin (the owner). Other users are mechanics.
2. **Photos** — **in scope for v1**. Optional attachments on a maintenance entry (e.g. worn brake pad). Stored on the VPS, backed up.
3. **Customer record reuse** — no separate Customer entity. Customer name + GSM live on the Vehicle record (one record per car, identified by plate/VIN). Two cars from the same customer = two vehicle records with duplicated customer fields. Accepted.
4. **Existing data import** — none. Clean start.
5. **Domain** — client will register a **separate domain** (not a subdomain of `onti-banden.be`). Domain registered and paid for by the client; we receive DNS access only.
6. **GDPR** — basic privacy notice acceptable at this scale. Customer phone numbers protected via auth + encrypted backups; no DPO required.
