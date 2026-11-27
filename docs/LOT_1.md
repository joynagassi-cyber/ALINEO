# Lot 1 — Walking skeleton (préparation exécutable)

**Version de référence :** `docs/PERSONAL_AGENTIC_OS_SPEC.md` v1.2 (baseline PAOS historique).
**Statut pour PAOS :** backlog de référence préparé ; ne constitue plus le plan de livraison courant d’ALINEO.
**Durées, dates et propriétaires :** non renseignés — aucun calendrier d’équipe n’a été fourni.
**Portée de cette baseline :** boucle web minimale, isolée par utilisateur, avec planner déterministe et Agent Activity ; connecteurs externes explicitement exclus de son Lot 1.

> **Réconciliation ALINEO :** l’utilisateur a confirmé un produit unique ALINEO, orienté hub agentique connecté. Cette direction place chat/connecteurs/progression/insights au centre et déroge explicitement à l’exclusion des connecteurs du présent Lot 1. Le backlog PAOS ci-dessous reste une référence d’exigences et de garde-fous, mais ne doit pas être annoncé comme le lot actuel ni être livré silencieusement à la place du hub. Les espaces PAOS et leur état sont réconciliés dans [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md).

## Objectif et sortie attendue

Prouver, sur le web, que l’utilisateur peut s’authentifier, configurer (sans valeur préremplie) ses plages et Life Core, capturer une tâche, obtenir une proposition de journée explicable, voir les arbitrages et l’appliquer après confirmation. Chaque donnée est isolée par session et chaque écriture auditée. Si l’IA est indisponible, le parcours manuel reste utilisable.

## Modèle d’exploitation de la discipline agentique

### Définition opératoire

Dans ce document, « discipline agentique » désigne une boucle de travail où l’utilisateur formule ses intentions, l’agent aide à les clarifier, le planner vérifie les contraintes et l’utilisateur garde la direction ainsi que les arbitrages. C’est une définition de produit réversible, pas une définition morale ni une routine personnelle imposée. Le logiciel suit des engagements observables ; il ne note ni la valeur de la personne, ni sa foi, ni son obéissance.

### Répartition des responsabilités

| Acteur | Responsabilités | Ne peut pas |
|---|---|---|
| Utilisateur | Définir résultats, priorités, disponibilités et pratiques protégées ; confirmer les écritures ; déclarer l’exécution ou fournir une preuve ; suspendre/refuser une proposition | Être contraint par une cible ou un horaire personnel prérempli |
| IA | Reformuler une capture, signaler les champs manquants, poser des questions utiles et résumer une proposition | Choisir les valeurs de vie, inventer une disponibilité, déplacer un bloc protégé, écrire sans consentement ou marquer un résultat terminé par inférence |
| Planner déterministe | Appliquer les contraintes configurées, trier selon la règle documentée, retourner proposition, diff et raisons | Inférer des préférences, modifier les entrées ou appliquer silencieusement le planning |
| Serveur | Dériver `user_id` de la session, valider les schémas, appliquer RLS/version/idempotence et consigner un audit expurgé | Faire confiance à un identifiant propriétaire fourni par le navigateur ou le modèle |

### Boucle de discipline — sans valeurs par défaut personnelles

1. **Capturer :** une intention devient un brouillon non persisté. Le système signale les informations manquantes ; l’utilisateur décide si et quand il confirme son ajout.
2. **Clarifier :** l’agent peut proposer une formulation vérifiable, une échéance ou une durée à confirmer. Il ne transforme pas une supposition en donnée.
3. **Choisir :** l’utilisateur détermine le résultat important pour la journée. Today peut présenter une action essentielle et jusqu’à deux actions secondaires comme disposition configurable, jamais comme quota de réussite.
4. **Planifier :** le moteur pur réserve les indisponibilités, rendez-vous saisis et pratiques Life Core protégées, puis propose des blocs. Une tâche sans durée reste visible (`estimate_required`). Aucun plan n’est appliqué sans confirmation explicite.
5. **Agir et constater :** les sessions et statuts reflètent une action de l’utilisateur ou une preuve qu’il fournit. L’IA n’infère pas `done` et l’activité affichée correspond à des événements réels.
6. **Réajuster :** après un changement, seul le futur est recalculé. Le passé est immuable ; les arbitrages impossibles restent visibles au lieu d’être résolus silencieusement.
7. **Apprendre plus tard :** les revues et l’estimation historique arrivent après le Lot 1. Aucun seuil de performance ou objectif de 12 mois n’est introduit sans choix utilisateur.

