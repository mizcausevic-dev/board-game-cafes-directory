#!/usr/bin/env bash
# Local deploy escape hatch, mirrors .github/workflows/deploy.yml but runs
# from a dev machine: 0 GitHub Actions minutes, and dodges the intermittent
# Hostinger WAF block on port 65002 for some GitHub-hosted runner IPs.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

HOST="82.25.89.47"
USER="u815783393"
REMOTE="domains/boardgamecafes.directory/public_html"
KEY="$HOME/.ssh/kg_hostinger_gh_actions_2026_06"

echo "Building..."
npm run build

test -f out/index.html || { echo "FAIL: no out/index.html"; exit 1; }
echo "Built $(find out -name index.html | wc -l) HTML pages."

echo "Deploying (upload-only, no remote delete)..."
tar -czf - -C out . | ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=30 -o ServerAliveInterval=15 \
  -p 65002 -i "$KEY" "$USER@$HOST" \
  "set -e; cd '$REMOTE' && tar --overwrite -xzf - && echo DEPLOY_EXTRACTED"

echo "Done. Verify: curl -o /dev/null -w '%{http_code}\n' https://boardgamecafes.directory/"
