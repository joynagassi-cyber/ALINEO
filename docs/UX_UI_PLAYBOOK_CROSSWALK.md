# Cahier de fonctionnalités et réponses au UX/UI Playbook

**Version :** 0.1<br>
**Date :** 2026-11-23<br>
**Statut :** spécification de conception / traçabilité documentaire ; ce fichier ne décrit pas une application implémentée.<br>
**Sources produit :** [direction hub ALINEO](AGENT_HUB_DIRECTION.md), [réconciliation et état réel](ALINEO_IMPLEMENTATION.md), ainsi que les documents PAOS historiques utilisés pour leurs contraintes de sécurité et exigences reportées.<br>
**Sources UX/UI :** *UX/UI Playbook — édition 2026* (182 pages) et *UX/UI Playbook — Kit bonus* (26 pages), fournis avec la demande.

## 1. Portée, sources et limites

Ce cahier répond aux questionnaires, gabarits de cadrage et critères de vérification identifiables dans les deux PDF, puis les relie au produit décrit dans le dépôt. Il sert à distinguer :

1. **fonctionnalités produit** à réaliser et leur lot PAOS de référence ;
2. **méthodes de conception/recherche** à appliquer, mais qui ne sont pas des écrans ou fonctions de l’application ;
3. **règles UX/UI et critères d’acceptation** à vérifier sur les écrans ;
4. **exemples, exercices ou sujets hors périmètre** qui ne deviennent pas des exigences produit.

### 1.1 Identité et périmètre actuels

L’utilisateur a confirmé qu’**ALINEO est l’unique produit de ce dépôt** et que le hub agentique connecté est sa direction principale. Il demande maintenant de remplacer la marque OpenFuse par Alineo dans l’application mobile/web sous `apps/openfuse/`. Ce chemin technique est conservé pour la provenance ; l’ancienne interface artisanale sous `apps/alineo/` reste rejetée et n’est pas réactivée. La direction visuelle la plus récente est un shell graphite avec sidebar compacte, contenu flottant bordé et logo ruban fluide ; les logos de service `thesvg` restent dédiés aux connecteurs. Le périmètre est décrit dans [`AGENT_HUB_DIRECTION.md`](AGENT_HUB_DIRECTION.md) et [`ALINEO_IMPLEMENTATION.md`](ALINEO_IMPLEMENTATION.md).

> Les 22 fonctionnalités/lots PAOS ci-dessous restent un inventaire de la baseline historique, pas le backlog courant de l’application. Leur report ou leur conservation comme garde-fou est explicite dans le crosswalk produit. Les playbooks sont des méthodes de conception, de recherche et de qualité — pas un catalogue de fonctionnalités à implémenter.

### 1.2 Règles d’interprétation

- Le séquencement décrit ici reste celui de la baseline PAOS historique, pas le plan de livraison actuel d’ALINEO. La direction hub d’ALINEO place le chat, les connecteurs, la progression et les insights au centre ; le changement par rapport au Lot 1 PAOS est documenté dans `ALINEO_IMPLEMENTATION.md`. Le tableau PAOS ne doit pas servir de todo implicite.
- Le livre est une **référence de méthode et de qualité**, pas une nouvelle source de fonctionnalités. Une règle de conception peut devenir un critère d’acceptation ; un exemple de landing page, de paiement ou de dashboard commercial ne devient pas un écran d’ALINEO.
- Les propositions déjà écrites dans `ALINEO_DESIGN.md` restent des propositions de designer tant qu’elles ne sont pas validées. Les options techniques des documents PAOS ne deviennent pas des choix par répétition.
- En cas de conflit avec les contraintes explicites du produit, aucun horaire, durée, pratique, disponibilité, cible, priorité, préférence ou score personnel n’est prérempli. Une valeur personnelle inconnue reste vide/à confirmer. L’agent ne reçoit pas de notes narratives privées et n’expose aucune chaîne de pensée privée.
- Les réponses ci-dessous s’appuient sur les documents disponibles. Aucune recherche utilisateur, entretien, test de compréhension, mesure de succès ou validation juridique n’est revendiqué comme ayant eu lieu.

### 1.3 Échelle de statut utilisée

| Statut | Signification |
|---|---|
| **Baseline PAOS — à réaliser** | Fonction ou contrainte présente dans la spécification PAOS ; elle n’est pas pour autant implémentée. |
| **Proposition ALINEO** | Direction d’interface proposée dans le document de design, à valider. |
| **À confirmer** | La réponse n’existe pas dans les sources ou nécessite une décision de la personne responsable. |
| **À tester** | Le critère est défini, mais aucune preuve de test suffisante n’est disponible. |
| **Non applicable au périmètre actuel** | Le cas d’usage n’existe pas dans le produit ou dans le lot concerné ; à rouvrir si le périmètre change. |

## 2. Résultat produit visé et parcours de référence

### 2.1 Résultat visé — formulation de travail, non mesurée

Le modèle produit PAOS est une boucle personnelle d’exécution : **capturer → clarifier → choisir → planifier → agir → constater → réajuster**. L’outil aide à choisir une prochaine action et à voir ce qui est connu, proposé ou réellement appliqué ; il ne décide pas des priorités de vie à la place de la personne.

Pour le Lot 1, le premier parcours fonctionnel de référence est :

```text
Saisir une intention
→ examiner un brouillon non enregistré
→ répondre seulement aux clarifications réellement nécessaires
→ confirmer la création d’une tâche
→ configurer explicitement fuseau et disponibilités si un plan est demandé
→ obtenir une proposition déterministe avec raisons et diff
→ approuver ou refuser l’application
→ voir les faits enregistrés et les arbitrages
→ recalculer uniquement le futur, après nouvelle confirmation
```

La formulation exacte du bénéfice, son utilisateur cible et son résultat mesurable ne sont pas validés par une étude utilisateur.

### 2.2 Inventaire des fonctionnalités à réaliser, par lots

Toutes les lignes ci-dessous sont des **exigences/documentations de travail**, pas des preuves de livraison. Les critères détaillés complètent les identifiants PAOS existants ; ils ne modifient pas les contrats normatifs du cahier de référence.

