# Cahier des charges exécutable — Personal Agentic OS

> **Statut de périmètre mis à jour :** ce cahier conserve les exigences et lots PAOS comme documentation historique et source de garde-fous pour ALINEO. L’utilisateur a depuis confirmé un seul produit ALINEO, avec le hub connecté comme direction principale. Les six domaines PAOS et leur séquencement ne sont pas tous le périmètre courant de livraison ; leur traitement et l’écart explicite du Lot 1 sont établis dans [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md).

**Version :** 1.2
**Date :** 2026-11-23
**Statut :** baseline normative v1.2 pour préparer le Lot 1 et cadrer les lots suivants ; décisions personnelles/configurables et propositions techniques non confirmées consignées dans `DECISIONS.md`.
**Identité actuelle :** ALINEO est le nom du produit confirmé dans ce dépôt. « Personal Agentic OS » / PAOS désigne la baseline documentaire historique ; « LifeAI » est le nom du dépôt technique.
**Source de cadrage :** Google Doc existant « Personal Agentic OS — Cahier des charges technique v0.1 » (ID `1c1t0wCzUTC8s9wQ9FnN1uA7DA4Fxzouyn3GQsowCv_Q`). Le corps Drive n’est pas synchronisé intégralement avec cette v1.2 : le Markdown de ce dépôt est la référence actuelle ; aucune nouvelle copie Drive n’a été créée.
**Dépôt :** `joynagassi-cyber/LifeAI`, branche de travail `arena/c18245a0-lifeai`, issue de `75824786cc8d17e47b81fda1d01fd1e2b305520a`.

## 0. Gouvernance et limites de la version

Ce cahier rend testables les exigences PAOS actuellement recensées à partir du v0.1 et du brief fonctionnel transmis par l’utilisateur (six espaces et capacités attendues de l’agent). Il ne prétend pas remplacer ni résumer le fichier `MASTER_DOCUMENTATION_AGENT_[PROMPT.md]` : ce fichier n’a pas été trouvé dans le chemin local indiqué ni dans Google Drive lors des recherches. L’ordre précis éventuellement imposé par ce fichier reste donc à confirmer. Les sources accessibles et leur statut sont dans [`COVERAGE_MATRIX.md`](COVERAGE_MATRIX.md). Les propositions de framework, d’hébergement, de stockage de fichiers, de marge et de niveau d’autonomie ne sont pas considérées comme des décisions approuvées ; voir `DECISIONS.md`.

Le dépôt Git est la source de vérité du Markdown et du code. Le Google Doc existant reste un support de consultation dont le corps n’est pas entièrement synchronisé avec la v1.2 ; ne pas le considérer comme la présente version complète. Toute future synchronisation substantielle devra afficher la version et le chemin source. Les décisions ci-dessous sont séparées des hypothèses ; aucun horaire, objectif personnel, fournisseur ou seuil de réussite n’est inventé.

Les mots **DOIT**, **NE DOIT PAS** et **PEUT** expriment respectivement une exigence, une interdiction et une option. La version 1.2 est « exécutable » au sens où ses exigences, contrats, cas d’erreur, critères et portes de livraison peuvent être implémentés et testés. Elle n’implémente pas encore l’application.

## 1. Produit et résultat attendu

Le produit est une boucle personnelle d’exécution, pas un gestionnaire de tâches augmenté ni un chatbot greffé à un calendrier : **capturer → clarifier → choisir un résultat → planifier → se concentrer → constater → réajuster → apprendre**. Il protège les engagements fondamentaux, rend la charge visible et laisse l’utilisateur décider des arbitrages.

La première livraison doit prouver un flux web minimal de bout en bout avant d’ajouter les vues avancées, connecteurs, plateformes natives ou agents spécialisés. L’IA comprend, clarifie et propose ; un moteur déterministe valide le planning ; le serveur applique les permissions ; les écritures sensibles restent soumises à une confirmation humaine.

### Espaces fonctionnels cohérents

