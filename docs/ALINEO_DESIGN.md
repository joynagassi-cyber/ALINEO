# ALINEO — structure produit & direction UX/UI

**Version :** 0.1 — proposition de structure antérieure<br>
**Date :** 2026-11-23<br>
**Statut :** document historique de conception PAOS ; il n’est ni l’application réelle ni le périmètre produit courant.

> **Décision de périmètre actuelle :** ALINEO est le produit unique de ce dépôt et le hub décrit dans [`AGENT_HUB_DIRECTION.md`](AGENT_HUB_DIRECTION.md) en est la direction principale. L’application active sous `apps/openfuse/` porte la marque Alineo ; le nom OpenFuse reste uniquement comme provenance technique. `apps/alineo/` conserve l’ancienne interface artisanale rejetée, qui n’est pas réactivée. La direction visuelle courante est un shell graphite, une sidebar compacte, des panneaux flottants bordés et le logo ruban Alineo ; les icônes de service `thesvg` restent dédiées aux connecteurs. L’architecture de six espaces et la grille des 18 palettes plus bas restent des références historiques, pas un catalogue à ajouter à l’interface courante. Voir [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md). Les playbooks UX/UI sont des méthodes de travail et de qualité, pas des demandes de fonctionnalités.

Je prends comme brief fonctionnel la vision déjà fournie pour l’espace personnel agentique (Today, Projects, Calendar, Focus, Life Core, Habits), avec ses frontières de sécurité et son séquencement en lots. Je m’appuie sur les deux playbooks UX/UI joints. Je ne bloque pas le travail sur le prompt maître.

> **Principe de conception :** ALINEO aide à choisir et à suivre une prochaine action sans décider à la place de la personne. L’interface montre ce qui est connu, ce qui manque, ce qui est proposé et ce qui a réellement été appliqué.

## 1. Lecture des playbooks et règles appliquées

| Règle du playbook | Application dans ALINEO |
|---|---|
| Un écran répond à une intention ; l’action primaire domine. | Une action principale par écran, un verbe explicite dans chaque bouton, navigation stable. |
| Un dashboard sert à décider, pas à remplir l’espace. | Pas de KPI décoratifs dans l’état vide ; au plus trois indicateurs utiles quand des données réelles existent ; période et source affichées pour tout chiffre. |
| L’état vide est un véritable écran. | Il explique ce qui manque et pourquoi, propose une première action réelle, et ne simule ni tâche ni habitude. |
| Chaque écran se conçoit dans ses états vide, chargement, rempli, erreur, succès et ses cas limites. | Chaque fiche d’écran ci-dessous précise les états et le recours ; le prototype signale explicitement l’absence de connexion. |
| Mobile-first, grille de 8, deux familles typographiques maximum, cibles tactiles confortables. | Navigation mobile à cinq destinations principales, espacements sur l’échelle 4/8, police système, cibles ≥44 px. |
| L’agent n’est pas un chat avec un spinner. | Plan modifiable avant exécution, portée explicite, arrêt accessible, activité fondée sur des événements réels et résultat distinguant vérifié / à vérifier / non fait. |
| Le livrable est une source de vérité, avec contenu et règles explicites. | Ce document décrit l’IA, les écrans, les états, les lots et les tokens ; le prototype reste une maquette, pas une application connectée. |

Références utilisées : *UX/UI Playbook* (édition 2026), notamment pp. 28, 32, 42–45, 55–60, 89–93, 109–116, 119–122 et 139–148 ; *Kit bonus*, notamment les fiches d’audit 40 points, de passation, de vérification IA et de rapport d’agent. Le [crosswalk des fonctionnalités, questionnaires et critères de contrôle](UX_UI_PLAYBOOK_CROSSWALK.md) répond aux questions repérables dans les deux PDF et précise ce qui n’est pas une fonctionnalité produit.

**Écart volontaire au playbook :** la page sur l’interaction agentique suggère une valeur par défaut lors de certaines clarifications. Pour ALINEO, aucune pratique, heure, durée, disponibilité, cible, priorité ou préférence personnelle n’est préremplie. Une inconnue reste inconnue ; l’agent peut poser jusqu’à trois questions utiles, sans inventer de valeur personnelle. Les exemples visuels du playbook ne sont ni copiés ni repris comme données.

