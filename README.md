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