| ID de travail | Fonctionnalité et comportement attendu | Lot | Critères d’acceptation / limites |
|---|---|---:|---|
| **F-01** | **Shell web, authentification et propriétaire** : ouvrir un espace personnel authentifié, établir le propriétaire côté serveur, isoler toutes les données par session. | 1 | Sans session, les routes privées sont refusées. Le client et le modèle ne choisissent pas `user_id`. Les tests à deux utilisateurs couvrent lectures et écritures croisées. Le mode de connexion reste à choisir ; aucun compte de démonstration n’est seedé. |
| **F-02** | **Profil et paramètres nécessaires à la planification** : fuseau, locale éventuelle, plages de disponibilité, paramètres de planification et préférences explicitement choisies. | 1 | Valeurs absentes indiquées comme non configurées ; aucun fuseau, horaire, semaine de travail ou disponibilité devinés. Aucun plan n’est généré sans fuseau et disponibilité valides. Les réglages ne doivent pas bloquer la capture d’une intention. |
| **F-03** | **Capture et inbox de tâches** : texte saisi par la personne → brouillon structuré → champs manquants visibles (selon le besoin : résultat, échéance, preuve, priorité, durée) → confirmation séparée avant persistance → édition manuelle et liste/inbox. | 1 | Aucun brouillon n’est enregistré comme tâche sans confirmation. Les champs facultatifs restent vides. La clarification ne convertit pas une supposition en fait. Une panne IA ne bloque pas la saisie manuelle. Pas de projets, d’objectifs ou de jalons complets au Lot 1. |
| **F-04** | **Cycle de vie d’une tâche** : statuts `inbox`, `ready`, `planned`, `doing`, `blocked`, `done`, `cancelled`, informations nécessaires au planner et dépendances simples. | 1 | Chaque transition est validée. `done` n’est défini que par une action/preuve de l’utilisateur, jamais par une inférence de l’agent. Une tâche non prête ou bloquée reste visible avec sa raison. Les vues avancées restent au Lot 2. |
| **F-05** | **Today minimal** : engagements protégés configurés, résultat/action du jour, prochaine action, blocs internes, tâches non planifiées, conflits, recalcul et progression factuelle. | 1 | Ordre de lecture de référence : engagements configurés → action utile → prochaine action → contraintes fixes → arbitrages. La disposition « une essentielle + jusqu’à deux secondaires » est facultative/configurable, pas un quota. Pas de KPI décoratif ni de progression fictive. État vide utile, sans tâche ni événement d’exemple. |
| **F-06** | **Life Core configuré par l’utilisateur** : ajouter, modifier, désactiver des pratiques, leurs récurrences, fuseau, durée réservée si choisie, niveau `locked`/`ask`/`flexible` et fenêtre de rattrapage facultative. | 1 (configuration vide) | Aucune pratique ou occurrence seedée. `locked` est une contrainte dure ; `ask` exige confirmation pour être déplacé ; `flexible` ne peut être déplacé silencieusement. Aucune prescription de jeûne, durée, fréquence, pratique ou santé ; aucun score spirituel ni journal narratif au Lot 1. |
| **F-07** | **Planner déterministe et explicable** : utiliser fuseau, disponibilités/indisponibilités, pratiques protégées, événements fixes disponibles, tâches, priorités/échéances/dépendances, durée explicitement saisie, `earliest_start`, contexte/énergie et marge si configurée ; renvoyer proposition, diff et motif pour chaque tâche non placée. | 1 | Même entrée/version → même sortie. Réserver les contraintes dures, exclure les tâches non prêtes/bloquées/terminées/sans durée, trier de façon stable (importance décroissante, échéance croissante, `created_at`, ID ; valeurs nulles en dernier) puis placer dans le premier intervalle continu compatible à partir de `earliest_start`. Aucun chevauchement, dépendance violée, déplacement de bloc `locked`, changement du passé ou fractionnement au Lot 1. Motifs visibles, dont `estimate_required`, `capacity`, `dependency` et `conflict`. Marge non configurée = 0 avec `NO_BUFFER_CONFIGURED`, sans la présenter comme un réglage personnel approprié. Proposition sans mutation. |
| **F-08** | **Approbation, application et annulation interne** : comparer l’avant/après, confirmer ou refuser, appliquer une version précise avec idempotence et audit ; annuler seulement les effets futurs permis. | 1 | L’application n’a lieu qu’après action explicite de l’utilisateur. Clé d’idempotence répétée = aucun doublon ; version périmée = conflit explicable sans écrasement. Le passé est immuable. Les suppressions, si/une fois ajoutées, requièrent une confirmation renforcée. |
| **F-09** | **Agent minimal et clarification** : un orchestrateur unique, intégré au parcours (pas un chatbot plein écran), peut reformuler une capture, demander les données manquantes et proposer un plan via des outils autorisés. | 1 | Outils validés côté serveur et restreints au propriétaire courant. `propose_day_plan` est en lecture seule ; `create_task` et `apply_plan` nécessitent confirmation. Maximum de trois questions utiles par clarification ; aucune valeur personnelle préremplie pour raccourcir l’échange. Sans fournisseur sélectionné, le flux manuel reste fonctionnel. |
| **F-10** | **Activité de l’agent** : chronologie de la demande, données effectivement consultées, appels d’outils, proposition, approbation, changements réalisés, erreurs et annulation. | 1 | Chaque ligne correspond à un événement réel ; états possibles `prepared`, `running`, `awaiting_approval`, `completed`, `failed`, `cancelled`. Bouton d’arrêt quand l’exécution est arrêtable. Résumé public et portée visibles ; aucune chaîne de pensée, durée simulée ou réussite non vérifiée. En fin de résultat, distinguer « vérifié / estimé / non fait ». |
| **F-11** | **Sécurité, audit et confidentialité** : RLS, validation serveur, propriétaire dérivé de la session, audit expurgé avec request ID, idempotence, versions, procédures d’export/suppression de compte documentées. | 1 | Secrets serveur uniquement ; aucune donnée privée sensible dans `localStorage`, logs, métriques ou requête modèle. Pas de note narrative Life Core au Lot 1. Prévoir et démontrer les flux d’export/suppression de compte avant le pilote selon la décision de confidentialité. Tests RLS à deux utilisateurs, sauvegarde/restauration, rollback et E2E sont des preuves de sortie à produire, pas des résultats acquis. |
| **F-12** | **Objectifs, projets, jalons et portefeuille** : relier vision/résultat annuel → objectif trimestriel → projet → jalon → tâche → bloc/session réelle, avec preuve observable du résultat. | 2 | Aucun objectif/projet d’exemple prérempli. Limites quantitatives éventuelles configurables, jamais des quotas forcés. Les tâches sans projet restent possibles. Dépendances et filtres ne dupliquent pas les données. |
| **F-13** | **Vues d’exécution étendues** : vues Liste, Board, Timeline et Eisenhower global/filtrable par projet. | 2 | L’urgence est calculée depuis échéance/fenêtre/signal explicite et l’importance depuis résultat/impact/valeur ; les quadrants sont des vues calculées, pas une vérité indépendante stockée. Ils aident à arbitrer, sans supprimer ni déléguer automatiquement. Gantt éditable complet non inclus dans la base actuelle. Priorité/statut restent lisibles en texte, pas par couleur seule. |
| **F-14** | **Calendrier interne** : vues jour, semaine, mois et année ; blocs/tâches internes et, à mesure que les lots le permettent, projets, pratiques, habitudes et sessions avec provenance. | 2 | Source de données unique ; aucune entrée fictive ; dates interprétées dans le fuseau choisi. Conflit et état vide distincts des données de calendrier externe. Les quatre vues déjà dans le prototype sont des vues locales vides, pas un calendrier connecté. |
| **F-15** | **Focus et sessions** : mode choisi par l’utilisateur (Pomodoro configurable, chronomètre ou durée libre), tâche/projet facultatif, démarrer/pause/reprise/fin anticipée, historique factuel, sons facultatifs. | 2 (mécanismes natifs au 5) | Aucune durée ou session présélectionnée. Temps planifié et réellement observé restent distincts. Aucun timer Web n’est présenté comme alarme garantie quand l’app est suspendue/fermée. |
| **F-16** | **Estimations, apprentissage et revues** : distinguer estimation de travail, incertitude/marge approuvée et durée réelle ; confiance P50/P80 et révisions après observations ; revues à la demande de la personne. | 2 | Pas d’estimation automatique au Lot 1. Pas de marge personnelle inventée. Les heuristiques affichent leur source/confiance et ne sont pas des promesses. Cadence de revue, seuils de pilote et modalités d’apprentissage restent à choisir. |
| **F-17** | **Habitudes ordinaires** : récurrence quotidienne, hebdomadaire ou personnalisée ; fréquence/cible/unité si définies ; occurrences `done`/`partial`/`skipped`, commentaire facultatif, tendance factuelle. | 2 | Domaine distinct de Life Core ; aucune habitude, cible ou fréquence seedée. Une rupture est factuelle, non punitive ; pas de score de valeur personnelle. |
| **F-18** | **Suivi d’exécution et ajustement** : comparer propositions/plans aux statuts, sessions et preuves effectivement enregistrés ; signaler retards/conflits et proposer un réajustement du futur. | Après Lot 1 ; lot précis à confirmer (dépend de capacités du Lot 2+) | L’agent ne déduit jamais qu’une tâche est terminée, ne réécrit pas le passé et ne réapplique pas de proposition sans approbation requise. Rappels et surveillance en arrière-plan n’utilisent que des préférences configurées. Cette ligne formalise `PAOS-AGENT-05` sans la tirer implicitement dans le MVP. |
| **F-19** | **Calendrier connecté** : connexion par utilisateur, provenance, conflits, lecture Google Calendar seule au début ; proposition de création/modification externe après aperçu et approbation précise. | 3 | Aucun OAuth au Lot 1. Composio est une piste, pas un choix confirmé. Aucun événement externe ne devient tâche sans consentement ; aucune écriture/suppression automatique. Scopes, fournisseur, webhooks et idempotence externe à décider avant activation. |
| **F-20** | **Documents et sources** : import local et sources Drive/Docs autorisées ; formats candidats PDF, Markdown/TXT, PNG/JPEG, XLSX/CSV, DOCX ; extraction sandboxée, provenance, citations et indexation éventuelle contrôlée. | 4 | Validation MIME/taille, quarantaine, accès filtré, rétention/suppression à définir. Contenu documentaire = donnée non fiable, jamais une instruction d’outil. Pas de bucket, index ou envoi global de données réelles avant décision de stockage/consentement. |
| **F-21** | **Autres connecteurs contrôlés** : Gmail lecture/recherche puis brouillon après confirmation ; GitHub lecture puis écritures contrôlées, selon autorisations. | 4 | Aucun connecteur activé au Lot 1. Aucune action externe sans aperçu et confirmation liée à l’action. Aucun secret OAuth côté client ; scopes et fournisseurs à confirmer. |
| **F-22** | **Clients installés** : PWA puis Android/Capacitor et Windows/Tauri seulement après validation web ; notifications/alarme natives de Focus lorsque la plateforme les supporte et les permissions l’autorisent. | 5 | Aucun client natif dans le MVP. Respect des conventions/accessibilité propres à la plateforme ; test sur appareils réels requis. L’app n’annonce jamais une livraison exacte lorsque le système suspend ou termine le processus. |

### 2.3 Fonctions explicitement absentes du MVP

Au Lot 1, ne pas développer ni laisser croire qu’existent : projets/objectifs complets, calendrier interne avancé, vues Board/Timeline/Eisenhower, Focus, habitudes, estimations apprises, calendrier Google, Gmail/Drive/GitHub, import de documents, clients Android/Windows, multi-agent, exécution interne autonome préautorisée, action externe autonome, facturation/abonnement, landing page marketing ou dashboard commercial. La recherche globale évoquée dans la proposition ALINEO n’est pas une exigence PAOS ; la différer jusqu’à ce que le volume d’objets et une recherche utilisateur la justifient. Dans le périmètre strict de ce Lot 1 PAOS, CopilotKit, AG-UI, A2UI, fournisseurs IA et outils de streaming restent des options. L’application Alineo utilise un socle mobile/web dont la provenance technique est documentée séparément ; cela ne transfère pas automatiquement tous ses connecteurs ou fonctions dans le Lot 1 PAOS. Tout déplacement de périmètre doit être documenté.

## 3. Les six patterns d’interface agentique appliqués au produit

Référence : *Playbook*, p. 109. Le livre décrit des patterns de confiance, pas six features isolées à ajouter à un menu.

| Pattern | Application spécifiée | Limite/décision |
|---|---|---|
| **Clarification avant action** | Signaler les champs réellement manquants ; poser au plus trois questions utiles ; montrer les inconnues ; conserver la saisie. | Le livre suggère aussi une valeur par défaut préremplie. Cette partie est **écartée** pour toute donnée personnelle : pas d’horaire, durée, pratique, disponibilité, cible ou préférence inventée. |
| **Plan éditable** | Montrer proposition, raisons et diff avant application ; permettre de corriger/refuser. | La proposition est non mutante ; l’approbation est explicite en Lot 1. |
| **Périmètre visible** | Indiquer les données/l’espace accessibles et ce que l’agent peut modifier ; rendre les autorisations révoquables. | Lot 1 : données internes du propriétaire uniquement ; pas de connecteur externe. |
| **Permissions graduées** | Lecture limitée au périmètre autorisé ; écriture séparée de la lecture ; action destructive avec confirmation renforcée. | Le modèle « lecture libre / demander une fois pour écrire » du livre n’est **pas** adopté par défaut. Le contrat PAOS exige la confirmation de chaque écriture agentique et de chaque application de plan au Lot 1 ; toute autonomie future est à décider, bornée et révocable. |
| **Journal d’étapes** | Une ligne par étape réellement observable avec état, résultat public et possibilité d’arrêt si pertinent. | Ni « l’IA réfléchit » seul, ni faux événements, ni chaîne de pensée privée. |
| **Vérifié / estimé / non fait** | Résultat final séparant faits vérifiés, estimation et actions non réalisées, y compris lorsqu’une rubrique est vide. | L’agent ne proclame pas « terminé » sans preuve. |

**Test de clarification du livre (p. 109) :** soumettre deux fois la même tâche volontairement ambiguë et vérifier que l’agent clarifie au lieu de produire deux résultats incompatibles ; six questions seraient excessives selon le playbook. Ce test n’a pas été exécuté. Pour ALINEO, l’acceptation reste « au plus trois questions utiles, aucune valeur personnelle inventée » ; les autres valeurs métier doivent être choisies ou laissées inconnues.

## 4. Réponses aux questions explicites du livre

Les réponses « inconnu / à confirmer » sont des réponses honnêtes à un questionnaire de cadrage. Elles ne doivent pas être remplacées par des personas, chiffres ou observations inventés.

### 4.1 Quatre questions qui définissent un écran — *Playbook*, p. 11

