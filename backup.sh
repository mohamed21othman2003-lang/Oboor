#!/usr/bin/env bash
# نسخ احتياطي يومي: قاعدة البيانات (Postgres) + الملفات المرفوعة (MinIO).
# يُشغَّل عبر cron. النسخ تُحفظ في /opt/oobor/backups مع الاحتفاظ بآخر 14 نسخة.
set -euo pipefail
cd "$(dirname "$0")"
set -a; source .env; set +a

STAMP=$(date +%Y%m%d-%H%M%S)
BK="$(pwd)/backups"
mkdir -p "$BK"

# 1) قاعدة البيانات → sql.gz
docker compose exec -T -e PGPASSWORD="$POSTGRES_PASSWORD" postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-privileges \
  | gzip > "$BK/db-$STAMP.sql.gz"

# 2) ملفات MinIO المرفوعة → tar.gz (من الـvolume مباشرة)
docker run --rm -v oobor_miniodata:/data -v "$BK":/backup alpine \
  tar czf "/backup/minio-$STAMP.tar.gz" -C /data . 2>/dev/null

# 3) تدوير: احتفظ بآخر 14 نسخة فقط
ls -1t "$BK"/db-*.sql.gz    2>/dev/null | tail -n +15 | xargs -r rm -f
ls -1t "$BK"/minio-*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm -f

echo "[$(date)] backup ok: db-$STAMP.sql.gz + minio-$STAMP.tar.gz"