| Espace | Question à laquelle il répond | Rôle et séquencement |
|---|---|---|
| **Today** | Qu’est-ce qui compte aujourd’hui, quelle est la prochaine action et où en sont les engagements ? | Centre quotidien ; configuration minimale au Lot 1, recommandations justifiées et progression factuelle. |
| **Projects** | Quels résultats, jalons et tâches composent chaque projet ? | Une seule source de données, plusieurs vues ; portefeuille et vues étendues aux lots suivants. |
| **Calendar** | Quand se déroulent les tâches, événements, sessions et périodes protégées ? | Vues jour/semaine/mois/année ; calendrier interne d’abord, Google Calendar en lecture seule au début du Lot 3. |
| **Focus** | Comment se déroule une session de concentration ? | Pomodoro configurable, chronomètre ou durée libre ; notifications natives seulement sur plateformes qui les autorisent, après validation web. |
| **Life Core** | Quels engagements fondamentaux l’utilisateur veut-il protéger ? | Pratiques définies par l’utilisateur, configuration vide, aucune note narrative ou notation spirituelle en Lot 1. |
| **Habits** | Quelles habitudes ordinaires veut-il suivre ? | Espace distinct de Life Core, avec récurrences personnalisables et historique factuel. |

Ces espaces partagent les mêmes données, permissions et règles de provenance ; ils ne deviennent pas six bases ni six agents indépendants. Les horizons et paramètres personnels restent configurables.

## 2. Principes non négociables

1. **Life Core sous contrôle de l’utilisateur.** Prière, lecture biblique, jeûne et pratiques personnalisées sont des engagements protégés, pas des tâches à noter. Seul l’utilisateur définit leur contenu, horaire, fréquence, durée, exceptions et protection. Aucun horaire n’est prérempli. L’agent ne prescrit ni durée, ni fréquence, ni régime de jeûne et ne prétend pas interpréter une volonté divine.
2. **Confidentialité par défaut.** Les notes spirituelles/narratives ne sont pas nécessaires au Lot 1, ne sont pas envoyées au modèle et ne sont pas incluses dans les journaux. Leur stockage est désactivé jusqu’à décision explicite (voir `DECISIONS.md`). Les occurrences peuvent enregistrer un état factuel sans texte privé.
3. **Contrôle humain.** Toute écriture externe demande aperçu et confirmation. Toute suppression exige une confirmation renforcée. Par défaut réversible pour le Lot 1, toute écriture interne issue de l’agent ou l’application d’un plan exige aussi une action explicite de l’utilisateur. L’utilisateur peut annuler/suspendre une exécution ; l’interface expose les opérations observées, jamais une chaîne de pensée privée.
4. **Vérité observable.** Une activité d’agent n’est affichée que si un événement réel la justifie. Pas de texte de raisonnement fabriqué, de tâche déclarée terminée sans preuve utilisateur, ni de modification silencieuse du passé.
5. **Planification déterministe.** Le LLM ne place jamais directement des événements. Il produit une intention structurée ; le planner pur applique les contraintes, retourne les raisons et produit un diff.
6. **Réduction de charge.** Une fonction entre dans le MVP si elle réduit au moins les décisions répétitives, les engagements oubliés, le temps de planification, la fragmentation de l’information, l’erreur d’estimation ou la perte de concentration.
7. **Séparation produit.** Personal Agentic OS conserve dépôt, base, identités, secrets et déploiement séparés d’APIOS. Aucun domaine, jeu de données, compte de démonstration, branding ou code métier apicole ne doit être repris. Toute réutilisation de code ou d’assets exige une vérification de licence et une attribution.

## 3. Périmètre par lot

