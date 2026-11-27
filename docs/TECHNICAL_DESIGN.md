# Architecture technique et contrats — Personal Agentic OS

**Version :** 1.2 (complément de `PERSONAL_AGENTIC_OS_SPEC.md`)<br>
**Date :** 2026-11-23<br>
**Statut :** spécification de référence historique PAOS ; elle décrit des exigences et une architecture proposée, pas l’architecture déjà déployée dans ALINEO.<br>
**Périmètre du document :** modules natifs PAOS, architecture envisagée, schéma Supabase, contrats d’agent/Composio et définition de son MVP.

Les mots **DOIT**, **NE DOIT PAS** et **PEUT** s’appliquent à la baseline PAOS décrite ici. Ils ne prouvent pas qu’un choix technique est adopté ni qu’un composant existe dans ALINEO. La sélection fonctionnelle actuelle et les garde-fous conservés sont réconciliés dans [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md). Le prompt maître complet n’a pas été retrouvé et la couverture documentaire d’origine reste limitée.

**État d’identité :** l’utilisateur a confirmé que ce dépôt contient un seul produit ALINEO et que le hub connecté de [`AGENT_HUB_DIRECTION.md`](AGENT_HUB_DIRECTION.md) est sa direction principale. Le présent document reste le backlog/guide de sûreté de la baseline PAOS ; ses modules natifs et lots ne constituent pas un engagement que toutes ces capacités sont dans le périmètre courant. L’application active sous `apps/openfuse/` porte maintenant la marque Alineo; le nom de chemin est une référence technique au socle upstream, pas à l’identité produit. Le scaffold Hono/CopilotKit v2/A2UI sous `apps/alineo/` est l’ancienne interface et reste rejeté. Le mode sample local utilise des exemples fictifs, sans fournisseur/modèle ou connecteur live ; le live n’est pas prêt pour le multi-tenant.

## 1. Décisions, propositions et exclusions

### 1.1 Contraintes produit retenues

- Les six espaces — Today, Projects, Calendar, Focus, Life Core et Habits — sont des façades d’un même modèle de données, activées au fil des lots. Ils ne constituent ni six bases ni six agents.
- Supabase/PostgreSQL est la source de vérité ; chaque ligne privée est isolée par `user_id` et RLS. Le serveur dérive le propriétaire de la session.
- Le planner est déterministe, indépendant du LLM et sans écriture lors d’une proposition. Un orchestrateur unique précède tout éventuel multi-agent.
- Une écriture issue de l’agent et l’application d’un plan exigent une approbation explicite en Lot 1. Toute écriture externe exige aperçu, approbation liée à l’action précise et audit. Aucune permission future ne donne une autorisation globale.
- Aucun horaire, pratique, durée, objectif, disponibilité, cible, préférence ou score personnel n’est prérempli. Les exemples du brief sont illustratifs. Le Life Core commence vide ; les notes narratives privées ne sont pas collectées au Lot 1 et ne sont pas transmises à l’IA.
- Agent Activity ne montre que des événements réels et des résumés publics ; aucune chaîne de pensée privée n’est stockée ou affichée.
- PAOS demeure séparé d’APIOS : dépôts, identités, données, secrets, déploiements, marque et licences ne sont pas mutualisés.

### 1.2 État des choix techniques

| Sujet | État documenté | Conséquence de conception |
|---|---|---|
| Base/Auth | Supabase/PostgreSQL est la base retenue dans la spécification ; RLS obligatoire. | Modules métier et repos isolés derrière des interfaces testables ; migrations versionnées. |
| UI web | L’application Alineo utilise Expo/React Native dans `apps/openfuse/`; l’ancien shell React/Vite est conservé dans `apps/alineo/`. | L’identité active est Alineo ; le chemin du socle upstream reste un détail de provenance. Le document PAOS reste une référence de contrats et ne prescrit pas de réactivation du shell artisanal. |
| Runtime serveur | L’app Alineo fournit Hono/Node; son mode sample local utilise SSE et tourne sans clé Intelligence. Le mode live hérité est mono-propriétaire et non multi-tenant. | Même origine et serveur privé restent nécessaires ; aucune authentification multi-utilisateur Alineo, base Supabase/RLS ou cible d’hébergement n’est mise en place. |
| LLM / orchestration UI | Aucun modèle/provider n’est choisi. Le mode sample utilise un agent local fictif; le live exige une sélection et un contrôle des conditions de traitement. | Les contrats PAOS ne doivent pas être confondus avec l’intégration UI; aucun SDK ne confère un droit d’écriture. |
| A2UI | Renderer A2UI se trouve uniquement dans l’ancienne app `apps/alineo/`; il n’est pas la direction de l’application Alineo active. | Le rendu ne valide aucun droit d’écriture. Ne pas réactiver ni imposer A2UI au shell actif sans demande explicite. |
| Connecteurs | Composio est la voie envisagée pour le Lot 3, pas une configuration active du Lot 1. Intégration et scopes à valider. | Contrat interne ci-dessous ; aucun nom d’outil distant, endpoint ou scope Composio n’est présumé. |
| Fichiers | Formats candidats précisés au Lot 4 ; Supabase Storage et indexation ne sont pas choisis. | Les documents sont hors Lot 1 ; pas d’upload, de bucket ni d’indexation activé par cette spécification. |
| Clients | Web d’abord ; Capacitor/Android et Tauri/Windows sont des options du Lot 5. | Pas de client installé, notification système ni promesse d’alarme dans le MVP. |

Voir [`DECISIONS.md`](DECISIONS.md) pour les questions nécessitant une validation. Une alternative présente dans le brief ne doit pas être interprétée comme un choix fait.

## 2. Arborescence logique des modules

L’arborescence ci-dessous fixe les frontières fonctionnelles et la direction des dépendances ; elle ne présume pas l’outil de monorepo ni le framework web final.

