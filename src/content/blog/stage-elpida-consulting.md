---
title: 'Mon stage chez ELPIDA CONSULTING : concevoir un Service IA de bout en bout'
description: 'Retour d’expérience complet sur mon stage de 5 semaines chez ELPIDA CONSULTING — du framework à composants à l’agent IA, en passant par Kafka, le Machine Learning et l’API. Bilan personnel, difficultés rencontrées et impact sur mon projet professionnel.'
pubDate: 2026-08-14
tags: ['stage', 'elpida', 'python', 'ia', 'microservices', 'kafka', 'backend']
---

> Ce billet est mon rapport de stage : il décrit le cadre de l'expérience, le travail
> réalisé, les compétences mises en œuvre, puis un bilan personnel honnête sur ce que ce
> stage m'a apporté — et ce qu'il m'a coûté.

---

## 1. Le cadre général du stage

Toute expérience professionnelle commence par un cadre. Le mien était clair dès le premier
jour, et je le restitue ici dans ses grandes lignes.

### 1.1 L'entreprise

Mon stage s'est déroulé au sein de la société **ELPIDA CONSULTING** :

- **Raison sociale** : ELPIDA CONSULTING
- **SIRET** : 89096550200036
- **Représentée par** : M. MOUANDA BIYOGHE Adris, en sa qualité de Président
- **Coordonnées** : +33 7 52 36 96 71 · amouanda@elpida-consulting.com
- **Lieu du stage** : à distance (travail depuis mon domicile à Marseille)

### 1.2 Le secteur d'activité et le marché

ELPIDA CONSULTING évolue dans le secteur des **services numériques et du développement
logiciel**, avec une spécialisation marquée autour de trois axes : la **programmation
Python**, l'**intégration de microservices** et le **développement d'agents IA**. Le
marché de l'entreprise est celui des solutions logicielles d'aide à la décision : ses
clients sont des acteurs de la **restauration et du commerce de détail** qui cherchent à
mieux comprendre leur activité à partir de leurs données. C'est un segment en pleine
croissance, où la demande d'outils capables de transformer des données brutes en
suggestions exploitables dépasse largement l'offre existante.

### 1.3 La durée du stage

La convention de stage prenait effet le **1ᵉʳ juillet 2026** pour s'achever le
**7 août 2026**, soit une durée totale de **5 semaines** correspondant à
**168 heures effectuées** au sein de l'organisme d'accueil.

### 1.4 Les objectifs du stage

Les objectifs définis en début de convention étaient les suivants :

- la programmation Python appliquée à un projet réel ;
- le développement logiciel et l'intégration de microservices ;
- le déploiement sur le cloud ;
- le développement d'un agent IA.