| Lot | Inclus | Exclusions explicites |
|---|---|---|
| 0 — Décisions et parcours | Parcours capture → plan → exécution → revue ; politiques de confidentialité/autonomie ; critères du pilote | Nom commercial, horaires ou objectifs supposés |
| 1 — Walking skeleton | Dépôt et CI ; Supabase Auth et migrations/RLS ; tâches simples ; configuration Life Core vide au départ ; Today minimal ; planner déterministe ; runtime agent minimal ; Agent Activity ; tests d’isolation | Fournisseur IA imposé, écriture externe, Calendar connecté, notes spirituelles narratives |
| 2 — Exécution mesurable | Objectifs/projets/jalons ; vues List/Board/Timeline/Eisenhower ; calendrier interne jour/semaine/mois/année ; Focus et sessions ; estimations P50/P80 avec confiance ; suivi planifié/réel et propositions de réajustement ; revues ; annulation des écritures internes ; habitudes basiques | Gantt éditable complet et vues annuelles avancées au-delà d’un résumé lisible |
| 3 — Calendar connecté | Composio par utilisateur (choix opérationnel à confirmer) ; Google Calendar en lecture seule au départ ; conflits/provenance ; proposition de création ou modification externe après aperçu et approbation ; webhooks et idempotence | Suppression automatique, création/modification sans approbation, scopes étendus non validés |
| 4 — Documents et autres connecteurs | Import local et Drive/Docs (PDF, Markdown, TXT, PNG/JPEG, XLSX/CSV, DOCX) ; extraction sandboxée, citations et indexation éventuelle contrôlée ; Gmail en lecture/recherche et brouillon après confirmation ; GitHub en lecture puis écritures contrôlées | Instructions trouvées dans les documents traitées comme ordres ; indexation ou partage automatique sans autorisation |
| 5 — Clients installés | PWA puis Android/Capacitor et Windows/Tauri après validation web ; mécanismes natifs de Focus/notification lorsqu’ils sont pris en charge ; tests app active, suspendue, verrouillée et terminée | Garantie de livraison exacte lorsque le système d’exploitation ou l’app est suspendu/terminé |

**MVP contractuel : Lot 1 uniquement.** Le périmètre exact inclus/exclu, les modules, le schéma Supabase cible et les contrats de l’agent/Composio sont précisés dans [`TECHNICAL_DESIGN.md`](TECHNICAL_DESIGN.md). Le brief récent n’autorise pas à tirer des fonctions prévues aux Lots 2–5 dans le MVP. Tout déplacement est un changement de périmètre à approuver explicitement.

Hors périmètre du premier MVP : UI générée librement, multi-agent autonome, envoi autonome d’emails/candidatures, lecture automatique du journal spirituel, mode hors ligne complet, synchronisation simultanée Gmail/Drive/GitHub, Android/Windows avant validation web, Gantt éditable complet.

## 4. Exigences fonctionnelles testables

### 4.1 Profil, données et objectifs

- **PAOS-DATA-01 — Source de vérité :** PostgreSQL/Supabase est la source de vérité. `localStorage` ne contient que l’état d’interface/cache non sensible, jamais l’unique copie des tâches, créneaux ou pratiques.
- **PAOS-AUTH-01 — Identité :** chaque requête protégée obtient `user_id` depuis la session Supabase côté serveur. Le client et le modèle ne peuvent pas choisir librement cet identifiant. Aucun utilisateur, rôle ou compte de démonstration n’est précréé.
- **PAOS-PROFILE-01 — Configuration :** le fuseau horaire doit être renseigné avant de produire un planning ; aucun fuseau/horaire personnel n’est présumé. Les dates sont stockées en UTC et présentées dans le fuseau du profil.
- **PAOS-GOAL-01 — Hiérarchie :** Vision → résultat annuel → objectif trimestriel → projet → jalon → tâche → bloc → session réelle. Un résultat a une preuve observable ; une tâche commence par un verbe et décrit un état vérifiable. Les limites suggérées (3 résultats/an, 3 objectifs/trimestre, 3 engagements/semaine, 1 action essentielle + 2 secondaires/jour) sont configurables, jamais des quotas forcés.
- **PAOS-TASK-01 — Capture :** la capture naturelle produit un brouillon d’engagement. Elle signale les champs manquants (résultat, échéance, preuve, priorité) et n’écrit rien tant que l’utilisateur ne confirme pas l’ajout à l’inbox.
- **PAOS-TASK-02 — Statuts :** `inbox`, `ready`, `planned`, `doing`, `blocked`, `done`, `cancelled`. Une tâche ne passe à `done` que sur action utilisateur ou preuve explicitement fournie ; l’agent ne l’infère pas.
- **PAOS-TASK-03 — Vues :** une source de données alimente la liste/inbox simple du Lot 1 ; les vues Board, Timeline, Eisenhower et Calendar arrivent aux Lots 2+ sans dupliquer les tâches. La matrice Eisenhower peut agréger les tâches de tous les projets et être filtrée par projet ; les quadrants Q1 (urgent/important), Q2 (important/non urgent), Q3 (urgent/non important) et Q4 (ni urgent ni important) sont calculés à partir de l’urgence (échéance/fenêtre/signal explicite) et de l’importance (résultat/impact/valeur), jamais stockés comme vérité indépendante. Elle aide à arbitrer et ne supprime/ne délègue rien automatiquement.