| Question | Réponse pour le produit | Statut |
|---|---|---|
| Qui l’ouvre, et dans quel état d’esprit ? | Hypothèse de travail : la personne qui gère ses propres engagements et veut voir une prochaine action sans perdre le contrôle de son planning. Profil, segment, contexte et état d’esprit réel non étudiés. | **À confirmer / recherche** |
| Que doit-elle réussir à faire, en une phrase avec un verbe ? | Dans le premier parcours : **capturer une intention et confirmer le brouillon de tâche** ; sur Today, choisir la prochaine action ou examiner une proposition en attente. | **Baseline PAOS ; priorité d’écran à valider** |
| Quel est le chemin le plus court vers ce verbe ? | Ouvrir la capture depuis Today → saisir en langage libre → revoir le brouillon et les inconnues → confirmer. La planification demande ensuite fuseau/disponibilités explicites et un accord distinct avant écriture. | **Parcours proposé, non testé** |
| Que se passe-t-il si ce chemin échoue (erreur, vide, lenteur) ? | Garder la saisie, nommer l’erreur/champ manquant, offrir une correction ou un nouvel essai ; ne rien enregistrer ni annoncer comme réussi. Montrer un état vide utile, un chargement réservé à une opération réelle et un parcours manuel si l’IA échoue. | **Exigence de conception ; à tester** |

**Test des 5 secondes (même page) :** phrase de compréhension proposée : « Capturer une intention, voir la prochaine action et examiner un plan avant qu’il soit appliqué. » Cette phrase décrit le concept de travail ; sa compréhension par le public n’a pas été mesurée. Nom et proposition de valeur définitifs restent ouverts.

### 4.2 Les 8 questions avant de dessiner — *Playbook*, p. 28

La page ajoute une question de cadrage à poser en premier ; elle est incluse ici en plus des huit numérotées.

| # | Question du livre | Réponse factuelle pour le produit | Statut |
|---:|---|---|---|
| **Avant les 8** | Qu’est-ce qui se passe aujourd’hui, sans ce projet ? | Le dépôt contient aujourd’hui une documentation de conception et un prototype statique non connecté. La manière dont la personne organise actuellement ses tâches, horaires ou engagements n’est pas décrite par les sources. | **Contexte produit partiel ; usage actuel inconnu** |
| 1 | Qui utilise, sur quel appareil et dans quel contexte ? | Le modèle PAOS vise une personne par session dans le Lot 1 et un parcours web. Appareil réel, lieu, heure, accès à une main, réseau et segment utilisateur ne sont pas validés. | **Hypothèse mono-propriétaire ; recherche à faire** |
| 2 | Quelle est l’unique action la plus importante de l’écran ? | Pour la première valeur du Lot 1 : capturer une intention. Si une proposition attend une décision, l’action principale de cet état devient l’examiner/approuver ou refuser ; ne pas afficher deux actions primaires concurrentes. | **Proposition d’architecture par état** |
| 3 | Que doit comprendre la personne en moins de 5 secondes ? | Elle peut saisir une intention ; le plan éventuel est une proposition explicable, pas une action déjà faite. | **Hypothèse de message ; compréhension non testée** |
| 4 | Quel est le chemin actuel et où bloque-t-il ? | Chemin produit spécifié à la section 2.1. Les étapes réelles, outils actuels et points de blocage des utilisateurs n’ont pas été observés. | **Flux conçu ; parcours réel inconnu** |
| 5 | Quelles données existent vraiment, et lesquelles seraient inventées ? | Aucune donnée personnelle de production n’est fournie. Le modèle attendra, selon le cas, tâches saisies, durée saisie, échéance, dépendances, fuseau, disponibilité, blocs et pratiques configurées par la personne. Aucun exemple du livre ou horaire personnel n’est à seedé. | **Schéma cible documenté ; enregistrements réels absents** |
| 6 | Quels sont les cas limites : vide, très long, très nombreux, erreur, hors ligne ? | À couvrir : profil/ disponibilité non configurés, Life Core vide, tâche sans durée, durée trop longue, capacité nulle, dépendance bloquée, journée vide, titre/texte long, erreur réseau/fournisseur, état d’approbation expiré, version périmée, décalage horaire/DST. Le mode hors ligne complet est exclu du MVP. | **Cas de test proposés ; non exécutés dans l’app** |
| 7 | Quelles contraintes techniques : framework, performance, i18n, accessibilité ? | Web d’abord ; Supabase/PostgreSQL et RLS sont la base de spécification ; React/Vite recommandé, Next.js option non choisie ; runtime/hosting/LLM/auth-method restent à confirmer. Les critères de qualité de ce cahier sont visés mais ne prouvent pas la conformité. | **Certaines contraintes posées ; choix ouverts** |
| 8 | Comment saura-t-on que c’est réussi (métrique, test, retour) ? | Aucun seuil ni baseline chiffré n’est validé. La spécification liste des indicateurs descriptifs possibles pour un pilote de 30 jours ; tests d’usage et seuils à convenir avant pilote. Les critères MVP vérifiables figurent dans le cahier PAOS et `LOT_1.md`. | **Mesures candidates ; cible inconnue** |

### 4.3 Grille de brief express — *Playbook*, p. 67

| Élément demandé | Réponse pour le produit |
|---|---|
| Objectif business / résultat | Réduire des décisions répétitives, engagements oubliés, temps de planification, fragmentation, erreur d’estimation et perte de concentration est l’intention de PAOS. Aucun objectif business chiffré, chiffre de revenu ou seuil de succès n’est fourni. |
| Audience | Hypothèse mono-utilisateur personnelle pour le Lot 1 ; segment réel et trois profils concrets inconnus. |
| Action clé | Capturer et confirmer une intention dans le parcours initial ; examiner une proposition avant son application. À valider par recherche. |
| Contraintes | Lot 1 web seulement ; isolation et confidentialité fortes ; données personnelles non préremplies. Stack, auth, hébergement, modèle IA et dates non finalisés. Voir `DECISIONS.md`. |
| Décideur / validation | L’utilisateur de cette demande est l’interlocuteur de cadrage connu ; les rôles officiels de validation, éventuels autres décideurs et délais ne sont pas documentés. Pas de comité supposé. |
| Succès à 30 jours | Aucun seuil choisi. Le cahier PAOS propose de mesurer descriptivement action essentielle définie/réalisée, temps de planification autoévalué, ratio planifié/réalisé, propositions acceptées sans modification, conflits et charge mentale ; ne pas fabriquer de baseline ni de résultat. |

Les trois sources rapides suggérées p. 67 (entretiens, audit comparatif de concurrents, revue d’analytics/tickets/avis) n’ont pas été utilisées pour produire des observations dans ce cahier. Aucun audit concurrentiel, entretien, examen de tickets ou analyse d’analytics n’est revendiqué. Les durées d’entretiens, tailles d’échantillon et promesses de gain indiquées dans le livre sont des méthodes/exemples, pas un engagement de recherche ou de performance du produit.

### 4.4 Les 20 questions de recherche utilisateur — *Playbook*, p. 95

**État de recherche : aucun entretien utilisateur du produit n’est attesté.** Les réponses factuelles, lorsqu’elles manquent, sont marquées comme telles. La liste ci-dessous n’autorise pas à enregistrer des notes narratives privées dans l’IA.

| # | Question de recherche | Réponse/état pour le produit |
|---:|---|---|
| 1 | Quel dernier problème la personne a-t-elle eu avec ce type d’outil ? | **Inconnu** — aucun récit d’utilisateur collecté. |
| 2 | Qu’est-ce qui l’a fait chercher une solution ce jour-là ? | **Inconnu** — déclencheur réel à demander en entretien. |
| 3 | Qu’utilise-t-elle aujourd’hui à la place ? | **Inconnu** — outils et contournements actuels non fournis. |
| 4 | Qui décide, qui paie ? | **À confirmer** — l’hypothèse du Lot 1 est un propriétaire individuel ; décideur d’achat et modèle payant non établis. |
| 5 | Quel appareil, lieu et moment ? | **Inconnu** — web-first est une décision de séquencement, pas une observation de contexte utilisateur. |
| 6 | Montrez-moi comment la personne a fait la dernière fois. | **Aucune observation** — prévoir une tâche réelle choisie après recrutement ; ne pas inventer de scénario représentatif. |
| 7 | Quelle information manquait pour décider ? | **Usage inconnu.** Le planner aura besoin de données explicites telles que durée, échéance, disponibilité et contraintes ; cela ne prouve pas lesquelles manquent aux personnes dans leur vie réelle. |
| 8 | Qu’est-ce qui a pris le plus de temps ? | **Inconnu** — planification et dispersion sont des problèmes visés par PAOS, pas des durées mesurées. |
| 9 | Où la personne a-t-elle hésité, et pourquoi ? | **Inconnu** — aucun test modéré de prototype réalisé. |
| 10 | Qu’est-ce qui aurait provoqué l’abandon ? | **Inconnu** — la confidentialité, les données manquantes, la complexité et la confiance sont des risques à tester, pas des constats d’abandon. |
| 11 | Comment la personne nomme-t-elle l’objet dans son métier ? | Les documents emploient « intention », « tâche », « projet », « bloc », « pratique », « Life Core ». **Vocabulaire de conception, non validé auprès des utilisateurs.** |
| 12 | Quel mot lui ferait dire « c’est pour moi » ? | **Inconnu** — à demander sans suggérer de termes. |
| 13 | Quel mot la ferait fuir ? | **Inconnu** — à demander sans suggérer de termes. |
| 14 | Comment l’expliquerait-elle à un collègue en une phrase ? | Proposition d’équipe : « Un espace qui aide à choisir et suivre une prochaine action sans appliquer de plan à votre place. » **Ce n’est pas une citation utilisateur.** |
| 15 | Quel chiffre l’intéresse le plus ? | **Aucun chiffre choisi** — pas de KPI personnel ou professionnel validé. Les métriques candidates du cahier PAOS ne sont pas une préférence utilisateur. |
| 16 | À quoi ressemble un bon résultat ? | Produit : une action/proposition compréhensible, avec ses contraintes et son état réel. **Résultat personnel concret à définir par la personne ; aucun objectif n’est seedé.** |
| 17 | Qu’est-ce qui rassurerait avant de payer ? | **Non applicable au MVP :** aucun paiement ou modèle payant spécifié. La visibilité des permissions, de la provenance et des approbations est une exigence de confiance à tester, pas une réponse utilisateur. |
| 18 | Qu’a-t-elle déjà essayé qui ne marchait pas ? | **Inconnu** — aucun historique de solution antérieure fourni. |
| 19 | Que fera-t-elle juste après avoir terminé ? | Le produit peut enregistrer une action confirmée puis proposer un réajustement futur ; ce que la personne fait ensuite dans sa vie réelle est **inconnu**. |
| 20 | À qui en parlera-t-elle et comment ? | **Inconnu / hors Lot 1** — partage, collaboration, recommandation ou fonction sociale non spécifiés. Ne pas ajouter d’invitation ou de viralité à partir de cette question. |

### 4.5 Les 5 questions de preuve à poser à un chiffre — *Playbook*, p. 99