### Limites particulières du Life Core

Les pratiques, leur nom, calendrier, durée, fuseau, protection et éventuel rattrapage sont définis par l’utilisateur. La configuration commence vide. `locked` est une contrainte dure ; `ask` demande une confirmation ; `flexible` permet une proposition, jamais un déplacement silencieux. Le produit ne prescrit aucune pratique, fréquence, durée ou règle de santé/spiritualité et ne produit aucun score spirituel. Les notes narratives restent hors Lot 1, de l’IA, des journaux et des métriques.

### Scénarios de sortie du Lot 1

- **Profil non configuré :** l’écran explique ce qui manque ; aucun planning, horaire ou engagement fictif n’est créé.
- **Capture incomplète :** le brouillon reste non persisté jusqu’à confirmation ; les champs inconnus sont affichés comme tels.
- **Conflit ou durée absente :** la tâche reste visible avec un motif ; un bloc `locked` n’est pas déplacé.
- **Application du plan :** l’utilisateur voit le diff avant/après et confirme ; la même clé d’idempotence ne crée pas de doublon.
- **Interruption :** le passé reste inchangé ; les effets sur les blocs futurs et les arbitrages sont présentés avant une nouvelle confirmation.
- **IA ou fournisseur indisponible :** capture manuelle, tâches et planner déterministe restent utilisables ; aucune erreur brute ni aucun secret n’est exposé.

## Hypothèses de travail — temporaires et réversibles

- Nom d’ingénierie : **LifeAI** (dépôt), produit : **Personal Agentic OS** (nom de travail seulement).
- Cible du Lot 1 : web, un propriétaire par session, schéma `user_id` dès le début ; pas de `organization_id`/collaboration d’équipe avant décision SaaS.
- Supabase est la source de vérité déjà posée ; React/Vite reste la base recommandée du v0.1, tandis que Next.js est une alternative proposée non confirmée. Le framework doit être fixé avant le scaffold. Fournisseur IA, version de CopilotKit, méthode de connexion et hébergeur restent non fixés.
- Pas de pratiques, horaires, disponibilité, notes privées, tâche ou objectif seedés comme s’ils appartenaient à l’utilisateur.
- Une durée de tâche doit être saisie par l’utilisateur pour la planifier. Pas de génération P50/P80 en Lot 1 ; tâches sans durée restent visibles comme `estimate_required`.
- Toute écriture interne issue de l’agent et toute application de plan demandent une confirmation explicite. Toutes les écritures externes sont hors lot.
- Le planner utilise zéro minute de marge seulement si aucune marge n’a été configurée et expose `NO_BUFFER_CONFIGURED` ; cette valeur technique n’est pas une recommandation personnelle.
- Notes narratives Life Core exclues du schéma/UI Lot 1 ; aucune donnée de prière/jeûne n’est envoyée à l’IA.

## Dépendances

1. Scaffold du dépôt et CI.
2. Auth/session → migrations/RLS.
3. Types/validation métier → API tâches et Life Core.
4. Moteur planner pur → `plan_versions` / diff.
5. API sécurisée → UI Today.
6. Runtime agent et événements observables (peut être activé après le parcours manuel).
7. Tests d’isolation, E2E, durcissement et gate de déploiement.

```text
L1-01 → L1-02 → L1-03 → L1-04 → L1-05 → L1-06
                         ↘ L1-07 ↗          ↘ L1-08
```

## Backlog de réalisation

### L1-01 — Dépôt, architecture et CI

**Livrables :** arborescence logique `apps/web`, `apps/server`, `packages/{contracts,domain,planner,agent-core,adapters,ui,config}` et `supabase/{migrations,tests}` selon `docs/TECHNICAL_DESIGN.md` ; React/Vite recommandé par la base existante, Next.js uniquement si H-10 est confirmé avant scaffold ; API/BFF Node/TypeScript same-origin en proposition à valider ; lint/typecheck/test/build en CI ; `.env.example` sans valeur secrète ; documentation de lancement.

**Acceptation :** clone propre + installation reproductible ; tous les checks CI passent ; aucun secret `VITE_*` ; aucune donnée APIOS ni asset non licencié ; le service web accepte le host de preview/deploiement autorisé et écoute sur `0.0.0.0`.

### L1-02 — Authentification et contexte propriétaire

**Livrables :** Supabase Auth derrière une interface de session ; middleware serveur qui établit le propriétaire ; gestion d’expiration et refus non authentifié. Le mode de connexion final reste une question ouverte, donc l’adaptateur doit éviter de coupler le domaine à un fournisseur d’identité.