## 2. Positionnement et premier succès

- **Pour qui :** non défini. Aucun profil, modèle d’accès solo/équipe ou persona ALINEO n’est confirmé ; ne pas déduire l’hypothèse PAOS historique.
- **Promesse d’interface :** « Voir clairement la prochaine action, sans perdre de vue ce que vous choisissez de protéger. » C’est une microcopie proposée pour le concept PAOS historique, pas la promesse de marque du hub ALINEO.
- **Premier succès PAOS historique :** permettre de capturer une intention. Ce parcours n’est pas le parcours livré par l’application actuelle ; ALINEO commence par le hub de chat/connecteurs décrit dans `AGENT_HUB_DIRECTION.md`.
- **Non-objectifs de design :** chatbot plein écran, tableau de bord rempli de scores, streaks culpabilisants, calendrier qui transforme un événement en tâche sans accord, ou agent qui annonce une réussite sans preuve.

## 3. Architecture de l’information

### 3.1 Carte des espaces

| Espace | Question utilisateur | Objet central | Action principale | Lot de référence |
|---|---|---|---|---|
| **Aujourd’hui / Today** | Que choisir et que faire maintenant ? | Plan du jour, tâches, conflits et faits observés | Capturer une intention ou examiner une proposition | Lot 1 minimal |
| **Projets / Projects** | Quel résultat, quels jalons et quelles tâches ? | Projet et tâches liées | Créer ou organiser un projet | Lot 2 |
| **Calendrier / Calendar** | Quand les engagements se déroulent-ils ? | Blocs internes et événements avec provenance | Examiner ou déplacer un bloc proposé | Lot 2 interne, Lot 3 connecté |
| **Focus** | Comment mener une session de concentration ? | Session réelle liée ou non à une tâche | Choisir un mode puis démarrer | Lot 2 ; mécanismes natifs Lot 5 |
| **Life Core** | Quels engagements fondamentaux ai-je choisi de protéger ? | Pratiques définies uniquement par l’utilisateur | Configurer ou ajuster une pratique | Lot 1 vide à configurer |
| **Habitudes / Habits** | Quelles habitudes ordinaires veux-je suivre ? | Habitude et occurrence factuelle | Définir une récurrence ou déclarer une occurrence | Lot 2 |
| **Activité de l’agent** | Qu’a-t-il réellement consulté, proposé ou fait ? | Événements ordonnés et résumés publics | Inspecter, approuver, refuser ou arrêter | Lot 1 minimal |
| **Paramètres** | Quelles sont mes règles et permissions ? | Profil, fuseau, disponibilité, confidentialité | Modifier une préférence explicitement | Lot 1 minimal |

Les espaces Projects, Calendar, Focus et Habits réutilisent une source commune pour les tâches/blocs ; ils ne créent pas de copies concurrentes. L’Eisenhower est une vue globale calculée et filtrable, non un état personnel stocké séparément. Life Core et Habits restent deux domaines distincts.

### 3.2 Navigation

**Bureau :** barre latérale persistante, six espaces visibles, état courant marqué par un fond et un libellé — pas seulement par une différence de graisse. `Activité de l’agent` et `Paramètres` sont des destinations utilitaires séparées du groupe quotidien.

**Mobile :** cinq destinations maximum dans la barre basse : Aujourd’hui, Projets, Calendrier, Focus et **Plus**. « Plus » ouvre une feuille de navigation avec Life Core, Habitudes, Activité et Paramètres. Les commandes essentielles ont une zone cliquable d’au moins 44 px et la première action reste atteignable dans le tiers inférieur.

**Actions globales :** capture accessible depuis Today ; recherche globale quand il existe assez d’objets pour la justifier ; aucun bouton de connexion externe avant le lot et le consentement requis.

### 3.3 Parcours principal

```text
Capturer une intention
  → clarifier les champs réellement manquants (maximum trois questions utiles)
  → examiner/modifier le brouillon non persisté
  → confirmer l’ajout à l’inbox
  → configurer fuseau et disponibilités si un plan est demandé
  → calcul déterministe et proposition avec diff + motifs
  → approuver ou refuser l’application du plan
  → consulter les effets et l’activité réellement enregistrés
  → réajuster seulement le futur
```