Aucun chiffre d’usage ou de performance produit n’est disponible. Les nombres cités dans les PDF ou dans les exemples UI ne sont pas des statistiques d’ALINEO.

| # | Question de vérification | Réponse/règle pour une mesure future |
|---:|---|---|
| 1 | De quand date le chiffre ? | Date de collecte, période et version produit devront accompagner tout indicateur. Aujourd’hui : aucune mesure produit datée. |
| 2 | Quelle est la population exacte ? | Définir qui/quoi est inclus (participants, sessions, tâches, période) avant de calculer ; population et taille d’échantillon actuelles inconnues. |
| 3 | Est-ce une moyenne de moyennes ? | Aucune agrégation n’a été faite. En faire une, il faudra documenter le dénominateur et la pondération ; ne pas agréger des pourcentages sans les effectifs. |
| 4 | Qui publie, et que peut-il y gagner ? | Source de mesure du produit non sélectionnée ; tout fournisseur/outil intéressé devra être nommé et son intérêt déclaré. |
| 5 | Que faudrait-il observer pour que le chiffre soit faux ? | Définir événement, numérateur, dénominateur, période et observation qui réfuterait l’hypothèse avant de publier un chiffre. Aucune hypothèse chiffrée produit n’est actuellement validée. |

### 4.6 Le brief projet de 12 questions — *Playbook*, p. 166 et *Kit bonus*, p. 6

Le kit bonus répète les mêmes douze questions : elles sont traitées une fois, sans les compter comme un second questionnaire. Les réponses ci-dessous sont celles disponibles pour le produit ; les champs manquants restent à confirmer.

| # | Question du brief | Réponse pour le produit en cours |
|---:|---|---|
| 1 | En une phrase, qu’est-ce que le projet doit accomplir ? | ALINEO réunit le chat, des connecteurs sélectionnés par l’utilisateur et des vues de progression/insights fondées sur des faits, sans remplacer les services source. C’est une formulation de périmètre, pas une promesse de performance. |
| 2 | Qui sont les utilisateurs principaux ? Décrire trois profils/contextes. | **À confirmer.** Aucun persona ou modèle d’accès solo/équipe n’est validé ; ne pas en fabriquer. |
| 3 | Quelle est l’action la plus importante attendue ? | L’entrée principale reste le chat Alineo. En sample local, il s’appuie sur un agent fictif sans fournisseur/modèle ; aucune identité ou connexion live n’est configurée. |
| 4 | Comment le succès est-il mesuré aujourd’hui ? Quels chiffres existent ? | Aucun chiffre de base, analytics ou seuil de succès n’est fourni. Aucune mesure ou cible n’est préremplie. |
| 5 | Quelles sont les contraintes techniques (stack/CMS/app existante) ? | L’application Alineo utilise Expo/React Native, Hono et CopilotKit sous `apps/openfuse/`. Le mode sample local fonctionne sans modèle/provider ou clé Intelligence ; aucune identité live Alineo, compte OAuth ou connexion réelle n’est configurée. L’ancien shell React/Vite/A2UI est dans `apps/alineo/` et n’est pas la direction active. |
| 6 | Quelle est la date de mise en ligne ? Est-elle fixe ? | **Aucune date de mise en ligne ou date fixe fournie.** Le calendrier des lots de travail n’est pas à inventer. |
| 7 | Existe-t-il une identité visuelle ? Où sont les fichiers ? | **Identité actuelle : Alineo.** Shell graphite, sidebar compacte, panneaux flottants bordés et logo ruban généré dans `apps/openfuse/apps/mobile/assets/alineo-flow-mark.png`, partagé entre accueil, navigation, icône et favicon. Les marques Gmail/Google Calendar viennent de `thesvg`. La MicOrb reste le symbole de l’assistant, distinct de l’identité produit. Voir aussi `src/ui.tsx`, `src/brand-icon.tsx` et le README assets. |
| 8 | Les contenus sont-ils rédigés ? Qui les écrit ? | Des textes UX de travail existent dans le document ALINEO ; aucun contenu final de lancement ni responsable éditorial n’est validé. Aucun contenu personnel n’est fourni. |
| 9 | Quels sont trois produits aimés, et pourquoi en termes d’usage ? | **Non fourni.** Les produits fictifs et exemples visuels du livre ne sont pas des références sélectionnées par le propriétaire. |
| 10 | Quelles obligations légales, réglementaires ou d’accessibilité ? | Exigences produit internes : confidentialité/sécurité et objectif de qualité WCAG 2.2 AA dans la direction design. Juridiction de lancement, activité, obligations légales applicables et avis juridique **à confirmer** ; cette réponse n’est pas une conclusion juridique. |
| 11 | Qui valide, sous quel délai ? | L’interlocuteur de la demande peut valider le cadrage ; le décideur officiel, autres validateurs et délai de retour ne sont pas précisés. |
| 12 | Quel est le budget global, développement inclus ? | **Aucun budget, prix ou modèle de financement fourni.** Aucun tarif ni paiement ne doit être ajouté sur la base du livre. |

### 4.7 Audit d’écran en 10 questions — *Playbook*, p. 73

Les questions sont traitées comme des critères à passer sur chaque écran livré. **Elles n’ont pas reçu de score**, car aucun audit complet d’écran n’a été effectué.

| # | Question | Réponse/critère ALINEO et état de preuve |
|---:|---|---|
| 1 | Comprend-on l’objectif de l’écran en 5 secondes ? | Exigence de clarté ; formulation proposée à la section 4.1. **Pas de test utilisateur réalisé.** |
| 2 | Sait-on où regarder d’abord, ensuite, enfin ? | Handoff doit ordonner les blocs ; l’ordre Today est décrit dans `ALINEO_DESIGN.md`. Les autres écrans doivent avoir le même niveau de détail. **À vérifier visuellement.** |
| 3 | Y a-t-il une action primaire évidente et unique ? | Une action primaire par état/écran ; quand une approbation attend, elle devient l’action de cet état. **À vérifier dans chaque écran et état.** |
| 4 | Couleurs, espacements et composants sont-ils identiques ailleurs ? | Tokens/composants proposés dans `ALINEO_DESIGN.md`. Aucune revue transversale complète ou conformité des contrastes n’est attestée. |
| 5 | Vide, chargement, erreur et succès existent-ils ? | Cinq états de page sont requis : vide, chargement, rempli, erreur, succès, plus cas limite. **Spécifiés ; pas tous implémentés.** |
| 6 | Chaque action produit-elle une réaction visible en moins de 400 ms ? | Feedback immédiat attendu pour les commandes locales ; si l’opération dépasse le seuil perceptif, afficher un état de chargement réel et conserver le contexte. **Mesure runtime non effectuée.** |
| 7 | Contraste, focus clavier, labels et alternatives textuelles ? | Critères bloquants de passation définis ci-dessous. Contraste/focus/clavier n’ont pas été complètement mesurés dans un navigateur réel ou sur appareil. |
| 8 | Les textes sont-ils utiles, courts et orientés utilisateur ? | Règle de microcopie : verbe clair, correction/action dans l’erreur, aucune phrase de remplissage. Les textes de production et leur compréhension restent à valider. |
| 9 | Prix, frais, sécurité et contact sont-ils visibles ? | Prix/frais **non applicables** : aucune facturation au MVP. Pour la sécurité/confiance, permissions, provenance et approbation doivent être expliquées au point d’action. Coordonnées/support et SLA **à décider**. |
| 10 | Tout est-il atteignable/lisible au pouce et à une main ? | Cibles de conception ≥44 px sur mobile et mise en page responsive proposées ; aucun test à une main sur téléphone réel n’est attesté. |

### 4.8 Questions du protocole de test — *Playbook*, pp. 71–72 et 173

Le livre donne des scripts d’entretien et de test, pas des réponses déjà obtenues. **Aucun test utilisateur n’a été conduit ici.**

| Prompt de recherche/test | État/réponse produit |
|---|---|
| « Que comprenez-vous de ce que le produit propose ? » | Réponse attendue comme hypothèse : voir une prochaine action et, si souhaité, examiner une proposition avant application. Réponse réelle : **non recueillie**. |
| « Imaginez que vous voulez [tâche réelle]. Montrez-moi comment vous feriez. » | Tâche réelle à choisir avec une personne recrutée ; le scénario exact et le recrutement sont **à confirmer**. Ne pas utiliser les exemples du livre comme tâches validées. |
| « Que cherchez-vous à cet instant ? » | À poser uniquement si la personne bloque ; aucune intervention qui lui indique le bouton. Aucune session exécutée. |
| « Sur une échelle de 1 à 5, à quel point était-ce facile ? » | Aucune note collectée. La note isolée ne remplace pas l’observation des tâches, hésitations et erreurs. |
| « Qu’est-ce qui vous a le plus gêné ? » | **Inconnu** jusqu’à test ; ne pas présumer que le problème est esthétique ou éditorial. |
| « Racontez la dernière fois où vous avez eu besoin de [tâche]. » | Question d’entretien à utiliser avec une tâche déterminée ; aucun récit disponible. |
| Quels outils/étapes ont été utilisés, qu’est-ce qui a coincé et combien de temps ? | **Aucune observation/mesure** ; une durée ne doit pas être inventée. |
| Quels mots la personne emploie-t-elle ? | **Aucun vocabulaire utilisateur consigné** ; les mots de l’interface sont encore des propositions. |
| Qu’est-ce qui la rassure ou la fait reculer ? | **Inconnu** ; transparence des permissions et des résultats est une exigence produit à tester, pas une préférence mesurée. |
| Que fera-t-elle juste après ? Accepterait-elle une nouvelle session dans deux semaines ? | **Inconnu / aucun engagement de suivi**. Le suivi de recherche n’est pas une fonction de l’application. |

Le script de 20 minutes donné p. 173 se décompose en 2 min de contexte (dernière occurrence), 5 min de récit sans interruption (outils/étapes/blocages/temps), 5 min de vocabulaire exact, 4 min sur les preuves qui rassurent ou font reculer, 3 min sur l’étape suivante, puis 1 min pour demander si un suivi dans deux semaines est acceptable. Ce script est une méthode facultative à préparer, pas une séance réalisée ni une durée de session utilisateur déjà validée. Ne pas suggérer d’idée, ne pas demander si la personne « aimerait » une fonctionnalité, noter les verbes plutôt que des adjectifs.

La règle de méthode retenue : tester l’interface et la tâche, pas la personne ; observer sans guider ; documenter échantillon, date, tâche, erreurs, limites et corrections. La règle des cinq personnes dans le livre est un point d’arrêt exploratoire, pas une preuve de taux, de représentativité ou d’absence de problème rare. Aucun chiffre du livre ne devient un résultat d’ALINEO.

### 4.9 Checklist d’un écran généré par IA — 8 bloqueurs + 4 contrôles de confiance, pp. 107 et 173

