# 7n4xt — Portfolio & Blog

Portfolio of **Abdulmalek Esughi** (7n4xt) — cybersecurity student specializing in
networking & infrastructure. Built with **Astro**, styled with the **Nord** palette,
with an infra/terminal aesthetic.

## Tech

- [Astro 4](https://astro.build) — static site generation
- Content collections for the blog (markdown posts in `src/content/blog`)
- Live GitHub repo grid via the public GitHub API (client-side fetch)
- Zero runtime framework, minimal JS

## Sections

- **Hero** — terminal aesthetic, live clock, status badge
- **About** — personal story + timeline
- **Skills** — grouped by networking / security / languages / tools
- **Featured Projects** — curated showcase
- **Live GitHub Repos** — auto-fetched from `api.github.com`
- **Blog** — markdown posts with tags, reading time, filtering

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run build      # outputs static site to dist/
npm run preview    # preview the production build
```

## Deploying to a homelab

The build output is a fully static `dist/` folder — serve it with any web server.
Example with **nginx**:

```nginx
server {
    listen 80;
    server_name portfolio.lan;              # or your public domain
    root /var/www/about-me/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

Steps on your Proxmox host:

```bash
# 1. build locally (or on the server)
npm ci && npm run build

# 2. copy the static output to your web root
sudo mkdir -p /var/www/about-me
sudo cp -r dist /var/www/about-me/dist

# 3. point nginx at it (config above), then
sudo nginx -s reload
```

### Automatic deployment inside a Debian LXC

The setup script installs a systemd timer, **not a webhook**. It checks the public
`7n4xt/about-me` repository's `main` branch every minute and builds inside the LXC.
Cloudflare Tunnel and nginx configuration are left unchanged. No incoming ports,
GitHub token, self-hosted runner, package installations, or upgrades are needed.

Prerequisites: systemd, Git, Node.js, npm, and `flock` available system-wide in
standard system binary directories, including `/usr/sbin`. Protect `main`: builds execute repository
code as a restricted account, which can replace this website but cannot write
outside its state and site directories through the systemd service.

After these scripts are available in your checkout, run **inside the LXC**:

```bash
cd /root/about-me
bash scripts/setup-auto-deploy.sh
```

Run setup as root. It creates the `about-me-deploy` account, a separate checkout
under `/var/lib/about-me-deploy`, and root-owned service/script files. It grants
that account group write access to `/var/www/about-me`; it does not change the
current `dist` content. The initial checkout commit is recorded as the baseline:
**setup does not build or publish it**. The next changed `main` commit triggers
`npm ci` and `npm run build`. Re-running setup keeps the existing baseline.

Successful output is copied to `/var/www/about-me/.releases/<commit>.<suffix>`.
On the first successful deployment, the existing `dist/` directory is retained
as `.releases/previous-...` and `dist` becomes a symlink. This first conversion has
a brief rename gap; later releases switch the symlink atomically. nginx must
allow symlinks (the default), and its document root stays `/var/www/about-me/dist`.
No nginx reload is needed. Failed builds leave the live site unchanged and are
retried on the next timer run. Previous releases are retained, so monitor disk
usage. Builds time out after 15 minutes; concurrent runs cannot overlap.

```bash
systemctl status about-me-deploy.timer
journalctl -u about-me-deploy.service -n 60 --no-pager
# Check immediately; unchanged commits still skip building:
systemctl start about-me-deploy.service
# Stop automatic deployment:
systemctl disable --now about-me-deploy.timer
# Also stop an already running build if necessary:
systemctl stop about-me-deploy.service
```

Changes to the repository's deployment scripts do not automatically update the
root-owned installed script. Review changes, then rerun setup explicitly.

Local deployment logic tests (Python 3 + Git; no real npm build or server changes):

```bash
bash -n scripts/setup-auto-deploy.sh scripts/deploy.sh
python3 scripts/test-deploy.py
```

### Optional: dockerized

```bash
docker run -d --name portfolio \
  -p 8080:80 \
  -v "$PWD/dist:/usr/share/nginx/html:ro" \
  nginx:alpine
```

Add a reverse proxy in your router/firewall to expose port 8080 (or 443 with
TLS via a Caddy/Traefik/certbot layer) if you want it public.

## Writing blog posts

Add a markdown file to `src/content/blog/`:

```md
---
title: 'My Post Title'
description: 'Short summary shown on the blog index.'
pubDate: 2026-01-01
tags: ['networking', 'linux']
---

Your content here...
```

- `tags` are optional but enable the tag filter on the blog index.
- `updatedDate` is optional.
- Set `draft: true` to keep a post from being published.

## Customizing

- `src/lib/site.ts` — name, links, email, socials
- `src/styles/global.css` — Nord design tokens and global styles
- `src/content/blog/` — your posts
- 