```text
/
├── apps/
│   ├── web/                         # shell React responsive, routage à choisir
│   │   └── src/
│   │       ├── app/                 # routes, layout, session, navigation
│   │       ├── features/
│   │       │   ├── today/           # tableau de journée et décisions visibles
│   │       │   ├── tasks/           # inbox, détail, édition manuelle
│   │       │   ├── projects/        # Lot 2 : portefeuille et vues partagées
│   │       │   ├── calendar/        # Lot 2 interne, Lot 3 connecté
│   │       │   ├── focus/           # Lot 2 : sessions et contrôles
│   │       │   ├── life-core/       # configuration explicite, sans journal Lot 1
│   │       │   ├── habits/          # Lot 2 : habitudes distinctes du Life Core
│   │       │   ├── agent-activity/  # événements publics réellement observés
│   │       │   └── settings/        # profil, fuseau, disponibilité, permissions
│   │       ├── shared/              # client API, auth UI, accessibilité, composants
│   │       └── test/                # tests UI et E2E
│   └── server/                      # BFF/API Node ; framework HTTP à choisir
│       └── src/
│           ├── http/                # routes, validation, erreurs, middleware
│           ├── auth/                # validation de session et contexte propriétaire
│           ├── application/         # cas d’usage, orchestration transactionnelle
│           ├── repositories/        # accès Supabase/Postgres côté serveur
│           ├── policy/              # approbations, droits et limites d’outils
│           ├── observability/       # request ID, audit redigé, événements
│           └── jobs/                # réservé aux lots futurs, désactivé au MVP
├── packages/
│   ├── contracts/                  # DTO API, erreurs et schémas validés (Zod ou équivalent)
│   ├── domain/                     # règles métier sans réseau, UI ni fournisseur
│   │   ├── tasks/
│   │   ├── life-core/
│   │   ├── availability/
│   │   ├── projects/               # Lot 2
│   │   ├── calendar/               # Lot 2/3
│   │   ├── focus/                  # Lot 2
│   │   └── habits/                 # Lot 2
│   ├── planner/                    # fonction pure, ordre stable, motifs, diff
│   ├── agent-core/                 # orchestrateur unique, politique, tools, activity
│   │   └── skills/                 # Lot futur : manifestes revus/versionnés et allowlist stricte
│   ├── adapters/
│   │   ├── llm/                    # interface + adaptateur choisi ultérieurement
│   │   ├── database/               # client/repos Supabase, serveur seulement
│   │   └── composio/               # Lot 3 : adaptateur serveur, inactif avant consentement
│   ├── ui/                         # tokens/composants accessibles, aucun thème APIOS
│   └── config/                     # configuration typée, aucune valeur secrète committée
├── supabase/
│   ├── migrations/                 # migrations incrémentales, relisibles et réversibles
│   └── tests/                      # tests SQL/RLS, deux utilisateurs minimum
├── docs/
└── .env.example                    # noms/indications seulement, jamais de secret réel
```

**Dépendances autorisées :** `web → contracts` et composants UI ; `server → application/domain/contracts/adapters` ; `agent-core → contracts/domain/policy/ports` ; adaptateurs vers fournisseurs seulement côté serveur. `domain` et `planner` ne dépendent ni du LLM, ni de Composio, ni du framework. `planner` n’effectue aucun accès réseau ou écriture. Aucun import de clé serveur dans `apps/web`.

Les fonctionnalités Projects, Calendar, Focus et Habits peuvent exister comme dossiers vides ou frontières de code, mais aucune route, navigation ou donnée fictive ne doit les faire passer pour des fonctions livrées au Lot 1. Le répertoire `skills/` est inactif au MVP : une compétence future est un manifeste revu/versionné qui référence uniquement les tools autorisés et ne peut ni ajouter un droit ni changer la politique d’approbation. Les chemins reflètent des responsabilités ; leur création dans le dépôt reste une tâche d’implémentation, pas un fait acquis.

## 3. Architecture d’exécution

### 3.1 Flux de requête

```text
Navigateur (React)
  ├─ Supabase Auth : session utilisateur, clé publique uniquement
  └─ HTTPS same-origin → API/BFF
       1. vérifier JWT/session ; user_id := claim `sub` validée
       2. valider DTO et permission ; refuser tout user_id fourni par le client/modèle
       3. appeler le cas d’usage avec un client DB lié au JWT utilisateur
       4. appliquer RLS, contrainte de version et idempotence
       5. écrire l’audit dans la transaction métier
       6. retourner DTO stable ; publier les événements réellement observés
             ├─ Supabase Auth + PostgreSQL (source de vérité)
             ├─ planner pur (proposition seulement)
             ├─ passerelle LLM optionnelle, serveur seulement (fournisseur à choisir)
             └─ adaptateur Composio (Lot 3+, consentement/scopes, serveur seulement)
```

L’API/BFF est le seul chemin d’écriture du produit. Le navigateur utilise la clé publique de Supabase pour la session ; il n’accède pas à `service_role`, au fournisseur LLM, aux secrets Composio ni aux identifiants de connexion. Les appels DB côté serveur conservent le JWT de l’utilisateur pour que RLS s’applique ; un client `service_role` n’est pas le mécanisme courant d’accès aux données. Toute tâche d’administration privilégiée, si elle devient nécessaire, est un cas distinct, restreint et audité. Cette topologie est la proposition de sécurité de référence à valider avec l’hébergement choisi.

### 3.2 Règles de confiance et erreurs

- Les schémas d’entrée sont validés au serveur. Les valeurs d’ID de propriétaire proviennent uniquement de la session validée.
- Les données externes (événement, fichier, email, sortie de tool) sont des données non fiables, même après validation de forme ; aucune instruction incluse ne peut étendre les outils autorisés.
- Les mutations incluent contrôle de version ; une divergence renvoie `VERSION_CONFLICT` sans écraser l’état.
- Toute écriture porte une clé d’idempotence propre à l’utilisateur/opération ; le rejeu retourne le résultat déjà enregistré, sans second effet.
- Erreur publique stable : `{ code, message_public, retryable, request_id }`. Aucun token, stack trace, payload fournisseur brut ou existence de données d’un autre propriétaire n’est révélé.
- Les logs et résumés publics excluent prompts complets, notes privées Life Core, secrets, contenu de document et détails personnels non nécessaires.

## 4. Architecture de l’agent

### 4.1 Composants et responsabilités

