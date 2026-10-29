/**
 * Translation catalogue.
 *
 * `en` is the reference: every key must exist there. `fr` is typed against it,
 * so a missing or misspelled key breaks the build instead of silently falling
 * through to English at runtime.
 *
 * Keys are flat and namespaced (`hero.title`, `blog.empty`) to keep lookups cheap
 * from both Astro components and the inline boot script.
 */

export const en = {
  // ---- meta
  'meta.homeTitle': '7n4xt — Abdulmalek Esughi | Networking & Infrastructure Student',
  'meta.homeDesc':
    'Portfolio of Abdulmalek Esughi (7n4xt) — networking & infrastructure student based in Marseille, France. CCNA in progress, cybersecurity background.',
  'meta.blogTitle': 'Blog',
  'meta.blogDesc':
    'Notes, write-ups and deep dives by Abdulmalek Esughi — networking, infrastructure, cybersecurity and homelab experiments.',
  'meta.404Title': '404 — page not found',

  // ---- nav
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.skills': 'Skills',
  'nav.projects': 'Projects',
  'nav.repos': 'Repos',
  'nav.blog': 'Blog',
  'nav.contact': 'Contact',
  'nav.hire': 'Hire me',
  'nav.toggleMenu': 'Toggle menu',
  'nav.primary': 'Primary',

  // ---- language switcher
  'lang.switchTo': 'Switch to French',
  'lang.label': 'Language',

  // ---- hero
  'hero.greeting': "Hi, I'm",
  'hero.systemOnline': 'system online',
  'hero.sub1': 'Networking & infrastructure student in',
  'hero.sub2':
    ', with a cybersecurity background. Working toward the',
  'hero.sub3':
    '— I stand up homelabs, harden systems, and break things on purpose to learn how they work.',
  'hero.viewWork': 'View my work',
  'hero.readBlog': 'Read the blog',
  'hero.downloadCV': 'Download CV',
  'hero.cvNote': 'Download the French CV (English version available below)',
  'hero.roles':
    'networking & infra student|working toward CCNA|homelab tinkerer|cybersecurity background|linux enjoyer',
  'hero.status': 'always learning',

  // ---- about
  'about.label': '// about',
  'about.title': 'From cyber foundations to network infrastructure',
  'about.subtitle':
    "I'm a networking & infrastructure student who started in cybersecurity — and that security mindset never left me. I like to understand how the whole stack fits together, from the physical NIC up to the services running on top.",
  'about.lead1a': 'From',
  'about.lead1b': 'to',
  'about.lead1c':
    ", I started with two years of cybersecurity studies, then moved into my true lane: networking and infrastructure. I'm now in my 3rd year, working toward the",
  'about.lead1d': ', and my homelab — ',
  'about.lead1e': ' — is my playground for learning how production systems behave.',
  'about.lead2':
    "I don't stop at theory. I self-host, I break, I rebuild, and I document everything I learn on this blog. That's how I go from \"knows about X\" to \"deployed X and fixed it when it broke at 2 AM.\"",
  'about.factLocation': 'location',
  'about.factOrigin': 'origin',
  'about.factCoffee': 'coffee',
  'about.factStatus': 'status',
  'about.factOriginValue': 'Libya → Europe',
  'about.factCoffeeValue': '[█████████░] critical',
  'about.factStatusValue': 'learning 24/7',
  'about.tl1Period': 'Now · 3rd Year',
  'about.tl1Role': 'Networking & Infrastructure',
  'about.tl1Org': 'CCNA in progress',
  'about.tl1Desc':
    'Deep-diving into network architectures, routing & switching, server administration, and virtualization — preparing for the CCNA while building resilient infrastructure on my Proxmox homelab.',
  'about.tl2Period': '2024 — 2025 · 1st–2nd Years',
  'about.tl2Role': 'Computer Science — Cybersecurity specialisation',
  'about.tl2Org': 'Cybersecurity foundations',
  'about.tl2Desc':
    'Focused on offensive and defensive security: Wazuh SIEM, Wireshark analysis, system hardening, and HackTheBox CTF grinding. Those two years gave me the security mindset I now apply to infrastructure.',
  'about.tl3Period': '2022 — 2023',
  'about.tl3Role': 'From Libya to Marseille : language & studies',
  'about.tl3Org': 'Integration in France',
  'about.tl3Desc':
    'Moved from Libya to Marseille at the end of 2022, then spent 2023 learning French full-time to prepare for computer science studies in a new country.',

  // ---- skills
  'skills.label': '// skills',
  'skills.title': 'A full-stack infrastructure toolkit',
  'skills.subtitle':
    'The tools and technologies I work with daily — focused on the layers that make networks and infrastructure secure and resilient.',
  'skills.groupNetworking': 'Networking & Infrastructure',
  'skills.groupNetworkingNote': 'the layers I live in',
  'skills.groupSecurity': 'Security',
  'skills.groupSecurityNote': 'break it to defend it',
  'skills.groupCode': 'Languages',
  'skills.groupCodeNote': 'tools of the trade',
  'skills.groupTools': 'Tools',
  'skills.groupToolsNote': 'daily drivers',
  'skills.itemLinux': 'Linux administration',
  'skills.itemCcna': 'CCNA (in progress)',
  'skills.itemProxmox': 'Proxmox / virtualization',
  'skills.itemDocker': 'Docker & containers',
  'skills.itemServers': 'Server administration',
  'skills.itemTroubleshooting': 'Network troubleshooting',
  'skills.itemSelfHosting': 'Self-hosting',
  'skills.itemWazuh': 'Wazuh SIEM',
  'skills.itemWireshark': 'Wireshark / packet analysis',
  'skills.itemHardening': 'System hardening',
  'skills.itemHoneypots': 'Honeypots',
  'skills.itemCtf': 'CTF (HackTheBox, Root-Me)',
  'skills.foot': 'in this category',

  // ---- projects
  'projects.label': '// projects',
  'projects.title': 'Featured projects',
  'projects.subtitle':
     'Projects across infrastructure, cybersecurity, and web development. Explore the code to see how they work.',
  'projects.viewSource': 'view source →',
  'projects.pNostroguard':
    'Live SaaS cybersecurity training platform — interactive security exercises delivered through a web platform.',
  'projects.pVaultCli':
    'Encrypted local password manager built in Python — secrets never leave your machine.',
  'projects.pHangmanWeb':
    'Car-themed web-based Hangman game built with Go — a fun take on the classic word game with a JDM twist.',
  'projects.pYmmoblier':
    'Full-stack real estate platform built with PHP MVC — property management with role-based dashboards for users, agents and admins.',
  'projects.pForumGo':
    'Modern discussion platform built with Go — search, categories, pagination and an admin panel.',
  'projects.pEDealership':
    'Web application for a premium performance car dealership — university project to sharpen JS skills.',
  'projects.pReseauLinux':
    'Complete Linux network infrastructure simulation — Nginx, DNS, MariaDB, WireGuard VPN, Samba, firewall and observability.',
  'projects.pPapery':
    'Web application for discovering, managing and enjoying high-quality wallpapers — a project exploring API integration.',
  'projects.pHangmanCli':
    'Console version of the classic Hangman word game built in Go — read words from a file, guess letters, track your attempts.',

  // ---- repos
  'repos.label': '// github',
  'repos.title': 'Live from GitHub',
  'repos.subtitle':
    'Public repositories fetched live from the GitHub API — always up to date.',
  'repos.querying': 'querying api.github.com/users/7n4xt/repos ...',
  'repos.count': 'repos · sorted by last push',
  'repos.noDesc': 'No description provided.',
  'repos.failed': '⚠ failed to reach GitHub API',
  'repos.errorTitle': 'could not fetch repositories — check network or rate limit.',
  'repos.errorCta': 'Open GitHub instead',
  'repos.viewAll': 'View all',
  'repos.viewAllSuffix': 'on GitHub',
  'repos.stars': 'Stars',
  'repos.forks': 'Forks',
  'repos.fork': 'fork',

  // ---- footer
  'footer.blurb1': '—',
  'footer.blurb2': 'From Libya, based in',
  'footer.blurb3': 'Always building, always breaking things to understand them.',
  'footer.navigate': 'Navigate',
  'footer.connect': 'Connect',
  'footer.reachOut': 'Reach out',
  'footer.email': 'Email',
  'footer.built': 'Built with',
  'footer.palette': '& the Nord palette.',

  // ---- blog
  'blog.backHome': '← back home',
  'blog.label': '// blog',
  'blog.title': 'Notes from the lab',
  'blog.subtitle': 'Write-ups, experiments and lessons learned while breaking things on purpose.',
  'blog.empty': 'no posts yet — the lab is still warming up.',
  'blog.all': '#all',
  'blog.readTime': 'min read',
  'blog.backToBlog': '← back to blog',
  'blog.updated': 'updated',
  'blog.morePosts': 'More posts',
  'blog.authorBio':
    'Networking & infrastructure student with a cybersecurity background — working toward the CCNA. Write me at',

  // ---- 404
  'nf.line1': '[err] request failed',
  'nf.line2': '[err] 404: page not found',
  'nf.hint': '$ suggest an alternative route ...',
  'nf.home': 'Go home',
  'nf.blog': 'Read the blog',
} as const;