![Vue d'ensemble du système développé pendant le stage](/photos/elpida-architecture.svg)

---

## 2. Le travail réalisé : du framework à composants au Service IA

Le cœur de ma mission était de construire un **Service IA** complet : un système
Python modulaire, configurable et scalable, capable de produire des suggestions
commerciales à partir des données de vente d'une enseigne, et d'interagir avec un
utilisateur via un agent conversationnel intelligent.

### 2.1 Un framework maison : l'architecture à composants

La première difficulté de conception était aussi la plus importante : **comment rendre
l'application modulaire et scalable ?** La réponse a été une architecture à composants
entièrement pensée en **programmation orientée objet**.

L'idée, que je formule avec une analogie que j'utilise encore aujourd'hui, est de
considérer l'application comme un **PC monté sur mesure**. On trouve :

- une **carte mère** (`Context`), le singleton qui orchestre tout le système ;
- des **composants enfichables** (`Component`), à la manière d'une carte graphique ou
  d'un disque dur : base de données, cache, messagerie, agent, API ;
- un **manuel** (`config.json`) qui indique à la carte mère quels composants sont
  installés, quelles sont leurs configurations et comment ils se connectent les uns aux
  autres.

Chaque composant hérite d'une classe de base abstraite (`Component`) qui définit un
**cycle de vie** standard : `connect()`, `onEnterLoopBefore()`, `onEnterLoop()`,
`onEnterLoopAfter()`, puis `disconnect()` dans l'ordre inverse. Le framework gère
l'**injection de dépendances** via un registre (`@registry`) et une fabrique
(`component_factory`), ce qui signifie que les composants ne se connaissent pas
directement : ils déclarent leurs dépendances, et le `Context` les câble.

Cette séparation des responsabilités rend l'ensemble **configurable sans toucher au
code** : changer de base de données, déplacer un service ou modifier des identifiants se
fait en modifiant uniquement `config.json`.

### 2.2 Les composants d'infrastructure

J'ai implémenté successivement les composants suivants :

- **PostgreSQL** — base de données relationnelle principale, via `psycopg2`, avec des
  requêtes paramétrées pour éviter toute injection SQL ;
- **Redis** — cache haute performance, utilisé notamment pour stocker les suggestions et
  l'historique de conversation actif, avec des listes de contrôle d'accès ;
- **InfluxDB** — base de données de séries temporelles ;
- **Kafka** — plateforme de messagerie en mode KRaft, avec un producteur et un
  consommateur implémentés comme composants.

L'ensemble était orchestré via **Docker Compose**, chaque service possédant son propre
Dockerfile, et PostgreSQL étant initialisé avec un jeu de données de démonstration
(`fake_database.sql`).

### 2.3 L'architecture événementielle

L'un des moments clés du stage a été le passage à une **architecture événementielle**.
Au départ, les pipelines de traitement n'étaient pas déclenchés par des événements : le
système fonctionnait de manière plus « procédurale ». J'ai analysé moi-même ce manque
dans mes notes, puis j'ai proposé un plan en cinq étapes :

1. ajouter une méthode `eventReceived` au cycle de vie des composants ;
2. convertir les messages Kafka en événements ;
3. router ces événements vers les composants concernés ;
4. implémenter le traitement dans `AgentSales` ;
5. mettre à jour `config.json`.

J'ai ensuite réalisé cette évolution : le framework expose désormais un hook
`eventReceived(topic, record)` et le `KafkaConsumer` achemine les messages reçus vers le
composant approprié. C'est ce qui a transformé le système d'une simple collection de
services en une **architecture véritablement orientée événements**, où les composants
réagissent aux événements au lieu de s'appeler les uns les autres.

### 2.4 L'agent de vente : du Machine Learning aux suggestions

Le composant central est **`AgentSales`**, un agent d'aide à la décision commerciale.
Son fonctionnement repose sur une chaîne de traitement complète :

- un **agrégateur** (`SalesAggregator`) construit, avec `pandas`, un jeu de
  caractéristiques à partir des tables `paniers`, `panier_lignes` et
  `panier_ligne_option` — environ **23 features** par panier ;
- un **entraîneur** (`Trainer`) entraîne un **RandomForestClassifier** avec
  `scikit-learn`, en utilisant `class_weight="balanced"` pour gérer le déséquilibre des
  classes, et calcule les métriques de performance (précision, rappel, F1) ainsi que les
  importances de caractéristiques ;
- à l'exécution, l'agent charge le modèle, regroupe les paniers récents par enseigne,
  calcule une **probabilité moyenne de confirmation** via `predict_proba` et publie des
  suggestions sur le topic Kafka `sales-suggestions` (ex. `follow_up_high_value`,
  `monitor_active`).

Le modèle entraîné est persisté (`sales_model.pkl`), et l'agent gère les cas limites :
jeu de données trop petit, absence de modèle, données manquantes — avec un repli élégant
plutôt qu'une erreur fatale.

### 2.5 Le service de suggestions et la prévention de l'effet « troupeau »

Autour de l'agent, j'ai conçu un **`SuggestionService`** dont le rôle est de fournir des
suggestions rapidement sans écraser la base de données. La solution retenue :

- un cache **Redis** avec une durée de vie (TTL) de 900 secondes ;
- une détection de **fraîcheur** des données ;
- un **rafraîchissement en arrière-plan protégé par verrou** : si plusieurs requêtes
  arrivent en même temps alors que le cache est vide, une seule d'entre elles déclenche
  réellement le calcul ; les autres attendent le verrou. C'est une prévention explicite
  du phénomène connu sous le nom de *cache stampede* (effet troupeau).

Cette préoccupation — « et si 10 clients demandent la même chose en même temps ? » — est
typique des questions de montée en charge qui m'intéressent particulièrement.

### 2.6 L'agent conversationnel : l'IA générative appliquée

La dernière brique était un **agent conversationnel** (`LLMChat`) reposant sur l'API de
**DeepSeek** via le SDK OpenAI, avec un modèle `deepseek-chat`. L'agent est conçu pour
l'**appel d'outils** (*tool calling*) : trois fonctions lui sont exposées
(`get_sales_suggestions`, `get_recent_orders`, `get_cache_status`) qu'il peut invoquer
pour répondre aux questions d'un utilisateur sur les ventes.

Deux points méritent d'être soulignés :

- **l'historique de conversation à double couche** : Redis sert de cache rapide pour les
  conversations actives, tandis qu'une table PostgreSQL (`conversation_history`, format
  JSONB) archive les échanges pour un usage ultérieur ;