1. **API d’agent** : authentifie la session, crée un `agent_run`, lie un request ID et applique les limites de taille/temps. Elle n’accepte aucun rôle ni propriétaire du navigateur.
2. **Orchestrateur unique** : transforme la demande en décision structurée, demande une clarification si des données sont absentes, appelle uniquement les tools explicitement enregistrés. Multi-agent hors MVP.
3. **Constructeur de contexte** : lit les données minimales autorisées pour le cas d’usage. Les notes narratives Life Core n’existent pas au Lot 1 ; si elles sont ajoutées plus tard, elles sont exclues du contexte par défaut. Aucun accès massif à la base.
4. **Adaptateur LLM** : interface fournisseur-neutraliste, sortie typée et timeouts/erreurs normalisés. Le fournisseur/modèle n’est pas sélectionné ici. L’absence du fournisseur n’empêche pas le flux manuel ni le planner.
5. **Registre de tools** : allowlist côté serveur, schémas, niveau de risque, permission requise et mode lecture/proposition/écriture. Le modèle ne peut ni charger un tool, ni modifier sa définition, ni choisir un compte externe arbitraire.
6. **Services de domaine/planner** : appliquent les règles déterministes et produisent résultat, justification publique et diff. Un planner calcule ; il n’écrit pas.
7. **Moteur d’approbation** : lie un accord à un hash de payload précis, propriétaire, version, action, expiration et clé d’idempotence. Une modification du payload, des permissions, de la version ou de la connexion invalide l’accord.
8. **Exécuteur de mutation** : revalide propriétaire, permission, état courant, version et approbation au moment de l’exécution ; applique en transaction ; émet audit et événement réel.
9. **Agent Activity** : projection des événements stockés, ordonnée par `sequence`, avec résumé public et temps réel uniquement lorsque l’événement correspondant existe. Aucun texte de raisonnement interne n’est conservé.

### 4.2 Tools et droits — Lot 1

Contrats logiques ; les noms sont internes à PAOS et n’impliquent pas une API de fournisseur particulière. La prévisualisation et la création du seul enregistrement `approval` sont gérées par le serveur/UI ; le tool de mutation est appelé uniquement après la décision utilisateur. L’annulation de plan du Lot 1 reste un geste utilisateur/API, pas un tool supplémentaire autorisé au modèle.

| Tool interne | Entrée utile | Effet | Niveau et règle |
|---|---|---|---|
| `capture_commitment` | `{ text, source? }` | Produit un brouillon structuré et les champs manquants. | Proposition ; **aucune persistance** avant confirmation UI. Texte utilisé selon le fournisseur choisi et la politique de confidentialité approuvée. |
| `clarify_commitment` | `{ draft, missing_fields[] }` | Pose une question ou propose une reformulation. | Proposition ; ne crée pas de préférence ni d’échéance tacite. |
| `propose_day_plan` | `{ local_date, task_ids? }` | Retourne version, blocs proposés, diff et raisons de non-planification. | Calcul pur/read-only ; aucune mutation ni envoi à un calendrier. |
| `create_task` | `{ approval_id, idempotency_key }` | Crée la tâche après revalidation de l’approbation et de la session. Le payload exact est celui de l’aperçu déjà approuvé. | Écriture interne avec confirmation explicite et audit ; aucune mutation avant approbation. |
| `apply_plan` | `{ approval_id, plan_version_id, idempotency_key }` | Applique seulement le plan approuvé si snapshot/version inchangés. | Écriture interne confirmée, transactionnelle, idempotente ; conflit = aucune écriture. |

Chaque invocation validée peut produire `tool.requested`, `tool.started`, `tool.completed` ou `tool.failed`. Pour une mutation, un événement d’approbation puis `action.applied` n’est émis qu’après commit réussi. Les événements peuvent être reliés à `agent_run_id`; ils n’incluent ni chaîne de pensée, ni verbatim privé, ni texte simulé. Un timeout ou résultat incertain d’un fournisseur externe ne doit pas être présenté comme une réussite.

### 4.3 Cycle de vie d’approbation

```text
prepared → awaiting_approval → approved → executing → completed
                              ↘ rejected       ↘ failed / conflict
                              ↘ expired
```

L’approbation se fait par un geste utilisateur dans une interface authentifiée ; le modèle ne peut pas approuver. L’objet approuvé inclut `owner_id`, `action_type`, `resource/version`, `payload_hash`, `expires_at` et les paramètres d’effet. Toute altération invalide l’accord. Les opérations irréversibles/suppressions ne font pas partie du MVP. Il n’existe pas de consentement global aux écritures. Toute proposition externe future est confirmée séparément, action par action.

### 4.4 Contrats HTTP du MVP

Ces routes sont des contrats de produit (l’implémentation peut les co-localiser avec le framework web). Toutes les routes sont same-origin HTTPS, authentifiées sauf endpoints publics Auth explicitement fournis par Supabase. Les DTO n’acceptent jamais `user_id` comme champ d’autorité.

| Méthode / route | Entrée et réponse attendue | Mutation / garde-fou |
|---|---|---|
| `GET /api/profile` | Retourne profil et `version`, valeurs non configurées conservées comme `null`. | Lecture du propriétaire courant. |
| `PUT /api/profile` | `{ displayName?, timezone, locale?, weekStartsOn?, expectedVersion }`. | Fuseau vérifié IANA ; contrôle optimiste ; aucun horaire personnel créé automatiquement. |
| `GET /api/availability-rules` | Liste explicite, éventuellement vide. | Lecture du propriétaire courant. |
| `POST /api/availability-rules` | `{ weekday, localStart, localEnd }`. | Saisie utilisateur ; pas de règle seedée ; contrôle des chevauchements/ranges et version. |
| `PATCH /api/availability-rules/:id` / `DELETE .../:id` | Champs autorisés + `expectedVersion`. | Propriétaire/RLS ; suppression explicite ; planner invalide les propositions devenues obsolètes. |
| `GET /api/life-practices` | Pratiques du propriétaire, liste vide par défaut. | Aucune pratique créée au premier login. |
| `POST /api/life-practices` | `{ kind, title, timezone, protectionLevel, durationMinutes?, recurrenceRule?, recoveryWindowMinutes? }`. | Champs saisis par utilisateur ; validation du fuseau/récurrence ; pas de note narrative. |
| `PATCH /api/life-practices/:id` / `DELETE .../:id` | Champs modifiables + `expectedVersion`. | RLS/contrôle de version ; signaler les blocs/occurrences futurs affectés, ne pas les supprimer silencieusement. |
| `GET /api/tasks?status=&cursor=` | Liste/inbox paginée, sans projets au Lot 1. | Scopée à la session ; champs privés minimisés. |
| `POST /api/capture` | `{ text, source? }` → `{ draft, missingFields[] }`. | Brouillon non persistant ; si un fournisseur IA est activé, traitement selon consentement et paramètres approuvés. |
| `POST /api/tasks` / `PATCH /api/tasks/:id` | DTO tâche + `expectedVersion?` + `idempotencyKey` pour création. | Écriture utilisateur explicite ; écriture d’agent seulement après approbation liée au hash. |
| `GET /api/today?date=YYYY-MM-DD` | Tâches, pratiques configurées, blocs, conflits et non-planifiés du propriétaire. | Date interprétée dans le fuseau configuré ; retourne `configurationRequired` si fuseau/disponibilité manquent. |
| `POST /api/plans/propose` | `{ localDate, inputVersionHash? }` → plan versionné, diff, motifs. | Pur/read-only ; aucun bloc écrit à la proposition. |
| `POST /api/plans/:id/apply` | `{ approvalId, expectedVersion, idempotencyKey }`. | Revalide snapshot, propriétaire, hash et approbation dans la transaction ; stale = `VERSION_CONFLICT`, sans écriture. |
| `POST /api/plans/:id/cancel` | `{ approvalId?, expectedVersion, idempotencyKey }`. | N’annule que les effets futurs permis ; passé immuable. |
| `GET /api/agent/runs/:id/events` | Événements publics triés par `sequence`. | Propriétaire courant ; aucune chaîne de pensée ni payload brut. |
| `POST /api/approvals/:id/decision` | `{ decision: "approved"|"rejected", expectedVersion }`. | Décision du propriétaire connecté ; approbation expirée ou hash/payload modifié refusés. |

