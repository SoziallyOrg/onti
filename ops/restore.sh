#!/usr/bin/env bash
set -euo pipefail
[ $# -lt 1 ] && echo "Usage: $0 <file.dump.age>" && exit 1
ENC="$1"; DUMP="/tmp/onti-restore-$$.dump"
DB_USER="${POSTGRES_USER:-onti}"; DB_NAME="${POSTGRES_DB:-onti}"
echo "Decrypting..."
if [ -n "${AGE_KEY_FILE:-}" ]; then age -d -i "$AGE_KEY_FILE" -o "$DUMP" "$ENC"
else age -d -o "$DUMP" "$ENC"; fi
echo "Stopping app..."
docker stop onti-app 2>/dev/null || true
echo "Dropping + recreating DB..."
docker exec onti-db psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";" -c "CREATE DATABASE \"$DB_NAME\" OWNER \"$DB_USER\";"
echo "Restoring..."
docker exec -i onti-db pg_restore --no-owner --no-acl --role="$DB_USER" -U "$DB_USER" -d "$DB_NAME" < "$DUMP"
rm -f "$DUMP"
docker start onti-app
echo "Done. Verify in browser."
