---
title: 'Why I Started Playing CTFs (and Kept Going)'
description: 'Capture The Flag competitions are the best teacher I have found for practical security. Here is how I use them and what I get out of it.'
pubDate: 2026-06-14
tags: ['security', 'ctf', 'hackthebox', 'learning']
---

There's a gap between reading about security and understanding it. CTFs are how I bridge
that gap. A good challenge doesn't tell you the answer — it drops you in front of an
environment and lets you make the mistakes that teach you.

## What I actually play

I'm on **HackTheBox** and **Root-Me**, with the occasional local CTF when one comes up.
I started with the easy machines and boxed myself into a corner thinking I needed to know
everything first. You don't. You need to be curious enough to start.

## My process per challenge

1. **Recon before anything else.** `nmap -sC -sV target` and read the output properly.
2. **Take notes.** Every port, every version, every weird response. It saves hours.
3. **Try the obvious first.** Default credentials, unauthenticated endpoints. The easy
   win is a real win.
4. **Only then look for help.** If I'm stuck, I write down what I tried, then go hunting.

## What it teaches you

The biggest thing CTFs taught me isn't a tool or a technique — it's how to think.
Systems leak information. Attackers chain those leaks. Defenders need to see their own
infrastructure the way an attacker does, and CTFs are the cheapest way to practice that
perspective.

## Why it makes me a better defender

When I go back to my own homelab after a challenge, I look at it differently. I see the
default service banners I left running, the dashboard with no auth, the firewall rules I
never actually tested. Fixing those is the whole point.

Try one box this weekend. Not to win — to learn how to lose productively.