Une proposition n’est jamais présentée comme une action déjà exécutée. Une écriture agentique interne en Lot 1 demande confirmation. Une action externe future est approuvée séparément, avec son aperçu précis. Aucun état d’activité ne révèle de chaîne de pensée privée.

## 4. Fiches d’écran

Chaque écran a un verbe, une entrée, une sortie, une action primaire et ses états. Les textes entre guillemets sont des propositions de microcopie française ; ils ne constituent pas des données personnelles.

### 4.1 Démarrage / profil — « Configurer »

- **Entrée :** premier accès authentifié ; profil vide.
- **Sortie :** profil sauvegardé ; fuseau et disponibilité restent « à configurer » si la personne les omet.
- **Structure :** étape courte identité/session → fuseau → disponibilité ; Life Core reste facultatif et vide tant que l’utilisateur n’ajoute rien. Permettre la capture d’une première tâche sans forcer tout l’onboarding.
- **Action primaire :** `Enregistrer mes repères` uniquement dans l’étape de configuration correspondante.
- **Vide :** « Rien n’est prérempli. Configurez ces repères quand vous souhaitez planifier. »
- **Chargement :** bouton occupé, saisie conservée, pas de double envoi.
- **Erreur :** champ concerné + cause et correction ; brouillon préservé.
- **Succès :** confirmation visible et retour à l’écran prévu.
- **Cas limites :** fuseau manquant/invalide, disponibilité vide, plage traversant minuit, sortie sans configuration. Ne pas inventer d’horaire.

### 4.2 Aujourd’hui / Today — « Choisir »

- **Entrée :** tâches et blocs du propriétaire ; paramètres explicites disponibles ou manquants.
- **Sortie :** prochaine action choisie, plan inspecté ou arbitrage visible.
- **Ordre de lecture :** titre et intention du jour → configuration bloquante si nécessaire → action de capture → liste/chronologie → Life Core configuré → activité réelle.
- **Action primaire :** `Capturer une intention`.
- **État initial :** carte claire expliquant qu’aucun planning n’existe encore, avec une action de capture ; panneau séparé `Life Core à configurer`. Le calendrier ne montre pas de créneaux horaires fictifs.
- **Chargement :** squelettes à la taille finale des blocs, aucune mise en page qui saute.
- **Rempli :** planification avec blocs, tâche essentielle/secondaires si l’utilisateur choisit cette disposition, non-planifiés et conflits expliqués. Les compteurs éventuels affichent période/source et disparaissent s’ils ne déclenchent aucune action.
- **Erreur :** « Impossible de charger votre journée » + `Réessayer` ; les tâches enregistrées restent accessibles.
- **Succès :** après confirmation, le plan appliqué et sa version sont visibles ; après une action utilisateur, le statut factuel est mis à jour.
- **Cas limites :** aucun fuseau, aucune disponibilité, tâche sans durée, capacité insuffisante, bloc `locked`, journée vide, date/DST.

### 4.3 Capture — « Capturer »

- **Entrée :** texte saisi par l’utilisateur, sans persistance implicite.
- **Sortie :** brouillon compréhensible, champs manquants signalés, aperçu avant confirmation.
- **Structure :** feuille latérale sur bureau, feuille modale sur mobile ; champ libellé `Qu’est-ce que vous voulez avancer ?` ; champs date/durée/priorité facultatifs et vides ; détails avancés repliés.
- **Action primaire :** `Prévisualiser le brouillon`, puis confirmation explicite distincte pour créer la tâche.
- **Vide :** aide courte, jamais Lorem ipsum. « Écrivez l’intention avec vos mots. Vous pourrez préciser la suite après. »
- **Chargement :** étape réelle « Analyse en cours » uniquement si un fournisseur est effectivement appelé ; sinon aucun spinner d’IA.
- **Erreur :** saisie conservée ; proposition d’éditer ou réessayer ; aucune écriture.
- **Succès :** brouillon affiché avec inconnues visibles et état `Non enregistré` jusqu’au geste de confirmation.
- **Cas limites :** texte long, date ambiguë, plusieurs actions dans une phrase, résultat incertain du modèle, fournisseur absent. L’agent demande clarification au lieu d’inventer.

### 4.4 Projets — « Organiser » — Lot 2