### 4.2 Today, calendrier, focus, Life Core et habitudes

- **PAOS-TODAY-01 — Ordre :** Today répond successivement : (1) engagements fondamentaux protégés ; (2) résultat utile du jour ; (3) prochaine action ; (4) rendez-vous/échéances fixes ; (5) arbitrages requis. Il montre aussi les sessions Focus et habitudes du jour lorsqu’elles existent, l’avancement des projets pertinent et les recommandations de l’agent avec leurs raisons. Composants Lot 1 : prochaine pratique configurée, une action essentielle, jusqu’à deux secondaires (disposition configurable, pas un quota), chronologie, tâches non planifiées, conflits, bouton de recalcul, progression factuelle et diff avant/après du plan.
- **PAOS-LC-01 — Configuration vide :** aucun calendrier Life Core n’est seedé. L’utilisateur définit chaque pratique, règle de récurrence, fuseau, durée réservée, niveau (`locked`, `ask`, `flexible`) et fenêtre de rattrapage facultative.
- **PAOS-LC-02 — Protection :** `locked` est une contrainte dure ; `ask` ne peut être déplacé qu’après confirmation explicite ; `flexible` peut apparaître dans une proposition de déplacement mais jamais être appliqué silencieusement. Une pratique protégée n’est jamais remplacée par une tâche professionnelle.
- **PAOS-LC-03 — Jeûne et notes :** le produit enregistre uniquement ce que l’utilisateur définit ; aucune recommandation de santé/durée/fréquence. Notes privées exclues de l’IA, de l’indexation et des métriques ; aucun champ de texte de journal dans le Lot 1.
- **PAOS-CAL-01 — Calendrier général :** le produit expose les vues jour, semaine, mois et année sur une source de données unique ; le calendrier interne précède le Lot 3. Il réunit tâches/blocs internes, périodes de projets, événements, récurrences d’habitudes, pratiques Life Core et sessions Focus, avec provenance. À partir du Lot 3, Google Calendar est en lecture seule au départ. Toute création ou modification externe fait d’abord l’objet d’un aperçu et d’une approbation explicite ; un événement externe ne devient jamais une tâche sans consentement.
- **PAOS-FOCUS-01 — Plus tard :** Pomodoro configurable, chronomètre classique ou durée libre ; lien à une tâche/projet ou « sans tâche/projet » ; pause/reprise/fin anticipée ; historique et prévu/réel ; fonds sonores facultatifs. Les clients installés utilisent, lorsque le système et les permissions le permettent, des alarmes/notifications natives plutôt qu’un timer JavaScript seul. Aucune livraison à l’heure exacte n’est garantie lorsque l’app est suspendue ou terminée ; limitations et résultats des tests sont visibles.
- **PAOS-HABIT-01 — Séparation :** habitudes ordinaires distinctes de Life Core, avec récurrence quotidienne, hebdomadaire ou personnalisée, fréquence/cible/unité, occurrences `done`/`partial`/`skipped`, commentaire optionnel et tendance de régularité. Les ruptures restent factuelles, sans pénalité ; la reprise est visible et valorisée.

### 4.3 Planner déterministe

