#!/usr/bin/env bash
set -euo pipefail
DATE=$(date +%F)
DUMP="/tmp/onti-${DATE}.dump"
ENC="${DUMP}.age"
echo "[$(date -Iseconds)] Backup starting..."
docker exec onti-db pg_dump --format=custom --compress=4 -U "${POSTGRES_USER:-onti}" "${POSTGRES_DB:-onti}" > "$DUMP"
echo "  Dump: $(du -h "$DUMP" | cut -f1)"
age -r "$AGE_PUBKEY" -o "$ENC" "$DUMP" && rm -f "$DUMP"
echo "  Encrypted: $(du -h "$ENC" | cut -f1)"
rclone copyto "$ENC" "b2:${B2_BUCKET}/db/${DATE}.dump.age" && rm -f "$ENC"
rclone delete "b2:${B2_BUCKET}/db" --min-age 30d
echo "[$(date -Iseconds)] Backup done."
