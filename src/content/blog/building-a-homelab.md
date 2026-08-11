---
title: 'Building a Homelab: Lessons From Standing Up Proxmox'
description: 'My journey building a Proxmox-based homelab — the mistakes, the wins, and what I would tell my past self before starting.'
pubDate: 2026-07-20
tags: ['homelab', 'proxmox', 'infrastructure', 'linux']
---

I spent months reading about homelabs before finally committing to one. The articles
made it look like a weekend project — install Proxmox, spin up a few VMs, call it a day.
It isn't. Here's what actually happened, in roughly the order it happened.

## The hardware problem

Everyone starts with hardware. I had an old desktop I wasn't using, and a used server
with a Xeon that someone was giving away. I chose the desktop. Regret number one: power
consumption and noise matter more than raw specs. A silent, modest machine you leave on
24/7 beats a jet engine you turn off every night.

## First boot, first panic

Installing Proxmox itself is the easiest part — it's a Debian installer with extra steps.
The real fun starts after:

```bash
# fix the classic no-dashboard-after-install moment
systemctl status pveproxy
```

If `pveproxy` is running and you still can't reach the web UI, it's almost always a
firewall or network bridge misconfiguration, not a broken install. Check the bridge:

```bash
ip addr show vmbr0
```

## What actually runs on it now

After several iterations, my current stack is deliberately small:

- **Pi-hole** — network-wide ad and tracker blocking
- **Grafana + Prometheus** — metrics from the whole host
- **Navidrome** — self-hosted music
- **Samba** — file shares for the house
- **Wazuh** — the security layer I'm actively learning

## The real lesson

The homelab's value isn't the services — it's the operational muscle you build. I've
learned more about networking, DNS, backups, and Linux administration from this box than
from any single course. Break it, fix it, document it, repeat.

## If I started over

1. Start with one service, not five
2. Back up the config before you touch anything
3. Put everything in Docker LXC containers, not VMs
4. Write down your network scheme on day one

A homelab isn't a project you finish. It's a place you keep going back to.