- **Entrée :** résultats/projets créés par l’utilisateur ; mêmes tâches que dans Today.
- **Sortie :** projet structuré, échéances et tâches associées visibles sans duplication.
- **Structure :** en-tête `Projets`, filtres, navigation de vues Liste / Board / Timeline / Eisenhower ; détail d’un projet avec résultat, jalons, tâches, activité. L’Eisenhower peut agréger toutes les tâches puis se filtrer par projet.
- **Action primaire :** `Créer un projet`.
- **Vide :** expliquer qu’un projet relie un résultat à des jalons/tâches ; une action de création ; aucun projet d’exemple.
- **Chargement :** squelettes de la vue choisie.
- **Rempli :** vues depuis le même modèle ; priorité, échéance et statut toujours textuels, pas uniquement colorés.
- **Erreur :** filtres conservés, bouton `Réessayer`.
- **Cas limites :** projet sans jalon, tâche sans projet, plusieurs projets, dépendance bloquée, libellé long, filtre sans résultat. Aucun KPI sans période et source.

### 4.5 Calendrier — « Planifier » — Lot 2 / 3

- **Entrée :** blocs internes et, plus tard, événements externes avec provenance.
- **Sortie :** comprendre les disponibilités, les engagements fixes et les conflits.
- **Structure :** Année (12 mini-calendriers), Mois (grille), Semaine (échelle 24 h sur sept jours), Jour (frise 24 h) ; commandes `Aujourd’hui` / période précédente / suivante et panneau contextuel pour la date sélectionnée. Les filtres par projet, Life Core, habitudes, Focus et source sont envisagés quand ces domaines existent. Badge texte pour `Interne`, `Life Core`, `Google Calendar`, etc.
- **Action primaire :** au Lot 2, examiner la plage et ses blocs ; au Lot 3, connecter un calendrier en lecture seule après consentement.
- **Vide :** état distinct « aucun bloc interne » et « aucun calendrier connecté » ; pas d’événement fabriqué.
- **Chargement :** place réservée aux blocs et à la navigation temporelle.
- **Rempli :** durées, source et timezone lisibles ; conflit expliqué ; cliquer un bloc ouvre son détail.
- **Erreur :** source concernée identifiée + réessai ; aucune réussite annoncée après timeout inconnu.
- **Cas limites :** changement d’heure, événement tout-jour, fuseaux, doublons, pagination, source révoquée. Un événement externe ne crée pas une tâche sans confirmation.

### 4.6 Focus — « Se concentrer » — Lot 2 / 5

- **Entrée :** mode choisi par l’utilisateur (Pomodoro, chronomètre ou durée libre) ; tâche/projet facultatif.
- **Sortie :** session réelle avec démarrage, pause/reprise et fin anticipée enregistrés.
- **Structure :** choix de mode sans valeur présélectionnée, état de session, tâche liée ou `sans tâche`, contrôle de pause/fin et historique factuel.
- **Action primaire :** `Démarrer la session` après sélection explicite du mode.
- **Vide :** expliquer les modes ; ne pas suggérer une durée.
- **Chargement :** feedback d’action, pas un faux indicateur de progression.
- **Rempli :** temps réellement observé et session en cours clairement indiquée.
- **Erreur :** état de session et récupération expliqués.
- **Cas limites :** app suspendue/terminée, permission de notification refusée, changement de timezone. L’app web seule ne promet pas une alarme exacte ; les mécanismes natifs ne sont étudiés qu’au Lot 5.

### 4.7 Life Core — « Protéger » — Lot 1, vide par défaut

- **Entrée :** aucune pratique ou valeur seedée ; seul ce que l’utilisateur ajoute.
- **Sortie :** règles explicites pour les créneaux à protéger et leurs exceptions.
- **Structure :** liste de pratiques configurées, niveau de protection, récurrence, fuseau, durée réservée si choisie, fenêtre de rattrapage facultative. Pas de journal narratif au MVP.
- **Action primaire :** `Ajouter une pratique`.
- **Vide :** « Aucune pratique n’a été ajoutée. Vous définissez ce qui compte et ce que vous souhaitez protéger. » Pas d’exemple prérempli.
- **Chargement :** squelettes ; aucune catégorie supposée.
- **Rempli :** `locked`, `ask`, `flexible` affichés par nom et description.
- **Erreur :** ne pas perdre les champs ; préciser la correction.
- **Cas limites :** conflit avec une tâche, absence de durée, récurrence invalide, modification d’une occurrence passée. Ne pas prescrire le jeûne ni une pratique, une durée ou une fréquence.

