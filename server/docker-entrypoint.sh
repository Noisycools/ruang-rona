#!/bin/sh

# Jalankan migrasi database
echo "Running database migrations..."
npx prisma migrate deploy

# Jalankan perintah utama (dari CMD Dockerfile)
exec "$@"