export type Dict = { readonly [K in keyof typeof en]: string };
export type Key = keyof Dict;

export const fr: Dict = {
  // ---- meta
  'meta.homeTitle': '7n4xt — Abdulmalek Esughi | Étudiant Réseaux & Infrastructure',
  'meta.homeDesc':
    'Portfolio d’Abdulmalek Esughi (7n4xt) — étudiant en réseaux et infrastructure à Marseille. CCNA en préparation, parcours cybersécurité.',
  'meta.blogTitle': 'Blog',
  'meta.blogDesc':
    'Notes, write-ups et retours d’expérience d’Abdulmalek Esughi — réseaux, infrastructure, cybersécurité et homelab.',
  'meta.404Title': '404 — page introuvable',

  // ---- nav
  'nav.home': 'Accueil',
  'nav.about': 'À propos',
  'nav.skills': 'Compétences',
  'nav.projects': 'Projets',
  'nav.repos': 'Dépôts',
  'nav.blog': 'Blog',
  'nav.contact': 'Contact',
  'nav.hire': 'Recrutez-moi',
  'nav.toggleMenu': 'Ouvrir le menu',
  'nav.primary': 'Navigation principale',

  // ---- language switcher
  'lang.switchTo': 'Passer en anglais',
  'lang.label': 'Langue',

  // ---- hero
  'hero.greeting': 'Bonjour, je suis',
  'hero.systemOnline': 'en ligne',
  'hero.sub1': 'Étudiant en réseaux et infrastructure à',
  'hero.sub2': ', avec un parcours en cybersécurité. Je prépare le',
  'hero.sub3':
    ' — je monte des homelabs, je durcis des systèmes et je casse volontairement des choses pour comprendre comment elles fonctionnent.',
  'hero.viewWork': 'Voir mes projets',
  'hero.readBlog': 'Lire le blog',
  'hero.downloadCV': 'Télécharger le CV',
  'hero.cvNote': 'CV en français — version anglaise disponible plus bas',
  'hero.roles':
    'étudiant réseaux & infra|préparation CCNA|bricoleur de homelab|parcours cybersécurité|amateur de linux',
  'hero.status': 'toujours en apprentissage',

  // ---- about
  'about.label': '// à propos',
  'about.title': 'Des fondations cyber à l’infrastructure réseau',
  'about.subtitle':
    'Je suis étudiant en réseaux et infrastructure, arrivé par la cybersécurité — et ce réflexe sécurité ne m’a jamais quitté. J’aime comprendre comment toute la pile s’assemble, de la carte réseau physique jusqu’aux services qui tournent au-dessus.',
  'about.lead1a': 'De la',
  'about.lead1b': 'à',
  'about.lead1c':
    ', j’ai commencé par deux années d’études en cybersécurité, puis j’ai rejoint ma vraie voie : les réseaux et l’infrastructure. Je suis aujourd’hui en 3e année et je prépare le',
  'about.lead1d': ', et mon homelab — ',
  'about.lead1e':
    ' — est mon terrain de jeu pour apprendre comment se comportent des systèmes de production.',
  'about.lead2':
    'Je ne m’arrête pas à la théorie. J’héberge, je casse, je reconstruis et je documente tout ce que j’apprends sur ce blog. C’est comme ça que je passe de « connaît X » à « a déployé X et l’a réparé quand ça a lâché à 2 h du matin ».',
  'about.factLocation': 'localisation',
  'about.factOrigin': 'origine',
  'about.factCoffee': 'café',
  'about.factStatus': 'statut',
  'about.factOriginValue': 'Libye → Europe',
  'about.factCoffeeValue': '[█████████░] critique',
  'about.factStatusValue': 'apprentissage 24/7',
  'about.tl1Period': 'Aujourd’hui · 3e année',
  'about.tl1Role': 'Réseaux & Infrastructure',
  'about.tl1Org': 'CCNA en préparation',
  'about.tl1Desc':
    'Approfondissement des architectures réseau, du routage et du switching, de l’administration serveur et de la virtualisation — préparation du CCNA et construction d’une infrastructure résiliente sur mon homelab Proxmox.',
  'about.tl2Period': '2024 — 2025 · 1re et 2e années',
  'about.tl2Role': 'Informatique — spécialisation cybersécurité',
  'about.tl2Org': 'Fondations en cybersécurité',
  'about.tl2Desc':
    'Focus sur la sécurité offensive et défensive : SIEM Wazuh, analyse Wireshark, durcissement système et CTF sur HackTheBox. Ces deux années m’ont donné le réflexe sécurité que j’applique aujourd’hui à l’infrastructure.',
  'about.tl3Period': '2022 — 2023',
  'about.tl3Role': 'De la Libye à Marseille : langue et études',
  'about.tl3Org': 'Intégration en France',
  'about.tl3Desc':
    'Arrivé de Libye à Marseille fin 2022, j’ai passé 2023 à apprendre le français à plein temps pour préparer des études d’informatique dans un nouveau pays.',

  // ---- skills
  'skills.label': '// compétences',
  'skills.title': 'Une boîte à outils infra complète',
  'skills.subtitle':
    'Les outils et technologies que j’utilise au quotidien — centrés sur les couches qui rendent les réseaux et l’infrastructure sûrs et résilients.',
  'skills.groupNetworking': 'Réseaux & Infrastructure',
  'skills.groupNetworkingNote': 'les couches où je vis',
  'skills.groupSecurity': 'Sécurité',
  'skills.groupSecurityNote': 'casser pour mieux défendre',
  'skills.groupCode': 'Langages',
  'skills.groupCodeNote': 'les outils du métier',
  'skills.groupTools': 'Outils',
  'skills.groupToolsNote': 'usage quotidien',
  'skills.itemLinux': 'Administration Linux',
  'skills.itemCcna': 'CCNA (en préparation)',
  'skills.itemProxmox': 'Proxmox / virtualisation',
  'skills.itemDocker': 'Docker & conteneurs',
  'skills.itemServers': 'Administration serveur',
  'skills.itemTroubleshooting': 'Diagnostic réseau',
  'skills.itemSelfHosting': 'Auto-hébergement',
  'skills.itemWazuh': 'SIEM Wazuh',
  'skills.itemWireshark': 'Wireshark / analyse de paquets',
  'skills.itemHardening': 'Durcissement système',
  'skills.itemHoneypots': 'Honeypots',
  'skills.itemCtf': 'CTF (HackTheBox, Root-Me)',
  'skills.foot': 'dans cette catégorie',

  // ---- projects
  'projects.label': '// projets',
  'projects.title': 'Projets phares',
  'projects.subtitle':
    'Des projets en infrastructure, cybersécurité et développement web. Explorez le code pour comprendre leur fonctionnement.',
  'projects.viewSource': 'voir le code →',
  'projects.pNostroguard':
    'Plateforme SaaS de formation en cybersécurité — exercices de sécurité interactifs via une interface web.',
  'projects.pVaultCli':
    'Gestionnaire de mots de passe local et chiffré, écrit en Python — les secrets ne quittent jamais la machine.',
  'projects.pHangmanWeb':
    'Jeu du pendu web sur le thème automobile, développé en Go — une relecture du classique avec une touche JDM.',
  'projects.pYmmoblier':
    'Plateforme immobilière full-stack en PHP MVC — gestion des biens avec tableaux de bord par rôle (utilisateurs, agents, admins).',
  'projects.pForumGo':
    'Plateforme de discussion moderne développée en Go — recherche, catégories, pagination et panneau d’administration.',
  'projects.pEDealership':
    'Application web pour un concessionnaire de voitures de sport — projet universitaire pour affiner le JavaScript.',
  'projects.pReseauLinux':
    'Simulation complète d’une infrastructure réseau Linux — Nginx, DNS, MariaDB, VPN WireGuard, Samba, pare-feu et observabilité.',
  'projects.pPapery':
    'Application web pour découvrir, gérer et profiter de fonds d’écran de qualité — un projet autour de l’intégration d’API.',
  'projects.pHangmanCli':
    'Version console du jeu du pendu en Go — lecture des mots depuis un fichier, propositions de lettres et suivi des essais.',

  // ---- repos
  'repos.label': '// github',
  'repos.title': 'En direct de GitHub',
  'repos.subtitle':
    'Dépôts publics récupérés en direct via l’API GitHub — toujours à jour.',
  'repos.querying': 'interrogation de api.github.com/users/7n4xt/repos ...',
  'repos.count': 'dépôts · triés par dernier push',
  'repos.noDesc': 'Aucune description fournie.',
  'repos.failed': '⚠ API GitHub injoignable',
  'repos.errorTitle': 'impossible de récupérer les dépôts — vérifiez le réseau ou la limite de requêtes.',
  'repos.errorCta': 'Ouvrir GitHub',
  'repos.viewAll': 'Voir tous les dépôts de',
  'repos.viewAllSuffix': 'sur GitHub',
  'repos.stars': 'Étoiles',
  'repos.forks': 'Forks',
  'repos.fork': 'fork',

  // ---- footer
  'footer.blurb1': '—',
  'footer.blurb2': 'Originaire de Libye, basé à',
  'footer.blurb3': 'Toujours en train de construire, de casser pour comprendre.',
  'footer.navigate': 'Navigation',
  'footer.connect': 'Me joindre',
  'footer.reachOut': 'Contact',
  'footer.email': 'Email',
  'footer.built': 'Fait avec',
  'footer.palette': '& la palette Nord.',

  // ---- blog
  'blog.backHome': '← retour à l’accueil',
  'blog.label': '// blog',
  'blog.title': 'Notes du lab',
  'blog.subtitle':
    'Write-ups, expérimentations et leçons apprises en cassant des choses exprès.',
  'blog.empty': 'aucun article pour l’instant — le lab chauffe encore.',
  'blog.all': '#tous',
  'blog.readTime': 'min de lecture',
  'blog.backToBlog': '← retour au blog',
  'blog.updated': 'mis à jour le',
  'blog.morePosts': 'Plus d’articles',
  'blog.authorBio':
    'Étudiant en réseaux et infrastructure, parcours cybersécurité — préparation du CCNA. Écrivez-moi à',

  // ---- 404
  'nf.line1': '[err] requête échouée',
  'nf.line2': '[err] 404 : page introuvable',
  'nf.hint': '$ proposez une autre route ...',
  'nf.home': 'Retour à l’accueil',
  'nf.blog': 'Lire le blog',
};

export const dictionaries = { en, fr } as const;
export const DEFAULT_LANG = 'en';
export type Lang = keyof typeof dictionaries;

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'fr';
}