### 4.8 Habitudes — « Suivre » — Lot 2

- **Entrée :** habitudes ordinaires créées par la personne, distinctes du Life Core.
- **Sortie :** occurrence factuelle (`done`, `partial`, `skipped`) et tendance de régularité.
- **Structure :** liste, récurrence quotidienne/hebdomadaire/personnalisée, cible/unité si choisies ; aucune cible présélectionnée.
- **Action primaire :** `Créer une habitude`.
- **Vide :** expliquer l’usage et laisser une action ; aucune habitude d’exemple.
- **Chargement :** squelettes de lignes.
- **Rempli :** historique lisible sans score punitif ; reprise visible.
- **Erreur :** état conservé, possibilité de réessayer.
- **Cas limites :** fuseau, récurrence personnalisée, journée manquée, cible absente. Pas de streak présenté comme score de valeur personnelle.

### 4.9 Activité de l’agent — « Inspecter »

- **Entrée :** événements réellement émis par une exécution.
- **Sortie :** savoir ce qui a été lu, proposé, approuvé, exécuté ou a échoué.
- **Structure :** chronologie avec acteur, état, tool/action, résumé public, résultat et heure réelle. Afficher la portée d’accès et le bouton d’arrêt quand une exécution est arrêtable.
- **Action primaire :** `Examiner la proposition` lorsqu’elle existe ; sinon aucune action artificielle.
- **Vide :** « Aucune activité de l’agent pour le moment. »
- **En cours :** une ligne par étape réelle : `En attente`, `En cours`, `Terminé`, `Ignoré`, `Échec` ; arrêt accessible.
- **Approbation :** aperçu avant action, choix Approuver / Refuser visibles et distincts.
- **Succès/échec :** événements observés, changements réellement appliqués, erreur normalisée et prochaine action.
- **Cas limites :** résultat externe inconnu, run annulé, permission révoquée. Aucun texte « l’IA réfléchit » comme seule information ; aucune chaîne de pensée privée.

### 4.10 Paramètres — « Régler »

- **Entrée :** identité et options configurables.
- **Sortie :** préférences enregistrées ou explicitement restées non configurées.
- **Structure :** sections Profil & fuseau, Disponibilités, Confidentialité, Permissions agent, Connexions (plus tard), Accessibilité. Une navigation secondaire unique, un champ par ligne, libellé visible.
- **Action primaire :** sauvegarde contextuelle si nécessaire ; réglage léger sauvegardé avec confirmation visible.
- **Vide :** configuration manquante expliquée sans bloquer la capture.
- **Chargement :** formulaire stable, pas de perte des valeurs.
- **Erreur :** message décrivant quoi / pourquoi / comment corriger ; brouillon préservé.
- **Succès :** confirmation accessible ; action destructive séparée et confirmée.
- **Cas limites :** fuseau invalidé, réseau absent, formulaire long, texte à 200 %, permission révoquée.

## 5. Direction visuelle et design system

### 5.1 Concept visuel

**« Alignement calme »** : une interface claire, précise, accueillante, sans imagerie héroïque ni orbe. Une grille sobre et une seule couleur d’action donnent la sensation d’ordre ; les statuts utilisent libellé + icône en plus de leur teinte. Aucun logo, image externe ou style d’APIOS n’est réutilisé. Les références de calendrier fournies orientent les vues année/mois/semaine/jour et le panneau de date ; leurs marques, événements et données d’exemple ne sont pas repris. Elles ne tranchent pas le thème sombre : la maquette garde le thème clair proposé en v0.1.

### 5.2 Tokens proposés