Les réponses réussies utilisent un DTO documenté et peuvent inclure `{ requestId, version, auditEventId }` ; les réponses d’erreur gardent `{ code, message_public, retryable, request_id }`. Les writes sont idempotents quand elles peuvent produire un effet ; les interactions manuelles directes du propriétaire restent explicites et ne sont pas confondues avec l’autonomie d’un agent. Les événements de session réels peuvent provenir du serveur ou d’une action confirmée, jamais d’un timer simulé.

## 5. Schéma Supabase cible

### 5.1 Règles communes

Le présent schéma est la cible de migration proposée, pas une migration déjà appliquée. Les champs privés ci-dessous sont indexés/filtrés par propriétaire. Sauf mention `NULL`, les colonnes et timestamps listés sont `NOT NULL` ; sauf autre clé précisée, `id` est `uuid PRIMARY KEY DEFAULT gen_random_uuid()`. `CHECK IN (...)` est une notation abrégée de `CHECK (colonne IN (...))` et les types/contraintes sont vérifiés lors de la revue SQL avant implémentation.

- Tables privées : `user_id uuid NOT NULL`; clés étrangères vers `auth.users(id) ON DELETE CASCADE`; RLS active avant exposition. Exception de représentation : `profiles.id` est directement `auth.users.id` et ses policies comparent `auth.uid() = id`.
- Pour toute référence d’un objet utilisateur à un autre, ajouter `UNIQUE(id, user_id)` sur la cible et une FK composite `(foreign_id, user_id) → target(id, user_id)` afin qu’un ID d’un autre propriétaire soit refusé par la base, même si une route est défectueuse.
- Politique propriétaire : `USING (auth.uid() = user_id)` et `WITH CHECK (auth.uid() = user_id)` sur SELECT/INSERT/UPDATE/DELETE pour les tables usuelles. Aucune policy `anon`. `profiles` compare `auth.uid() = id`.
- `audit_events` et `agent_steps` sont lisibles seulement par leur propriétaire et n’acceptent pas de DML direct depuis le navigateur. INSERT passe par un writer serveur étroit ou une fonction DB sécurisée qui dérive le propriétaire, valide les types et n’accepte pas de texte arbitraire ; UPDATE/DELETE sont refusés par droits/policy/trigger. Si une fonction `SECURITY DEFINER` est utilisée, elle fixe `search_path`, n’exécute aucun SQL dynamique et a des tests d’abus. Le `service_role` n’est jamais le client général des données applicatives.
- Identifiants `uuid`; dates absolues `timestamptz` stockées UTC ; les règles récurrentes locales portent un fuseau IANA explicite. L’absence de fuseau ou disponibilité reste une configuration incomplète.
- `version integer NOT NULL` est incrémentée par le chemin de mutation après `UPDATE ... WHERE id = $id AND version = $expected`. Pour les tables non modifiables, le champ n’est pas requis.
- JSONB seulement pour préférences structurées, snapshot de plan ou résumé d’audit avec schéma versionné ; pas de dump arbitraire de conversation, secret OAuth, note privée ou contenu de fichier.
- Valeurs d’application initiales ne seedent aucune ligne de profil, disponibilité, tâche, pratique ou habitude personnelle. Les valeurs système de sécurité (approbation requise, listes vides) ne constituent pas des préférences personnelles.

### 5.2 Lot 1 — tables et clés

