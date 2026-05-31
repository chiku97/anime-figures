#!/bin/sh
set -e

echo "[startup] Preparing backend container..."

if [ ! -d "node_modules" ]; then
  echo "[startup] node_modules missing, running npm install..."
  npm install
else
  echo "[startup] node_modules already present, skipping npm install"
fi

echo "[startup] Running prisma generate..."
npx prisma generate

echo "[startup] Running prisma migrate deploy..."
npx prisma migrate deploy

echo "[startup] Seeding with demo data..."

node ./dataSeed.js

echo "[startup] Starting backend server..."
exec npm start