- **PAOS-PLAN-01 — Entrées :** fuseau, plages de disponibilité, indisponibilités, Life Core, événements fixes disponibles, tâches/priorités/échéances/dépendances, durées explicitement saisies, préférences d’énergie/contexte et marge si définie. Le Lot 1 n’estime pas à la place de l’utilisateur : sans durée explicite, une tâche reste non planifiée (`estimate_required`).
- **PAOS-PLAN-02 — Contraintes dures :** aucun chevauchement ; respect des événements fixes ; aucun déplacement de Life Core `locked` ; dépendances satisfaites ; indisponibilités ; durée minimale ; date réellement impérative. Conflit impossible à résoudre = arbitrage visible, jamais suppression ou déplacement silencieux.
- **PAOS-PLAN-03 — Algorithme Lot 1 :** (1) valider fuseau et disponibilité ; (2) réserver les contraintes dures ; (3) exclure les tâches non prêtes, bloquées, terminées ou sans durée ; (4) trier de façon stable par importance décroissante (`NULL` en dernier), échéance croissante (`NULL` en dernier), `created_at` croissant, puis ID ; (5) placer chaque tâche dans le premier intervalle continu compatible à partir de `earliest_start` ; (6) ne pas fractionner une tâche en Lot 1 ; (7) inscrire le motif de toute tâche non placée ; (8) retourner une proposition et un diff, sans écriture. Cette règle lexicographique est un défaut technique réversible, sans poids opaque.
- **PAOS-PLAN-04 — Marge :** aucune marge personnelle n’est inventée. Si `buffer_minutes` n’est pas défini, utiliser 0 et afficher `NO_BUFFER_CONFIGURED` dans la proposition ; l’utilisateur peut le régler.
- **PAOS-PLAN-05 — Réajustement :** le passé est immuable ; seul le futur est recalculé. Les blocs protégés restent intacts. Chaque déplacement, tâche non placée et raison est visible. L’application exige une confirmation, un `plan_version`, une clé d’idempotence et une écriture conditionnelle sur la version.

### 4.4 Estimation

À partir du Lot 2, séparer (1) durée de travail estimée, (2) incertitude/marge de risque explicitement configurée ou proposée et approuvée, (3) apprentissage depuis les durées planifiées/réelles observables. Conserver P50/P80, confiance, catégorie/complexité, interruptions, résultat et changements de périmètre. Priorité : estimation utilisateur → médiane de tâches comparables → heuristique clairement basse confiance. Si aucune marge n’est définie, appliquer zéro et afficher `NO_BUFFER_CONFIGURED` ; l’agent ne choisit pas une marge personnelle. Utiliser P80 si l’échéance est risquée, réviser après sessions, ne jamais présenter une estimation comme promesse. Une tâche trop large déclenche une demande de décomposition. Tout exemple chiffré dans le brief utilisateur est illustratif, pas une durée personnelle par défaut.

### 4.5 Agent et activité

- **PAOS-AGENT-01 :** un orchestrateur avec compétences (capture/clarification, objectifs/projets, planification, estimation plus tard, focus, revue, connecteurs plus tard, documents plus tard). Aucun multi-agent avant preuve d’un besoin.
- **PAOS-AGENT-02 :** tools autorisés initialement : `capture_commitment` (brouillon), `clarify_commitment`, `create_task` (après confirmation), `propose_day_plan` (sans effet), `apply_plan` (confirmation obligatoire). Focus/revue/connecteurs selon lots suivants.
- **PAOS-AGENT-03 :** chaque tool a schéma serveur validé (Zod ou équivalent), `user_id` de session, résultat structuré, résumé public, identifiant d’audit et erreurs métier sûres. `idempotency_key` pour toute écriture, contrôle de version optimiste, audit avant/après redigé.
- **PAOS-ACTIVITY-01 :** Agent Activity affiche seulement demande comprise, données consultées, tool appelé/résultat, proposition, approbation, action réellement appliquée, erreur et annulation. États : `prepared`, `running`, `awaiting_approval`, `completed`, `failed`, `cancelled`. Aucun texte de pensée privée, faux événement ou durée simulée.
- **PAOS-AGENT-04 :** si le fournisseur IA est indisponible, tâches, Life Core et planner restent utilisables sans IA. Les contenus externes futurs (email/document/pièce jointe/sortie d’outil) sont non fiables et ne deviennent jamais des instructions exécutables.
- **PAOS-AGENT-05 — Suivi d’exécution :** l’agent peut comparer son planning aux statuts, sessions et preuves réellement enregistrés ; il signale retards/conflits et propose un réajustement. Il ne déduit jamais qu’une tâche est terminée, ne réécrit pas le passé et n’applique pas une nouvelle proposition sans l’approbation prévue. Les contrôles en arrière-plan/rappels utilisent uniquement des préférences de notification configurées.

### 4.6 Documents et sources — Lot 4