| Table | Colonnes / règles essentielles | Index et rôle |
|---|---|---|
| `profiles` | `id uuid PK → auth.users(id)` ; `display_name text NULL`, `timezone text NULL`, `locale text NULL`, `week_starts_on smallint NULL CHECK 0..6`, `created_at`, `updated_at`. Le fuseau reste NULL jusqu’à saisie et vérification IANA. | `id` suffit pour accès propriétaire. Profil = paramètres explicites uniquement. |
| `user_settings` | `user_id uuid PK/FK`; `autonomy_policy jsonb NOT NULL DEFAULT '{"internal_writes":"approval_required","external_writes":"approval_required"}'::jsonb` ; `planning_preferences jsonb NOT NULL DEFAULT '{}'::jsonb` ; `notification_preferences jsonb NOT NULL DEFAULT '{}'::jsonb` ; `privacy_preferences jsonb NOT NULL DEFAULT '{}'::jsonb` ; `version`, timestamps. Valeurs de vie et plages ne sont pas encodées dans des défauts cachés. | Une ligne créée à l’inscription ou au premier accès. Les defaults JSON décrivent les garde-fous et l’absence de préférences. |
| `availability_rules` | `id`, `user_id`, `weekday smallint CHECK 0..6`, `local_start time`, `local_end time CHECK local_end > local_start`, `active boolean`, `created_at`, `updated_at`, `version`. Intervalles définis dans le fuseau du profil, une ligne par plage et jour ; aucune ligne par défaut. | `(user_id, weekday, active)` ; planner Lot 1. Plages traversant minuit représentées par deux jours explicites. |
| `tasks` | `id`, `user_id`, `title text NOT NULL CHECK btrim(title) <> ''`, `description text NULL`, `status text CHECK IN ('inbox','ready','planned','doing','blocked','done','cancelled')`, `importance smallint NULL` (aucun score seedé ; `NULL` trié après une importance explicite), `urgency_source text NULL`, `due_at timestamptz NULL`, `earliest_start timestamptz NULL`, `duration_minutes integer NULL CHECK > 0`, `energy text NULL`, `context text NULL`, `completed_at timestamptz NULL`, `version`, timestamps. `status` initial `inbox` est un état de workflow, pas une préférence personnelle. | `UNIQUE(id,user_id)` ; `(user_id,status,created_at)` et `(user_id,due_at)` ; tâche non planifiable sans durée explicite. |
| `task_dependencies` | `user_id`, `task_id`, `depends_on_task_id`, `created_at`; PK `(task_id, depends_on_task_id)` ; deux FKs composites vers `tasks(id,user_id)` ; `CHECK(task_id <> depends_on_task_id)`. | Index `(user_id, depends_on_task_id)` ; le service détecte les cycles par parcours récursif avant mutation ; l’écriture ne peut relier deux propriétaires. |
| `life_practices` | `id`, `user_id`, `kind text` et `title text` saisis par l’utilisateur, `protection_level text CHECK IN ('locked','ask','flexible')`, `default_duration_minutes integer NULL CHECK > 0`, `recurrence_rule text NULL` validée côté serveur, `timezone text NOT NULL` IANA choisie par l’utilisateur, `recovery_window_minutes integer NULL CHECK >=0`, `active boolean`, `version`, timestamps. `ai_access boolean NOT NULL DEFAULT false` si le champ est conservé pour défense en profondeur. | `UNIQUE(id,user_id)` ; `(user_id,active)` ; **aucune ligne seedée**. Pas de champ de journal narratif. |
| `practice_occurrences` | `id`, `user_id`, `practice_id`, `scheduled_start/ scheduled_end timestamptz CHECK scheduled_end > scheduled_start`, `state text CHECK IN ('scheduled','done','partial','skipped')`, `version`, timestamps. Pas de notes libres. FK composite vers `life_practices`. | `UNIQUE(user_id,practice_id,scheduled_start)` ; `(user_id,scheduled_start)` ; état factuel ; une occurrence ne prouve pas à elle seule une pratique si elle n’a pas été déclarée par l’utilisateur. |
| `time_blocks` | `id`, `user_id`, `task_id NULL`, `practice_id NULL`, `kind text CHECK IN ('busy','task','practice')`, `source text CHECK IN ('user','planner')`, `starts_at`, `ends_at CHECK ends_at > starts_at`, `locked boolean`, `status text CHECK IN ('proposed','confirmed','cancelled')`, `plan_version_id NULL`, `version`, timestamps. Au plus une référence task/practice ; `busy` n’en référence aucune ; les autres référencent celle correspondant à `kind`. FK composites de même propriétaire. | `UNIQUE(id,user_id)` ; `(user_id,starts_at,ends_at)` ; overlap vérifié par contrainte/exclusion transactionnelle si disponible et toujours par service. En Lot 1, pas d’événement externe. |
| `plan_versions` | `id`, `user_id`, `plan_date date`, `input_hash text`, `sequence integer`, `status text CHECK IN ('proposed','approved','applied','superseded','cancelled','conflict')`, `diff_json jsonb` versionné, `reason_codes jsonb`, `created_at`, `applied_at NULL`, `version`. Plan proposé immuable ; application conserve une trace. | `UNIQUE(id,user_id)` ; `UNIQUE(user_id,plan_date,sequence)` ; `(user_id,plan_date,created_at DESC)`. Pas d’écriture des blocs à l’étape de proposition ; `time_blocks` utilise une FK composite vers cette version. |
| `agent_runs` | `id`, `user_id`, `request_id`, `status text CHECK IN ('prepared','running','awaiting_approval','completed','failed','cancelled')`, `started_at`, `finished_at NULL`, `public_summary text NULL`, `provider_key text NULL` (identifiant non secret), `error_code text NULL`, `version`, timestamps. Aucun prompt/CoT brut. | `UNIQUE(user_id,request_id)` ; `(user_id,created_at DESC)`. |
| `agent_steps` | `id`, `user_id`, `agent_run_id`, `sequence integer`, `event_type text` allowlisté, `tool_name text NULL`, `status text`, `public_summary text NULL`, `occurred_at`, `metadata_redacted jsonb NOT NULL DEFAULT {}`. Pas de champ `chain_of_thought`, prompt ou texte privé. FK composite vers run. | `UNIQUE(agent_run_id,sequence)` ; `(user_id,occurred_at)`. Source de la vue Activity. |
| `approvals` | `id`, `user_id`, `action_type text`, `resource_type text`, `resource_id uuid NULL`, `expected_version integer NULL`, `payload_hash text`, `payload_preview jsonb` minimisé, `status text CHECK IN ('awaiting_approval','approved','rejected','expired','executed','failed')`, `expires_at`, `decided_at NULL`, `decision_by uuid NULL → auth.users` avec `CHECK(decision_by IS NULL OR decision_by = user_id)`, `version`, timestamps. Pas de texte privé. | `UNIQUE(id,user_id)` ; `(user_id,status,expires_at)` ; l’application recalcule le hash, ne se fie pas au seul statut. |
| `idempotency_records` | `user_id`, `idempotency_key text`, `operation text`, `request_hash text`, `resource_type text NULL`, `resource_id uuid NULL`, `response_code integer NULL`, `created_at`, `expires_at NULL`. PK `(user_id,idempotency_key)` ; même clé avec hash différent = refus. | Recherche par PK ; résultat sensible minimal ; conservation documentée. |
| `audit_events` | `id`, `user_id`, `request_id`, `actor_type text CHECK IN ('user','agent','system')`, `action text`, `entity_type text`, `entity_id uuid NULL`, `before_redacted jsonb NULL`, `after_redacted jsonb NULL`, `occurred_at`. Pas de payload complet, prompt ou notes. | `(user_id,occurred_at DESC)` et `(request_id)` ; INSERT append-only ; refus des UPDATE/DELETE par policy/droits/trigger. |