Ces douze points sont des contrôles de qualité du livrable d’écran, non des fonctionnalités de l’utilisateur final. La liste est reprise ci-dessous intégralement. **Aucun contrôle n’est déclaré globalement passé sur l’application**, car l’application produit n’est pas implémentée et l’audit complet n’a pas eu lieu.

| Groupe | Contrôle du livre | Réponse/critère pour le produit |
|---|---|---|
| Bloquant 1 | Chaque champ a un libellé visible et associé | Obligatoire sur tout formulaire ; vérifier association sémantique et annonce. |
| Bloquant 2 | Chaque bouton-icône et lien a un nom accessible | Obligatoire ; vérifier le nom hors contexte et les commandes clavier. |
| Bloquant 3 | Toutes les paires texte/fond sont mesurées (le kit indique ≥4,5:1) | Mesurer chaque paire réelle. Appliquer le seuil pertinent du critère pour texte courant/grand texte et consigner les exceptions ; aucune mesure complète disponible. |
| Bloquant 4 | Parcours clavier complet, focus visible, aucun piège | Bloquant avant livraison web ; test clavier/navigateur requis. |
| Bloquant 5 | Un H1, aucun saut de niveau | Bloquant ; à vérifier écran par écran. |
| Bloquant 6 | Attribut de langue sur la racine | Obligatoire ; langue de lancement à confirmer, prototype rédigé en français. |
| Bloquant 7 | États vide, chargement, erreur et succès | Présents et déclenchés par des conditions réelles ; ajouter aussi l’état rempli et les cas limites pour le produit. |
| Bloquant 8 | Réglage de réduction du mouvement respecté | Obligatoire ; vérifier `prefers-reduced-motion` lors de l’implémentation. |
| Confiance 1 | Aucun texte de remplissage ni promesse inventée | Bloquant ; contenu absent indiqué, chiffres/promesses sourcés ou retirés. |
| Confiance 2 | Montants et dates au format local | Dates/heures selon locale/fuseau explicites ; aucun montant commercial au MVP. |
| Confiance 3 | Contenu conforme au fichier de contexte, ligne par ligne | Comparer l’interface et les sorties à la spécification versionnée ; toute absence/contradiction devient une question ouverte, pas du texte improvisé. |
| Confiance 4 | Résultat annonce vérifié, estimé, non fait | Requis pour tout rapport ou résultat agent ; les catégories vides restent visibles. |

### 4.10 Quatre vérifications juridiques du livre — *Playbook*, p. 105

| Vérification posée par le livre | Réponse pour ce produit |
|---|---|
| Taille/forme de l’entreprise et éventuelle exemption ? | Structure juridique, taille et chiffre d’affaires non fournis. |
| Produit ou service concerné ? | Le concept décrit un service logiciel web ; qualification juridique exacte et marché de mise à disposition à confirmer. |
| Quelle transposition nationale s’applique ? | Juridiction(s) de commercialisation/exploitation non confirmée(s). Aucune recherche juridique ou conclusion par pays n’est faite dans ce document. |
| Que dit le contrat sur le référentiel et le périmètre de conformité ? | Aucun contrat client ou engagement de conformité fourni. Ne pas déclarer « conforme » sur la base de la checklist ; rapporter version, date, parcours et limites lorsque l’audit sera réellement effectué. |

### 4.11 Questions opératoires dispersées dans le livre

Les items ci-dessous couvrent les questions hors questionnaires principaux qui ont un effet sur la conception. Les exemples de commerce, SaaS et design d’agence ne sont pas transposés en fonctionnalités.

| Référence / question du livre | Réponse pour le produit |
|---|---|
| p. 12 — « Le parcours est-il le plus court et le plus sûr ? » | Parcours proposé : capturer sans onboarding obligatoire, configurer uniquement les paramètres nécessaires à la planification, confirmer avant toute écriture. **À tester avec des utilisateurs.** |
| p. 12 — « L’écran est-il lisible, cohérent, accessible ? » | Critères d’accessibilité et design system définis dans les sections 6–8 ; conformité non démontrée. |
| p. 12 — « Faut-il le faire, et pour quelle valeur ? » | Une fonction doit réduire une des charges visées par PAOS ; le besoin réel et la valeur d’ALINEO sont à valider. Une idée d’interface du livre ne suffit pas. |
| p. 15 — « Combien d’information par écran ? » | Le minimum nécessaire pour décider et agir dans l’état présent ; pas de nombre universel de cartes. Les repères du livre (3–5 sections, formulaires de 5–7 champs maximum par étape, une action primaire) sont des heuristiques, à tester sur les vrais parcours. Un chiffre ne s’affiche que s’il apporte une décision, avec source/période. |
| p. 20 — « Besoin d’aide ? Réponse en moins de 2 h. » | Exemple de promesse commerciale du livre, **pas un SLA produit**. Canal support et délai de réponse non décidés. |
| p. 22 — un champ est-il un doublon ? | Ne collecter que les données nécessaires au parcours ; aucun formulaire ne doit redemander un champ déjà présent sans justification. Schéma de profil réduit à ce qui est utile et explicitement saisi. |
| p. 26 — que fait le produit, pour qui, que peut-on y faire ? | Réponse de travail : aider une personne à capturer une intention, choisir une prochaine action et planifier sous contrôle. « Pour qui » demeure une hypothèse, non un segment étudié. |
| p. 30 — chaque bénéfice répond-il à « et donc ? » | Pour le texte produit, relier chaque bénéfice à un résultat utilisateur observable, sans prétendre à un gain non mesuré. Aucune landing page commerciale ni promesse chiffrée n’est retenue au MVP. |
| p. 32–33 — le dashboard évolue-t-il, quelle part, qui est en tête, où est le problème ? | **Pas de dashboard analytique SaaS dans le MVP.** Ne pas créer ces graphiques ou métriques. Si une vue de projet/données est ajoutée plus tard, les visualisations devront répondre à une décision réelle, avec période, provenance et action possible. |
| p. 33 — « est-ce que ça va ? par rapport à quand ? que dois-je faire maintenant ? » | Today doit montrer les engagements, la prochaine action et les arbitrages ; pas de score « ça va » inventé. Comparaison temporelle et KPI attendent des données réelles et un besoin validé. |
| p. 39 — puis-je annuler l’essai, que se passe-t-il à sa fin, puis-je changer d’offre ? | Aucun essai, abonnement, offre ou facturation n’est spécifié ; **non applicable au MVP**. Si le modèle payant est décidé plus tard, ces questions deviennent des critères de transparence. |
| p. 40 — mot de passe oublié ? | Une authentification est nécessaire au Lot 1, mais fournisseur, méthode et parcours de récupération restent à choisir. Ne pas inventer SSO/email/password comme décision. |
| p. 40 — demander une question de contexte (ex. métier) ? | Aucun métier ou profil professionnel n’est requis dans les exigences actuelles ; ne pas ajouter cette question au démarrage sans utilité prouvée. |
| p. 56 — le contenu respire-t-il et se lit-il sans effort ? | Critère de revue visuelle : espacement, ligne de texte, contraste et densité doivent faciliter la lecture. Ajouter de l’espace n’est pas une correction automatique ; vérifier le contenu réel et la hiérarchie. |
| p. 63 — « La personne peut-elle agir après avoir lu ça ? » | Toute consigne, erreur ou état vide doit proposer une action réellement disponible ; si aucune action n’est possible, expliquer ce qui manque et ne pas afficher un faux CTA. |
| p. 68 — « Si je résume… c’est bien ça ? » | Bonne méthode de validation du brief : reformuler par écrit et faire corriger avant de figer la structure. Ce n’est pas une conversation ou un rituel à imposer dans le produit. |
| p. 69 — le client demande-t-il du bleu ? | La couleur relève d’une décision documentée et mesurée, pas d’une préférence supposée. La palette ALINEO actuelle est une proposition. |
| p. 70 — grille de 8, ordre de lecture, six états de bouton ? | Grille et tokens sont des règles de passation ; états de contrôles à spécifier (cf. 6.1). Ils ne constituent pas des fonctions produit. |
| p. 71–72 — les testeurs demandent-ils « c’est fait ? » et comprennent-ils l’écran ? | Le produit prévoit un feedback visible et une preuve d’action ; il faut encore tester ces hypothèses. Aucun résultat de test rapporté. |
| p. 75 — si on ajoute une fonction et décale le calendrier, laquelle prioriser ? | Méthode de discussion de périmètre, pas une question à poser à l’application. Aucun calendrier ni estimation de délai fourni ; tout changement de lot nécessite une décision explicite et un impact documenté. |
| p. 81 — « Qui valide et arbitre ? » | Le rôle de décideur final et les délais formels ne sont pas nommés dans les sources. Ne pas créer de rôles d’équipe ou d’approbation multi-personnes dans le Lot 1. |
| p. 81 — « Qu’est-ce qui vous fait dire ça ? » / la visibilité du bouton répond-elle à l’inquiétude ? | Technique de découverte d’un besoin lors d’un retour de design ; aucun retour utilisateur de ce type n’a été reçu. Ne pas transformer la réponse en réglage d’interface avant d’avoir compris le problème. |
| p. 88 — qui peut ouvrir, comprendre et modifier le livrable ? | Ce cahier et la spécification de référence sont des Markdown versionnés dans le dépôt. Cela n’établit pas l’existence d’un fichier Figma/Penpot ni d’un contrat de handoff final. |
| p. 91 — chaque état est-il visible/testable par `?state=` ? | C’est une technique de test du livre, pas une route produit obligatoire. Un futur écran doit avoir un moyen reproductible de tester ses états ; aucun harness applicatif n’est déclaré ici. |
| p. 122 — comment envoyer le brief et traiter les réponses tardives ? | Processus de prestation design/agence, pas une fonction ALINEO. Aucun e-mail de relance, échéance 48 h ou appel automatique à implémenter. |
| p. 129 — « Supprimer cette facture ? » | La facture est un exemple hors domaine. Le principe de confirmation renforcée des actions destructives est retenu si une suppression de tâche/objet est ajoutée ; aucune suppression externe au Lot 1. |
| p. 143 — que voit la personne et que peut-elle faire ensuite ? | Chaque écran/état doit spécifier entrée, information utile, action disponible et sortie. Le parcours principal est décrit à la section 2.1 ; les autres écrans ont une structure dans `ALINEO_DESIGN.md`. |
| p. 160 — « Le thème suit-il le bureau ? » | Le prototype reste en thème clair ; thème sombre et suivi du thème système ne sont pas décidés. Si un thème sombre est ajouté, il exigera un second jeu de tokens et des mesures de contraste distinctes. |

## 5. Handoff de l’écran Today selon les 8 sections du livre

