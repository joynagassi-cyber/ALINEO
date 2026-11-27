# ALINEO — périmètre produit et état de réalisation

**Mis à jour :** 2026-11-23<br>
**Statut :** source de vérité de cadrage pour l’application Alineo sous `apps/openfuse/`; `apps/alineo/` conserve l’ancienne interface construite à la main, rejetée et non réactivée.<br>
**Décision d’identité :** il s’agit d’un seul produit dans ce dépôt : **ALINEO**, avec une direction principale de hub agentique connecté. **Marque d’interface courante : Alineo.** Le nom upstream OpenFuse est conservé uniquement dans les références techniques et la provenance MIT, pas dans l’expérience produit. L’interface active adopte une palette graphite sombre, une sidebar compacte et un panneau de contenu flottant bordé. Le logo ruban Alineo généré (`apps/openfuse/apps/mobile/assets/alineo-flow-mark.png`) sert à l’accueil, à la navigation, à l’icône de l’application et au favicon. Les marques Gmail et Google Calendar de `thesvg` restent dédiées aux connecteurs, et la MicOrb demeure le repère de l’assistant. Le sélecteur de 18 dégradés et le shell artisanal restent dans l’ancienne application.

## 1. Autorité et réconciliation des documents

Ordre de priorité pour le travail ALINEO :

1. Les décisions explicites ci-dessus et celles consignées dans `DECISIONS.md`.
2. Cette note, qui fixe le périmètre ALINEO et explique les écarts avec les documents de lots PAOS.
3. `AGENT_HUB_DIRECTION.md`, source fonctionnelle du hub : chat, connecteurs nommés, progression, insights et activité véridique.
4. Les documents PAOS (`PERSONAL_AGENTIC_OS_SPEC.md`, `TECHNICAL_DESIGN.md`, `LOT_1.md`) comme exigences de sûreté et backlog de référence des domaines PAOS — **pas** comme une affirmation que les six modules PAOS sont tous le périmètre ou le calendrier ALINEO.
5. `ALINEO_DESIGN.md` et le crosswalk des playbooks comme références historiques/méthodologiques. Les playbooks UX/UI sont appliqués comme méthode et critères de qualité ; leur catalogue d’exemples ne devient pas un catalogue de fonctions ALINEO.

Les anciens documents qui disent que le hub est distinct d’ALINEO, que l’identité reste à confirmer, ou que le produit est une simple maquette reflètent un état documentaire antérieur. Ils ne décrivent plus la décision produit actuelle. Les anciens prototypes dans `prototype/` restent des artefacts historiques distincts de l’application réelle.

## 2. Tableau de réconciliation : espaces PAOS et hub ALINEO

| Domaine décrit dans PAOS | Traitement explicite dans ALINEO | Conséquence actuelle |
|---|---|---|
| **Today** | L’intention quotidienne est servie d’abord par le chat et des faits lus depuis des sources autorisées. ALINEO ne devient pas un second gestionnaire de tâches ni un planificateur local complet. | Aucune journée, tâche, priorité ou disponibilité n’est préremplie. Une vue native de planification n’est pas incluse dans la tranche courante. |
| **Projects** | Les projets restent dans leur outil d’origine. Une information pourra être résumée après connexion et autorisation d’une source qui la fournit. | Pas de base CRUD Projects ou de projets d’exemple dans ALINEO. |
| **Calendar** | Google Calendar est une cible de connexion nommée par l’utilisateur. Cela n’accorde pas les permissions et ne confirme pas les opérations. | Aucun compte/service n’est connecté. API, scopes et opérations doivent être vérifiés ; les écritures nécessiteront un aperçu et une confirmation explicite. |
| **Focus** | Le module Focus natif PAOS est différé ; il n’est pas dans la direction principale actuelle du hub. | Aucun minuteur, blocage d’application ou alarme n’est proposé ni promis. |
| **Life Core** | Aucune donnée Life Core n’est créée, suggérée ou synchronisée automatiquement. Si cette fonction est envisagée plus tard, sa configuration devra venir explicitement de l’utilisateur et ses notes privées ne seront pas envoyées au modèle. | Domaine absent de l’interface courante ; configuration reste vide. Aucun horaire, pratique, objectif ou valeur personnelle ne sera inventé. |
| **Habits** | Les habitudes et leurs occurrences ne sont pas reconstruites comme un tracker natif. Une éventuelle progression dépendra de faits réellement disponibles et autorisés depuis les services source. | Aucun streak, score, objectif ou occurrence n’est calculé à vide. |
| **Agent Activity** | Conservé comme exigence de transparence du hub. L’activité affichera des événements réels, des propositions, des approbations et des erreurs observés. | L’état vide indique qu’aucun agent/service n’est connecté. Aucune chaîne de pensée privée ni action simulée. |
| **Progression et insights** | Cette capacité du hub reprend l’intention de suivi PAOS tout en restant transversale aux données autorisées, avec source, période et définition explicables. | Valeurs vides jusqu’à ce qu’une vraie source fournisse des données suffisantes. Aucun graphique, score ou tendance d’exemple. |