**Compléments d’intégrité :** les transitions de statut invalides sont refusées dans le service et couvertes par tests ; `done` impose une action utilisateur ou preuve fournie, jamais l’inférence du LLM. Les références de `time_blocks` et `task_dependencies` portent toutes `user_id`. Les approbations n’autorisent que le propriétaire courant. Toute écriture atomique met à jour l’objet, l’idempotence et l’audit dans une même transaction quand la topologie le permet.

### 5.3 Évolution post-MVP, sans activation anticipée

Ces tables ne font **pas** partie du Lot 1. Les migrations ultérieures ajoutent `user_id`, les FK composites et RLS avant l’exposition de chaque fonction.

- **Lot 2 — objectifs/projets :** `goals(id,user_id,parent_goal_id NULL,title,description NULL,period_start NULL,period_end NULL,status,version,timestamps)` ; `projects(id,user_id,goal_id NULL,title,description NULL,status,start_date NULL,due_date NULL,version,timestamps)` ; `milestones(id,user_id,project_id,title,due_at NULL,status,version,timestamps)`. Ajouter ensuite `tasks.project_id NULL` et les FK composites. Les vues List/Board/Timeline/Eisenhower partagent les mêmes tâches ; les projets ne les recopient pas.
- **Lot 2 — Focus :** `focus_sessions(id,user_id,task_id NULL,project_id NULL,planned_minutes NULL,started_at,ended_at NULL,paused_seconds,state,completion_source,version,timestamps)` ; une durée réelle est calculée uniquement à partir des événements effectivement enregistrés. Fonds sonores facultatifs, hors dépendance du cœur.
- **Lot 2 — estimations/revues :** `task_estimate_events(id,user_id,task_id,estimate_kind,minutes,confidence,source,recorded_at,session_id NULL,scope_change NULL)` ; événement append-only pour préserver initial, révisions et réalisé. P50/P80/confidence n’apparaissent pas avant assez de données et ne sont pas une promesse. `reviews(id,user_id,period_start,period_end,summary_structured,created_at)` sans score spirituel.
- **Lot 2 — habitudes :** `habits(id,user_id,title,recurrence_rule,target_value NULL,unit NULL,active,version,timestamps)` et `habit_occurrences(id,user_id,habit_id,scheduled_at,state CHECK IN ('done','partial','skipped'),value NULL,created_at)`. Distinctes des `life_practices`; aucune habitude seedée.
- **Lot 3 — connecteurs :** `connector_accounts(id,user_id,provider,external_subject_id NULL,connection_ref,status,granted_scopes text[],connected_at,revoked_at NULL,last_sync_at NULL,version,timestamps)` ; `external_objects(id,user_id,connector_account_id,object_type,external_id,etag NULL,source_updated_at NULL,last_seen_at NULL,deleted_at NULL,metadata_minimized)` ; `connector_cursors(id,user_id,connector_account_id,resource,watermark,updated_at)` ; `webhook_receipts(id,user_id,provider,event_id,payload_hash,received_at,processed_at NULL,status)` avec unicité provider/event_id ; une ligne n’est créée qu’après validation de signature et résolution de la connexion/propriétaire. Les callbacks invalides/inconnus sont rejetés sans enregistrer leur payload. Les jetons OAuth restent dans le coffre géré par le fournisseur de connexion, jamais en base PAOS.
- **Lot 4 — documents :** `documents(id,user_id,source_type,source_ref NULL,storage_key NULL,mime_type,size_bytes,checksum,status,retention_until NULL,created_at,deleted_at NULL)` et éventuellement `document_chunks(id,user_id,document_id,chunk_index,content_ref,source_locator,embedding_ref NULL,created_at)`. Le fichier lui-même, le stockage, la vectorisation, la rétention et la suppression sont à décider avant toute activation. RLS également sur Storage ; aucun chunk accessible hors filtre propriétaire/source.

Les champs ci-dessus sont le contrat logique à valider avant chaque lot. Les options d’hébergement, de coffre, d’indexation et de stockage ne sont pas choisies par cette liste.

### 5.4 Migrations et critères RLS

1. Une migration par changement cohérent, numérotée, relisible et couverte par une migration inverse ou une procédure de rollback documentée. Pas de données personnelles d’exemple dans les migrations.
2. Chaque nouvelle table est créée avec propriétaire, FK, contraintes et indexes, puis RLS/policies ; ne pas déployer une table exposée entre ces étapes.
3. Tests automatisés avec deux utilisateurs authentifiés : lecture, insertion, mise à jour, suppression propres ; même opérations croisées refusées ; références composites croisées refusées ; absence d’accès `anon`.
4. Test des suppressions de compte/cascade, dépendances, sessions expirées, approbation expirée, version périmée, idempotence répétée et audit append-only.
5. Sauvegarde/restauration et retour arrière doivent être démontrés avant pilote ; aucun résultat de ce type n’est revendiqué dans ce dépôt documentaire.

## 6. Contrats Composio — Lot 3 uniquement

### 6.1 Port interne et isolation

Composio est un adaptateur serveur envisagé pour relier le compte calendrier de chaque propriétaire. Les noms ci-dessous sont des **opérations internes PAOS**, pas les noms garantis de tools/IDs Composio. Le SDK/API exact, le mécanisme de callback, la gestion de scopes et la validation des webhooks seront fixés après vérification de la documentation correspondant à la version réellement choisie ; aucun endpoint fournisseur n’est inventé ici.

```ts
interface CalendarConnectorPort {
  beginConnect(input: { ownerId: string; provider: "google_calendar"; returnUrl: string }): Promise<ConnectSession>;
  finishConnect(input: { ownerId: string; state: string; callback: unknown }): Promise<ConnectionStatus>;
  listEvents(input: { ownerId: string; connectionId: string; from: string; to: string; pageToken?: string }): Promise<Page<ExternalCalendarEvent>>;
  getEvent(input: { ownerId: string; connectionId: string; externalEventId: string }): Promise<ExternalCalendarEvent>;
  createEvent(input: { ownerId: string; connectionId: string; event: CalendarEventWrite; idempotencyKey: string }): Promise<ExternalCalendarEvent>;
  updateEvent(input: { ownerId: string; connectionId: string; externalEventId: string; expectedEtag?: string; event: CalendarEventWrite; idempotencyKey: string }): Promise<ExternalCalendarEvent>;
  revoke(input: { ownerId: string; connectionId: string }): Promise<void>;
}
```

