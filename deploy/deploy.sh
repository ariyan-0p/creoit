#!/usr/bin/env bash
# One-command update: ships the current project to the server, builds it there,
# and reloads it with zero hand-holding.
#
#   bash deploy/deploy.sh
#
# Needs the dedicated key at ~/.ssh/creoit_vps (added once in Hostinger).
set -euo pipefail

HOST="${CREOIT_HOST:-187.126.119.197}"
USER_AT="root@${HOST}"
KEY="${CREOIT_KEY:-$HOME/.ssh/creoit_vps}"
SSH=(ssh -i "$KEY" -o IdentitiesOnly=yes -o BatchMode=yes)

cd "$(dirname "$0")/.."

echo "▸ checking the build locally first…"
npx next build >/dev/null

echo "▸ uploading…"
tar czf - \
  --exclude=node_modules --exclude=.next --exclude=.git --exclude=.vercel --exclude=.claude \
  --exclude=ClashDisplay_Complete --exclude=MONIQA_v.1.0 --exclude="*.log" . \
  | "${SSH[@]}" "$USER_AT" 'mkdir -p /var/www/creoit && tar xzf - -C /var/www/creoit'

echo "▸ building on the server and reloading…"
"${SSH[@]}" "$USER_AT" 'cd /var/www/creoit \
  && export NEXT_TELEMETRY_DISABLED=1 \
  && npm ci --no-audit --no-fund >/dev/null \
  && npm run build >/dev/null \
  && pm2 startOrReload deploy/ecosystem.config.cjs --update-env \
  && pm2 save >/dev/null \
  && sleep 2 && curl -s -o /dev/null -w "site answers: HTTP %{http_code}\n" http://127.0.0.1:3000/'

echo "✓ live."