- **PAOS-DOC-01 — Import contrôlé :** formats candidats : PDF, Markdown, TXT, PNG/JPEG, XLSX/CSV, DOCX et Google Docs/Drive autorisés par l’utilisateur. Chaque import valide MIME/taille, quarantaine et provenance ; l’extraction s’exécute en sandbox. L’indexation est facultative et soumise aux permissions, à la rétention et à une décision de stockage ; les résultats utilisés par l’agent comportent des citations/source et un filtre d’accès. Le contenu importé demeure une donnée non fiable, jamais une instruction d’outil. Les données personnelles des fichiers ne sont pas envoyées au modèle en bloc par défaut. Supabase Storage est une option, pas un choix confirmé.

## 5. Contrat de données

Toutes les tables privées portent un propriétaire : `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`, sauf `profiles.id = auth.users.id`. Les horodatages sont UTC et les écritures concurrentes versionnées ; index sur propriétaire et colonnes de filtrage. RLS est activée avant toute exposition navigateur. Les contraintes composites et le dictionnaire cible sont dans [`TECHNICAL_DESIGN.md`](TECHNICAL_DESIGN.md).

**Lot 1 minimum :**
- `profiles(id, display_name, timezone, locale, week_starts_on, created_at, updated_at)` ; `id` correspond à `auth.users.id`.
- `user_settings(user_id, autonomy_policy, planning_preferences, notification_preferences, privacy_preferences, version)` ; valeurs absentes explicitement marquées, pas de planning caché.
- `tasks(id, user_id, title, description, status, importance, urgency_source, due_at, earliest_start, duration_minutes, energy, context, completed_at, version, created_at, updated_at)` ; `duration_minutes > 0` si planifiée.
- `task_dependencies(task_id, depends_on_task_id)` ; clé composée, références de même propriétaire, cycles refusés côté service.
- `life_practices(id, user_id, kind, title, protection_level, default_duration_minutes, rrule, timezone, recovery_window_minutes, ai_access DEFAULT false, active, timestamps)` ; aucune pratique seedée.
- `practice_occurrences(id, user_id, practice_id, scheduled_start, scheduled_end, state, timestamps)` ; pas de note libre en Lot 1.
- `time_blocks(id, user_id, task_id NULL, practice_id NULL, source, starts_at, ends_at, locked, status, plan_version_id NULL, version, timestamps)` ; `ends_at > starts_at`.
- `plan_versions(id, user_id, plan_date, input_hash, version, status, diff_json, created_at, applied_at NULL)` ; propositions immuables, application idempotente.
- `availability_rules` : fenêtres locales configurées par l’utilisateur, sans ligne seedée.
- `agent_runs`, `agent_steps`, `approvals`, `audit_events`, `idempotency_records` : toutes rattachées à `user_id` (sauf `profiles.id = auth.users.id`) ; audit append-only, contenu sensible redigé, clé d’idempotence unique par utilisateur.

Le dictionnaire des colonnes, contraintes composites, politiques RLS, migrations ultérieures et frontières des modules est défini dans [`TECHNICAL_DESIGN.md`](TECHNICAL_DESIGN.md). Ce schéma est une spécification ; aucune migration n’est encore appliquée.

**Après Lot 1 :** `goals`, `projects`, `milestones`, `focus_sessions`, `task_estimate_events`, `reviews`, `habits`/`habit_occurrences`, `connector_accounts`, `external_objects`, `documents`, `document_chunks`. Les jetons OAuth ne sont jamais stockés dans `connector_accounts`. Le stockage de notes privées reste bloqué à la décision de confidentialité.

## 6. Sécurité, confidentialité et exploitation