- `ownerId` est injecté par le serveur depuis la session, jamais accepté comme autorité depuis le modèle. `connectionId` est vérifié en base pour ce même propriétaire avant tout appel Composio.
- L’identifiant externe Composio (entity/user et connection) est opaque et non secret ; préférer un identifiant PAOS pseudonyme stable plutôt qu’un email ou une donnée de Life Core.
- Aucun access/refresh token n’est stocké ni renvoyé par PAOS. Les secrets Composio résident uniquement dans la configuration serveur/coffre choisi.
- Les appels distants passent par une allowlist, un schéma strict, une limite de débit, un timeout et un journal redigé. Le modèle ne voit jamais une clé, un outil arbitraire ou un brut fournisseur.
- Une connexion est liée à un utilisateur et à un fournisseur ; une révocation déconnecte la connexion, invalide ses approbations en attente et bloque toute réutilisation de son `connectionId`.

### 6.2 DTO normalisés

```ts
type ConnectSession = {
  connectionId: string;          // identifiant PAOS non-secret
  authorizationUrl: string;      // URL de consentement temporaire
  expiresAt: string;             // RFC 3339 UTC
};

type ConnectionStatus = {
  connectionId: string;
  provider: "google_calendar";
  status: "connected" | "reauth_required" | "revoked";
  grantedScopes: string[];       // scopes réellement confirmés, jamais demandés par le modèle
};

type ExternalCalendarEvent = {
  externalEventId: string;
  title: string;
  startsAt: string;              // RFC 3339 avec offset
  endsAt: string;
  timezone: string;
  allDay: boolean;
  etag?: string;
  sourceUpdatedAt?: string;
  provenance: { provider: "google_calendar"; connectionId: string };
};

type CalendarEventWrite = {
  title: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  allDay?: boolean;
  description?: string;          // vide/omis par défaut ; contenu uniquement après confirmation
};

type Page<T> = { items: T[]; nextPageToken?: string; syncWatermark?: string };
```

Les événements distants sont des données non fiables. Au début, normaliser seulement les champs nécessaires aux conflits/affichage ; description, invités et pièces jointes sont omis du contexte IA par défaut. Valider dates, timezone, longueur et caractères ; conserver provenance/source ID et `etag` si fourni. Une donnée extérieure ne crée pas une tâche sans action explicite.

### 6.3 API produit et droits

| Route interne PAOS | Fonction | Autorisation |
|---|---|---|
| `POST /api/connectors/google-calendar/connect` | Initier la session de consentement et retourner une URL temporaire + `state` anti-CSRF. | Session valide ; scopes minimaux configurés côté serveur, aucune portée fournie par le modèle. |
| `GET /api/connectors/google-calendar/callback` | Vérifier `state`, lier la connexion au propriétaire initiateur et enregistrer l’état/scopes réellement accordés. | Callback à usage unique ; rejet si state expiré, déjà consommé ou propriétaire différent. |
| `GET /api/calendar/events?from=&to=&pageToken=` | Lire une fenêtre du calendrier connecté ; paginer et normaliser. | Lecture seulement ; `connectionId` déterminé/validé côté serveur. |
| `POST /api/calendar/event-proposals` | Produire une proposition locale de création/modification et son aperçu/hash. | Aucun appel d’écriture externe. |
| `POST /api/calendar/event-proposals/:id/apply` | Appliquer une proposition après décision authentifiée et revalidation des données/scopes. | Approbation explicite liée au hash, `expectedEtag`/version et `idempotency_key`. |
| `DELETE /api/connectors/google-calendar/connection` | Révoquer/désactiver la connexion, invalider approbations/cursors et lancer la suppression de références locales selon la politique de rétention. | Confirmation de l’utilisateur ; jamais de suppression d’événement distant en Lot 3 initial. |

**Scopes :** la première connexion est en lecture seule. Pour Google Calendar, le scope de lecture candidat est `calendar.events.readonly` ; il reste à vérifier contre le produit, la configuration Composio et la politique OAuth retenue avant demande réelle. Un scope de création/modification (candidat : `calendar.events`) ne peut être demandé qu’après décision explicite et justification de la fonction ; aucun scope d’écriture ni suppression n’est autorisé par défaut. L’écran de consentement présente le fournisseur, les permissions, données lues et moyen de révocation.

### 6.4 Écriture externe, webhooks et idempotence

- Les objets externes et modifications proposées sont stockés séparément des tâches/blocs internes ; une provenance externe ne devient pas une priorité personnelle.
- Pour appliquer une création/modification : générer l’aperçu, calculer `payload_hash`, afficher l’objet complet qui sera écrit, recueillir l’accord, puis revalider connexion, scope, hash, version/ETag et échéance d’approbation juste avant l’appel.
- Préférer un identifiant idempotent supporté par le fournisseur. Si Composio/provider n’offre pas une clé idempotente fiable, enregistrer une opération sortante avant appel et réconcilier par identifiant/empreinte ; en cas de timeout à résultat inconnu, **ne pas répéter à l’aveugle** et demander une vérification/résolution.
- Aucun webhook n’est accepté sans vérification cryptographique conforme à la documentation de la version retenue. Le schéma de signature n’est pas supposé ici. Dédupliquer par identifiant d’événement fournisseur ; à défaut, empreinte canonique limitée + fenêtre d’idempotence ; rejeter les événements non authentifiés et enregistrer seulement un motif redigé.
- Un webhook déclenche une mise à jour de cache/provenance, jamais une instruction agentique ni la création silencieuse d’une tâche. Une période de réconciliation par lecture reste possible si la livraison webhook n’est pas garantie.
- Erreurs normalisées : `CONNECTOR_NOT_FOUND`, `CONSENT_REQUIRED`, `SCOPE_MISSING`, `REAUTH_REQUIRED`, `RATE_LIMITED`, `UPSTREAM_UNAVAILABLE`, `UPSTREAM_CONFLICT`, `INVALID_PROVIDER_RESPONSE`, `OUTCOME_UNKNOWN`. Ne jamais retourner l’erreur brute de Composio.
- L’API Composio exacte, le choix du connecteur Calendar Google-only/multi-fournisseur, les scopes finalisés et les garanties de webhook/idempotence sont des portes de décision avant activation Lot 3 ; rien de cela n’est activé au Lot 1.

