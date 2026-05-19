# Deploy Onti Garage

## Quick start (DigitalOcean / any VPS)

```bash
ssh root@YOUR_IP

# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone
cd /opt && git clone https://github.com/SoziallyOrg/onti.git && cd onti/ops

# Configure
cp .env.example .env && nano .env
# Fill: DOMAIN, POSTGRES_PASSWORD, AUTH_SECRET, NEXTAUTH_URL, ADMIN_EMAIL/PASSWORD/NAME

# Deploy
docker compose up -d --build
# First run: ~3 min (build + migrations)

# Verify
docker compose ps        # 3 services Up
docker compose logs app  # "Ready"
```

Visit https://your-domain.com → login with ADMIN_EMAIL + ADMIN_PASSWORD.

---

## Test without a domain (IP only, no HTTPS)

Edit `Caddyfile`: change `{$DOMAIN:localhost}` to `:80`
Edit `.env`: set `NEXTAUTH_URL=http://YOUR_IP`

```bash
docker compose up -d --build
```

Visit http://YOUR_IP

---

## Redeploy

```bash
cd /opt/onti && git pull && cd ops && docker compose up -d --build
```

---

## Backups (ops/backup.sh)

Requires `age` + `rclone` on the host.

```bash
apt install -y age rclone
rclone config  # type b2, enter key_id + app_key

# Test
source .env && export AGE_PUBKEY B2_BUCKET POSTGRES_USER POSTGRES_DB
./backup.sh

# Cron (nightly 3am)
crontab -e
# 0 3 * * * source /opt/onti/ops/.env && export AGE_PUBKEY B2_BUCKET POSTGRES_USER POSTGRES_DB && /opt/onti/ops/backup.sh >> /var/log/onti-backup.log 2>&1
```

---

## Restore (ops/restore.sh)

```bash
rclone copy b2:onti-backups/db/2026-05-19.dump.age /tmp/
./restore.sh /tmp/2026-05-19.dump.age
# Prompts for age private key
```

---

## Architecture

```
Internet → Caddy (:443) → Next.js app (:3000) → Postgres (:5432)
                                    ↓
                              photos volume
```