Ce tableau ne déplace pas silencieusement les modules PAOS vers le produit ; il énonce ce que la direction hub conserve, reporte ou ne reconstruit pas.

## 3. Écart explicite avec le Lot 1 PAOS

Le Lot 1 PAOS (`LOT_1.md`) définit un MVP avec authentification, Supabase/RLS, tâches internes, Life Core vide, Today minimal et planner déterministe, et **exclut** les connecteurs externes. Le hub ALINEO, choisi ensuite comme direction principale du produit, met au contraire le chat agentique, les connecteurs vers outils existants et les insights au centre. Ces périmètres de MVP ne sont donc pas identiques.

La priorité hub est le changement de périmètre explicite pour ALINEO : le backlog PAOS n’est pas suivi comme séquence de livraison ALINEO à la lettre. L’application active sous `apps/openfuse/` provient du socle open-source MIT épinglé au commit `67580f16059d9c10111db00768e8a235d06cafdc`, mais l’identité du produit est désormais Alineo. Le nom amont reste consigné pour provenance seulement; l’application et ses textes n’emploient pas OpenFuse comme marque. Le mode `sample` utilise des données fictives explicites et le runtime SSE sans clé Intelligence; les Rich Threads distants y sont désactivés. Aucun modèle/provider, compte Google ni connecteur de données n’est sélectionné ou connecté. La télémétrie CopilotKit du runtime est distincte et activée par défaut, avec opt-out via `COPILOTKIT_TELEMETRY_DISABLED=true` ou `DO_NOT_TRACK=1`. Le mode live reste bloqué avant une décision et une implémentation d’identité serveur adaptée; le système n’est pas multi-tenant.

## 4. Garde-fous PAOS retenus pour ALINEO

Les exigences suivantes restent des contraintes de réalisation, même lorsque le module PAOS associé n’est pas construit :

- **Vérité des données :** ne présenter aucune connexion, lecture, écriture, progression, tendance, réponse de modèle ou réussite sans preuve observée. Séparer faits, calculs, propositions et inconnues.
- **Aucune donnée personnelle inventée :** Life Core reste vide ; ne pas fabriquer pratiques, horaires, objectifs, préférences, disponibilités, scores ou résultats.
- **Confidentialité :** ne pas envoyer de notes privées à l’IA ; ne pas collecter ou stocker du texte privé non requis ; secrets et jetons OAuth ne vont jamais dans le navigateur.
- **Contrôle utilisateur :** aucune écriture externe par défaut. Toute action future affiche précisément l’effet envisagé et exige une confirmation liée à cette action ; échec ou résultat incertain demeure explicite.
- **Activité publique seulement :** montrer les opérations réellement observées, sans exposer ni prétendre exposer une chaîne de pensée privée.
- **Sécurité serveur :** avant toute authentification, stockage ou connecteur réel, établir l’identité côté serveur, minimiser les scopes, isoler les données, valider les entrées/actions et tester permissions, échecs, révoquabilité et idempotence.
- **Accessibilité et qualité UX :** employer les playbooks pour structurer les parcours, les états vides/chargement/erreur/succès, l’accessibilité et la validation ; ne pas importer leurs exemples comme des fonctions demandées.

## 5. Portée fonctionnelle de la direction ALINEO

**Dans la direction produit :**

1. Chat agentique, quand un runtime et un fournisseur sûrs seront réellement choisis/configurés.
2. Connecteurs envisagés vers Gmail, des services Workspace explicitement sélectionnés, Google Calendar, TickTick et d’autres outils uniquement après vérification API, scopes, coûts/quotas, conditions d’offre et sécurité.
3. Progression issue de données réelles des services connectés, avec provenance et période.
4. Insights et graphiques seulement quand les données et définitions rendent le résultat justifiable.
5. Activité et approbations reflétant les événements réels.