Référence : *Playbook*, p. 167. Le handoff de production devra être décliné pour chaque écran significatif ; celui-ci fixe le niveau attendu pour Today sans prétendre livrer une maquette développeur finale.

| Section du handoff | Réponse de conception pour Today | État |
|---|---|---|
| **1. Rôle de l’écran** | Voir les engagements configurés, l’action à choisir, les éléments non planifiés et les arbitrages. Action primaire selon l’état : « Capturer une intention » sans plan ; « Examiner la proposition » lorsqu’une proposition attend une décision. | Proposition, à tester |
| **2. Structure et layout** | Mobile-first ; ordre décrit dans `ALINEO_DESIGN.md` ; panneau de capture et chronologie ; largeurs de vérification proposées 375/768/1280 px, support web à vérifier de 320 à 1920 px. Les valeurs de grille ne certifient pas une implémentation. | Proposition, à vérifier |
| **3. Tokens** | Tokens sémantiques de couleur, espacement, rayon et typographie dans `ALINEO_DESIGN.md` ; pas de couleurs codées dans la spécification d’écran. Contrastes réels à mesurer. | Proposition, à vérifier |
| **4. États** | Vide, chargement, rempli, erreur, succès, cas limite ; boutons/contrôles documentés au repos, focus, erreur, chargement, succès et désactivé selon le contexte. | États décrits ; code non livré |
| **5. Interactions** | Capture non persistée, aperçu, confirmation, proposition sans mutation, détail du diff, approbation/refus, feedback d’erreur, conservation du brouillon et retour sans perte. Chaque action destructive future est distincte et confirmée. | Parcours spécifié, non testé |
| **6. Accessibilité** | Titre hiérarchique, régions nommées, labels visibles, erreurs reliées, ordre/focus clavier, noms accessibles, mouvement réduit, zoom et contrastes. Les cas lecteur d’écran/appareil réel restent à auditer. | Critères définis, pas de conformité revendiquée |
| **7. Contenu** | Microcopie de travail en français ; aucune donnée d’exemple ou de remplissage ; chaîne longue/localisation à vérifier ; période/source obligatoire pour tout chiffre. Textes de lancement et langue de sortie à confirmer. | Brouillon rédactionnel |
| **8. Questions ouvertes** | Identité ALINEO/PAOS ; public prioritaire ; succès mesurable ; framework/auth/LLM ; thème et identité visuelle ; langue/plateformes de lancement ; résultats de recherche ; décision de calendrier et d’autonomie. | Voir section 9 ; aucun délai fourni |

## 6. Critères de qualité et de passation

Les règles de cette section sont des **gates de qualité**, pas des fonctions à ajouter au menu. Les seuils chiffrés ci-dessous sont des cibles de conception tirées du livre ; leur vérification sur la cible du produit reste à effectuer.

### 6.1 Règles transversales à appliquer à chaque écran

- Un objectif compréhensible et une seule action primaire visible par écran/état ; chaque écran décrit son entrée, sa sortie et le chemin de retour.
- Navigation stable avec état actif visible autrement que par graisse/couleur seule. Au plus cinq destinations dans une barre principale ; l’architecture de navigation ALINEO devra respecter ou justifier ce seuil. Le regroupement de destinations secondaires sous « Plus » est une option de design, pas une feature métier validée.
- États de page : **vide, chargement, rempli, erreur, succès**, plus un cas limite représentatif. Le gabarit d’écran généré par IA du livre vérifie quatre états nommés (vide, chargement, erreur, succès) ; pour le produit, l’état rempli reste également obligatoire.
- États de contrôle à décrire par composant. Pour le contrôle principal, le kit cite : **repos, focus clavier, erreur, chargement, succès, désactivé**. Ne pas confondre l’état du bouton et l’état global du formulaire.
- Champs avec label visible et associé ; erreur près du champ, avec cause/règle et action de correction ; état invalide annoncé ; aucun placeholder comme seul label.
- Texte courant : contraste visé ≥4,5:1 ; grand texte et éléments non textuels utiles ≥3:1 selon le critère applicable ; focus visible ; aucune information portée seulement par la couleur. Mesurer les paires réellement utilisées, pas uniquement la palette.
- Navigation clavier complète, ordre logique, aucun piège, retour sans perte de brouillon ; zoom navigateur à 200 % ; pas d’action réservée au survol.
- Cible tactiles de design ALINEO ≥44 px, sans faire passer ce confort pour une valeur minimale universelle : la checklist détaille des cibles différentes par plateforme.
- Le chargement réserve l’espace attendu ; saisie conservée ; pas de double envoi ; un message de succès seulement après preuve de l’action. Un réseau indisponible a un état/reprise ; mode hors ligne complet non inclus.
- Langue déclarée (`lang`) et dates/heures localisées au fuseau configuré ; aucun texte tronqué à cause d’une largeur fixe. Locale de lancement, langues supplémentaires et RTL restent à confirmer.
- Aucun texte de remplissage, chiffre, témoignage, prix, durée ou promesse inventé. Un chiffre doit avoir une source, une date, une population et une limite d’interprétation.
- Images seulement si utiles, autorisées et décrites/masquées selon leur rôle ; le prototype actuel n’a pas besoin de photos ou d’illustrations marketing.
- `prefers-reduced-motion` respecté ; mouvement informatif seulement ; pas de boucle décorative. Mode sombre absent du prototype ; s’il est ajouté, créer et tester ses propres tokens.
- Performance à mesurer sur une version livrée. Repères du livre : LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1 au 75e centile ; ce ne sont **pas des performances mesurées** du produit.
- Tests de compréhension/recherche sont distincts d’un audit statique. Cinq participants peuvent aider à découvrir des défauts fréquents selon le livre, mais ne mesurent pas un taux de réussite ni la représentativité.

### 6.2 Les 40 points de l’audit UX/UI — *Playbook*, p. 165 et *Kit bonus*, p. 2

Les 40 points sont tous classés ci-dessous. « À tester » signifie que le critère s’applique, pas que le test est passé. Les conventions de panier, prix ou fichier graphique sont des éléments du gabarit générique ; lorsqu’elles ne correspondent pas au produit, elles sont explicitement non applicables.

| # | Point du contrôle | Application au produit / preuve attendue |
|---:|---|---|
| 1 | Objectif compris en 5 secondes | Formulation par écran ; test de compréhension réel requis. |
| 2 | Action primaire unique et dominante | Une action primaire par état ; vérifier capture vs approbation. |
| 3 | Entrée et sortie de chaque écran identifiables | Décrire dans le handoff et valider les retours/navigation. |
| 4 | Emplacement courant signalé | État actif textuel/visuel dans la navigation. |
| 5 | Retour arrière sans perte de saisie | Conserver le brouillon non persisté lors du retour. |
| 6 | Conventions (logo, panier, menu, recherche) | Menu/navigation à appliquer ; logo et panier **non applicables** tant qu’il n’y a ni marque ni commerce ; recherche seulement si le volume d’objets le justifie. |
| 7 | Parcours fréquent le plus court | À identifier par recherche ; capture accessible depuis Today est la proposition. |
| 8 | Aucune fonction secondaire ne concurrence la principale | Hiérarchie visuelle contrôlée par état. |
| 9 | Liens et boutons ne se ressemblent pas | Différenciation sémantique et visuelle, focus clavier inclus. |
| 10 | Premier usage produit un résultat visible en moins de 60 s | Cible de conception proposée par le livre/ALINEO, pas une promesse ni une mesure ; test chronométré nécessaire. |
| 11 | Pas de Lorem ipsum ou texte de remplissage | Bloquant ; contenu absent indiqué comme tel. |
| 12 | Libellés de boutons = verbes d’action | Verbes explicites et cohérents avec l’action exécutée. |
| 13 | Messages d’erreur indiquent quoi faire | Cause, champ/objet et correction/réessai visibles. |
| 14 | Prix/frais visibles avant engagement | Paiement/frais commerciaux **non applicables au MVP** ; à rouvrir si une offre payante est décidée. |
| 15 | Texte secondaire assez contrasté | Mesure de chaque paire réelle, pas une appréciation visuelle seule. |
| 16 | Dates et montants au bon format local | Dates/heures au fuseau/locale configurés ; montants seulement si un usage financier est ajouté. |
| 17 | Cas longs testés (ex. nom de 40 caractères) | Tester titres de tâche/projet et champs longs sur chaque largeur. |
| 18 | État vide explique la valeur et propose une action | CTA seulement s’il fonctionne ; Life Core/tâches/calendrier sans données restent vides honnêtement. |
| 19 | Pas de phrases complètes en majuscules | Règle éditoriale. |
| 20 | Une langue cohérente et accents corrects | Français dans la proposition actuelle ; langue de lancement à confirmer. |
| 21 | Deux familles typographiques maximum | Système typographique proposé ; contrôler les rendus et polices de remplacement. |
| 22 | Tailles tirées d’une échelle décidée | Utiliser les tokens ; valeur finale non validée. |
| 23 | Espacements multiples de 4, idéalement 8 | Utiliser l’échelle de tokens ; vérifier les composants. |
| 24 | Un accent de couleur par écran | Règle de direction visuelle, à vérifier sur écrans remplis/états. |
| 25 | Même composant = même style | Source de tokens/composants unique ; ne pas créer de variantes ad hoc sans motif. |
| 26 | Rayons et ombres cohérents | Contrôler l’ensemble des cartes, feuilles et contrôles. |
| 27 | Hiérarchie lisible en plissant les yeux | Inspection en niveaux de gris et test de tâche ; pas de score obtenu. |
| 28 | Pas plus de 75 caractères par ligne | ALINEO retient 75 comme plafond de rédaction proposé ; la checklist générale demande 45–80, à ajuster au rôle/écran. |
| 29 | Style/cadrage des images homogènes | Conditionnel ; aucune image de marque n’est requise. Si une image est ajoutée, vérifier cohérence, licence et texte alternatif. |
| 30 | Fichier nommé/rangé, calques/pages/versions | Règle de livraison design, non fonction de l’application. Les specs du dépôt sont versionnées en Markdown ; aucun fichier Figma n’est déclaré. |
| 31 | Cinq états d’écran | Vide, chargement, rempli, erreur, succès ; cas limite documenté en plus. |
| 32 | Six états de bouton, focus clavier compris | Repos, focus, erreur, chargement, succès, désactivé selon le kit ; adapter le rendu au composant sans supprimer le focus. |
| 33 | Chaque champ a un label, pas seulement un placeholder | Bloquant ; association sémantique testable. |
| 34 | Contraste texte ≥4,5:1 mesuré | Cible texte courant ; mesurer chaque paire, états inclus. |
| 35 | Cible tactile ≥44 px sur mobile | Cible de confort ALINEO ; mesurer la hit-area et l’espacement sur appareil. |
| 36 | Clavier complet et focus visible | Bloquant ; vérifier au clavier/navigateur, pas seulement dans le code. |
| 37 | Aucune information par la seule couleur | Libellé, pictogramme, forme ou texte en complément. |
| 38 | Images décoratives masquées, images informatives décrites | Conditionnel selon présence ; images absentes n’exigent pas d’illustration de remplacement. |
| 39 | Réseau lent/échec traité | Réserver l’espace, préserver la saisie, expliquer reprise ; ne pas promettre offline complet. |
| 40 | Handoff écrit avec espacements/comportements | Décliner les 8 sections du handoff pour chaque écran significatif avant implémentation. |