| Token | Valeur de départ | Usage |
|---|---|---|
| `color.canvas` | `#F5F7F5` | Fond de l’espace |
| `color.surface` | `#FFFFFF` | Cartes et feuilles |
| `color.ink` | `#182724` | Texte principal |
| `color.ink-secondary` | `#42534D` | Corps de texte secondaire |
| `color.muted` | `#5D6B65` | Aide et légendes, à valider par mesure de contraste |
| `color.line` | `#DCE5DF` | Séparateurs et bordures |
| `color.accent` | `#315F50` | Action primaire, sélection active |
| `color.accent-soft` | `#E8F1EC` | Fond d’état actif |
| `color.success` | `#256449` | Réussite, toujours avec texte/icône |
| `color.warning` | `#805600` | Avertissement, toujours avec texte/icône |
| `color.danger` | `#A33336` | Erreur/action dangereuse, toujours avec texte/icône |
| `space.*` | `4, 8, 12, 16, 24, 32, 48, 64 px` | Échelle commune |
| `radius.*` | `8, 12, 16, 24 px` | Contrôles, cartes, panneaux |
| `type.*` | `12, 14, 16, 20, 24, 32 px` | Échelle compacte, six niveaux |
| `motion.*` | `120, 180, 250 ms` | Feedback bref, pas de mouvement décoratif |

Valeurs de départ à mesurer sur chaque paire réelle avant handoff ; elles ne sont pas déclarées conformes à WCAG sur simple inspection. Deux familles de police au maximum ; le prototype utilise une pile système sans téléchargement externe. Mode sombre non livré ici ; les tokens sémantiques permettent de définir un second jeu plus tard.

### 5.3 Composants de base

- `AppShell` : barre latérale bureau, navigation basse mobile, en-tête de contenu.
- `NavItem` : icône cohérente, libellé, sélection perceptible et `aria-current`.
- `Button` : primaire, secondaire, tertiaire, danger ; variantes repos/focus/chargement/désactivé.
- `Card` et `EmptyState` : titre qui constate, explication utile, une action réellement disponible.
- `StatusBadge` : texte + pictogramme + couleur, jamais couleur seule.
- `TaskRow`, `TimelineBlock`, `ProjectViewSwitcher` : mêmes données, vues différentes.
- `CaptureSheet`, `ApprovalPanel`, `AgentEventRow` : brouillon non persisté, aperçu approuvable, activité réelle.
- `Field` : label associé, aide, erreur et état de sauvegarde ; aucune instruction essentielle portée par le placeholder.

### 5.4 Responsive et mouvement

- Dessiner et vérifier d’abord à 375 px ; palier étroit 320 px ; tablette 640–1023 px ; bureau à partir de 1024 px avec contenu plafonné à 1200 px.
- À 375 px : une colonne ; actions principales dans la moitié basse/zone du pouce ; menus secondaires en feuille modale ; jamais d’action uniquement au survol.
- Tableau : transformer en lignes/cartes lisibles ou défilement annoncé ; ne pas réduire les caractères jusqu’à l’illisible.
- En-têtes, barres et feuilles respectent les safe areas ; zoom navigateur conservé.
- Transitions brèves sur `transform`/`opacity`, arrêtées/réduites par `prefers-reduced-motion`; aucun contenu qui clignote ou défile automatiquement.

## 6. États, contenu et accessibilité — critères de passation

Pour chaque écran réellement implémenté, le handoff doit inclure : contenu non fictif, action primaire, états vide/chargement/rempli/erreur/succès, cas limite court/long, état réseau, focus clavier, libellés, raccourcis, version et captures aux largeurs 375/768/1280 px.

**Contrôles bloquants à finir de mesurer sur navigateur et appareils :**

- Contraste du texte courant ≥ 4,5:1 ; éléments non textuels et bordures utiles ≥ 3:1 selon leur usage.
- Parcours clavier complet, focus visible, ordre de tabulation logique, aucune action réservée à la souris.
- Champ avec label visible et associé ; bouton-icône avec nom accessible ; erreurs liées aux champs.
- Cibles tactiles ≥ 44 px ; aucune information transmise par la seule couleur.
- Zoom à 200 %, largeur 320 px, libellés longs, valeurs absentes et contenu RTL à considérer avant internationalisation.
- Réglage système de mouvement réduit respecté ; au plus un accent visuel dominant par écran.
- Message de réussite seulement si l’action a réellement été observée ; métrique uniquement avec période et source.