## 7. Périmètre exact du MVP

### 7.1 Définition

**MVP contractuel = Lot 1 du cahier PAOS**, pas la totalité des six espaces et pas une version avancée du brief récent. Il est un parcours web mono-propriétaire avec Auth/RLS, tâches simples, Life Core vide à configurer, Today minimal, planner déterministe et activité agentique observable. Le mot MVP ne déplace aucune fonction prévue au Lot 2 ou aux lots suivants.

### 7.2 Inclus dans ce MVP

1. Squelette web responsive, navigation essentielle et authentification Supabase ; l’utilisateur connecté est le seul propriétaire des données affichées.
2. Profil sans valeur personnelle seedée ; saisie explicite du fuseau et des plages de disponibilité avant production d’un plan.
3. Tâches simples : capture/draft, confirmation avant persistance, liste/inbox, édition manuelle, statuts et dépendances nécessaires au planner. Pas de hiérarchie projets au Lot 1.
4. Life Core initialement vide ; ajout/édition/désactivation de pratiques par l’utilisateur, récurrence/fuseau/protection lorsqu’ils sont saisis, aucune note narrative ni score.
5. Today minimal : pratiques configurées pertinentes, tâches, chronologie interne, non-planifiés, conflits, recommandation explicable et progression factuelle. Les dispositions 1 essentielle + jusqu’à 2 secondaires sont configurables, pas des objectifs obligatoires.
6. Planner pur déterministe : durées saisies, pas d’estimation IA/P50/P80, pas de fractionnement, règles de conflit, diff versionné, motif pour chaque tâche non planifiée. Zéro marge technique seulement si aucune marge n’est choisie, accompagnée de `NO_BUFFER_CONFIGURED`.
7. Proposition et application avec aperçu, confirmation humaine, contrôle de version, idempotence, audit append-only et annulation future selon les règles du cahier.
8. Agent runtime minimal, orchestrateur unique, outils allowlistés/scopés et Agent Activity vraie. L’application Alineo utilise un backend sample local fictif sans modèle/provider ni donnée utilisateur réelle. L’ancienne UI CopilotKit/A2UI dans `apps/alineo/` n’est plus active. La provenance du socle n’équivaut ni à la validation des contrats métier PAOS ni à une sécurité multi-tenant. Une identité et une sélection explicite de fournisseur/conditions sont requises avant toute donnée réelle en live.
9. Sécurité de base, erreurs sûres, journaux redigés et tests RLS avec deux utilisateurs, tests unitaires planner, parcours E2E et preuve opérationnelle avant pilote.

### 7.3 Explicitement exclus du Lot 1

- **Projects** complets, objectifs/jalons/portefeuille ; projets et vues de projet au Lot 2.
- Vues Board, Timeline/Gantt éditable et Eisenhower globale ; calendrier interne jour/semaine/mois/année comme espace complet ; les vues étendues arrivent au Lot 2. La liste/inbox et une chronologie minimaliste Today ne sont pas une suite de vues.
- Google Calendar connecté, Composio, OAuth/connecteurs, lecture/écriture d’événements, webhooks ; Lot 3.
- Focus/Pomodoro, sons, historique de sessions, notifications système et timer natif ; Lot 2 puis Lot 5 pour fonctions natives.
- Habits, occurrences, statistiques de régularité ; Lot 2. Life Core n’est pas reconverti en Habits.
- Estimation apprise, P50/P80, marge de risque personnelle, revue de performance ; Lot 2.
- Import PDF/Markdown/images/tableurs/DOCX/Drive/Docs, OCR, extraction, recherche vectorielle, stockage fichier ; Lot 4.
- Gmail, Drive, GitHub et toute autre intégration externe ; Lot 4+.
- Android/Capacitor, Windows/Tauri, offline complet et promesse d’alarme app fermée ; Lot 5 et validations par appareil.
- Multi-agent, exécution interne préautorisée, action externe autonome, suppression externe, UI générée librement, chaîne de pensée exposée.

Tout déplacement d’un élément des lots 2–5 vers le MVP constitue un **changement de périmètre** : décision utilisateur explicite, révision de cette table, impact sécurité/données/acceptation documenté. Aucun changement n’est implicite.

### 7.4 Conditions de sortie du MVP (preuves à produire)

- Installation propre et CI format/lint/typecheck/tests/build verte ; ces tâches ne sont pas encore exécutées.
- Tests automatisés Auth/RLS à deux utilisateurs couvrant les opérations et références croisées ; aucun test de ce type n’est revendiqué à ce stade.
- Parcours manuel fonctionnel sans fournisseur IA : config vide, saisie des paramètres, capture → confirmation → proposition → diff → confirmation → blocs/Today.
- Fixtures du planner reproductibles, tri stable, absence de chevauchement, contraintes Life Core, durée manquante, capacité, dépendance, version obsolète et idempotence vérifiées.
- Audit réel pour chaque mutation, aucun événement d’activité fabriqué, aucun champ de pensée privée, aucune note narrative Life Core.
- Sauvegarde/restauration, retour arrière et procédures de suppression/export démontrés avant pilote.
- Aucune intégration ni permission OAuth active ; aucun secret client ; aucun compte, pratique, horaire, cible ou contenu de démonstration représentant une personne.
- Décisions avant pilote : framework, hébergement, méthode d’authentification, fournisseur IA/conditions, périmètre mono/SaaS et seuils de pilote. Un document de conception seul ne satisfait pas ces critères.

## 8. Traçabilité et statut de réalisation

| Livrable documentaire | Fichier |
|---|---|
| Vision fonctionnelle, exigences normatives, lots et critères | [`PERSONAL_AGENTIC_OS_SPEC.md`](PERSONAL_AGENTIC_OS_SPEC.md) |
| Architecture logique, modèle de données, contrats agent/Composio et MVP exact | Présent document |
| Backlog et preuves attendues du Lot 1 | [`LOT_1.md`](LOT_1.md) |
| Hypothèses techniques et décisions utilisateur ouvertes | [`DECISIONS.md`](DECISIONS.md) |
| Sources et limites de lecture | [`COVERAGE_MATRIX.md`](COVERAGE_MATRIX.md) |

À la date de cette version, cette arborescence et ce schéma sont des spécifications. Aucun code applicatif, migration Supabase, test applicatif, build, fournisseur, scope OAuth ou déploiement n’est déclaré implémenté ou validé.