Le barème du kit (0–2 éléments manquants « prêt », 3–5 à corriger, plus de 5 retour à la structure) est un outil de revue de livrable design, **pas un score de qualité de vie ou un indicateur produit**. Il ne remplace pas les bloqueurs d’accessibilité ni des tests utilisateurs.

### 6.3 Les 77 règles de checklist agent — *Playbook*, pp. 174–181

Cette matrice répertorie les 77 identifiants, leur niveau et leur portée afin de ne rien convertir silencieusement en fonctionnalité. Les noms de plateformes sont ceux du livre : web, iOS, Android, Windows, macOS et Linux. Le statut ci-dessous décrit **l’applicabilité au périmètre prévu**, jamais une conformité déjà obtenue.

Légende de portée : **L1 web** = critère à vérifier sur l’application web du Lot 1 ; **futur** = conditionnel au lot/client concerné ; **hors cible actuelle** = plateforme non incluse dans les Lots 1–5 actuels ; **conditionnel** = seulement si la fonction existe (p. ex. thème sombre, paiement, image). Toutes les preuves de conformité restent **à vérifier** au moment de l’implémentation/livraison.

Ne pas confondre le **niveau de sévérité** de la règle (`BLOCKING`/`MAJOR`/`MINOR`/non applicable) avec le **statut de preuve**. Pour les rapports du projet, utiliser `VÉRIFIÉ` avec une preuve, `À VÉRIFIER`, `NON FAIT` ou `NON APPLICABLE`. Le livre emploie aussi « automatisé / à vérifier / non applicable » pour distinguer les types de contrôles ; une règle automatiquement lue dans un fichier ne prouve pas à elle seule la conformité de l’écran rendu.

| ID | Niveau du livre | Règle (résumé fidèle) | Portée dans le produit |
|---|---|---|---|
| A01 | BLOCKING | Un seul H1, aucun saut de niveau | L1 web ; toutes plateformes si livrées |
| A02 | BLOCKING | Régions de navigation nommées (`nav`, `main`, `header`) | L1 web |
| A03 | MAJOR | État actif visible autrement que par la graisse | L1 web |
| A04 | MAJOR | Cinq entrées au plus dans une barre principale | L1 web ; vérifier la navigation ALINEO à 6 espaces et regrouper si nécessaire |
| A05 | MAJOR | Retour arrière vers l’écran précédent, pas l’accueil | L1 web |
| A06 | BLOCKING | Un objectif et une action primaire par écran | Tous les écrans |
| B01 | BLOCKING | Texte courant ≥4,5:1 sur son fond réel | L1 web |
| B02 | BLOCKING | Grand texte ≥3:1 | L1 web |
| B03 | BLOCKING | Icônes utiles, bordures et focus ≥3:1 | L1 web |
| B04 | BLOCKING | Pas d’information portée par la couleur seule | Tous les écrans |
| B05 | MAJOR | Thème sombre = second jeu de tokens, pas filtre | Conditionnel ; thème sombre non livré dans la proposition actuelle |
| B06 | MAJOR | Information conservée en contraste élevé/niveaux de gris | L1 web ; vérifier si thème système est pris en charge |
| C01 | BLOCKING | Rien d’utile sous 12 px à l’échelle par défaut | L1 web |
| C02 | MAJOR | Texte à 200 % sans perte ni scroll horizontal du corps | L1 web |
| C03 | MAJOR | Taille système jusqu’à 200 % | Futur Android Lot 5 ; iOS hors cible actuelle |
| C04 | MAJOR | Longueur de ligne 45–80 caractères pour corps | L1 web ; ALINEO propose un plafond de 75 |
| C05 | MINOR | Deux familles maximum, échelle documentée | L1 web |
| D01 | BLOCKING | Cible interactive ≥24×24 px ou espacement équivalent | L1 web (minimum du livre) ; ALINEO vise 44 px en tactile |
| D02 | BLOCKING | iOS : cible 44×44 pt, plancher 28 pt | Hors cible actuelle (iOS non planifié) |
| D03 | BLOCKING | Android : cible 48×48 dp | Futur Lot 5 |
| D04 | BLOCKING | Windows : 40×40 epx, 44 en UI tactile | Futur Lot 5 |
| D05 | MAJOR | macOS/Linux : 22–28 pt, espacée | Hors cible actuelle ; à rouvrir si plateforme ajoutée |
| D06 | MAJOR | Action destructive séparée des actions fréquentes | L1 web si suppression présente ; partout ailleurs si livré |
| D07 | MAJOR | Gestes système préservés | Futur Android ; iOS hors cible actuelle |
| E01 | BLOCKING | Vide, chargement, erreur, succès, cas limite existent | Tous les écrans, L1 web |
| E02 | BLOCKING | Vide propose une action, pas seulement un constat | Tous les états vides |
| E03 | MAJOR | Erreur explique quoi faire | L1 web |
| E04 | MAJOR | Chargement réserve l’espace et évite le saut | L1 web |
| E05 | MAJOR | État désactivé explique pourquoi/comment activer | L1 web |
| F01 | BLOCKING | Label visible et associé programmatiquement | Tous les formulaires |
| F02 | BLOCKING | Erreur sous le champ et règle nommée | Tous les formulaires |
| F03 | BLOCKING | `aria-invalid` et annonce de l’erreur | L1 web |
| F04 | MAJOR | Le formulaire ne demande que les données utilisées | Tous les formulaires |
| F05 | MAJOR | Type de clavier et autocomplétion adaptés | L1 web ; champs concernés |
| F06 | MAJOR | Action primaire unique et sortie disponible | L1 web |
| G01 | BLOCKING | Langue du document déclarée | L1 web |
| G02 | BLOCKING | Pas de largeur de texte en dur ; chaîne longue contenue | L1 web |
| G03 | MAJOR | Un seul format de montant par écran, selon la langue | Conditionnel ; aucun montant/facturation au MVP |
| G04 | MAJOR | Aucun remplissage ni promesse invérifiable | Tous les écrans et sorties agent |
| G05 | MAJOR | RTL rendu sans casser les icônes directionnelles | Conditionnel à une langue RTL ; langue(s) de lancement à confirmer |
| G06 | MINOR | Dates/heures relatives ou localisées | L1 web ; fuseau utilisateur explicite requis pour planifier |
| H01 | BLOCKING | Clavier complet, focus visible, aucun piège | L1 web |
| H02 | BLOCKING | Image décrite ou décorative | Conditionnel à la présence d’images |
| H03 | BLOCKING | Chaque contrôle a un nom accessible | L1 web |
| H04 | BLOCKING | Focus déplacé après navigation sans vol de focus | L1 web |
| H05 | MAJOR | Zoom texte système/navigateur à 200 % testé | L1 web ; preuves navigateur requises |
| H06 | MAJOR | Rôles/états natifs ou ARIA exacts | L1 web |
| I01 | MAJOR | Pas d’image/police bloquante au premier écran | L1 web ; stack/assets à vérifier |
| I02 | MAJOR | Pas de layout shift, CLS ≤0,1 | L1 web ; mesure nécessaire |
| I03 | BLOCKING | Réduction de mouvement respectée | Tous les écrans |
| I04 | MAJOR | Pas d’animation >400 ms sans raison ni boucle infinie | L1 web ; mouvement utile justifié |
| I05 | MINOR | Premier rendu utile <2,5 s sur réseau médian | Web et Android au Lot 5 ; iOS non planifié ; mesure à faire |
| J01 | BLOCKING | Android edge-to-edge, encoches et barre système | Futur Lot 5 Android |
| J02 | BLOCKING | Retour Android/système prédictif fonctionne | Futur Lot 5 Android |
| J03 | MAJOR | Retour visuel Android conforme aux conventions Material | Futur Lot 5 Android |
| J04 | BLOCKING | Retour par le bord iOS natif conservé | Hors cible actuelle (iOS non planifié) |
| J05 | MAJOR | Zones sûres iOS respectées | Hors cible actuelle |
| J06 | MAJOR | iOS : barre d’onglets ≤5, feuilles à paliers | Hors cible actuelle |
| J07 | BLOCKING | Windows : raccourcis et touches d’accès fournis | Futur Lot 5 Windows |
| J08 | MAJOR | Fenêtre Windows de 320 epx au plein écran sans casse | Futur Lot 5 Windows |
| J09 | MAJOR | Thème/contraste élevé Windows suivis | Futur Lot 5 Windows |
| J10 | BLOCKING | macOS : chaque action au menu système | Hors cible actuelle (macOS non planifié) |
| J11 | MAJOR | macOS redimensionnable avec minimum défini | Hors cible actuelle |
| J12 | MAJOR | GNOME sans double barre, icônes symboliques | Hors cible actuelle (Linux non planifié) |
| J13 | MAJOR | KDE : conventions de menus/barre/raccourcis | Hors cible actuelle |
| J14 | MAJOR | Thème sombre/contraste élevé Linux suivis | Hors cible actuelle |
| J15 | BLOCKING | Web 320–1920 px sans scroll horizontal | L1 web |
| J16 | MAJOR | Zones sûres web et zoom de page non bloqué | L1 web mobile/responsive |
| K01 | BLOCKING | Pas de consentement pré-coché ; refus aussi accessible | L1 web quand consentement/permissions sont demandés ; appliquer aux approbations |
| K02 | BLOCKING | Aucune promesse inventée/chiffre sans source/date | Tous les écrans, métriques et sorties agent |
| K03 | MAJOR | Total/frais visibles avant engagement | Non applicable au MVP sans achat ; à réouvrir si paiement ajouté |
| K04 | MAJOR | Sortir d’un parcours sans perdre le travail | L1 web ; conserver brouillons/saisie |
| L01 | BLOCKING | Tokens utilisés, pas de couleur codée en dur dans l’écran | L1 web |
| L02 | BLOCKING | Résultat distingue vérifié/estimé/non fait | Activité et résultats agent |
| L03 | MAJOR | Chaque point coché a une preuve reproductible | Tests/rapport de revue |
| L04 | MAJOR | Fichier de contexte agent décrit les règles d’écran | Workflow d’ingénierie/agent, pas une fonction utilisateur ; docs de référence à fournir/maintenir |
| L05 | MINOR | Composant cohérent, nommé par intention | Design system/code ; tous les lots |

