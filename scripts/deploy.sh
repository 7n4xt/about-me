#!/usr/bin/env bash
set -Eeuo pipefail
umask 022

STATE_DIR=${STATE_DIR:-/var/lib/about-me-deploy}
SITE_ROOT=${SITE_ROOT:-/var/www/about-me}
REPO_URL=${REPO_URL:-https://github.com/7n4xt/about-me.git}
BRANCH=${BRANCH:-main}
RELEASES="$SITE_ROOT/.releases"
export GIT_TERMINAL_PROMPT=0

exec 9>"$STATE_DIR/deploy.lock"
flock -n 9 || exit 0

repo="$STATE_DIR/repo"
[[ -d "$repo/.git" ]] || { echo 'Deployment checkout missing; run setup first.' >&2; exit 1; }
[[ $(git -C "$repo" remote get-url origin) == "$REPO_URL" ]] || { echo 'Unexpected repository origin.' >&2; exit 1; }
git -C "$repo" fetch --depth=1 origin "refs/heads/$BRANCH"
commit=$(git -C "$repo" rev-parse --verify 'FETCH_HEAD^{commit}')
if [[ -f "$STATE_DIR/last-deployed" ]] && [[ $(cat "$STATE_DIR/last-deployed") == "$commit" ]]; then
  echo "No new commit on $BRANCH."
  exit 0
fi

echo "Building $commit as $(id -un)."
git -C "$repo" checkout --detach "$commit"
cd "$repo"
npm ci --include=dev --no-audit --no-fund
npm run build
[[ -s dist/index.html ]] || { echo 'Build did not produce dist/index.html.' >&2; exit 1; }
[[ -z $(find dist -type l -print -quit) ]] || { echo 'Refusing to publish symlinks inside dist.' >&2; exit 1; }

release=$(mktemp -d "$RELEASES/$commit.XXXXXXXX")
next="$SITE_ROOT/.dist-next-$$"
backup=''
published=false
cleanup() {
  local status=$?
  if [[ -L "$next" ]] && [[ $(readlink "$next") == "$release" ]]; then rm -- "$next"; fi
  if [[ -n "$backup" && ! -e "$SITE_ROOT/dist" && ! -L "$SITE_ROOT/dist" ]]; then
    mv -T -- "$backup" "$SITE_ROOT/dist"
  fi
  if [[ "$published" == false ]]; then rm -rf -- "$release"; fi
  return "$status"
}
trap cleanup EXIT
trap 'exit 143' TERM
trap 'exit 130' INT
cp -R --no-preserve=mode,ownership dist/. "$release/"
chmod 0755 "$release"
ln -s -- "$release" "$next"

if [[ -e "$SITE_ROOT/dist" && ! -L "$SITE_ROOT/dist" ]]; then
  [[ -d "$SITE_ROOT/dist" ]] || { echo 'Live dist path is not a directory.' >&2; exit 1; }
  # The first directory-to-symlink migration has a brief rename gap; keep the old site for rollback.
  backup="$RELEASES/previous-$(date +%s)-$$"
  mv -T -- "$SITE_ROOT/dist" "$backup"
fi
mv -Tf -- "$next" "$SITE_ROOT/dist"
published=true
printf '%s\n' "$commit" > "$STATE_DIR/last-deployed.next"
mv -f -- "$STATE_DIR/last-deployed.next" "$STATE_DIR/last-deployed"
echo "Published $commit to $SITE_ROOT/dist. Previous releases retained in $RELEASES."