La fiche Bonus Kit propose quatre statuts d’audit : bloquant, majeur, mineur, non applicable ; son rapport public distingue vérifié, à vérifier et non fait. ALINEO reprend cette distinction sans prétendre qu’un contrôle non exécuté est réussi. Une vérification axe-core partielle des règles structurelles (labels, noms de commandes, ARIA, landmarks et titres) a réussi sous JSDOM sur huit espaces, les quatre vues du calendrier et le dialogue de capture. Elle ne mesure ni le contraste ni le focus/clavier dans un navigateur réel. Aucun audit axe complet/Lighthouse ni test sur navigateur ou appareil réel n’a été exécuté.

## 7. Prototype ALINEO historique — archivé, ne pas poursuivre

Un aperçu web interactif autonome est fourni dans `prototype/alineo/` (`index.html`, `styles.css`, `app.js`). Il permet de naviguer entre les espaces, de consulter les états vides et les écrans de structure, d’essayer les vues Année/Mois/Semaine/Jour avec navigation sur la date locale de l’appareil et de prévisualiser une intention en mémoire de page. Les vues calendrier n’affichent aucun événement ; aucune préférence de fuseau ni donnée personnelle n’est sauvegardée. Le texte saisi est effacé à la fermeture de la capture ou au rechargement et n’est jamais transmis. Aucun compte, stockage durable, backend, authentification/RLS, modèle d’IA, calendrier externe ou fournisseur n’est connecté. Les destinations des Lots 2–5 illustrent la navigation future ; les commandes non disponibles l’indiquent au lieu de prétendre exécuter l’action. Une vérification de fumée ponctuelle sous JSDOM (navigation, capture, états vides et absence d’écriture Web Storage), ainsi qu’une sélection de règles structurelles axe-core, ont réussi ; ces contrôles ne remplacent pas des tests navigateur réels. Cet aperçu statique n’est pas l’application du produit ; aucune suite de tests automatisés maintenue ni audit complet d’accessibilité n’est livrée.

| Phase | Structure visuelle | Fonctionnement attendu | Statut dans le prototype |
|---|---|---|---|
| **Lot 1** | Today minimal, tâches simples, Life Core vide, paramètres, proposition/diff, activité | Auth/RLS, capture confirmée, planner déterministe, approbations explicites | Structure/états illustrés ; aucune donnée ni API connectée |
| **Lot 2** | Projects, Board/Timeline/Eisenhower, Calendar interne, Focus, Habits, estimation | Données partagées, sessions/occurrences et apprentissage explicable | Maquettes de destination seulement |
| **Lot 3** | Calendar connecté avec provenance | Composio, Google Calendar lecture seule d’abord, écriture après aperçu/confirmation | Non connecté ; aucune permission demandée |
| **Lot 4** | Import et consultation sourcée | Validation, sandbox, citations, rétention et accès filtré | Hors prototype fonctionnel |
| **Lot 5** | Clients installés | Capacitor/Tauri seulement après validation web ; comportement natif testé | Hors prototype |

## 8. Décisions et inconnues après confirmation de l’identité

1. **Résolu :** ALINEO est le produit unique du dépôt et le hub connecté est sa direction principale. Voir [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md) pour le périmètre actuel et le crosswalk PAOS.
2. **Toujours inconnu :** les profils/utilisateurs principaux et le modèle d’accès. Ne pas supposer un persona mono-utilisateur, équipe ou SaaS.
3. **Direction visuelle précédente :** l’image de 18 dégradés et le sélecteur clair/sombre concernent l’ancienne app `apps/alineo/` uniquement. La marque actuelle est Alineo, avec un shell graphite, une sidebar compacte, des panneaux flottants bordés et un logo ruban généré ; ne pas réintroduire l’ancienne grille.
4. **État courant :** l’application Alineo dans `apps/openfuse/` est la base de travail active. Le modèle/provider, l’identité live, les connecteurs et la plateforme de déploiement ne sont pas choisis.
5. **À vérifier avant intégration :** capacités, opérations, scopes OAuth, coûts/quota et conditions des connecteurs ; aucun n’est activé actuellement.

**État de preuve :** ce document décrit une conception PAOS historique et son prototype archivé ; il ne prouve pas l’implémentation actuelle d’ALINEO. Les contrôles UX/accessibilité certifiés et tests utilisateurs restent à effectuer.