Les règles marquées **hors cible actuelle** signifient que les spécifications PAOS actuelles ne prévoient pas ces plateformes ; cela n’empêche pas de rouvrir leur périmètre plus tard. Les règles bloquantes pertinentes ne peuvent pas être déclassées pour accélérer une livraison. Aucune ligne n’est déclarée conforme par le seul fait qu’elle figure ici.

## 7. Éléments du livre qui ne sont pas des fonctionnalités ALINEO

| Contenu du livre/kit | Classement pour le produit |
|---|---|
| Landing page de vente, checkout, tarifs, essai gratuit, panier, prix/frais et conversion | Exemples de territoires UI ; hors MVP et hors modèle commercial actuellement documenté. Ne pas créer ces écrans. |
| Réservation/prise de rendez-vous et paiement commercial | Exemple d’un autre type de produit. Le Calendar personnel PAOS n’est pas un système de réservation pour une clientèle externe. |
| Dashboard de revenus, MRR, clients, graphiques commerciaux, témoignages/logos | Maquettes fictives du livre ; ne pas copier valeurs, noms, produits, données, KPI ou illustrations. Today n’est pas un dashboard SaaS de revenus. |
| 35 écrans annotés et 13 comparaisons avant/après du playbook | Corpus pédagogique, pas quota d’écrans à construire. Seuls les parcours PAOS listés dans l’inventaire fonctionnalité/lots sont retenus. Une correction d’interface ne prouve pas une hausse de conversion. |
| 20 questions de recherche, entretiens de 15/20 minutes, test des 5 personnes | **Méthodes** à employer si une étude est décidée ; pas des fonctions d’interview ou de scoring utilisateur dans l’application. Aucun participant/entretien n’est inventé. |
| Brief client en 12 questions, proposition commerciale, contrat, devis, budget, factures, relances, tours de retours | Gabarits pour prestation design ; le questionnaire est répondu dans la section 4.6, mais ne devient pas un onboarding ni une fonction de facturation. |
| Handoff et contrôle final avant envoi (noms de calques, liens client, date de retour, e-mail de livraison) | Workflow de design/livraison, non fonctionnalité produit. Les principes de documentation/proof sont repris dans les critères de passation. |
| Pipeline brief → inventaire d’écrans → wireframe gris → revue/tests → handoff (p. 89–91) | Méthode de travail en phases, pas un pipeline exposé à l’utilisateur. Les documents PAOS/ALINEO servent de base de référence ; aucun wireframe HTML ou fichier Figma/Penpot n’est déclaré livré par ce cahier. |
| Fichier de contexte `AGENTS.md`/`CLAUDE.md`, tokens, prompts de génération (p. 91, 111) | Méthode de contexte pour outils de conception/code, pas une fonctionnalité. Les règles produit sont dans les Markdown référencés ici ; le choix d’un fichier d’instructions d’agent n’est pas une dépendance approuvée. |
| Audit de 40 points et checklist agent de 77 règles | **Règles de qualité et preuves** ; pas un score, une préférence personnelle ou un écran à implémenter pour l’utilisateur. |
| Chiffres et affirmations de l’édition 2026 (WebAIM, conversion, tests, temps) | Source/méthodologie du livre ; aucun chiffre n’est présenté comme mesure du produit. La date/population/source doivent être vérifiées avant tout usage externe. |
| Pages de vente ou exemples de support « réponse en moins de 2 h » | Microcopie d’exemple ; aucun SLA n’est validé. |
| Exemples de marque, noms, dates, montants, contextes, outils ou contenus de démonstration du PDF | Données fictives du livre ; ne pas réutiliser comme données ALINEO/PAOS, contenu initial, préférence ou validation. |
| Prompts destinés à un agent de conception et format `?state=` | Méthode de production/test des maquettes ; pas d’API publique ou commande utilisateur à ajouter automatiquement. |
| Interfaces spécifiques macOS, Linux, iOS | Référence de plateforme générale, mais pas cible confirmée dans le séquencement actuel (web, puis Android/Windows). Pas de fonctionnalités natives pour ces plateformes à ajouter. |
| Proposition de permission « écrire après une seule approbation » et défaut prérempli | Idées du livre, non retenues comme décision personnelle : en Lot 1, chaque écriture interne agentique requiert confirmation, et aucune valeur personnelle n’est présélectionnée. |

## 8. Questions ouvertes — réponses connues, pas des suppositions

Les questions ci-dessous empêchent de finaliser une partie du produit ou du pilote, mais ne bloquent pas la spécification de design présente.

| Sujet | État | Conséquence |
|---|---|---|
| ALINEO est-il relié au nom PAOS/LifeAI ? | **À confirmer.** Aucune équivalence posée ici. | Garder noms, marque et identité produit provisoires. |
| Public principal, trois profils et situations réelles ? | **À confirmer / recherche à conduire.** | Ne pas figer onboarding, terminologie ou campagne sans preuve. |
| Problème actuel, premier résultat validé, métrique/baseline et seuil de pilote ? | **À confirmer.** | Mesures candidates descriptives seulement ; pas de promesse chiffrée. |
| Date de lancement, budget et modèle de paiement ? | **Non fournis.** | Pas de planning, tarif ou checkout. |
| Langue(s), zone(s) d’exploitation et obligations applicables ? | Français dans le prototype ; cible légale et locale **à confirmer**. | Définir `locale`/timezone sans déduire la langue à partir de la localisation. Revue juridique/accessibilité avant lancement. |
| Identité visuelle, palette finale, thème et suivi du thème système ? | **Proposition seulement** : palette claire « Alignement calme » ; thème sombre non livré. | Mesurer les contrastes et valider le thème/branding avant le handoff final. |
| Comment garder au plus cinq entrées principales avec six espaces produit ? | `ALINEO_DESIGN.md` propose six espaces visibles sur bureau et cinq destinations sur mobile. C’est un point à résoudre selon A04 ; proposition à tester : quatre destinations principales + « Plus » pour les domaines secondaires, sans retirer aucun espace. | Réviser la navigation dans le design et le prototype après validation ; pas de nouvelle fonction métier. |
| Méthode Auth, framework web, runtime, hébergement, modèle IA, connecteur de streaming ? | Voir options et hypothèses dans `DECISIONS.md` ; non fixés. | Aucun fournisseur ou secret en production ; le flux manuel reste le socle. |
| Vie personnelle : pratiques Life Core, fréquence, durée, horaires, jeûne, cible ou priorité ? | **Aucune valeur utilisateur fournie.** | Life Core vide ; pas de seed, prescription ou score. |
| Journal/note privée, stockage et accès IA ? | Lot 1 : aucun journal narratif ; stockage et transmission au modèle exclus. Évolution ultérieure à décider. | Pas de texte privé dans le schéma, l’IA, les logs ou les métriques du MVP. |
| Calendar, fournisseur, scopes et écritures externes ? | Lot 3 : Google en lecture seule au début est une base de travail ; choix opérationnels et scopes à confirmer ; toute écriture externe exige confirmation. | Aucun OAuth/connecteur actif au Lot 1. |
| Autonomie interne future ? | Lot 1 : chaque écriture agentique confirmée ; autonomie préautorisée future non décidée. | Aucun droit global ou irrévocable. |
| Recrutement, protocole, décideur et échéance des tests utilisateurs ? | **À confirmer.** Aucun test/entretien réalisé. | Pas de validation UX déclarée. |

## 9. État des preuves et suites de vérification

- À la question de couverture du Kit bonus « Prêt à livrer ? » : **non comme application produit**. `prototype/alineo/` est un aperçu statique non connecté. Il contient une navigation de maquette, les vues calendrier locales Année/Mois/Semaine/Jour et un aperçu de capture en mémoire de page ; il ne constitue pas l’application PAOS/ALINEO.
- Les vérifications déjà faites sur ce prototype sont limitées à des contrôles ponctuels (navigation et états locaux sous JSDOM, absence de stockage Web, syntaxe JS/CSS et réponses HTTP de l’aperçu). Elles ne prouvent ni Auth/RLS, ni planner serveur, ni persistance, ni agent/LLM, ni connecteur.
- L’application Alineo Expo mobile/web active se trouve sous `apps/openfuse/apps/mobile/` ; elle est distincte de `prototype/alineo/` et ne prouve pas à elle seule la livraison de tous les lots PAOS. L’état UX/UI courant, les commandes de validation et les limites de preuve sont consignés dans [`UX_UI_AUDIT_STATUS.md`](UX_UI_AUDIT_STATUS.md) : typechecks, Biome ciblé, 38 tests mobiles et export web ont réussi ; un seul aperçu web en mode `sample` est exposé. Ces preuves ne constituent ni test navigateur réel, ni audit WCAG/Lighthouse complet, ni mesure de contraste de tous les écrans, ni test utilisateur/appareil ou validation E2E.
- Avant de marquer un contrôle comme **vérifié**, conserver une preuve reproductible : version/périmètre, fichier ou écran, commande/capture/mesure, résultat et date. Les contrôles impossibles à mesurer restent **à vérifier** ; les plateformes/fonctions absentes sont **non applicables au périmètre**, pas « conformes ».
- Les preuves de sortie du Lot 1 restent celles de [`LOT_1.md`](LOT_1.md) et les 14 critères du MVP dans [`PERSONAL_AGENTIC_OS_SPEC.md`](PERSONAL_AGENTIC_OS_SPEC.md). Le présent crosswalk ne les remplace pas.

## 10. Références de pages

- *UX/UI Playbook — édition 2026* : quatre questions écran p. 11 ; rôles UX/UI/produit p. 12 ; questions pré-design p. 28 ; brief express p. 67 ; wireframe/test/audit p. 69–73 ; questions de recherche p. 95 ; évaluation d’un chiffre p. 99 ; vérification juridique p. 105 ; vérification d’écran IA p. 107 ; patterns agentiques p. 109 ; fichier de contexte p. 111 ; question du thème p. 160 ; audit 40 points p. 165 ; brief client p. 166 ; handoff en 8 sections p. 167 ; protocoles/questions et contrôles IA p. 173 ; checklist 77 règles pp. 174–181.
- *UX/UI Playbook — Kit bonus* : audit 40 points p. 2 ; brief client p. 6 ; fiche handoff p. 8 ; proposition commerciale p. 10 ; contrôle final p. 12 ; vérification écran IA p. 14 ; checklist agent p. 16 ; prompt d’agent p. 18 ; rapport p. 20 ; cibles de plateforme p. 22 ; limites de preuve p. 24.
- Pour les exigences produit, l’ordre des lots et l’état de réalisation, consulter les documents PAOS liés en tête. En cas de divergence, les lots PAOS et les contraintes utilisateur explicites priment sur les exemples du playbook.