- **PAOS-SEC-01 :** RLS `SELECT/INSERT/UPDATE/DELETE` vérifie `auth.uid() = user_id`; aucune policy `anon`; tests SQL/API avec deux utilisateurs distincts couvrant lecture et écritures croisées.
- **PAOS-SEC-02 :** `service_role` et secrets IA/OAuth uniquement côté runtime serveur ; jamais de variable `VITE_*` secrète ni de secret dans le navigateur, logs ou docs.
- **PAOS-SEC-03 :** audit avant/après redigé, request ID de bout en bout, rétention configurable, export et suppression de compte prévus. Les métriques ne contiennent ni texte de prière, notes, emails ni documents.
- **PAOS-SEC-04 :** validation de schéma côté serveur, CSRF/CORS selon topologie, CSP stricte, rate limit, arrêt global des actions agentiques et révocation de connecteur.
- **PAOS-SEC-05 :** documents/emails/pièces jointes sont des données non fiables ; import futur = contrôle MIME/taille, quarantaine et stockage privé, extraction sandboxée, provenance/citations, filtres de permission, rétention et suppression cohérente. Formats candidats : PDF, Markdown/TXT, PNG/JPEG, XLSX/CSV, DOCX et Google Docs/Drive autorisés. Une instruction trouvée dans un document n’appelle aucun tool. Le fournisseur de stockage/indexation reste à choisir.
- **PAOS-OPS-01 :** déploiement web sur HTTPS, même origine frontend/runtime si possible pour limiter CORS et préserver le streaming ; fournisseur d’hébergement non choisi. Sauvegarde/restauration, procédure de retour arrière, alertes et budget IA sont exigés avant pilote.
- **PAOS-OPS-02 :** le web ne promet pas une alarme exacte lorsque l’onglet est suspendu ou fermé. Les clients Android/Windows utiliseront les API natives de notification/alarme quand elles sont disponibles et autorisées ; un timer JavaScript seul n’est pas l’unique mécanisme. La livraison reste soumise aux permissions et politiques système, sans garantie de précision lorsque l’app est terminée. Tests sur appareil réel : app active, arrière-plan, suspendue, verrouillée et terminée ; l’interface expose les limites constatées.

## 7. API et contrats

Toutes les routes sont authentifiées et valident les entrées côté serveur. Le serveur dérive le propriétaire de la session. Les écritures retournent `resource`, `audit_event_id`, `version` et `undo_until` si applicable. Erreur stable : `{ code, message_public, retryable, request_id }`, sans erreur brute fournisseur.

| Route | Fonction / règle |
|---|---|
| `POST /api/capture` | Texte/source → brouillon structuré et champs manquants ; aucune persistance sans confirmation |
| `GET /api/today?date=YYYY-MM-DD` | Engagements, tâches, blocs, conflits et non-planifiés du propriétaire courant |
| `POST /api/plans/propose` | Entrées/snapshot → `plan_version`, diff, motifs ; lecture seule |
| `POST /api/plans/:id/apply` | Appliquer seulement la version proposée après confirmation + `idempotency_key` + contrôle de version |
| `POST /api/plans/:id/cancel` | Annuler une exécution future ; le passé ne change pas |
| `GET /api/agent/runs/:id` | Retourner uniquement les événements observables et redigés du propriétaire |
| `POST /api/approvals/:id/decision` | `approved`/`rejected`, user courant, expiration et audit obligatoires |
| `POST /api/tasks` | Écriture interne confirmée ; schéma, version et idempotence obligatoires |

À partir des lots suivants : `/api/focus/*`, `/api/connectors/:provider/authorize`, `/api/webhooks/composio`; les routes Calendar externes restent soumises à approbation explicite. Le port interne, DTO normalisés, cycle d’approbation, scopes candidats, idempotence, webhooks vérifiés et erreurs Composio sont spécifiés dans [`TECHNICAL_DESIGN.md`](TECHNICAL_DESIGN.md) ; les noms d’outils/endpoints distants et la version Composio restent à confirmer avant le Lot 3.

## 8. Interface et accessibilité

Today est prioritaire, responsive et lisible sur mobile ; une même tâche n’a qu’une source de vérité. Une barre de saisie conversationnelle peut capturer une intention ; raccourcis outils/connecteurs/skills et import de fichiers arrivent selon les lots. Les propositions d’agent montrent avant/après et raisons ; les tâches non planifiées ne disparaissent pas. Les statuts Life Core restent factuels, sans score spirituel. Navigation clavier, labels, contraste et `prefers-reduced-motion` sont vérifiés. **Si A2UI est sélectionné** (adoption non confirmée), utiliser des schémas fixes pour les formulaires/vues prévisibles et des rendus dynamiques seulement si une situation le justifie, dans un catalogue autorisé ; aucune UI générée n’écrit directement. Un fallback texte existe. Les visuels liés dans le brief sont des références d’inspiration non auditées, pas des assets à importer. Identité visuelle à choisir ; ne pas reprendre l’orbe, palette ou identité APIOS.