**Acceptation :** sans session, routes privées refusées ; `user_id` absent des paramètres libres exposés au modèle ; si un utilisateur A substitue un ID B, la requête ne voit/altère aucune donnée B ; les erreurs ne révèlent pas si un autre compte existe.

### L1-03 — Migrations, RLS et audit

**Livrables :** migrations versionnées pour `profiles`, `user_settings`, `availability_rules`, `tasks`, `task_dependencies`, `life_practices`, `practice_occurrences`, `time_blocks`, `plan_versions`, `agent_runs`, `agent_steps`, `approvals`, `idempotency_records`, `audit_events` ; policies RLS propriétaires ; indexes ; contraintes d’intervalle et FKs composites ; service role côté serveur uniquement. Le dictionnaire cible détaillé est dans `docs/TECHNICAL_DESIGN.md`.

**Acceptation :** RLS activée sur chaque table ; aucune policy `anon` ; tests SQL/API automatisés avec deux utilisateurs couvrent SELECT/INSERT/UPDATE/DELETE croisés ; cycles de dépendances et références inter-propriétaire refusés ; audit append-only, expurgé et avec request ID ; migration/reprise testée sur base vide.

### L1-04 — Domaine, tâches et API

**Livrables :** types de domaine et schémas serveur ; capture en brouillon ; CRUD de tâches après action utilisateur ; Life Core éditable par son propriétaire ; disponibilité et fuseau explicitement configurés ; format stable d’erreur.

**Acceptation :** tâches ont statut valide et version ; tâche `done` seulement après action utilisateur ; aucune pratique par défaut ; absence de fuseau/durée renvoie une erreur ou un état de configuration explicable ; les données navigateur ne deviennent pas la vérité serveur.

### L1-05 — Planner pur et explicable

**Livrables :** fonction sans appel réseau/LLM, inputs versionnés, contraintes dures, proposition `plan_version`, diff avant/après et motifs pour les non-planifiés ; test fixtures déterministes.

**Acceptation :** mêmes entrées/version → même sortie ; ordre stable par importance décroissante (`NULL` en dernier), échéance croissante (`NULL` en dernier), `created_at` croissant puis ID ; aucune intersection de blocs ; `locked` immuable ; dépendances respectées ; passé inchangé ; tâche sans durée non planifiée ; aucun créneau disponible = motif visible ; pas de fractionnement en Lot 1 ; application seulement après approbation, idempotence et contrôle optimiste.

### L1-06 — Today et flux manuel

**Livrables :** écran Today selon ordre PAOS-TODAY-01 ; inbox/tasks ; une action essentielle + jusqu’à deux secondaires ; chronologie interne ; configuration Life Core ; arbitrages ; proposition du planner avec raisons et diff.

**Acceptation :** l’écran est utile sans IA ; états « Life Core à configurer », « tâche non planifiée » et conflit sont visibles ; aucune progression inventée ; navigation clavier, labels, contraste et réduction du mouvement testés sur mobile/desktop.

### L1-07 — Runtime agent et Agent Activity

**Livrables :** un orchestrateur ; tools au périmètre minimum `capture_commitment`, `clarify_commitment`, `propose_day_plan`, et `create_task`/`apply_plan` seulement après confirmation ; catalogue de tools allowlist ; Agent Activity fondée sur événements observés ; provider injectable/configurable sans secret client.

**Acceptation :** prompt injection dans une entrée de test ne peut autoriser un tool ; outil scope user courant ; `propose_day_plan` ne modifie aucune ligne ; activité n’expose pas la chaîne de pensée ; test en mode sans clé confirme que Today/tasks/planner fonctionnent toujours ; erreurs provider sont normalisées et rattachées au run.

### L1-08 — Hardening et porte de sortie

**Livrables :** tests unitaires/property du planner ; intégration Auth/RLS ; E2E navigateur du parcours ; logs structurés redigés ; rate limit/CSP/CSRF selon topologie ; procédure rollback et export/suppression ; métriques sans contenu privé ; rapport de sécurité.

**Acceptation :** critères MVP 1–14 de la spec v1.2 passent ; aucune vulnérabilité bloquante non triée ; sauvegarde et restauration démontrées avant pilote ; endpoint health et dépendances monitorés ; aucun provider externe ni connecteur utilisateur n’est activé par défaut.

## Cas de test minimum à automatiser

