---
title: "Comment j'ai construit et auto-hébergé mon portfolio sur mon homelab — pour 6 €"
description: "De l'installation d'Astro au déploiement derrière Cloudflare Tunnel sur un conteneur Proxmox, sans ouvrir le moindre port sur mon routeur."
pubDate: 2026-08-26
tags: ['astro', 'homelab', 'proxmox', 'cloudflare', 'selfhosted', 'infrastructure']
---

> Ce billet raconte comment ce site est né : la stack technique, l'infrastructure
> maison, et la manière dont j'ai tout relié sans exposer le moindre port sur mon
> réseau — et pour seulement 6 € par an.

---

## 1. Pourquoi auto-héberger ?

Avant de parler de *comment*, parlons de *pourquoi*.

J'aurais pu déposer un template sur Netlify, Vercel ou GitHub Pages en cinq minutes,
gratos, et le sujet serait clos. Mais je suis en formation **infrastructure et
réseaux**. Mon homelab — un Proxmox dans un conteneur LXC — existe pour que je
comprenne ce qui se passe *sous* le code, pas seulement *dans* le code.

Héberger mon propre site, c'est :

- poser un serveur web sur une machine que j'administre ;
- exposer ce site sans faille de sécurité (aucun port ouvert) ;
- montrer que je sais faire ce que je veux apprendre.

Et comme bonus, je contrôle tout. Pas de builder propriétaire, pas de limite de bande
passante, pas de certificat à renouveler à la main.

## 2. Le domaine : 6 € sur Namecheap

Le point de départ, c'est le nom de domaine. J'ai choisi **7n4xt.com** — mon pseudo
depuis toujours — acheté chez **Namecheap** pour **6 € par an**. Pas un centime de plus.
Un nom de domaine, c'est le seul achat récurrent de ce projet.

## 3. La stack frontend : Astro 4

Le site lui-même est construit avec **Astro 4**. Pourquoi Astro plutôt qu'un framework
JS lourd ?

- **Statique par défaut.** Astro génère du HTML pur à la compilation. Pas de JS côté
  client sauf quand j'en ai explicitement besoin (le terminal qui tape tout seul, la
  grille GitHub qui fetch l'API en direct).
- **Markdown natif.** Les articles de blog sont de simples fichiers `.md` dans
  `src/content/blog/`. Astro les transforme en pages au build.
- **Composants.** Même sans framework frontend, Astro permet de découper le site en
  composants réutilisables (Hero, About, Skills, Footer...).
- **Léger.** Le build tient dans 300 Ko, trois fichiers CSS et un micro-module JS.

Le thème visuel est une adaptation de la palette **Nord** — ces bleus-gris arctiques
que j'utilise partout, de mon terminal à mon IDE — avec des accents monospace et une
ambiance « terminal » qui colle à ma pratique quotidienne.

## 4. L'infrastructure : Proxmox et LXC

Côté serveur, tout tourne sur **mon homelab Proxmox**. Pas un VPS loué, pas une VM
cloud — ma propre machine, chez moi, à Marseille.

L'application est isolée dans un **conteneur LXC** (un conteneur Linux, plus léger
qu'une VM complète) que j'ai baptisé `PORTFOLIO-NGINX`. Dedans :

- **nginx** sert les fichiers statiques produits par Astro
- **Git** me permet de pull les mises à jour depuis GitHub
- **Node.js** compile le projet sur place

Le workflow de déploiement est simple :

```bash
git pull
npm ci && npm run build
cp -r dist/* /var/www/about-me/dist/
systemctl reload nginx
```

Rien d'automatisé encore — pas de CI/CD, pas de GitHub Actions. C'est manuel. Mais
c'est du temps gagné à comprendre la mécanique plutôt qu'à ajouter des couches.

## 5. La partie la plus intéressante : zéro port ouvert

Le problème d'un serveur chez soi, c'est la sécurité. Ouvrir le port 80 ou 443 sur son
routeur, c'est exposer son réseau domestique à Internet. Même avec un bon pare-feu,
c'est une surface d'attaque supplémentaire que je ne veux pas.

La solution s'appelle **Cloudflare Tunnel** (anciennement `argo tunnel`). Le principe
est aussi simple qu'élégant :

1. J'installe un démon **cloudflared** sur le serveur
2. Le démon établit une **connexion sortante** vers Cloudflare
3. Quand un visiteur tape `7n4xt.com`, Cloudflare reçoit la requête et la transmet
   *via* le tunnel jusqu'à mon serveur
4. **Aucune règle de port** sur mon routeur. Rien. Pas même une redirection.

C'est une connexion inverse : c'est mon serveur qui parle à Cloudflare, pas l'inverse.
Si quelqu'un essaie de scanner mon IP publique, il ne trouve que mon routeur, rien
d'autre.

Le tunnel est chiffré de bout en bout — Cloudflare délivre automatiquement un
certificat HTTPS aux visiteurs, donc le site est en HTTPS sans que j'aie touché à
certbot.

## 6. La configuration du tunnel

Concrètement, sur le serveur :

```bash
# Installation
apt install cloudflared

# Authentification (ouvre un lien dans le navigateur)
cloudflared tunnel login

# Création du tunnel
cloudflared tunnel create portfolio

# Fichier de configuration (/etc/cloudflared/config.yml)
# tunnel: portfolio
# credentials-file: /root/.cloudflared/<uuid>.json
# ingress:
#   - hostname: 7n4xt.com
#     service: http://localhost:80
#   - hostname: www.7n4xt.com
#     service: http://localhost:80
#   - service: http_status:404

# Routage DNS (crée les enregistrements CNAME chez Cloudflare)
cloudflared tunnel route dns portfolio 7n4xt.com

# Installation en service systemd
cloudflared service install
systemctl start cloudflared
```

Une fois le service lancé, plus besoin d'y toucher. Il redémarre tout seul avec la
machine et maintient la connexion permanente.

## 7. Ce que j'ai appris en faisant ça

Ce projet m'a appris plus de choses que n'importe quel exercice de cours :

- **Configurer nginx** proprement (MIME types, cache, fallback SPA)
- **Comprendre le DNS** au-delà de la théorie (TTL, enregistrements CNAME, proxy
  Cloudflare)
- **Maîtriser systemd** pour qu'un service survive à un redémarrage
- **Dépanner un tunnel** quand la connexion se coupe
- **Chiffrer sans certbot** — Cloudflare Origin CA suffit

Et surtout, j'ai appris qu'on peut mettre un site en production **sans exposer son
réseau**, avec une stack qui coûte 6 € par an et qui tient sur un conteneur LXC.

## 8. Et après ?

La prochaine étape, c'est l'automatisation : un hook GitHub qui rebuild le site
automatiquement sur le serveur à chaque push, et peut-être une base de données pour
rendre le blog plus dynamique. Mais ça, ce sera pour un autre article.
