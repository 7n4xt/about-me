---
title: 'Wazuh on a Homelab: Turning a Honeypot Into a SIEM'
description: 'How I connected a honeypot to a Wazuh SIEM for real-time alerting — and what the setup actually looks like end to end.'
pubDate: 2026-05-30
tags: ['security', 'wazuh', 'siem', 'homelab']
---

A honeypot that logs to a file is a curiosity. A honeypot that feeds a SIEM is a learning
instrument. This post is the bridge between the two — the full pipeline I run at home to
watch who knocks on my network.

## The topology

```
Internet ──▶ Home Router ──▶ Honeypot VM
                                 │  (logs every attempt)
                                 ▼
                         Wazuh Manager
                                 │
                                 ▼
                     Alerting / Dashboard
```

The honeypot runs on an isolated VM so a compromised honeypot can't reach anything real.
Wazuh sits on its own VM, ingests the events, and raises alerts.

## Hooking the honeypot into Wazuh

Wazuh's agent has a `localfile` mode that reads custom log sources. My honeypot writes
JSON lines to a log, and Wazuh ingests that with a custom decoder:

```xml
<localfile>
  <log_format>json</log_format>
  <location>/var/log/honeypot/events.log</location>
</localfile>
```

From there I wrote a decoder and rules in `local_rules.xml` so known attack patterns
(port scans, SSH bruteforce, admin-path probing) map to alert levels instead of
overwhelming the dashboard with raw noise.

## The first alert

The first real alert that fired — `possible SSH bruteforce from <IP>` — was oddly
satisfying. An IP in some far-flung block trying to guess credentials on a box that has
no real credentials. The telemetry confirmed what I suspected: the internet is noisy, and
your network needs to be built to ignore the noise and flag the signal.

## What I changed after seeing the data

Looking at months of alerts changed my hardening priorities:

1. **Fail2ban everywhere.** Brute force is the single most common thing I see.
2. **Change default ports on exposed services.** It's not security, but it cuts noise.
3. **Segment everything.** The honeypot taught me segmentation isn't paranoia.

## Try it

If you have a spare VM, stand this up. Honeypot + SIEM + alerting is one of the most
educational security setups you can run at home — and the alert feed never stops
teaching.