- **le double mode** : un mode `test` qui renvoie des réponses simulées — indispensable
  pour les démonstrations sans dépendre d'un service externe — et un mode `prod` qui
  interroge réellement les services.

### 2.7 L'API REST et la sécurité

Le tout est exposé via une **API REST** : `GET /suggestions/sales?enseigne_id=...` et
`POST /chat`. J'ai implémenté un serveur HTTP à pool de threads
(`ThreadPoolHTTPServer`, 10 workers) et, surtout, une **protection par clé API**
(vérification d'un en-tête) pour l'ensemble des routes.

J'ai également appliqué les bons réflexes de sécurité appris sur mes projets précédents :

- **aucune clé API en dur dans le code** : la clé DeepSeek est lue depuis une variable
  d'environnement `LLM_TOKEN`, avec repli sur `config.json` ;
- **requêtes SQL paramétrées** systématiques, avec commentaire explicite expliquant le
  choix du pattern pour éviter l'injection.

### 2.8 La qualité logicielle

Dernier apport significatif : le projet dispose désormais de sa première suite de
**tests unitaires** (5 modules) — tests du gestionnaire d'API, du gestionnaire de chat,
du client LLM (avec client OpenAI simulé), des prompts et des outils. La mise en place
de tests a considérablement renforcé ma confiance dans le code produit.

![Outils, technologies et méthodes utilisés](/photos/elpida-stack.svg)

---

## 3. Le rôle, les responsabilités et l'organisation du travail

### 3.1 Mon rôle et mes activités

Mon rôle au sein de l'entreprise était celui d'**apprenti développeur** sur le projet
« Service IA ». Ce rôle couvrait des activités multiples et complémentaires :

- conception et implémentation du framework à composants ;
- développement des composants d'infrastructure (bases de données, Kafka) ;
- construction de la chaîne de Machine Learning (agrégation, entraînement, inférence) ;
- conception du service de suggestions avec cache ;
- intégration de l'agent conversationnel (LLM) ;
- réalisation de l'API REST ;
- rédaction de tests unitaires ;
- documentation technique du projet.

### 3.2 Rattachement hiérarchique et collaborations

J'étais **rattaché à M. MOUANDA BIYOGHE Adris**, Président d'ELPIDA CONSULTING, qui
supervisait le projet et assurait également le rôle de **tuteur technique**. Développeur
expérimenté, il suivait mon avancement commit après commit, relisait mon code et me
guidait sur les choix d'architecture avec un niveau d'exigence élevé.

Cette configuration — un encadrement unique assurant à la fois le pilotage du projet et
le suivi technique — m'a obligé à être **précis dans ma communication** : je devais
expliquer mon travail de manière synthétique et technique, tout en conservant une
visibilité constante sur l'avancement du projet.

### 3.3 L'organisation du travail en équipe

Le travail s'organisait à distance, avec des échanges réguliers. Le mode de
communication principal était écrit et asynchrone, via **Git/GitHub** (les revues de
code se faisaient sur les commits) et **Discord**, qui servait de canal de discussion
quasi-quotidien avec mon tuteur — un outil que je connaissais bien, mais que je découvrais
sous un angle professionnel. Les échanges se déroulaient en **français**, ce qui
constituait un exercice en soi pour un documenté technique.

L'organisation était la suivante : mon tuteur exprimait des exigences sous forme de
demandes courtes et ciblées ; je réfléchissais à l'architecture, je proposais une
approche, je l'implémentais et je la soumettais à validation. Ce cycle « proposition →
implémentation → revue → itération » est devenu ma routine quotidienne et reste, je
crois, la manière la plus efficace de progresser.

### 3.4 Les méthodes et outils utilisés

Au-delà des technologies décrites plus haut, ce stage m'a appris des **méthodes** de
travail précieuses :

- **Git et GitHub** comme outil de collaboration : commits réguliers et annotés,
  historiques clairs, revues de code ;
- **l'apprentissage assisté par IA** : j'ai utilisé des assistants de programmation
  comme tuteurs personnalisés, avec des consignes précises (« explique-moi comme à un
  débutant, avec des analogies, en me disant toujours *pourquoi* »). Cette méthode a
  accéléré ma montée en compétence de manière spectaculaire ;
- **la documentation comme outil de compréhension** : j'ai rédigé des guides techniques
  du projet (explication du framework, guide d'intégration du Machine Learning) dans
  lesquels j'expliquais le fonctionnement à quelqu'un qui découvrirait le code.

---

## 4. La mise en œuvre de ma curiosité, créativité et autonomie

Le grille d'évaluation d'un stage s'attache souvent à ce qui ne figurait pas dans le
cahier des charges. Voici quelques exemples concrets, tirés de mon quotidien, où je n'ai
pas attendu d'instructions.

### 4.1 J'ai anticipé l'architecture événementielle

Mon tuteur n'avait pas demandé explicitement de rendre le système événementiel. C'est en
analysant le code existant que j'ai identifié le manque : *« à l'état actuel du code,
les pipelines ne sont pas déclenchés par un événement Kafka, et `Component` n'a pas de
méthode `eventReceived` »*. Plutôt que de le signaler et d'attendre, j'ai rédigé un plan
en cinq étapes et je l'ai **implémenté**. Cette anticipation a été décisive pour la
qualité finale du livrable.

### 4.2 J'ai débusqué une incohérence de schéma de données

En étudiant les tables de la base, j'ai constaté que la colonne `panier_id` de la table
`panier_ligne_option` contenait en réalité des identifiants de *lignes* de panier, et
non de paniers. J'ai documenté ce décalage et **remappé les identifiants** pour obtenir
des données cohérentes avant de les faire passer dans le pipeline de Machine Learning.
Sans cette correction, le modèle aurait été entraîné sur des données erronées.

### 4.3 J'ai prévenu l'effet « troupeau » sur le cache

La prévention du *cache stampede* dans le `SuggestionService` n'a pas été demandée : je
l'ai ajoutée parce que je me suis posé la question « que se passe-t-il si beaucoup de
requêtes arrivent simultanément ? ». C'est ce type de questionnement, je pense, qui
distingue un développeur qui reproduit un code d'un développeur qui conçoit un système.

### 4.4 J'ai rendu le code plus sûr

J'ai systématiquement remplacé les clés en dur par des variables d'environnement,
paramétré les requêtes SQL et documenté mes choix de sécurité. Ce sont des réflexes que
je tiens de mon intérêt pour la cybersécurité, et qui n'ont pas été dictés par le cahier
des charges.

### 4.5 J'ai construit mes propres outils d'apprentissage

Plutôt que de me contenter des ressources généralistes, j'ai rédigé un « prompt maître »
destiné aux assistants IA, calibré exactement à mon niveau et à mon projet, pour obtenir
des explications sur mesure. J'ai également produit des documents pédagogiques qui me
servaient à la fois à comprendre et à transmettre.

---

## 5. Bilan personnel de l'expérience

### 5.1 Mon ressenti

Je ressort de ce stage avec un sentiment partagé, mais majoritairement positif. D'un
côté, la fierté d'avoir livré un système complet et fonctionnel — du framework au service
LLM — dont je comprends chaque ligne. De l'autre, l'humilité que procure la confrontation
avec un code professionnel et des exigences élevées. Ce stage m'a confirmé que j'aime
profondément ce que je fais : concevoir des systèmes, résoudre des problèmes, et voir
des briques s'assembler pour former un tout cohérent.

### 5.2 Ma progression professionnelle

Mon évolution au cours des 5 semaines est mesurable. En début de stage, mes commits
étaient hésitants, mes messages peu professionnels, et mon approche du code, parfois
brouillonne. En fin de stage, j'écrivais des messages de commit clairs et structurés,
je réfléchissais en termes d'architecture avant d'écrire une ligne de code, et j'avais
internalisé des concepts que je ne connaissais pas cinq semaines plus tôt : injection de
dépendances, cycle de vie des composants, architecture événementielle, pipeline de
Machine Learning, appel d'outils LLM.

![Phases du stage, de la découverte à la livraison](/photos/elpida-timeline.svg)

### 5.3 Les difficultés rencontrées : forces et faiblesses

Le critère d'évaluation le plus exigeant pour moi a été la **confrontation au niveau
d'exigence d'un développeur vétéran**. Mon tuteur savait exactement ce qu'il voulait —
un système modulaire, configurable, scalable, pensé en programmation orientée objet — et
il avait une vision très claire de la qualité. Mes premières propositions n'ont pas
toujours atteint ce niveau : il a fallu **revoir le code, le refactoriser, le faire
évoluer** pour correspondre à ses critères. Cette expérience de l'itération sous
contrainte est exactement ce qui fait progresser, mais elle a été rude.

De la même manière, la **maîtrise de Kafka et de l'architecture événementielle** a
constitué une courbe d'apprentissage abrupte pour quelqu'un qui découvrait la
messagerie : comprendre les concepts de topics, de consommateurs, d'événements, puis les
faire cohabiter avec le framework à composants a pris du temps et plusieurs essais
infructueux.

Enfin, l'**incohérence du schéma de données** (`panier_id` versus `ligne_id`) m'a
enseigné que je devais remettre en cause ce que je lisais : j'ai eu tendance, au début,
à faire confiance à la structure de données au premier degré, avant d'apprendre à la
vérifier.

**Ce que ces difficultés ont révélé :**

- **mes forces** : ma capacité d'analyse (j'ai identifié le problème du schéma seul),
  ma persévérance (je suis resté sur Kafka jusqu'à le maîtriser), et mon autonomie (je
  n'ai pas attendu que l'on me dise quoi faire) ;
- **mes faiblesses** : une tendance à surestimer la difficulté estimée d'un concept
  avant de le maîtriser (Kafka), et une confiance parfois excessive dans les données
  telles qu'elles se présentent, sans vérification critique systématique.

Ces faiblesses ne sont pas des fatalités : ce sont des axes de travail identifiés, et je
les ai déjà commencé à corriger — je vérifie désormais systématiquement la structure des
données avant de les traiter.

---

## 6. Impact du stage sur mon projet professionnel

Ce stage a eu un impact décisif sur mon projet professionnel, à deux niveaux.

**Sur le fond**, il a considérablement élargi mon champ de compétences. Ma formation et
mes projets personnels m'orientaient vers les **réseaux, l'infrastructure et la
sécurité** — mon homelab Proxmox, mes expériences avec Wazuh, mes CTF. Ce stage m'a
emmené sur un terrain complémentaire : le **backend, les microservices, l'architecture
événementielle, le Machine Learning et l'IA générative**. Je me découvre désormais une
double trajectoire possible : celle de l'ingénieur infrastructure qui construit des
systèmes fiables, et celle du développeur backend qui construit des systèmes
intelligents.

**Sur la forme**, ce stage m'a appris à travailler comme un professionnel : communiquer
avec des encadrants, itérer sur un code existant, respecter des exigences de qualité
élevées, documenter mon travail. Ces compétences transversales sont, j'en suis convaincu,
aussi précieuses que les compétences techniques.

En conclusion, ce stage chez ELPIDA CONSULTING ne fut pas simplement une validation de
formation : il a confirmé que je veux faire de l'ingénierie logicielle et de
l'infrastructure mon métier, et il m'a donné les outils pour continuer à progresser — un
système à livrer, des compétences à développer, et la certitude que la rigueur et la
curiosité sont les deux moteurs qui comptent. Je repars avec un projet dont je suis fier,
des erreurs que j'assume, et une trajectoire professionnelle clarifiée.