**Décision de réalisation courante :** l’application Alineo reprend le socle mobile/web open-source sous licence MIT dont l’origine et les corrections sont documentées dans `docs/OPENFUSE_SECURITY_REVIEW.md`. La copie contient le client mobile/web, le serveur et les workers; la présence de connecteurs ou d’outils dans le code ne signifie pas qu’ils soient configurés ou actifs. Pour l’échantillon local, un runtime SSE à threads propriétaires remplace l’Intelligence distante si aucune clé CPK n’est fournie; les routes Rich Threads sont alors refusées et aucun modèle/provider n’est appelé. Le mode live exige toujours les clés serveur nécessaires, une authentification et une revue des permissions; aucune identité multi-tenant Alineo n’est fournie. L’ancienne réalisation React/Vite/A2UI reste dans `apps/alineo/` comme tranche technique antérieure et n’est pas réactivée. La MicOrb est conservée comme repère de l’assistant, distinct du logo de produit Alineo.

## 6. État de l’application réelle

Le code courant est l’application mobile/web Alineo sous `apps/openfuse/`, issue du commit amont `67580f16059d9c10111db00768e8a235d06cafdc` et adaptée avec le patch de dépendances revu dans `docs/patches/openfuse-security-fork.patch`. Son interface Expo/React Native fournit les surfaces Chat, Activity, Ideas, Goals et Apps. `apps/alineo/` conserve l’ancienne interface construite à la main et n’est pas le parcours à poursuivre. Le nom de son dossier source est une provenance technique, non une marque visible de l’application.

Le mode local `sample` lance un serveur Hono limité à `127.0.0.1`, un agent simulé local, un jeu de données explicitement fictives et le runtime CopilotKit SSE sans Intelligence distante. Il ne nécessite pas de clé de modèle ou CPK. Le SDK CopilotKit peut émettre sa télémétrie runtime par défaut, indépendamment des intégrations de données. Rich Threads distants, modèle, recherche web, terminal/ordinateur, navigateur worker et OAuth ne sont pas activés dans la prévisualisation. L’API web de prévisualisation passe par une URL relative et un proxy même origine; le navigateur n’appelle pas `localhost` directement.

**Vérifications antérieures à ce rebranding :** l’adoption initiale avait passé une installation `pnpm@11.19.0` depuis le lockfile gelé, les builds Expo Web/serveur, le typecheck et 16 tests ciblés; une prévisualisation sample répondait aux routes de base. Les validations amont mentionnées dans la revue de sécurité sont historiques et ne sont pas des preuves pour les changements actuels.

**Vérifications du rebranding Alineo (23 novembre 2026) :** lint Biome (190 fichiers), typecheck serveur/mobile, build serveur et export Expo Web réussis; l’export intègre le wordmark transparent Alineo et le favicon produit. Les tests ciblés réalisés avant les seuls changements visuels ont passé : API/auth/config/télémétrie 44/44, choix Jev domaine/mobile 25/25 et flux serveur de choix 1/1. Après le changement du libellé du PDF fictif, la suite PDF ciblée a passé 8/8; les tests du routage API web même origine ont passé 2/2. Après correction de « Failed to fetch », les appels web utilisent `/api` relatif; les proxys Expo Metro et Arena Vite ont chacun répondu `200` à `/api/health`. Le smoke Vite renvoie aussi `200` pour l’app (titre Alineo), le favicon, la création de session et `/api/agent` (`mode: sample`, identité Alineo, navigateur non configuré); le bundle inclut le logo et ne montre plus le lien localhost sur l’écran d’accueil. Les seuls marqueurs de marque historiques du bundle sont `[OpenFuse choice]` et `[OpenMuse choice]`, lus pour compatibilité; le préfixe émis est `[Alineo choice]`. L’exécution groupée incluant toute la suite `conversation-jev.test.ts` avait été interrompue par `SIGKILL` sous pression mémoire; le cas concerné a réussi lorsqu’il a été lancé isolément. Aucun navigateur système n’était disponible pour une inspection visuelle automatisée; l’aperçu web reste ouvert dans Arena. Ces contrôles ne constituent ni une certification, ni une preuve de sûreté pour une exposition Internet ou multi-tenant.

**Non implémentés / non revendiqués :** choix et configuration d’un fournisseur/modèle, identité réelle Alineo multi-utilisateur, comptes, isolation multi-tenant, configuration OAuth Google, connecteurs externes actifs, intégrations de navigateur/ordinateur et déploiement. Le mode live hérité est protégé par une clé partagée à propriétaire unique dans l’alpha; il ne doit pas être présenté comme une authentification de production.

Voir `apps/openfuse/README.md` pour le démarrage local et `docs/OPENFUSE_SECURITY_REVIEW.md` pour les limites de sécurité.