- Deux utilisateurs, lecture et écriture croisées refusées.
- Journée avec deux Life Core verrouillés, tâche entre deux créneaux, tâche trop longue, tâche sans durée et dépendance bloquée.
- Chevauchement manuel impossible à appliquer ; planner conserve les blocs existants.
- `propose → apply` avec même idempotency key deux fois : un seul jeu de blocs.
- Stale `plan_version` : conflit de version explicable et aucun écrasement.
- Annulation/navigation pendant un run : état `cancelled`, pas de mutation ultérieure.
- Provider IA indisponible : parcours manuel toujours opérationnel ; aucun secret dans réponse/log.
- Fuseau explicite, passage minuit et tests DST ; aucune conversion implicite silencieuse.
- Life Core vide : aucun horaire ou pratique fictif ; notes privées absentes des appels, logs et métriques.
- Tâche réalisée : action utilisateur requise ; le modèle ne peut pas la marquer terminée.

## Traçabilité exigences → preuves attendues

Cette matrice définit des preuves à produire pendant l’implémentation ; elle ne signifie pas que les tests ou le produit existent déjà.

| Exigences v1.2 | Preuve minimale attendue pour la sortie du Lot 1 |
|---|---|
| `PAOS-AUTH-01`, `PAOS-DATA-01`, `PAOS-PROFILE-01`, `PAOS-SEC-01` | Migration sur base vide ; refus sans session ; tests RLS A/B pour SELECT/INSERT/UPDATE/DELETE ; propriétaire dérivé côté serveur ; aucun planning sans fuseau explicite. |
| `PAOS-TASK-01`, `PAOS-TASK-02` | Capture non persistée avant confirmation ; champs absents signalés ; statuts validés ; aucune transition vers `done` sans action/preuve utilisateur. |
| `PAOS-LC-01` à `PAOS-LC-03` | Base/UI sans pratiques ni horaires seedés ; tests `locked`/`ask`/`flexible` ; contrôle qu’aucune note narrative Life Core ne part vers l’IA, les logs ou les métriques. |
| `PAOS-PLAN-01` à `PAOS-PLAN-05` | Fixtures déterministes ; ordre de tri et motifs vérifiés ; tests de chevauchement, dépendances, Life Core protégé, tâche sans durée, immutabilité du passé, diff, version obsolète et idempotence. |
| `PAOS-TODAY-01` | Parcours E2E montrant configuration requise, engagements protégés, tâche essentielle/secondaires configurables, non-planifiés, conflits, raisons et diff ; aucune progression fictive. |
| `PAOS-AGENT-01` à `PAOS-AGENT-04`, `PAOS-ACTIVITY-01` | Tools allowlistés et schémas validés côté serveur ; test d’injection incapable d’élargir l’autorité ; proposition sans mutation ; événements d’activité réels ; absence de secret/chaîne privée ; parcours manuel lorsque le provider échoue. |
| `PAOS-SEC-02` à `PAOS-SEC-04`, `PAOS-OPS-01` | Scan sans secret client ; audit expurgé avec request ID ; tests d’idempotence/version ; contrôles CSRF/CSP/rate limit selon topologie ; procédure de sauvegarde/restauration et rollback exercée avant pilote. |
| `PAOS-SEC-05` | En Lot 1, aucune ingestion documentaire/connecteur n’est activée. La résistance aux instructions non fiables est testée lors de l’ajout des imports (Lot 4), pas revendiquée comme preuve d’une fonction absente. |

`PAOS-GOAL-01`, `PAOS-TASK-03`, `PAOS-CAL-01`, `PAOS-FOCUS-01`, `PAOS-HABIT-01` et `PAOS-OPS-02` relèvent des lots ultérieurs ; ils ne doivent pas être marqués « terminés » à la sortie du Lot 1. Les critères précis de report restent dans la spécification de référence.

## Definition of Done et décision de release

Le Lot 1 est terminé seulement lorsque :

- les huit éléments du backlog sont livrés et revus ;
- CI verte sur une installation propre ;
- tests d’isolation RLS et E2E passent ;
- le parcours capture → propose → diff → confirmation → Today fonctionne sans IA ;
- les règles Life Core, idempotence, version optimiste et audit sont prouvées ;
- les données, permissions, secrets, sauvegarde/restauration et retour arrière sont documentés ;
- aucun provider, connecteur Calendar ou automatisme externe n’est activé sans sélection/consentement ;
- l’utilisateur valide l’authentification, la portée produit et les questions critiques avant un pilote réel.

**Non inclus :** projets/objectif complets, Focus, estimation P50/P80, revues, habitude, Google Calendar, Gmail/Drive/GitHub, import documentaire, Android, Windows, notifications app fermée. Ils ne bloquent pas la préparation du squelette.
