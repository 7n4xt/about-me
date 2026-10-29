#!/usr/bin/env bash
set -Eeuo pipefail

[[ $EUID -eq 0 ]] || { echo 'Run this setup script as root inside the Debian LXC.' >&2; exit 1; }
USER_NAME=about-me-deploy
STATE_DIR=/var/lib/about-me-deploy
SITE_ROOT=/var/www/about-me
REPO_URL=https://github.com/7n4xt/about-me.git
BRANCH=main
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
SAFE_PATH=/usr/local/bin:/usr/bin:/bin

for command in git node npm flock runuser useradd install systemctl; do
  PATH="$SAFE_PATH" command -v "$command" >/dev/null || { echo "Missing prerequisite: $command. Install it separately; setup does not install packages." >&2; exit 1; }
done
[[ -d /run/systemd/system ]] || { echo 'systemd must be running inside this container.' >&2; exit 1; }
[[ -f "$SCRIPT_DIR/deploy.sh" ]] || { echo 'Keep deploy.sh next to this setup script.' >&2; exit 1; }
[[ ! -L "$SITE_ROOT" ]] || { echo 'Refusing a symlink as the site root.' >&2; exit 1; }
if id "$USER_NAME" >/dev/null 2>&1; then
  [[ $(getent passwd "$USER_NAME" | cut -d: -f6) == "$STATE_DIR" ]] || { echo "Existing $USER_NAME user has an unexpected home directory." >&2; exit 1; }
else
  useradd --system --user-group --home-dir "$STATE_DIR" --create-home --shell /usr/sbin/nologin "$USER_NAME"
fi
for path in "$STATE_DIR" "$SITE_ROOT/.releases"; do
  if [[ -e "$path" || -L "$path" ]]; then
    [[ -d "$path" && ! -L "$path" && $(stat -c %U "$path") == "$USER_NAME" ]] || { echo "Unexpected existing deployment directory: $path" >&2; exit 1; }
  fi
done
install -d -o "$USER_NAME" -g "$USER_NAME" -m 0750 "$STATE_DIR"
runuser -u "$USER_NAME" -- env PATH="$SAFE_PATH" node --version
runuser -u "$USER_NAME" -- env PATH="$SAFE_PATH" npm --version

if [[ ! -e "$STATE_DIR/repo" ]]; then
  runuser -u "$USER_NAME" -- env PATH="$SAFE_PATH" GIT_TERMINAL_PROMPT=0 git clone --depth=1 --branch "$BRANCH" "$REPO_URL" "$STATE_DIR/repo"
fi
[[ $(runuser -u "$USER_NAME" -- git -C "$STATE_DIR/repo" remote get-url origin) == "$REPO_URL" ]] || { echo 'Unexpected repository origin.' >&2; exit 1; }
if [[ ! -e "$STATE_DIR/last-deployed" ]]; then
  # Seed the baseline without building or publishing the current commit.
  runuser -u "$USER_NAME" -- bash -c 'git -C "$1/repo" rev-parse HEAD > "$1/last-deployed"' _ "$STATE_DIR"
fi

if [[ ! -d "$SITE_ROOT" ]]; then install -d -m 0755 "$SITE_ROOT"; fi
chgrp "$USER_NAME" "$SITE_ROOT"
chmod g+wx "$SITE_ROOT"
install -d -o "$USER_NAME" -g "$USER_NAME" -m 0755 "$SITE_ROOT/.releases"
install -d -m 0755 /usr/local/libexec
install -o root -g root -m 0755 "$SCRIPT_DIR/deploy.sh" /usr/local/libexec/about-me-deploy

cat > /etc/systemd/system/about-me-deploy.service <<'UNIT'
[Unit]
Description=Build and deploy new commits of the about-me portfolio
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
User=about-me-deploy
Group=about-me-deploy
WorkingDirectory=/var/lib/about-me-deploy
Environment=HOME=/var/lib/about-me-deploy
Environment=PATH=/usr/local/bin:/usr/bin:/bin
ExecStart=/usr/local/libexec/about-me-deploy
TimeoutStartSec=15min
UMask=0022
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/var/lib/about-me-deploy /var/www/about-me
RestrictSUIDSGID=true
UNIT

cat > /etc/systemd/system/about-me-deploy.timer <<'UNIT'
[Unit]
Description=Check GitHub for new portfolio commits every minute

[Timer]
OnBootSec=1min
OnUnitInactiveSec=1min
Unit=about-me-deploy.service

[Install]
WantedBy=timers.target
UNIT

systemctl daemon-reload
systemctl enable --now about-me-deploy.timer
echo 'Setup complete. No packages upgraded and no initial build or deployment performed.'
echo 'New main commits will build inside this LXC. Cloudflare Tunnel and nginx are unchanged.'
echo 'Logs: journalctl -u about-me-deploy.service -n 60 --no-pager'