## 9. Critères d’acceptation MVP

1. Un utilisateur ne peut lire, créer, modifier ou supprimer aucune ligne d’un autre utilisateur, y compris par Storage lorsqu’il sera ajouté.
2. En Lot 1, une intention naturelle peut devenir un brouillon clarifiable puis une tâche uniquement après confirmation ; objectifs, projets et jalons relèvent du Lot 2.
3. Le planner ne crée aucun chevauchement, ne viole aucune dépendance et ne déplace pas Life Core `locked`.
4. Une configuration Life Core vide est visible comme « à configurer » ; aucun horaire ou pratique fictif n’est créé.
5. Une tâche sans durée, une capacité insuffisante ou un conflit reste visible avec son motif d’arbitrage.
6. Le plan montre le diff avant application ; deux applications avec même clé d’idempotence ne dupliquent aucun bloc.
7. Une écriture externe n’est jamais exécutée sans aperçu et confirmation ; aucune écriture externe en Lot 1.
8. Focus, sessions réelles et estimation ne sont pas requis ni livrés en Lot 1 ; ils relèvent du Lot 2 et ne sont pas marqués « terminés » au MVP.
9. Agent Activity correspond à des événements réels, et aucune chaîne de pensée privée n’est exposée ou synthétisée.
10. Le texte privé Life Core n’est ni stocké en Lot 1, ni envoyé au modèle, ni inclus dans logs/métriques.
11. L’application reste utilisable pour tâches, Life Core et planning lorsque l’IA ou le réseau fournisseur échoue.
12. Fuseaux/horodatages passent des tests de date, changement d’heure et frontières de journée.
13. Chaque mutation a audit, version optimiste et politique d’annulation documentée.
14. CI exécute format/lint, typecheck, tests unitaires, tests d’intégration RLS et build ; les scénarios critiques passent sur navigateur réel avant pilote.

## 10. Mesure pilote de 30 jours

Mesurer sans seuil arbitraire : jours où l’action essentielle est définie ; actions essentielles terminées ; temps de planification autoévalué ; ratio planifié/réalisé ; erreur médiane P50/réel après Lot 2 ; plans acceptés sans modification ; conflits évités ; engagements oubliés ; actions externes bloquées/corrigées ; charge mentale avant/après. Évaluer Life Core qualitativement (temps protégé, obstacles, ajustements), jamais en score spirituel. Les seuils de réussite et l’objectif professionnel sur 12 mois attendent la validation du propriétaire.

## 11. Décisions et annexes opératoires

Décisions déjà cadrées par le v0.1 : produit séparé d’APIOS ; Supabase source de vérité ; un orchestrateur avant multi-agent ; planner déterministe indépendant du LLM ; Life Core protégé ; contrôle humain pour l’externe ; web avant Android/Windows ; React/Vite recommandé ; outils contrôlés. Si A2UI est retenu, il reste consultatif et contraint au catalogue autorisé ; son adoption n’est pas confirmée. Le brief utilisateur confirme l’orientation vers six espaces Today, Projects, Calendar, Focus, Life Core et Habits ainsi que le suivi des résultats. Next.js, hébergement, stockage de fichiers, autonomie préautorisée, politique d’alarmes et réglage des marges restent des propositions à confirmer dans `DECISIONS.md`.

Hypothèses temporaires et questions critiques : [`DECISIONS.md`](DECISIONS.md). Lot 1 détaillé, dépendances, tickets et portes d’acceptation : [`LOT_1.md`](LOT_1.md). Matrice de couverture et sources consultées : [`COVERAGE_MATRIX.md`](COVERAGE_MATRIX.md).

## 12. Références et traçabilité

Le v0.1 citait les guides Supabase/RLS, Composio/sessions, Capacitor notifications, Tauri notifications, le NIST AI RMF et les travaux sur les intentions d’implémentation. Ils sont conservés comme références de conception, pas comme preuve d’implémentation ni de conformité. Les preuves d’exécution n’existent pas encore : le dépôt au départ ne contient qu’un README. Toute future affirmation de test doit être liée à un résultat réellement exécuté.
